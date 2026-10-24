import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader/Loader";
import { fetchMe } from "./features/auth/authSlice";

// On first load, restore the session from the saved token
const App = () => {
  const dispatch = useDispatch();
  const { token, booting } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  if (booting) return <Loader full />;
  return <AppRoutes />;
};
export default App;
