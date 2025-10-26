import axios from "axios";
import fs from "fs";
import path from "path";
import Country from "../models/country.js";
import { computeEstimatedGDP, errorResponse } from "../utils.js";
import { generateSummaryImage } from "../imageGenerator.js";

export async function refreshCountries(req, res) {
  try {
    console.log("🔄 Fetching countries and exchange rates...");

    const [countriesRes, ratesRes] = await Promise.all([
      axios.get("https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"),
      axios.get("https://open.er-api.com/v6/latest/USD"),
    ]);

    const countries = countriesRes.data;
    const exchangeRates = ratesRes.data.rates;

    if (!Array.isArray(countries)) {
      return errorResponse(res, 503, "External data source unavailable", "Invalid country data");
    }

    const now = new Date();

    for (const c of countries) {
      const currencyCode = c.currencies?.[0]?.code || null;
      const rate = currencyCode ? exchangeRates[currencyCode] : null;
      const estimatedGDP = currencyCode && rate
        ? computeEstimatedGDP(c.population, rate)
        : 0;

      await Country.upsert({
        name: c.name,
        capital: c.capital,
        region: c.region,
        population: c.population,
        currency_code: currencyCode,
        exchange_rate: rate || null,
        estimated_gdp: estimatedGDP,
        flag_url: c.flag,
        last_refreshed_at: now,
      });
    }

    const allCountries = await Country.findAll();
    const top5 = allCountries
      .sort((a, b) => b.estimated_gdp - a.estimated_gdp)
      .slice(0, 5);

    await generateSummaryImage({
      total: allCountries.length,
      top5,
      lastRefreshedAt: now,
    });

    res.json({
      message: "Countries refreshed successfully",
      total: allCountries.length,
      last_refreshed_at: now,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 503, "External data source unavailable", error.message);
  }
}

export async function getAllCountries(req, res) {
  try {
    const { region, currency, sort } = req.query;
    const where = {};
    if (region) where.region = region;
    if (currency) where.currency_code = currency;

    let order = [];
    if (sort === "gdp_desc") order = [["estimated_gdp", "DESC"]];
    if (sort === "gdp_asc") order = [["estimated_gdp", "ASC"]];

    const countries = await Country.findAll({ where, order });
    res.json(countries);
  } catch (err) {
    console.error(err);
    errorResponse(res, 500, "Internal server error");
  }
}

export async function getCountryByName(req, res) {
  try {
    const { name } = req.params;
    const country = await Country.findOne({
      where: { name },
    });
    if (!country) return errorResponse(res, 404, "Country not found");
    res.json(country);
  } catch (err) {
    console.error(err);
    errorResponse(res, 500, "Internal server error");
  }
}

export async function deleteCountry(req, res) {
  try {
    const { name } = req.params;
    const deleted = await Country.destroy({ where: { name } });
    if (!deleted) return errorResponse(res, 404, "Country not found");
    res.json({ message: "Country deleted successfully" });
  } catch (err) {
    console.error(err);
    errorResponse(res, 500, "Internal server error");
  }
}

export async function getStatus(req, res) {
  try {
    const total = await Country.count();
    const lastCountry = await Country.findOne({
      order: [["last_refreshed_at", "DESC"]],
    });
    res.json({
      total_countries: total,
      last_refreshed_at: lastCountry?.last_refreshed_at || null,
    });
  } catch (err) {
    console.error(err);
    errorResponse(res, 500, "Internal server error");
  }
}

export async function getSummaryImage(req, res) {
  try {
    const imgPath = path.resolve("cache/summary.png");

    if (!fs.existsSync(imgPath)) {
      return errorResponse(res, 404, "Summary image not found");
    }

    res.sendFile(imgPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          errorResponse(res, 500, "Failed to send image");
        }
      }
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      errorResponse(res, 500, "Internal server error");
    }
  }
}