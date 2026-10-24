import api from "./axios";

export const checkIn = (body = {}) => api.post("/attendance/check-in", body).then((r) => r.data);
export const checkOut = (body = {}) => api.post("/attendance/check-out", body).then((r) => r.data);
export const getMyCalendar = (month) => api.get("/attendance/me", { params: { month } }).then((r) => r.data.data);
export const getMyCorrections = () => api.get("/attendance/corrections/me").then((r) => r.data.data);
export const requestCorrection = (body) => api.post("/attendance/corrections", body).then((r) => r.data);
export const getBoard = (params) => api.get("/attendance/board", { params }).then((r) => r.data.data);
export const getCorrections = (params) => api.get("/attendance/corrections", { params }).then((r) => r.data);
export const decideCorrection = (id, body) => api.patch(`/attendance/corrections/${id}`, body).then((r) => r.data);
