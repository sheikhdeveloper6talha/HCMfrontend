// Reusable react-hook-form rules
export const required = (label) => ({ required: `${label} is required` });
export const emailRule = {
  required: "Email is required",
  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
};
export const passwordRule = {
  required: "Password is required",
  minLength: { value: 8, message: "Use at least 8 characters" },
};
export const numberRule = (label, min = 0) => ({
  required: `${label} is required`,
  min: { value: min, message: `${label} must be at least ${min}` },
  valueAsNumber: true,
});

// Turns an Axios error into a readable message
export const errorMessage = (err) =>
  err?.response?.data?.message || (err?.request ? "Cannot reach the server. Check your connection." : err?.message) || "Something went wrong";

// Saves a Blob returned by Axios as a file download
export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
