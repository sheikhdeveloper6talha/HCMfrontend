import { useState } from "react";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import { getMyPayslips, downloadPayslip } from "../../../services/payrollService";
import { formatMonth } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { saveBlob } from "../../../utils/validation";

const Payslips = () => {
  const { data, loading, error } = useFetch(getMyPayslips);
  const [busyId, setBusyId] = useState("");
  const [dlError, setDlError] = useState("");

  const onDownload = async (p) => {
    setBusyId(p._id); setDlError("");
    try { saveBlob(await downloadPayslip(p._id), `payslip-${p.month}.pdf`); }
    catch { setDlError("Could not download this payslip. Please try again."); }
    setBusyId("");
  };

  const columns = [
    { key: "month", header: "Month", render: (p) => formatMonth(p.month) },
    { key: "gross", header: "Gross", render: (p) => formatCurrency(p.gross) },
    { key: "deductions", header: "Deductions", render: (p) => formatCurrency(p.deductions + p.tax) },
    { key: "net", header: "Net salary", render: (p) => <strong>{formatCurrency(p.net)}</strong> },
    { key: "pdf", header: "", render: (p) => <Button small loading={busyId === p._id} onClick={() => onDownload(p)}>Download PDF</Button> },
  ];
  return (
    <>
      <PageHeader title="My payslips" subtitle="Available after payroll is finalized" />
      <Alert type="error">{dlError}</Alert>
      <Card flush><Table columns={columns} rows={data} loading={loading} error={error} emptyText="No payslips yet" /></Card>
    </>
  );
};
export default Payslips;
