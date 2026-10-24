import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card, { StatCard } from "../../../components/Card/Card";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import BarChart from "../../../components/BarChart/BarChart";
import Loader from "../../../components/Loader/Loader";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import { getDashboard } from "../../../services/miscService";
import { listOrg } from "../../../services/employeeService";
import styles from "../Dashboard.module.css";

const shift = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

const HRDashboard = () => {
  const [filters, setFilters] = useState({ from: shift(-6), to: shift(0), department: "" });
  const set = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));
  const { data, loading, error } = useFetch(() => getDashboard("hr", filters), [filters.from, filters.to, filters.department]);
  const { data: depts } = useFetch(() => listOrg("departments"));

  return (
    <>
      <PageHeader title="HR dashboard" subtitle="Attendance and leave at a glance" />
      <div className={styles.filters}>
        <Input label="From" type="date" name="from" value={filters.from} max={filters.to} onChange={set("from")} />
        <Input label="To" type="date" name="to" value={filters.to} min={filters.from} onChange={set("to")} />
        <Select label="Department" name="dept" placeholder="All departments" value={filters.department} onChange={set("department")} options={(depts || []).map((d) => ({ value: d._id, label: d.name }))} />
      </div>
      {loading && <Loader />}
      <Alert type="error">{error}</Alert>
      {data && (
        <>
          <div className="grid cols-4">
            <StatCard label="Total employees" value={data.totalEmployees} />
            <StatCard label="Present today" value={data.presentToday} />
            <StatCard label="On leave today" value={data.onLeaveToday} tone="info" />
            <StatCard label="Late today" value={data.lateToday} tone="warn" />
            <StatCard label="Pending approvals" value={data.pendingApprovals} hint={`${data.pendingLeaves} leave, ${data.pendingCorrections} attendance`} tone="danger" />
            <StatCard label="Absenteeism" value={`${data.absenteeismRate}%`} hint="In selected range" tone="warn" />
          </div>
          <div className={styles.two}>
            <Card title="Attendance trend">
              <BarChart
                data={data.trend.map((t) => ({ label: t.date.slice(8), values: [t.present, t.late, t.onLeave, t.absent] }))}
                series={[{ name: "Present", color: "#0b8a73" }, { name: "Late", color: "#b7791f" }, { name: "On leave", color: "#2f5fa8" }, { name: "Absent", color: "#c0392b" }]} />
            </Card>
            <Card title="Leave usage (working days)" action={<Link to="/leave">Review requests</Link>}>
              {data.leaveUsage.length === 0 && <p className="muted">No approved leave in this range</p>}
              <ul className={styles.list}>{data.leaveUsage.map((l) => <li key={l.name}><span>{l.name}</span><strong>{l.days}</strong></li>)}</ul>
            </Card>
          </div>
        </>
      )}
    </>
  );
};
export default HRDashboard;
