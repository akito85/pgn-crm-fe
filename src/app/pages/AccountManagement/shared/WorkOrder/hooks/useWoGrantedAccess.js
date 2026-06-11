import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";

const WO_ACCESS_PATHS = {
  "sr-under-account": (accountType) =>
    `/account-management/${accountType === "one-time" ? "one-time" : "account-standard"}/service-requests/work-orders`,
  "account-detail": (accountType) =>
    `/account-management/${accountType === "one-time" ? "one-time" : "account-standard"}/work-orders`,
  "sr-standalone": () => "/account-management/service-requests/work-orders",
  "standalone": () => "/account-management/work-orders",
  "bad-debt": () => "/account-management/work-orders",
};

const useWoGrantedAccess = ({ entryPoint, accountType }) => {
  const dispatch = useDispatch();
  const [isAccessChecked, setIsAccessChecked] = useState(false);

  const { access_account } = useSelector((state) => state.accountManagement);
  const isGranted = access_account?.isGranted === true;

  useEffect(() => {
    setIsAccessChecked(false);
    const resolvePath = WO_ACCESS_PATHS[entryPoint];
    if (!resolvePath) {
      setIsAccessChecked(true);
      return;
    }
    const pathUrl = resolvePath(accountType);
    dispatch(getGrantedAccessAccount(pathUrl))
      .unwrap()
      .then(() => setIsAccessChecked(true))
      .catch(() => setIsAccessChecked(true));
  }, [dispatch, entryPoint, accountType]);

  return { isAccessChecked, isGranted };
};

export default useWoGrantedAccess;
