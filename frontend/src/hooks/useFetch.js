import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "../utils/validation";

// Runs an async loader and tracks loading / error state. Call reload() after changes.
const useFetch = (loader, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await loaderRef.current();
      setState({ data, loading: false, error: "" });
    } catch (err) {
      setState({ data: null, loading: false, error: errorMessage(err) });
    }
  }, []);

  useEffect(() => { load(); }, [load, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...state, reload: load };
};
export default useFetch;
