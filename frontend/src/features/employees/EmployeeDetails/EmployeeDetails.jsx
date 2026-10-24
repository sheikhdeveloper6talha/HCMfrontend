import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Badge from "../../../components/Badge/Badge";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../../hooks/useAuth";
import { getEmployee, getMyProfile, updateMyContact } from "../../../services/employeeService";
import { formatDate } from "../../../utils/formatDate";
import { errorMessage } from "../../../utils/validation";
import styles from "./EmployeeDetails.module.css";

// Route /employees/:id for Admin/HR, and /profile for the logged-in employee
const EmployeeDetails = () => {
  const { id } = useParams();
  const { isEmployee, isHR } = useAuth();
  const own = isEmployee && !id;
  const { data: emp, loading, error, reload } = useFetch(() => (own ? getMyProfile() : getEmployee(id)), [id]);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const openEdit = () => { reset({ phone: emp.phone || "", address: emp.address || "" }); setEditing(true); };
  const onSave = async (v) => {
    try { await updateMyContact(v); setEditing(false); setFeedback({ type: "success", text: "Contact details updated" }); reload(); }
    catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error">{error}</Alert>;

  const rows = [
    ["Employee code", emp.code], ["Email", emp.email], ["Phone", emp.phone || "-"],
    ["Department", emp.department?.name], ["Designation", emp.designation?.name],
    ["Joining date", formatDate(emp.joiningDate)], ["Leaving date", emp.leavingDate ? formatDate(emp.leavingDate) : "-"],
    ["Address", emp.address || "-"],
  ];

  return (
    <>
      <PageHeader title={emp.name} subtitle={own ? "Your profile" : "Employee profile"}>
        {!own && <Link to="/employees">Back to list</Link>}
        {isHR && !own && <Link to={`/employees/${emp._id}/edit`}><Button>Edit employee</Button></Link>}
        {own && <Button onClick={openEdit}>Update phone / address</Button>}
      </PageHeader>
      {!editing && <Alert type={feedback.type || "info"} onClose={() => setFeedback({ type: "", text: "" })}>{feedback.text}</Alert>}
      <Card title="Details" action={<Badge status={emp.status} />}>
        <dl className={styles.dl}>
          {rows.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
      </Card>
      <Modal open={editing} title="Update contact details" onClose={() => setEditing(false)}
        footer={<><Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit" form="contact-form" loading={isSubmitting}>Save</Button></>}>
        <form id="contact-form" className="stack" onSubmit={handleSubmit(onSave)} noValidate>
          <Alert type="error">{feedback.type === "error" ? feedback.text : ""}</Alert>
          <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone", { pattern: { value: /^[0-9+\-\s()]{7,20}$/, message: "Enter a valid phone number" } })} />
          <Input label="Address" multiline rows={3} {...register("address")} />
        </form>
      </Modal>
    </>
  );
};
export default EmployeeDetails;
