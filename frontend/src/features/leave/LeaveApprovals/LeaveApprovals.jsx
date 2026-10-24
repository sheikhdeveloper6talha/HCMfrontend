import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import Pagination from "../../../components/Pagination/Pagination";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getLeaves, decideLeave } from "../../../services/leaveService";
import { formatDate } from "../../../utils/formatDate";
import { errorMessage } from "../../../utils/validation";
import styles from "./LeaveApprovals.module.css";

const LeaveApprovals = () => {
  const { isHR } = useAuth();
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => getLeaves({ status, page, limit: 10 }), [status, page]);
  const [deciding, setDeciding] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const onDecide = async () => {
    setBusy(true);
    setFeedback({ type: "", text: "" });
    try {
      await decideLeave(deciding.item._id, { status: deciding.status, comment: comment || undefined });
      setFeedback({ type: "success", text: `Request ${deciding.status}. The employee was notified.` });
      setDeciding(null); setComment(""); reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); setDeciding(null); }
    setBusy(false);
  };

  const columns = [
    { key: "who", header: "Employee", render: (l) => `${l.employee?.name} (${l.employee?.code})` },
    { key: "type", header: "Type", render: (l) => l.leaveType?.name },
    { key: "dates", header: "Dates", render: (l) => `${formatDate(l.startDate)} - ${formatDate(l.endDate)}` },
    { key: "days", header: "Days" },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (l) => <Badge status={l.status} /> },
    { key: "actions", header: "Actions", render: (l) => isHR && l.status === "pending" ? (
      <div className="row">
        <Button small onClick={() => setDeciding({ item: l, status: "approved" })}>Approve</Button>
        <Button small variant="danger" onClick={() => setDeciding({ item: l, status: "rejected" })}>Reject</Button>
      </div>) : (l.comment || "-") },
  ];

  return (
    <>
      <PageHeader title="Leave approvals" subtitle={isHR ? "Review requests and leave a comment" : "All company leave requests"} />
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      <div className={styles.filter}>
        <Select label="Status" name="lstatus" placeholder="All" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          options={["pending", "approved", "rejected", "cancelled"].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />
      </div>
      <Card flush>
        <Table columns={columns} rows={data?.data} loading={loading} error={error} emptyText="No leave requests here" />
        <Pagination meta={data?.meta} onPage={setPage} />
      </Card>
      <Modal open={Boolean(deciding)} title={`${deciding?.status === "approved" ? "Approve" : "Reject"} leave`} onClose={() => setDeciding(null)}
        footer={<><Button variant="secondary" onClick={() => setDeciding(null)}>Cancel</Button><Button variant={deciding?.status === "approved" ? "primary" : "danger"} loading={busy} onClick={onDecide}>Confirm</Button></>}>
        <p style={{ marginBottom: 12 }}>{deciding?.item.employee?.name}: {deciding?.item.days} day(s), {formatDate(deciding?.item.startDate)} - {formatDate(deciding?.item.endDate)}</p>
        <Input label="Comment (optional)" name="lcomment" multiline rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </Modal>
    </>
  );
};
export default LeaveApprovals;
