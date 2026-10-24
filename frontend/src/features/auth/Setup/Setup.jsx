import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import AuthShell from "../AuthShell";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import Alert from "../../../components/Alert/Alert";
import Loader from "../../../components/Loader/Loader";
import { setupThunk, clearError } from "../authSlice";
import { getSetupStatus } from "../../../services/authService";
import { emailRule, passwordRule, required } from "../../../utils/validation";
import useAuth from "../../../hooks/useAuth";

const Setup = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const { status, error } = useSelector((s) => s.auth);
  const [needsSetup, setNeedsSetup] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(clearError());
    getSetupStatus().then((d) => setNeedsSetup(d.needsSetup)).catch(() => setNeedsSetup(false));
  }, [dispatch]);

  if (isLoggedIn) return <Navigate to="/" replace />;
  if (needsSetup === null) return <Loader full />;
  if (!needsSetup) return <AuthShell title="Already set up"><p>This system already has a company. <Link to="/login">Go to login</Link>.</p></AuthShell>;

  return (
    <AuthShell title="First-time setup" subtitle="Create your company and the first Admin account.">
      <form className="stack" onSubmit={handleSubmit((v) => dispatch(setupThunk(v)))} noValidate>
        <Alert type="error">{error}</Alert>
        <Input label="Company name" error={errors.companyName?.message} {...register("companyName", required("Company name"))} />
        <Input label="Admin full name" error={errors.name?.message} {...register("name", required("Name"))} />
        <Input label="Admin email" type="email" error={errors.email?.message} {...register("email", emailRule)} />
        <Input label="Password" type="password" autoComplete="new-password" hint="At least 8 characters" error={errors.password?.message} {...register("password", passwordRule)} />
        <Button type="submit" loading={status === "loading"}>Create company</Button>
      </form>
    </AuthShell>
  );
};
export default Setup;
