import api from "./axios";

export const getSetupStatus = () => api.get("/auth/setup-status").then((r) => r.data.data);
export const setupCompany = (body) => api.post("/auth/setup", body).then((r) => r.data.data);
export const loginUser = (body) => api.post("/auth/login", body).then((r) => r.data.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data.data);
export const changePassword = (body) => api.put("/auth/change-password", body).then((r) => r.data);

// Account management
export const getUsers = (role) => api.get("/auth/users", { params: { role } }).then((r) => r.data.data);
export const createHrUser = (body) => api.post("/auth/users/hr", body).then((r) => r.data);
export const setUserStatus = (id, isActive) => api.patch(`/auth/users/${id}/status`, { isActive }).then((r) => r.data);
export const resetUserPassword = (id) => api.post(`/auth/users/${id}/reset-password`).then((r) => r.data);
