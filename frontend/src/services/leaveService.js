import api from "./axios";

export const getBalance = () => api.get("/leaves/balance").then((r) => r.data.data);
export const getMyLeaves = () => api.get("/leaves/me").then((r) => r.data.data);
export const applyLeave = (body) => api.post("/leaves", body).then((r) => r.data);
export const cancelLeave = (id) => api.patch(`/leaves/${id}/cancel`).then((r) => r.data);
export const getLeaves = (params) => api.get("/leaves", { params }).then((r) => r.data);
export const decideLeave = (id, body) => api.patch(`/leaves/${id}/decision`, body).then((r) => r.data);
