import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/Modal/Modal";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import { applyLeave } from "../../../services/leaveService";
import { errorMessage, required } from "../../../utils/validation";
import { toInputDate } from "../../../utils/formatDate";

const LeaveForm = ({ open, leaveTypes, onClose, onDone }) => {
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();
  const start = watch("startDate");

  const onSubmit = async (v) => {
    setError("");
    try { await applyLeave(v); reset(); onDone("Leave request submitted"); }
    catch (e) { setError(errorMessage(e)); }
  };

  return (
    <Modal open={open} title="Apply for leave" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="leave-form" loading={isSubmitting}>Submit</Button></>}>
      <form id="leave-form" className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Alert type="error">{error}</Alert>
        <Select label="Leave type" options={leaveTypes.map((t) => ({ value: t._id, label: t.name }))} error={errors.leaveType?.message} {...register("leaveType", required("Leave type"))} />
        <div className="formgrid">
          <Input label="From" type="date" min={toInputDate()} error={errors.startDate?.message} {...register("startDate", required("Start date"))} />
          <Input label="To" type="date" min={start || toInputDate()} error={errors.endDate?.message}
            {...register("endDate", { required: "End date is required", validate: (v) => !start || v >= start || "End date cannot be before start date" })} />
        </div>
        <Input label="Reason" multiline rows={3} error={errors.reason?.message} {...register("reason", { required: "Reason is required", minLength: { value: 3, message: "Please add a short reason" } })} />
        <p className="muted">Only working days are counted. Weekends and public holidays are skipped.</p>
      </form>
    </Modal>
  );
};
export default LeaveForm;
