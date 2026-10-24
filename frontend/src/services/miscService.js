import api from "./axios";

export const getDashboard = (role, params) => api.get(`/dashboard/${role}`, { params }).then((r) => r.data.data);
export const getAnnouncements = () => api.get("/announcements").then((r) => r.data.data);
export const postAnnouncement = (body) => api.post("/announcements", body).then((r) => r.data);
export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`).then((r) => r.data);
export const getNotifications = () => api.get("/notifications").then((r) => r.data);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data);
export const markAllNotificationsRead = () => api.patch("/notifications/read-all").then((r) => r.data);
export const getAuditLogs = (params) => api.get("/audit", { params }).then((r) => r.data);
