import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card, { StatCard } from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Select from "../../../components/Select/Select";
import BarChart from "../../../components/BarChart/BarChart";
import Loader from "../../../components/Loader/Loader";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import { getDashboard } from "../../../services/miscService";
import { listOrg } from "../../../services/employeeService";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime, formatMonth } from "../../../utils/formatDate";
import styles from "../Dashboard.module.css";

const AdminDashboard = () => {
  const [department, setDepartment] = useState("");
  const { data, loading, error } = useFetch(() => getDashboard("admin", { department }), [department]);
  const { data: depts } = useFetch(() => listOrg("departments"));

  return (
    <>
      <PageHeader title="Company dashboard" subtitle="Live numbers from your database" />
      <div className={styles.filters}>
        <Select label="Department" placeholder="All departments" value={department} onChange={(e) => setDepartment(e.target.value)}
          options={(depts || []).map((d) => ({ value: d._id, label: d.name }))} />
      </div>
      {loading && <Loader />}
      <Alert type="error">{error}</Alert>
      {data && (
        <>
          <div className="grid cols-4">
            <StatCard label="Headcount" value={data.headcount} hint="Active employees" />
            <StatCard label="Attrition (12 mo)" value={`${data.attritionRate}%`} hint={`${data.left} left`} tone="warn" />
            <StatCard label="Monthly payroll cost" value={formatCurrency(data.monthlyPayrollCost)} hint="Gross, from salary structures" tone="info" />
            <StatCard label="Average salary" value={formatCurrency(data.averageSalary)} hint="Gross per month" />
          </div>
          <div className={styles.two}>
            <Card title="Headcount by department">
              <BarChart data={data.departments.map((d) => ({ label: d.department.slice(0, 6), values: [d.headcount] }))} series={[{ name: "Employees", color: "#0b8a73" }]} />
            </Card>
            <Card title="Department cost" flush>
              <Table rows={data.departments} rowKey="department" emptyText="No employees yet"
                columns={[{ key: "department", header: "Department" }, { key: "headcount", header: "Headcount" }, { key: "cost", header: "Monthly cost", render: (r) => formatCurrency(r.cost) }]} />
            </Card>
          </div>
          <div className={styles.two}>
            <Card title="Payroll runs" flush>
              <Table rows={data.payrollTrend} rowKey="month" emptyText="No payroll runs yet"
                columns={[{ key: "month", header: "Month", render: (r) => formatMonth(r.month) }, { key: "gross", header: "Gross", render: (r) => formatCurrency(r.gross) }, { key: "net", header: "Net", render: (r) => formatCurrency(r.net) }, { key: "status", header: "Status" }]} />
            </Card>
            <Card title="Recent activity">
              {data.recentAudit.length === 0 && <p className="muted">No activity yet</p>}
              <ul className={styles.list}>
                {data.recentAudit.map((a) => (
                  <li key={a._id}><span><strong>{a.actorName || "System"}</strong> {a.action.replace(/_/g, " ")} {a.entity}</span><span className="muted">{formatDateTime(a.createdAt)}</span></li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}
    </>
  );
};
export default AdminDashboard;
