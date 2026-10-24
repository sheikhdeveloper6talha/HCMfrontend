import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Modal from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import Pagination from "../../../components/Pagination/Pagination";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getBoard, getCorrections, decideCorrection } from "../../../services/attendanceService";
import { listOrg } from "../../../services/employeeService";
import { formatDate, formatTime, toInputDate } from "../../../utils/formatDate";
import { errorMessage } from "../../../utils/validation";
import styles from "./AttendanceBoard.module.css";

const AttendanceBoard = () => {
  const { isHR } = useAuth();
  const [date, setDate] = useState(toInputDate());
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const board = useFetch(() => getBoard({ date, department }), [date, department]);
  const corr = useFetch(() => getCorrections({ status: "pending", page, limit: 5 }), [page]);
  const { data: depts } = useFetch(() => listOrg("departments"));
  const [deciding, setDeciding] = useState(null); // { item, status }
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const summary = (board.data || []).reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {});

  const onDecide = async () => {
    setBusy(true);
    try {
      await decideCorrection(deciding.item._id, { status: deciding.status, comment: comment || undefined });
      setFeedback({ type: "success", text: `Correction ${deciding.status}` });
      setDeciding(null); setComment(""); corr.reload(); board.reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false);
  };

  const boardCols = [
    { key: "name", header: "Employee", render: (r) => `${r.employee.name} (${r.employee.code})` },
    { key: "department", header: "Department", render: (r) => r.employee.department },
    { key: "checkIn", header: "In", render: (r) => formatTime(r.checkIn) },
    { key: "checkOut", header: "Out", render: (r) => formatTime(r.checkOut) },
    { key: "hours", header: "Hours", render: (r) => r.workedHours || "-" },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
  ];
  const corrCols = [
    { key: "who", header: "Employee", render: (r) => r.employee?.name },
    { key: "date", header: "Date", render: (r) => formatDate(r.date) },
    { key: "times", header: "Requested", render: (r) => `${r.correction.checkIn || "-"} to ${r.correction.checkOut || "-"}` },
    { key: "reason", header: "Reason", render: (r) => r.correction.reason },
    ...(isHR ? [{ key: "actions", header: "Actions", render: (r) => (
      <div className="row">
        <Button small onClick={() => setDeciding({ item: r, status: "approved" })}>Approve</Button>
        <Button small variant="danger" onClick={() => setDeciding({ item: r, status: "rejected" })}>Reject</Button>
      </div>) }] : []),
  ];

  return (
    <>
      <PageHeader title="Attendance board" subtitle="Daily status for every active employee" />
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      <Card>
        <div className={styles.filters}>
          <Input label="Date" type="date" name="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
          <Select label="Department" name="bdept" placeholder="All departments" value={department} onChange={(e) => setDepartment(e.target.value)} options={(depts || []).map((d) => ({ value: d._id, label: d.name }))} />
        </div>
        <div className={styles.chips}>
          {Object.entries(summary).map(([k, v]) => <span key={k}><Badge status={k} /> {v}</span>)}
        </div>
      </Card>
      <Card flush><Table columns={boardCols} rows={board.data} rowKey="employee" loading={board.loading} error={board.error} emptyText="No employees for this date" /></Card>

      <Card title="Pending correction requests" flush>
        <Table columns={corrCols} rows={corr.data?.data} loading={corr.loading} error={corr.error} emptyText="No pending corrections" />
        <Pagination meta={corr.data?.meta} onPage={setPage} />
      </Card>

      <Modal open={Boolean(deciding)} title={`${deciding?.status === "approved" ? "Approve" : "Reject"} correction`} onClose={() => setDeciding(null)}
        footer={<><Button variant="secondary" onClick={() => setDeciding(null)}>Cancel</Button><Button variant={deciding?.status === "approved" ? "primary" : "danger"} loading={busy} onClick={onDecide}>Confirm</Button></>}>
        <p style={{ marginBottom: 12 }}>{deciding?.item.employee?.name} on {formatDate(deciding?.item.date)}</p>
        <Input label="Comment (optional)" name="comment" multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </Modal>
    </>
  );
};
export default AttendanceBoard;
