import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card, { StatCard } from "../../../components/Card/Card";
import Badge from "../../../components/Badge/Badge";
import Loader from "../../../components/Loader/Loader";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import { getDashboard } from "../../../services/miscService";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, formatMonth, formatTime } from "../../../utils/formatDate";
import styles from "../Dashboard.module.css";

const EmployeeDashboard = () => {
  const { data, loading, error } = useFetch(() => getDashboard("employee"));
  if (loading) return <Loader />;
  if (error) return <Alert type="error">{error}</Alert>;
  const t = data.today;
  return (
    <>
      <PageHeader title="My dashboard" />
      <Card>
        <div className={styles.clock}>
          <div>
            <p className="muted">Today</p>
            <p className={styles.big}>
              {t?.checkIn ? `In ${formatTime(t.checkIn)}${t.checkOut ? ` / Out ${formatTime(t.checkOut)}` : ""}` : "Not checked in yet"}{" "}
              {t?.checkIn && <Badge status={t.status} />}
            </p>
          </div>
          <Link to="/attendance">Open attendance</Link>
        </div>
      </Card>
      <div className="grid cols-4">
        <StatCard label="Days present (month)" value={data.daysPresentThisMonth} />
        <StatCard label="Late arrivals (month)" value={data.lateCount} tone="warn" />
        <StatCard label="Hours (last 7 days)" value={data.weeklyHours} tone="info" />
      </div>
      <div className={styles.two}>
        <Card title="Leave balance" action={<Link to="/leave">Apply</Link>}>
          <ul className={styles.list}>
            {data.leaveBalances.map((b) => (
              <li key={b.leaveType._id}><span>{b.leaveType.name}</span><strong>{b.remaining === null ? "No limit" : `${b.remaining} of ${b.quota} left`}</strong></li>
            ))}
          </ul>
        </Card>
        <Card title="Latest payslip" action={<Link to="/payslips">All payslips</Link>}>
          {data.latestPayslip ? (
            <ul className={styles.list}>
              <li><span>Month</span><strong>{formatMonth(data.latestPayslip.month)}</strong></li>
              <li><span>Net salary</span><strong>{formatCurrency(data.latestPayslip.net)}</strong></li>
            </ul>
          ) : <p className="muted">No payslip has been published yet</p>}
        </Card>
      </div>
      <Card title="Announcements" action={<Link to="/announcements">View all</Link>}>
        {data.announcements.length === 0 && <p className="muted">Nothing posted yet</p>}
        {data.announcements.map((a) => (
          <div key={a._id} className={styles.note}><h3>{a.title}</h3><p>{a.message}</p><small className="muted">{formatDate(a.createdAt)}</small></div>
        ))}
      </Card>
    </>
  );
};
export default EmployeeDashboard;
