import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import Modal from "../../../components/Modal/Modal";
import useFetch from "../../../hooks/useFetch";
import { createEmployee, updateEmployee, getEmployee, listOrg } from "../../../services/employeeService";
import { emailRule, errorMessage, required } from "../../../utils/validation";
import styles from "./EmployeeForm.module.css";

// Used for both "register employee" (/employees/new) and "edit employee" (/employees/:id/edit)
const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [secret, setSecret] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { data: depts, loading: l1 } = useFetch(() => listOrg("departments"));
  const { data: desigs, loading: l2 } = useFetch(() => listOrg("designations"));
  const { data: existing, loading: l3, error: loadError } = useFetch(() => (isEdit ? getEmployee(id) : Promise.resolve(null)), [id]);
  const opts = (list) => (list || []).map((x) => ({ value: x._id, label: x.name }));

  useEffect(() => {
    if (existing) reset({ ...existing, department: existing.department?._id, designation: existing.designation?._id });
  }, [existing, reset]);

  const onSubmit = async (values) => {
    setError("");
    try {
      if (isEdit) { await updateEmployee(id, values); navigate(`/employees/${id}`); }
      else {
        const res = await createEmployee(values);
        setSecret({ name: values.name, password: res.temporaryPassword, id: res.data._id });
      }
    } catch (e) { setError(errorMessage(e)); }
  };

  if (l1 || l2 || l3) return <Loader />;
  if (loadError) return <Alert type="error">{loadError}</Alert>;
  const noSetup = !depts?.length || !desigs?.length;

  return (
    <>
      <PageHeader title={isEdit ? "Edit employee" : "Register employee"} subtitle={isEdit ? undefined : "A login is created automatically with a temporary password."} />
      {noSetup && <Alert type="warning">Departments and designations must exist first. Ask the Admin to add them under Organization.</Alert>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <div className="stack">
            <Alert type="error">{error}</Alert>
            <div className="formgrid">
              <Input label="Full name" error={errors.name?.message} {...register("name", required("Name"))} />
              <Input label="Employee code" error={errors.code?.message} {...register("code", required("Employee code"))} />
              <Input label="Email" type="email" error={errors.email?.message} {...register("email", emailRule)} />
              <Input label="Phone" type="tel" error={errors.phone?.message} {...register("phone", { pattern: { value: /^[0-9+\-\s()]{7,20}$/, message: "Enter a valid phone number" } })} />
              <Select label="Department" options={opts(depts)} error={errors.department?.message} {...register("department", required("Department"))} />
              <Select label="Designation" options={opts(desigs)} error={errors.designation?.message} {...register("designation", required("Designation"))} />
              <Input label="Joining date" type="date" error={errors.joiningDate?.message} {...register("joiningDate", required("Joining date"))} />
              {isEdit && <Input label="Leaving date" type="date" hint="Used for prorated final salary" {...register("leavingDate")} />}
              {isEdit && <Select label="Status" placeholder={null} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive (login disabled)" }]} {...register("status")} />}
              <Input className="full" label="Address" multiline rows={3} {...register("address")} />
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting} disabled={noSetup}>{isEdit ? "Save changes" : "Register employee"}</Button>
            </div>
          </div>
        </Card>
      </form>
      <Modal open={Boolean(secret)} title="Employee registered" onClose={() => navigate(`/employees/${secret.id}`)} footer={<Button onClick={() => navigate(`/employees/${secret.id}`)}>Done</Button>}>
        <p>Give <strong>{secret?.name}</strong> this temporary password. They must change it at first login. It is shown only once.</p>
        <p className={styles.secret}>{secret?.password}</p>
      </Modal>
    </>
  );
};
export default EmployeeForm;
