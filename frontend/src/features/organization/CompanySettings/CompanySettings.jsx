import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../../../components/PageHeader/PageHeader";
import Card from "../../../components/Card/Card";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import useFetch from "../../../hooks/useFetch";
import { getCompany, updateCompany } from "../../../services/employeeService";
import { errorMessage, numberRule, required } from "../../../utils/validation";
import styles from "./CompanySettings.module.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CompanySettings = () => {
  const { data, loading, error } = useFetch(getCompany);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (data) reset({ ...data, weekends: (data.weekends || []).map(String) });
  }, [data, reset]);

  const onSubmit = async (v) => {
    setFeedback({ type: "", text: "" });
    try {
      const body = {
        ...v,
        weekends: [].concat(v.weekends || []).map(Number),
        officeLat: v.officeLat === "" || Number.isNaN(v.officeLat) ? undefined : v.officeLat,
        officeLng: v.officeLng === "" || Number.isNaN(v.officeLng) ? undefined : v.officeLng,
      };
      await updateCompany(body);
      setFeedback({ type: "success", text: "Settings saved. New rules apply to new records; history is not changed." });
    } catch (e) { setFeedback({ type: "error", text: errorMessage(e) }); }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error">{error}</Alert>;
  const needLocation = watch("locationRequired");

  return (
    <>
      <PageHeader title="Company settings" subtitle="Office hours, attendance rules and location" />
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="stack">
        <Alert type={feedback.type || "info"}>{feedback.text}</Alert>
        <Card title="Company">
          <div className="formgrid">
            <Input label="Company name" error={errors.name?.message} {...register("name", required("Name"))} />
            <Input label="Currency code" error={errors.currency?.message} {...register("currency", required("Currency"))} />
          </div>
        </Card>
        <Card title="Attendance rules">
          <div className="formgrid">
            <Input label="Office start time" type="time" error={errors.officeStart?.message} {...register("officeStart", required("Start time"))} />
            <Input label="Grace period (minutes)" type="number" error={errors.graceMinutes?.message} {...register("graceMinutes", numberRule("Grace period"))} />
            <Input label="Half-day if worked less than (hours)" type="number" step="0.5" error={errors.halfDayHours?.message} {...register("halfDayHours", numberRule("Half-day hours", 1))} />
          </div>
          <fieldset className={styles.weekends}>
            <legend>Weekend days</legend>
            {DAYS.map((d, i) => (
              <label key={d}><input type="checkbox" value={String(i)} {...register("weekends")} /> {d}</label>
            ))}
          </fieldset>
        </Card>
        <Card title="Office location (optional)">
          <label className="row"><input type="checkbox" {...register("locationRequired")} /> Require GPS location for check-in and check-out</label>
          {needLocation && (
            <div className="formgrid" style={{ marginTop: 14 }}>
              <Input label="Latitude" type="number" step="any" {...register("officeLat", { valueAsNumber: true })} />
              <Input label="Longitude" type="number" step="any" {...register("officeLng", { valueAsNumber: true })} />
              <Input label="Radius (metres)" type="number" error={errors.radiusMeters?.message} {...register("radiusMeters", numberRule("Radius", 10))} />
            </div>
          )}
        </Card>
        <div><Button type="submit" loading={isSubmitting}>Save settings</Button></div>
      </form>
    </>
  );
};
export default CompanySettings;
