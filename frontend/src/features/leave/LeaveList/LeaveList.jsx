import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card, { StatCard } from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import { ConfirmModal } from "../../../components/Modal/Modal";
import LeaveForm from "../LeaveForm/LeaveForm";
import useFetch from "../../../hooks/useFetch";
import { getBalance, getMyLeaves, cancelLeave } from "../../../services/leaveService";
import { formatDate } from "../../../utils/formatDate";
import { errorMessage } from "../../../utils/validation";
import { todayStr } from "./today";

const LeaveList = () => {
  const balance = useFetch(getBalance);
  const history = useFetch(getMyLeaves);
  const [applying, setApplying] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const reloadAll = () => { balance.reload(); history.reload(); };
  const onCancel = async () => {
    setBusy(true);
    try { await cancelLeave(cancelling._id); setFeedback({ type: "success", text: "Leave request cancelled" }); reloadAll(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false); setCancelling(null);
  };

  const canCancel = (l) => l.status === "pending" || (l.status === "approved" && l.startDate > todayStr());
  const columns = [
    { key: "type", header: "Type", render: (l) => l.leaveType?.name },
    { key: "dates", header: "Dates", render: (l) => `${formatDate(l.startDate)} - ${formatDate(l.endDate)}` },
    { key: "days", header: "Days" },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (l) => <Badge status={l.status} /> },
    { key: "comment", header: "HR comment", render: (l) => l.comment || "-" },
    { key: "actions", header: "", render: (l) => canCancel(l) && <Button small variant="secondary" onClick={() => setCancelling(l)}>Cancel</Button> },
  ];

  return (
    <>
      <PageHeader title="My leave" subtitle="Balances count pending and approved requests"><Button onClick={() => setApplying(true)}>Apply for leave</Button></PageHeader>
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      <Alert type="error">{balance.error}</Alert>
      <div className="grid cols-4">
        {(balance.data || []).map((b) => (
          <StatCard key={b.leaveType._id} label={b.leaveType.name} value={b.remaining === null ? "Unlimited" : b.remaining}
            hint={b.quota === null ? `${b.used} days taken (unpaid)` : `${b.used} used of ${b.quota} days`} />
        ))}
      </div>
      <Card title="History" flush><Table columns={columns} rows={history.data} loading={history.loading} error={history.error} emptyText="You have not requested any leave yet" /></Card>
      <LeaveForm open={applying} leaveTypes={(balance.data || []).map((b) => b.leaveType)} onClose={() => setApplying(false)}
        onDone={(text) => { setApplying(false); setFeedback({ type: "success", text }); reloadAll(); }} />
      <ConfirmModal open={Boolean(cancelling)} title="Cancel leave" message="Cancel this leave request?" confirmLabel="Yes, cancel it" loading={busy} onConfirm={onCancel} onClose={() => setCancelling(null)} />
    </>
  );
};
export default LeaveList;
