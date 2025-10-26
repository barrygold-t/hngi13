export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function computeEstimatedGDP(population, exchangeRate) {
  if (!population || !exchangeRate || exchangeRate === 0) return 0;
  const multiplier = randomInt(1000, 2000);
  return (population * multiplier) / exchangeRate;
}

export function errorResponse(res, statusCode, message, details = null) {
  const payload = { error: message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
}
