import { useMemo } from "react";
import { useSelector } from "react-redux";

const useIsSuperUser = () => {
  const rawToken = useSelector((state) => state.auth?.token);
  return useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userLevel === "Super User";
    } catch {
      return false;
    }
  }, [rawToken]);
};

export default useIsSuperUser;
