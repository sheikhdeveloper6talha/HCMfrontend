export const formatCurrency = (n, currency = "PKR") =>
  `${currency} ${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
