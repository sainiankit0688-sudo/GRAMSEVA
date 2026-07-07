require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const https = require("https");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const TIMEOUT_MS = 30000; // 30 seconds
const MAX_RETRIES = 3;

// In-memory cache: key = `${state}|${commodity}` -> { records, timestamp }
const responseCache = new Map();

const ALL_DATA_CACHE_KEY = "__all_data__";

// Custom HTTPS agent for data.gov.in — avoids connection reuse issues
const dataGovAgent = new https.Agent({
  keepAlive: false,
  rejectUnauthorized: false,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Normalise state names to match Data.gov.in dataset spellings.
// The dataset uses "Keralam" instead of "Kerala", "Chattisgarh"
// instead of "Chhattisgarh", etc.
const STATE_ALIAS = {
  kerala: "Keralam",
  chhattisgarh: "Chattisgarh",
  "andaman and nicobar islands": "Andaman and Nicobar",
};
function normaliseState(input) {
  const lower = (input || "").trim().toLowerCase();
  return STATE_ALIAS[lower] || input;
}

// Fetch ALL records from Data.gov.in (filters are NOT supported by this dataset)
// On success, caches the full dataset so subsequent requests are instant.
async function fetchAllRecords() {
  const url =
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` +
    `?api-key=${process.env.DATA_GOV_API_KEY}` +
    `&format=json` +
    `&limit=10000`;

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

      const body = response.data;
      if (body && body.status === "ok" && Array.isArray(body.records)) {
        responseCache.set(ALL_DATA_CACHE_KEY, {
          records: body.records,
          timestamp: Date.now(),
        });
        console.log(`Fetched ${body.records.length} records from Data.gov.in`);
      }
      return body;
    } catch (error) {
      lastError = error;
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed:`,
        error?.response?.data || error.message,
      );
      console.error("Stack:", error.stack);

      if (attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 1000;
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

// Market Prices — filter server-side because Data.gov.in dataset
// (resource 9ef84268-…) has external_ws=0 (filters disabled).
app.get("/api/market-prices", async (req, res) => {
  try {
    const requestedState = normaliseState((req.query.state || "").trim());
    const requestedCommodity = (req.query.commodity || "").trim();
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Try cached full dataset first
    let cachedAll = responseCache.get(ALL_DATA_CACHE_KEY);
    if (!cachedAll) {
      const body = await fetchAllRecords();
      if (!body || body.status !== "ok" || !Array.isArray(body.records)) {
        return res.status(502).json({
          success: false,
          status: "error",
          message: "Data.gov.in API returned an error response",
        });
      }
      cachedAll = responseCache.get(ALL_DATA_CACHE_KEY);
    }

    let allRecords = cachedAll.records;

    // Server-side filtering
    let filtered = allRecords;
    if (requestedState) {
      filtered = filtered.filter(
        (r) => r.state && r.state.toLowerCase() === requestedState.toLowerCase(),
      );
    }
    if (requestedCommodity) {
      filtered = filtered.filter(
        (r) =>
          r.commodity &&
          r.commodity.toLowerCase() === requestedCommodity.toLowerCase(),
      );
    }

    // Apply pagination on the filtered result
    const totalFiltered = filtered.length;
    const page = filtered.slice(offset, offset + limit);

    // Build a response that mirrors the Data.gov.in shape
    const responseBody = {
      status: "ok",
      total: totalFiltered,
      count: page.length,
      limit: String(limit),
      offset: String(offset),
      records: page,
      success: true,
    };

    return res.json(responseBody);
  } catch (error) {
    console.error("Error in /api/market-prices:", error.message);

    // On failure, return whatever cached data exists (even if unfiltered)
    const cachedAll = responseCache.get(ALL_DATA_CACHE_KEY);
    if (cachedAll) {
      let fallback = cachedAll.records;
      const reqState = normaliseState((req.query.state || "").trim());
      const reqCommodity = (req.query.commodity || "").trim();
      if (reqState) {
        fallback = fallback.filter(
          (r) => r.state && r.state.toLowerCase() === reqState.toLowerCase(),
        );
      }
      if (reqCommodity) {
        fallback = fallback.filter(
          (r) =>
            r.commodity &&
            r.commodity.toLowerCase() === reqCommodity.toLowerCase(),
        );
      }
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const page = fallback.slice(offset, offset + limit);
      console.log("Returning cached fallback for", reqState, reqCommodity);
      return res.json({
        status: "ok",
        total: fallback.length,
        count: page.length,
        limit: String(limit),
        offset: String(offset),
        records: page,
        success: true,
      });
    }

    if (error.code === "ECONNABORTED") {
      return res
        .status(504)
        .json({ status: "error", message: "Data.gov.in API timed out" });
    }

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});