import api from "./axios";

export const getEmployees = (params) => api.get("/employees", { params }).then((r) => r.data);
export const getEmployee = (id) => api.get(`/employees/${id}`).then((r) => r.data.data);
export const getMyProfile = () => api.get("/employees/me").then((r) => r.data.data);
export const createEmployee = (body) => api.post("/employees", body).then((r) => r.data);
export const updateEmployee = (id, body) => api.put(`/employees/${id}`, body).then((r) => r.data);
export const updateMyContact = (body) => api.put("/employees/me/contact", body).then((r) => r.data);
export const exportEmployees = (params) => api.get("/employees/export", { params, responseType: "blob" }).then((r) => r.data);

// Organization lists (departments, designations, leave-types, holidays) + company settings
export const getCompany = () => api.get("/company").then((r) => r.data.data);
export const updateCompany = (body) => api.put("/company", body).then((r) => r.data.data);
export const listOrg = (path) => api.get(`/company/${path}`).then((r) => r.data.data);
export const saveOrg = (path, body, id) => (id ? api.put(`/company/${path}/${id}`, body) : api.post(`/company/${path}`, body)).then((r) => r.data);
export const deleteOrg = (path, id) => api.delete(`/company/${path}/${id}`).then((r) => r.data);
