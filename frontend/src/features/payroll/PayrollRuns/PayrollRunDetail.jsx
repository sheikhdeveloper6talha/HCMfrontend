import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card, { StatCard } from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import { ConfirmModal } from "../../../components/Modal/Modal";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getRun, finalizeRun, downloadPayslip } from "../../../services/payrollService";
import { formatMonth } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { errorMessage, saveBlob } from "../../../utils/validation";

const PayrollRunDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data, loading, error, reload } = useFetch(() => getRun(id), [id]);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  if (loading) return <Loader />;
  if (error) return <Alert type="error">{error}</Alert>;
  const { run, payslips } = data;

  const onFinalize = async () => {
    setBusy(true);
    try { await finalizeRun(id); setFeedback({ type: "success", text: "Payroll finalized and locked. Employees were notified." }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false); setConfirming(false);
  };
  const onPdf = async (p) => {
    try { saveBlob(await downloadPayslip(p._id), `payslip-${p.month}-${p.employee.code}.pdf`); }
    catch (e) { setFeedback({ type: "error", text: "Could not download the payslip" }); }
  };

  const columns = [
    { key: "who", header: "Employee", render: (p) => `${p.employee?.name} (${p.employee?.code})` },
    { key: "days", header: "Days (employed/working)", render: (p) => `${p.employedDays}/${p.workingDays}` },
    { key: "abs", header: "Absent / half / unpaid", render: (p) => `${p.absentDays} / ${p.halfDays} / ${p.unpaidLeaveDays}` },
    { key: "gross", header: "Gross", render: (p) => formatCurrency(p.gross) },
    { key: "ded", header: "Deductions", render: (p) => formatCurrency(p.deductions) },
    { key: "tax", header: "Tax", render: (p) => formatCurrency(p.tax) },
    { key: "net", header: "Net", render: (p) => <strong>{formatCurrency(p.net)}</strong> },
    { key: "pdf", header: "", render: (p) => <Button small variant="secondary" onClick={() => onPdf(p)}>PDF</Button> },
  ];

  return (
    <>
      <PageHeader title={`Payroll: ${formatMonth(run.month)}`} subtitle="Review before finalizing">
        <Link to="/payroll">Back to payroll</Link>
        <Badge status={run.status} />
        {isAdmin && run.status === "draft" && <Button onClick={() => setConfirming(true)}>Finalize payroll</Button>}
      </PageHeader>
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      {run.status === "finalized" && <Alert type="info">This payroll is finalized and locked. It cannot be edited.</Alert>}
      <div className="grid cols-4">
        <StatCard label="Employees" value={run.employeeCount} />
        <StatCard label="Total gross" value={formatCurrency(run.totalGross)} tone="info" />
        <StatCard label="Total net" value={formatCurrency(run.totalNet)} />
      </div>
      <Card flush><Table columns={columns} rows={payslips} emptyText="No payslips in this draft. Check that employees have salary structures." /></Card>
      <p className="muted" style={{ fontSize: "0.8rem" }}>Tax uses illustrative annual slabs (0% to 600k, 5% to 1.2M, 15% to 2.4M, 25% above). It is not tax or legal advice.</p>
      <ConfirmModal open={confirming} danger={false} title="Finalize payroll" message={`Finalize ${formatMonth(run.month)}? It will be locked, and employees will be able to download their payslips.`} confirmLabel="Finalize and lock" loading={busy} onConfirm={onFinalize} onClose={() => setConfirming(false)} />
    </>
  );
};
export default PayrollRunDetail;
