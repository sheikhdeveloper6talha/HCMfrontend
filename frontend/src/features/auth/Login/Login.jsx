import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import AuthShell from "../AuthShell";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import { loginThunk, clearError } from "../authSlice";
import { getSetupStatus } from "../../../services/authService";
import { emailRule } from "../../../utils/validation";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useAuth();
  const { status, error } = useSelector((s) => s.auth);
  const [needsSetup, setNeedsSetup] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearError());
    getSetupStatus().then((d) => setNeedsSetup(d.needsSetup)).catch(() => {});
  }, [dispatch]);

  if (isLoggedIn) return <Navigate to={user.mustChangePassword ? "/change-password" : "/"} replace />;

  return (
    <AuthShell title="Log in" subtitle="Use the email and password from your administrator.">
      <form className="stack" onSubmit={handleSubmit((v) => dispatch(loginThunk(v)))} noValidate>
        <Alert type="error">{error}</Alert>
        {needsSetup && <Alert type="info">No company exists yet. <Link to="/setup">Run the first-time setup</Link>.</Alert>}
        <Input label="Email" type="email" autoComplete="username" error={errors.email?.message} {...register("email", emailRule)} />
        <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register("password", { required: "Password is required" })} />
        <Button type="submit" loading={status === "loading"}>Log in</Button>
      </form>
    </AuthShell>
  );
};
export default Login;
