import fs from "fs";
import path from "path";
import sharp from "sharp";
import dayjs from "dayjs";

const CACHE_DIR = "cache";
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

export async function generateSummaryImage({ total, top5, lastRefreshedAt }) {
  const formatted = dayjs(lastRefreshedAt).format("YYYY-MM-DD HH:mm:ss");
  const lines = [
    `🌍 Country Summary`,
    `Total Countries: ${total}`,
    `Last Refreshed: ${formatted}`,
    "",
    "Top 5 by Estimated GDP:",
    ...top5.map(
      (c, i) => `${i + 1}. ${c.name} — $${Math.round(c.estimated_gdp || 0).toLocaleString()}`
    ),
  ];

  const svg = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0f172a" />
    ${lines
      .map(
        (line, i) =>
          `<text x="50" y="${100 + i * 50}" font-family="Arial" font-size="36" fill="#e2e8f0">${line}</text>`
      )
      .join("\n")}
  </svg>`;

  const out = path.join(CACHE_DIR, "summary.png");
  await sharp(Buffer.from(svg)).png().toFile(out);
  return out;
}
