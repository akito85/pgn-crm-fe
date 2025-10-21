import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const useGrantAccessHooksPrecise = ({ selector = "general", url = "" }) => {
  const { data_grant_access } = useSelector((state) => state[selector]);
  const [isGranted, setIsGranted] = useState(true);
  const actions = data_grant_access?.actionList
    ?.filter((item) => item?.path?.includes(`${url}/`))
    ?.map((item) => item?.name);
  useEffect(() => {
    data_grant_access?.isGranted === false && setIsGranted(false);
  }, [data_grant_access]);
  return { isGranted, actions };
};

export default useGrantAccessHooksPrecise;
