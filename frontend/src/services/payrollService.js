import api from "./axios";

export const getRuns = () => api.get("/payroll/runs").then((r) => r.data.data);
export const createRun = (month) => api.post("/payroll/runs", { month }).then((r) => r.data.data);
export const getRun = (id) => api.get(`/payroll/runs/${id}`).then((r) => r.data.data);
export const finalizeRun = (id) => api.patch(`/payroll/runs/${id}/finalize`).then((r) => r.data.data);
export const getSalaries = () => api.get("/payroll/salaries").then((r) => r.data.data);
export const saveSalary = (employeeId, body) => api.put(`/payroll/salaries/${employeeId}`, body).then((r) => r.data);
export const getMyPayslips = () => api.get("/payroll/payslips/me").then((r) => r.data.data);
export const downloadPayslip = (id) => api.get(`/payroll/payslips/${id}/pdf`, { responseType: "blob" }).then((r) => r.data);
