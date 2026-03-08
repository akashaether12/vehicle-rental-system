const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toUtcDateOnly = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const getTodayUtcDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const calculateRentalDays = (startDate, endDate) => {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / DAY_IN_MS) + 1;
};

module.exports = { toUtcDateOnly, getTodayUtcDate, calculateRentalDays, DAY_IN_MS };
