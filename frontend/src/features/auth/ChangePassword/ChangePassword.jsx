import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthShell from "../AuthShell";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import { changePassword } from "../../../services/authService";
import { setUser } from "../authSlice";
import { errorMessage, passwordRule } from "../../../utils/validation";
import useAuth from "../../../hooks/useAuth";

const ChangePassword = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setError("");
    try {
      const res = await changePassword({ currentPassword, newPassword });
      dispatch(setUser({ ...user, ...res.data, mustChangePassword: false }));
      setDone(true);
      setTimeout(() => navigate("/"), 900);
    } catch (e) { setError(errorMessage(e)); }
  };

  return (
    <AuthShell title="Change password" subtitle={user?.mustChangePassword ? "You are using a temporary password. Choose a new one to continue." : "Choose a new password."}>
      <form className="stack" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Alert type="error">{error}</Alert>
        {done && <Alert type="success">Password changed. Redirecting...</Alert>}
        <Input label="Current password" type="password" autoComplete="current-password" error={errors.currentPassword?.message} {...register("currentPassword", { required: "Current password is required" })} />
        <Input label="New password" type="password" autoComplete="new-password" error={errors.newPassword?.message} {...register("newPassword", passwordRule)} />
        <Input label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirm?.message}
          {...register("confirm", { required: "Please confirm the password", validate: (v) => v === watch("newPassword") || "Passwords do not match" })} />
        <Button type="submit" loading={isSubmitting}>Update password</Button>
      </form>
    </AuthShell>
  );
};
export default ChangePassword;
