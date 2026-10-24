import { useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button/Button";
import Badge from "../../../components/Badge/Badge";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Modal, { ConfirmModal } from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getUsers, createHrUser, setUserStatus, resetUserPassword } from "../../../services/authService";
import { emailRule, errorMessage, required } from "../../../utils/validation";
import styles from "./UserManagement.module.css";

// Admin manages HR logins. HR manages employee logins. The API enforces this too.
const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [role, setRole] = useState(isAdmin ? "hr" : "employee");
  const { data, loading, error, reload } = useFetch(() => getUsers(role), [role]);
  const [creating, setCreating] = useState(false);
  const [target, setTarget] = useState(null); // { user, action: "status" | "reset" }
  const [secret, setSecret] = useState(null); // temp password shown once
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onCreate = async (v) => {
    try {
      const res = await createHrUser(v);
      setCreating(false);
      reset();
      setSecret({ name: v.name, password: res.temporaryPassword });
      reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  const onConfirm = async () => {
    setBusy(true);
    try {
      if (target.action === "reset") {
        const res = await resetUserPassword(target.user._id);
        setSecret({ name: target.user.name, password: res.temporaryPassword });
      } else {
        await setUserStatus(target.user._id, !target.user.isActive);
        setFeedback({ type: "success", text: `Account ${target.user.isActive ? "deactivated" : "activated"}` });
      }
      reload();
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
    setBusy(false);
    setTarget(null);
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "isActive", header: "Status", render: (u) => <Badge status={u.isActive ? "active" : "inactive"} /> },
    { key: "mustChangePassword", header: "Password", render: (u) => (u.mustChangePassword ? <Badge status="pending">Temporary</Badge> : "Set by user") },
    { key: "actions", header: "Actions", render: (u) => (
      <div className="row">
        <Button small variant="secondary" onClick={() => setTarget({ user: u, action: "reset" })}>Reset password</Button>
        <Button small variant={u.isActive ? "danger" : "primary"} onClick={() => setTarget({ user: u, action: "status" })}>{u.isActive ? "Deactivate" : "Activate"}</Button>
      </div>
    ) },
  ];

  return (
    <>
      <PageHeader title="Accounts" subtitle={isAdmin ? "Create and manage HR logins" : "Manage employee logins"}>
        {isAdmin && role === "hr" && <Button onClick={() => { setFeedback({ type: "", text: "" }); setCreating(true); }}>Create HR account</Button>}
      </PageHeader>
      {isAdmin && (
        <div className={styles.tabs} role="tablist">
          {[["hr", "HR accounts"], ["employee", "Employee accounts"]].map(([v, l]) => (
            <button key={v} role="tab" aria-selected={role === v} className={role === v ? styles.on : ""} onClick={() => setRole(v)}>{l}</button>
          ))}
        </div>
      )}
      {!creating && <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>}
      {!isAdmin && <Alert type="info">New employee logins are created when you register an employee.</Alert>}
      <Card flush><Table columns={columns} rows={data} loading={loading} error={error} emptyText="No accounts yet" /></Card>

      <Modal open={creating} title="Create HR account" onClose={() => setCreating(false)}
        footer={<><Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button><Button type="submit" form="hr-form" loading={isSubmitting}>Create</Button></>}>
        <form id="hr-form" className="stack" onSubmit={handleSubmit(onCreate)} noValidate>
          <Alert type="error">{feedback.type === "error" ? feedback.text : ""}</Alert>
          <Input label="Full name" error={errors.name?.message} {...register("name", required("Name"))} />
          <Input label="Email" type="email" error={errors.email?.message} {...register("email", emailRule)} />
          <p className="muted">A temporary password is generated. The HR user must change it on first login.</p>
        </form>
      </Modal>

      <ConfirmModal open={Boolean(target)} danger={target?.action === "status" && target?.user.isActive}
        title={target?.action === "reset" ? "Reset password" : target?.user.isActive ? "Deactivate account" : "Activate account"}
        message={target?.action === "reset" ? `Generate a new temporary password for ${target?.user.name}?` : `${target?.user.isActive ? "Deactivate" : "Activate"} the account of ${target?.user.name}?`}
        confirmLabel="Confirm" loading={busy} onConfirm={onConfirm} onClose={() => setTarget(null)} />

      <Modal open={Boolean(secret)} title="Temporary password" onClose={() => setSecret(null)} footer={<Button onClick={() => setSecret(null)}>Done</Button>}>
        <p>Share this with <strong>{secret?.name}</strong>. It is shown only once.</p>
        <p className={styles.secret}>{secret?.password}</p>
      </Modal>
    </>
  );
};
export default UserManagement;
