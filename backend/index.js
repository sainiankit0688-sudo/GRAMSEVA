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

// Concurrency guard — prevents parallel fetchAllRecords() calls.
// When multiple /api/market-prices requests arrive before the cache is
// primed, they all share this single in-flight promise instead of each
// triggering an independent 37-request Data.gov.in fetch.
let fetchPromise = null;

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
  delhi: "NCT of Delhi",
};
function normaliseState(input) {
  const lower = (input || "").trim().toLowerCase();
  return STATE_ALIAS[lower] || input;
}

// Normalise commodity names to match Data.gov.in dataset spellings.
// The dataset uses verbose names like "Barley(Jau)" while the UI
// uses short names like "Barley".
const COMMODITY_ALIAS = {
  barley: "Barley(Jau)",
  "bengalgram (chana)": "Bengal Gram(Gram)(Whole)",
  "blackgram (urad)": "Black Gram(Urd Beans)(Whole)",
  cashewnut: "Cashewnuts",
  castor: "Castor Seed",
  "cowpea (lobia)": "Cowpea(Lobia/Karamani)",
  ginger: "Ginger(Green)",
  "greengram (moong)": "Green Gram(Moong)(Whole)",
  guarseed: "Guar Seed(Cluster Beans Seed)",
  "jowar (sorghum)": "Jowar(Sorghum)",
  "masoor (lentil)": "Lentil(Masur)(Whole)",
  "paddy (dhan)": "Paddy(Common)",
  "ragi (finger millet)": "Ragi(Finger Millet)",
  sunflower: "Sunflower/Sunflower Seed",
  "tur (arhar)": "Red gram/Arhar/Tur(whole)",
  urad: "Black Gram(Urd Beans)(Whole)",
  watermelon: "Water Melon",
};
function normaliseCommodity(input) {
  const lower = (input || "").trim().toLowerCase();
  return COMMODITY_ALIAS[lower] || input;
}

// All states/UTs known to exist in Data.gov.in mandi dataset.
// Derived from full API scan — NOT derived from base fetch results.
// Includes states with 0 records so they are discoverable if data appears later.
const KNOWN_STATES = [
  "Andaman and Nicobar",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Keralam",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "NCT of Delhi",
  "Odisha",
  "Pondicherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const DATASET_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const API_PAGE_SIZE = 10000;

function buildDataGovUrl(limit, offset, state) {
  let url =
    `https://api.data.gov.in/resource/${DATASET_ID}` +
    `?api-key=${process.env.DATA_GOV_API_KEY}` +
    `&format=json&limit=${limit}&offset=${offset}`;
  if (state) {
    url += `&filters[state]=${encodeURIComponent(state)}`;
  }
  return url;
}

async function fetchWithRetry(url) {
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: TIMEOUT_MS,
        httpsAgent: dataGovAgent,
        proxy: false,
        headers: {
          "Connection": "close",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      console.error(
        `Attempt ${attempt}/${MAX_RETRIES} failed:`,
        status ? `HTTP ${status}` : error?.response?.data || error.message,
      );
      if (attempt < MAX_RETRIES) {
        if (status === 429) {
          // Rate-limited: respect Retry-After header if present,
          // otherwise use a generous fixed backoff (10 s).
          const retryAfter = error?.response?.headers?.["retry-after"];
          const waitMs = retryAfter
            ? Math.min(parseInt(retryAfter, 10) * 1000, 30000)
            : 10000;
          console.error(`  429 rate-limited — waiting ${waitMs / 1000}s`);
          await sleep(waitMs);
        } else {
          await sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }
  }
  throw lastError;
}

// Fetch ALL records from Data.gov.in.
// Data.gov.in hard-caps at 10,000 records per request.
// This function uses base fetch + state-level supplementary fetch
// to retrieve the complete dataset.
async function fetchAllRecords() {
  // Phase 1: Base fetch
  const baseBody = await fetchWithRetry(buildDataGovUrl(API_PAGE_SIZE, 0));
  if (
    !baseBody ||
    baseBody.status !== "ok" ||
    !Array.isArray(baseBody.records)
  ) {
    throw new Error("Data.gov.in base fetch failed");
  }
  let allRecords = [...baseBody.records];
  const baseTotal = baseBody.total || allRecords.length;

  console.log(
    `Base fetch: ${allRecords.length} records (dataset total: ${baseTotal})`,
  );

  // Phase 2: Early exit if total fits within one API page (no truncation)
  if (baseTotal <= API_PAGE_SIZE) {
    responseCache.set(ALL_DATA_CACHE_KEY, {
      records: allRecords,
      timestamp: Date.now(),
    });
    return { status: "ok", records: allRecords, total: allRecords.length };
  }

  // Phase 3: State-based supplementary fetch
  for (const state of KNOWN_STATES) {
    try {
      const body = await fetchWithRetry(
        buildDataGovUrl(API_PAGE_SIZE, 0, state),
      );
      // Post-filter: keep ONLY records matching this state
      // (Data.gov.in filter is unreliable for some states)
      const stateRecords = (body.records || []).filter(
        (r) => r.state === state,
      );

      if (stateRecords.length > 0) {
        const baseCount = allRecords.filter((r) => r.state === state).length;
        if (stateRecords.length > baseCount) {
          allRecords = allRecords.filter((r) => r.state !== state);
          allRecords.push(...stateRecords);
          console.log(
            `  ${state}: supplemented ${baseCount} -> ${stateRecords.length}`,
          );
        }
      }
    } catch (e) {
      console.error(
        `  ${state}: fetch failed, keeping base data`,
        e.message,
      );
    }
    // Pace requests to avoid triggering Data.gov.in rate limits.
    await sleep(500);
  }

  console.log(
    `Total fetched: ${allRecords.length} records (base: ${baseBody.records.length})`,
  );

  // Phase 4: Cache
  responseCache.set(ALL_DATA_CACHE_KEY, {
    records: allRecords,
    timestamp: Date.now(),
  });

  return { status: "ok", records: allRecords, total: allRecords.length };
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
    const requestedCommodity = normaliseCommodity((req.query.commodity || "").trim());
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    // Try cached full dataset first
    let cachedAll = responseCache.get(ALL_DATA_CACHE_KEY);
    if (!cachedAll) {
      // If another request is already fetching, share its promise
      // instead of triggering a duplicate 37-request Data.gov.in burst.
      if (!fetchPromise) {
        fetchPromise = fetchAllRecords().finally(() => {
          fetchPromise = null;
        });
      }
      const body = await fetchPromise;
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
      const reqCommodity = normaliseCommodity((req.query.commodity || "").trim());
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