import { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";

import ServiceRequestTable from "./ServiceRequestTable";
import ServiceRequestApprovalModal from "./ServiceRequestApprovalModal";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NotFound from "../../../../../NotFound";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import { getSrApprovalHistory } from "../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";

const ServiceRequest = ({ idAccount, idCustomer, type }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { access_account } = useSelector((state) => state.accountManagement);
  const { detail_srApprovalHistory } = useSelector((state) => state.serviceRequest);

  const [isAccessChecked, setIsAccessChecked] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);

  const isAccessGranted = access_account?.isGranted === true;

  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  const handleApprovalHistoryModal = (show, srId = 0) => {
    if (show) {
      dispatch(getSrApprovalHistory(srId));
      setShowApprovalHistoryModal(true);
    } else {
      setShowApprovalHistoryModal(false);
    }
  };

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
    <>
      <NxCardContainer header={"SERVICE REQUEST"}>
        <NxBaseContainer border>
          <ServiceRequestTable
            idAccount={idAccount}
            idCustomer={idCustomer}
            accountType={type}
            handleApproval={setShowApprovalModal}
            handleApprovalHistoryModal={handleApprovalHistoryModal}
            refreshSignal={refreshSignal}
          />
        </NxBaseContainer>
      </NxCardContainer>
      <ServiceRequestApprovalModal
        accountId={idAccount}
        isOpen={showApprovalModal}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={triggerRefresh}
      />
      {/* Approval History Modal */}
      <NxHistoryModal
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header={"Approval History"}
        dataApprover={detail_srApprovalHistory?.dataApprover}
        dataHistory={detail_srApprovalHistory?.dataHistory}
      />
    </>
  );
};

export default memo(ServiceRequest);
