import CrudPage from "../CrudPage/CrudPage";

const LeaveTypes = () => (
  <CrudPage title="Leave types" subtitle="Annual quotas apply to paid types. Unpaid leave has no limit." path="leave-types" singular="Leave type"
    fields={[
      { name: "name", label: "Name", rules: { required: "Name is required" } },
      { name: "annualQuota", label: "Annual quota (days)", type: "number", asNumber: true, defaultValue: 0, rules: { required: "Quota is required", min: { value: 0, message: "Cannot be negative" } } },
      { name: "paid", label: "Paid leave (uses quota)", type: "checkbox", defaultValue: true },
    ]}
    columns={[
      { key: "name", header: "Name" },
      { key: "annualQuota", header: "Annual quota", render: (r) => (r.paid ? `${r.annualQuota} days` : "No limit") },
      { key: "paid", header: "Type", render: (r) => (r.paid ? "Paid" : "Unpaid") },
    ]} />
);
export default LeaveTypes;
