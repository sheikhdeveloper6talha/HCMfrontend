import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import Badge from "../../../components/Badge/Badge";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getSalaries, saveSalary } from "../../../services/payrollService";
import { formatCurrency } from "../../../utils/formatCurrency";
import { errorMessage, numberRule } from "../../../utils/validation";
import styles from "./SalaryStructure.module.css";

const SalaryStructure = () => {
  const { isHR } = useAuth();
  const { data, loading, error, reload } = useFetch(getSalaries);
  const [editing, setEditing] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const [basic, hra, medical, other] = watch(["basic", "hra", "medical", "other"]).map((v) => Number(v) || 0);

  const openEdit = (row) => {
    const s = row.salary;
    reset({ basic: s?.basic ?? "", hra: s?.hra ?? 0, medical: s?.medical ?? 0, other: s?.other ?? 0 });
    setFeedback({ type: "", text: "" });
    setEditing(row.employee);
  };
  // Default policy: HRA 40% and medical 10% of basic (gross = 1.5 x basic)
  const autoFill = () => { setValue("hra", Math.round(basic * 0.4)); setValue("medical", Math.round(basic * 0.1)); setValue("other", 0); };

  const onSave = async (v) => {
    try {
      await saveSalary(editing._id, v);
      setEditing(null);
      setFeedback({ type: "success", text: "Salary structure saved. It applies to future payroll drafts." });
      reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  const columns = [
    { key: "name", header: "Employee", render: (r) => `${r.employee.name} (${r.employee.code})` },
    { key: "dept", header: "Department", render: (r) => r.employee.department?.name },
    { key: "basic", header: "Basic", render: (r) => (r.salary ? formatCurrency(r.salary.basic) : <Badge status="pending">Not set</Badge>) },
    { key: "gross", header: "Gross", render: (r) => (r.salary ? formatCurrency(r.salary.basic + r.salary.hra + r.salary.medical + r.salary.other) : "-") },
    ...(isHR ? [{ key: "actions", header: "", render: (r) => <Button small variant="secondary" onClick={() => openEdit(r)}>{r.salary ? "Edit" : "Set salary"}</Button> }] : []),
  ];

  return (
    <>
      <PageHeader title="Salary structures" subtitle="Basic salary and allowances for each employee" />
      {!editing && <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>}
      <Card flush><Table columns={columns} rows={data} rowKey="employee" loading={loading} error={error} emptyText="No active employees yet" /></Card>
      <Modal open={Boolean(editing)} title={`Salary: ${editing?.name || ""}`} onClose={() => setEditing(null)}
        footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" form="salary-form" loading={isSubmitting}>Save</Button></>}>
        <form id="salary-form" className="stack" onSubmit={handleSubmit(onSave)} noValidate>
          <Alert type="error">{feedback.type === "error" ? feedback.text : ""}</Alert>
          <div className="formgrid">
            <Input label="Basic salary" type="number" step="any" error={errors.basic?.message} {...register("basic", numberRule("Basic salary", 1))} />
            <Input label="House rent allowance" type="number" step="any" error={errors.hra?.message} {...register("hra", numberRule("HRA"))} />
            <Input label="Medical allowance" type="number" step="any" error={errors.medical?.message} {...register("medical", numberRule("Medical"))} />
            <Input label="Other allowance" type="number" step="any" error={errors.other?.message} {...register("other", numberRule("Other"))} />
          </div>
          <div className={styles.sum}>
            <span>Monthly gross: <strong>{formatCurrency(basic + hra + medical + other)}</strong></span>
            <Button small variant="ghost" onClick={autoFill}>Fill HRA 40% + medical 10%</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default SalaryStructure;
