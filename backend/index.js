require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const TIMEOUT_MS = 10000; // 10 seconds
const MAX_RETRIES = 2;

// In-memory cache: key = `${state}|${commodity}|${limit}` -> { data, timestamp }
const responseCache = new Map();

// Custom HTTPS agent for data.gov.in — avoids connection reuse issues
const dataGovAgent = new https.Agent({
  keepAlive: false,
  rejectUnauthorized: false,
});

function cacheKey(state, commodity, limit) {
  return `${state}|${commodity}|${limit}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fetch from Data.gov.in with retry & exponential backoff
async function fetchMarketPrices(state, commodity, limit) {
  const url =
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
    `?api-key=${process.env.DATA_GOV_API_KEY}` +
    `&format=json` +
    `&limit=${limit}` +
    `&filters[state]=${encodeURIComponent(state)}` +
    `&filters[commodity]=${encodeURIComponent(commodity)}`;

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: TIMEOUT_MS,
        httpsAgent: dataGovAgent,
        proxy: false,
        headers: {
          "Connection": "close",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed:`,
        error?.response?.data || error.message,
      );
      console.error("Stack:", error.stack);

      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GramSeva Backend Running"
  });
});

// Data.gov.in API with cache fallback
app.get("/api/market-prices", async (req, res) => {
  try {
    const state = req.query.state || "Uttar Pradesh";
    const commodity = req.query.commodity || "Potato";
    const limit = parseInt(req.query.limit) || 20;

    const key = cacheKey(state, commodity, limit);
    const data = await fetchMarketPrices(state, commodity, limit);

    if (data && data.status === "ok") {
      data.success = true;
      responseCache.set(key, { data, timestamp: Date.now() });
    }

    return res.json(data);
  } catch (error) {
    const state = req.query.state || "Uttar Pradesh";
    const commodity = req.query.commodity || "Potato";
    const limit = parseInt(req.query.limit) || 20;
    const key = cacheKey(state, commodity, limit);

    const cached = responseCache.get(key);

    if (cached) {
      console.log("Returning cached response for", key);
      return res.json(cached.data);
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ status: "error", message: "Data.gov.in API timed out" });
    }

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});