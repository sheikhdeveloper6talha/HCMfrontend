import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import Badge from "../../../components/Badge/Badge";
import Input from "../../../components/Input/Input";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import Table from "../../../components/Table/Table";
import AttendanceCorrection from "../AttendanceCorrection/AttendanceCorrection";
import useFetch from "../../../hooks/useFetch";
import { checkIn, checkOut, getMyCalendar, getMyCorrections } from "../../../services/attendanceService";
import { currentMonth, formatDate, formatTime } from "../../../utils/formatDate";
import { errorMessage } from "../../../utils/validation";
import styles from "./AttendanceCalendar.module.css";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Asks the browser for GPS only when needed; the server decides if it is required
const getPosition = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({});
    navigator.geolocation.getCurrentPosition((p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }), () => resolve({}), { timeout: 5000 });
  });

const AttendanceCalendar = () => {
  const [month, setMonth] = useState(currentMonth());
  const { data, loading, error, reload } = useFetch(() => getMyCalendar(month), [month]);
  const { data: corrections, loading: cLoading, error: cError, reload: reloadCorr } = useFetch(getMyCorrections);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [correcting, setCorrecting] = useState(null); // date string or ""

  const act = async (fn, okText) => {
    setBusy(true);
    setFeedback({ type: "", text: "" });
    try { await fn(await getPosition()); setFeedback({ type: "success", text: okText }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false);
  };

  const today = data?.today;
  const offset = data?.days?.length ? new Date(`${data.days[0].date}T00:00:00`).getDay() : 0;

  const corrColumns = [
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "reason", header: "Reason", render: (r) => r.correction.reason },
    { key: "status", header: "Status", render: (r) => <Badge status={r.correction.status} /> },
    { key: "comment", header: "HR comment", render: (r) => r.correction.comment || "-" },
  ];

  return (
    <>
      <PageHeader title="My attendance" subtitle="Check in and out. The server records the time.">
        <Button variant="secondary" onClick={() => setCorrecting("")}>Request correction</Button>
      </PageHeader>
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>

      <Card>
        <div className={styles.today}>
          <div>
            <p className="muted">Today</p>
            <p className={styles.times}>
              <span>In: <strong>{formatTime(today?.checkIn)}</strong></span>
              <span>Out: <strong>{formatTime(today?.checkOut)}</strong></span>
              {today?.checkIn && <Badge status={today.status} />}
            </p>
          </div>
          <div className="row">
            <Button loading={busy} disabled={Boolean(today?.checkIn)}
             onClick={() => act((p) => checkIn(p), "Checked in")}>Check in</Button>
            <Button variant="secondary" loading={busy} disabled={!today?.checkIn || Boolean(today?.checkOut)} onClick={() => act((p) => checkOut(p), "Checked out")}>Check out</Button>
          </div>
        </div>
      </Card>

      <Card title="Calendar" action={<Input label="" aria-label="Month" name="month" type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />}>
        {loading && <Loader />}
        <Alert type="error">{error}</Alert>
        {data && (
          <>
            <div className={styles.grid} role="grid" aria-label="Attendance calendar">
              {WEEK.map((d) => <div key={d} className={styles.dow}>{d}</div>)}
              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
              {data.days.map((d) => (
                <button key={d.date} className={`${styles.day} ${styles[d.status]}`} onClick={() => ["absent", "half_day", "missing_checkout", "late", "present"].includes(d.status) && setCorrecting(d.date)}
                  title={`${formatDate(d.date)}: ${d.status.replace(/_/g, " ")}${d.checkIn ? ` (${formatTime(d.checkIn)} - ${formatTime(d.checkOut)})` : ""}`}>
                  <span>{Number(d.date.slice(8))}</span>
                  <small>{d.status === "none" ? "" : d.status.replace(/_/g, " ")}</small>
                </button>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 10, fontSize: "0.8rem" }}>Tap a past day to request a correction.</p>
          </>
        )}
      </Card>

      <Card title="My correction requests" flush>
        <Table columns={corrColumns} rows={corrections} loading={cLoading} error={cError} rowKey="_id" emptyText="No correction requests" />
      </Card>

      <AttendanceCorrection open={correcting !== null} date={correcting || undefined} onClose={() => setCorrecting(null)}
        onDone={(text) => { setCorrecting(null); setFeedback({ type: "success", text }); reloadCorr(); reload(); }} />
    </>
  );
};
export default AttendanceCalendar;
