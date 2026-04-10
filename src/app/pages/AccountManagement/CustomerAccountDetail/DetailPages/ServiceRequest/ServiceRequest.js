import { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";

import ServiceRequestTable from "./ServiceRequestTable";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NotFound from "../../../../../NotFound";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";

const ServiceRequest = ({ idAccount, idCustomer, type }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { access_account } = useSelector((state) => state.accountManagement);

  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const isAccessGranted = access_account?.isGranted === true;

  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  useEffect(() => {
    setIsAccessChecked(false);
    const path = location?.pathname.includes("account-standard")
      ? "/account-management/account-standard/service-request"
      : "/account-management/account-onetime/service-request";

    dispatch(getGrantedAccessAccount(path))
      .unwrap()
      .then(() => setIsAccessChecked(true))
      .catch(() => setIsAccessChecked(true));
  }, [dispatch, location?.pathname]);

  if (!isAccessChecked) {
    return (
      <div className="w-full flex justify-center py-10">
        <Spin tip="Checking access..." />
      </div>
    );
  }

  if (!isAccessGranted) {
    return <NotFound type={"unauthorized"} />;
  }

  return (
    <NxCardContainer header={"SERVICE REQUEST"}>
      <NxBaseContainer border>
        <ServiceRequestTable
          idAccount={idAccount}
          idCustomer={idCustomer}
          handleApproval={setShowApprovalModal}
          refreshSignal={refreshSignal}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default memo(ServiceRequest);
