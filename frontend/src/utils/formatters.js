export const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

export const formatRelativeDate = (date) =>
  new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );
