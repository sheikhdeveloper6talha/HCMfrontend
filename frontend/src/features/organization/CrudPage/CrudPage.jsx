import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal, { ConfirmModal } from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import { listOrg, saveOrg, deleteOrg } from "../../../services/employeeService";
import { errorMessage } from "../../../utils/validation";

// One reusable list + add/edit/delete page. Each organization page only passes config.
// fields: [{ name, label, type, rules, asNumber, defaultValue }]  columns: [{ key, header, render? }]
const CrudPage = ({ title, subtitle, path, singular, fields, columns }) => {
  const { data, loading, error, reload } = useFetch(() => listOrg(path));
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [removing, setRemoving] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const openForm = (item = {}) => {
    reset(Object.fromEntries(fields.map((f) => [f.name, item[f.name] ?? f.defaultValue ?? ""])));
    setFeedback({ type: "", text: "" });
    setEditing(item);
  };

  const onSubmit = async (values) => {
    try {
      await saveOrg(path, values, editing._id);
      setEditing(null);
      setFeedback({ type: "success", text: `${singular} saved` });
      reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  const onDelete = async () => {
    setBusy(true);
    try { await deleteOrg(path, removing._id); setFeedback({ type: "success", text: `${singular} deleted` }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false);
    setRemoving(null);
  };

  const cols = [...columns, {
    key: "actions", header: "Actions",
    render: (r) => (
      <div className="row">
        <Button small variant="secondary" onClick={() => openForm(r)}>Edit</Button>
        <Button small variant="danger" onClick={() => setRemoving(r)}>Delete</Button>
      </div>
    ),
  }];

  return (
    <>
      <PageHeader title={title} subtitle={subtitle}><Button onClick={() => openForm()}>Add {singular.toLowerCase()}</Button></PageHeader>
      {!editing && <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>}
      <Card flush><Table columns={cols} rows={data} loading={loading} error={error} emptyText={`No ${title.toLowerCase()} yet. Add the first one.`} /></Card>

      <Modal open={Boolean(editing)} title={`${editing?._id ? "Edit" : "Add"} ${singular.toLowerCase()}`} onClose={() => setEditing(null)}
        footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" form="crud-form" loading={isSubmitting}>Save</Button></>}>
        <form id="crud-form" className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
          {editing && <Alert type="error">{feedback.type === "error" ? feedback.text : ""}</Alert>}
          {fields.map((f) =>
            f.type === "checkbox" ? (
              <label key={f.name} className="row"><input type="checkbox" {...register(f.name)} /> {f.label}</label>
            ) : (
              <Input key={f.name} label={f.label} type={f.type || "text"} error={errors[f.name]?.message}
                {...register(f.name, { ...(f.rules || {}), ...(f.asNumber ? { valueAsNumber: true } : {}) })} />
            )
          )}
        </form>
      </Modal>
      <ConfirmModal open={Boolean(removing)} title={`Delete ${singular.toLowerCase()}`} message={`Delete "${removing?.name}"? This cannot be undone.`} confirmLabel="Delete" loading={busy} onConfirm={onDelete} onClose={() => setRemoving(null)} />
    </>
  );
};
export default CrudPage;
