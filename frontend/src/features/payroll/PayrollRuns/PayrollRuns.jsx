import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getRuns, createRun } from "../../../services/payrollService";
import { currentMonth, formatMonth } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { errorMessage, required } from "../../../utils/validation";
import styles from "./PayrollRuns.module.css";

const PayrollRuns = () => {
  const { isHR } = useAuth();
  const { data, loading, error, reload } = useFetch(getRuns);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { month: currentMonth() } });

  const onCreate = async ({ month }) => {
    setFeedback({ type: "", text: "" });
    try { const run = await createRun(month); setFeedback({ type: "success", text: `Draft for ${formatMonth(month)} ready with ${run.employeeCount} payslips. Review it, then ask the Admin to finalize.` }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  const columns = [
    { key: "month", header: "Month", render: (r) => formatMonth(r.month) },
    { key: "employeeCount", header: "Employees" },
    { key: "totalGross", header: "Total gross", render: (r) => formatCurrency(r.totalGross) },
    { key: "totalNet", header: "Total net", render: (r) => formatCurrency(r.totalNet) },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "open", header: "", render: (r) => <Link to={`/payroll/${r._id}`}>Review</Link> },
  ];

  return (
    <>
      <PageHeader title="Payroll" subtitle="HR prepares monthly drafts. Admin finalizes and locks them." />
      <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>
      {isHR && (
        <Card title="Create or rebuild a draft">
          <form className={styles.form} onSubmit={handleSubmit(onCreate)} noValidate>
            <Input label="Month" type="month" error={errors.month?.message} {...register("month", required("Month"))} />
            <Button type="submit" loading={isSubmitting}>Generate draft</Button>
          </form>
          <p className="muted" style={{ marginTop: 10, fontSize: "0.85rem" }}>Uses attendance, approved leave, salary structures and joining/leaving dates. Employees without a salary structure are skipped. Finalized months cannot be rebuilt.</p>
        </Card>
      )}
      <Card flush><Table columns={columns} rows={data} loading={loading} error={error} emptyText="No payroll runs yet" /></Card>
    </>
  );
};
export default PayrollRuns;
