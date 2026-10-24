import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/Modal/Modal";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import { requestCorrection } from "../../../services/attendanceService";
import { errorMessage, required } from "../../../utils/validation";
import { toInputDate } from "../../../utils/formatDate";

// Employee asks HR to fix a day
const AttendanceCorrection = ({ open, date, onClose, onDone }) => {
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ values: { date: date || toInputDate(), checkIn: "", checkOut: "", reason: "" } });

  const onSubmit = async (v) => {
    setError("");
    try {
      await requestCorrection({ ...v, checkIn: v.checkIn || undefined, checkOut: v.checkOut || undefined });
      reset();
      onDone("Correction request sent to HR");
    } catch (e) { setError(errorMessage(e)); }
  };

  return (
    <Modal open={open} title="Request attendance correction" onClose={onClose}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="corr-form" loading={isSubmitting}>Submit request</Button></>}>
      <form id="corr-form" className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Alert type="error">{error}</Alert>
        <Input label="Date" type="date" max={toInputDate()} error={errors.date?.message} {...register("date", required("Date"))} />
        <div className="formgrid">
          <Input label="Correct check-in" type="time" {...register("checkIn")} />
          <Input label="Correct check-out" type="time" {...register("checkOut")} />
        </div>
        <Input label="Reason" multiline rows={3} error={errors.reason?.message} {...register("reason", { required: "Reason is required", minLength: { value: 5, message: "Please give a little more detail" } })} />
      </form>
    </Modal>
  );
};
export default AttendanceCorrection;
