import { useEffect } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getSrAttachments } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../../components/Nx/NxAttachmentInput";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { configApp } from "../../../../../../../constants/configApp";

const CustomerServiceRequestDetailAttch = ({ id, idAccount }) => {
  const dispatch = useDispatch();
  const { list_srAttachments, loading_listSrAttachments } = useSelector(
    (state) => state.serviceRequest
  );

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getSrAttachments({ accountId: idAccount, srId: id }));
    }
  }, [dispatch, id, idAccount]);

  const items = Array.isArray(list_srAttachments) ? list_srAttachments : [];

  const attachments = items.map((item) => ({
    ...item,
    fileCategoryName: item.fileCategoryName || item.type,
    urlFile1: item.urlFile1 || item.pathFile,
    dataType: item.dataType || "exist",
    fileType: item.fileType || item.type || "",
  }));

  return (
    <NxBaseContainer border>
      <Spin spinning={loading_listSrAttachments}>
        <NxAttachmentInput
          data={attachments}
          type="detail"
          configApplication={configApp.ACCOUNT_SERVICE}
          service={accountManagementService}
        />
      </Spin>
    </NxBaseContainer>
  );
};

export default CustomerServiceRequestDetailAttch;
