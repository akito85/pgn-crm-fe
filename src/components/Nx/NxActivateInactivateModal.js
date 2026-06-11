import { Alert, Button, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { requiredMessage } from "../../utils";
import InputComponent from "../InputComponent";
import NxModal from "./NxModal";
import NxApprovalInput from "./NxApprovalInput";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const NxActivateInactivateModal = ({
  action = "inactivate",
  isOpen = false,
  handleCloseModal = () => {},
  onFinish = () => {},
  header,
  menu,
  named,
  customMessage,
  sliceName,
  approvalOptionsName,
  approvalHierarchtDetailsName,
  loadingListApprovalOptionsName,
  loadingListHierarchyDetailName,
  loadingInactivateName,
  getApprovalOptions = () => {},
  getApprovalHierarchyDetails = () => {},
  width = 1000,
}) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const {
    [approvalOptionsName]: approvalOptions,
    [approvalHierarchtDetailsName]: approvalHierarchyDetails,
    [loadingListApprovalOptionsName]: loadingApprovalOptions,
    [loadingListHierarchyDetailName]: loadingHierarchyDetails,
    [loadingInactivateName]: actionLoading,
  } = useSelector((state) => state[sliceName] ?? {});

  const showApproval = !!sliceName;
  const derivedHeader = header ?? (action === "inactivate" ? "INACTIVATE" : "ACTIVATE");
  const alertType = action === "inactivate" ? "warning" : "info";
  const defaultMessage = `Are you sure you want to ${action} this ${menu} named ${named}?`;

  const handleClear = () => {
    form.resetFields();
  };

  const handleCancelModalFinal = () => {
    handleClear();
    handleCloseModal();
  };

  const handleSaveModal = (data) => {
    onFinish(data, handleClear);
  };

  const handleSelectHierarchy = (appHierId) => {
    if (appHierId) dispatch(getApprovalHierarchyDetails(appHierId));
  };

  useEffect(() => {
    if (sliceName) dispatch(getApprovalOptions());
  }, []);

  return (
    <NxModal
      isOpen={isOpen}
      handleCancel={handleCancelModalFinal}
      title={`${derivedHeader} INFORMATION`}
      width={width}
      type={"confirmation"}
      footer={
        <div className="flex justify-end">
          <Button onClick={handleCancelModalFinal} type="menu" disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            form="formApproveReject"
            type="submit"
            htmlType="submit"
            loading={actionLoading}
          >
            Confirm
          </Button>
        </div>
      }
      loading={actionLoading}
    >
      <div className="p-4">
        <Form
          id="formApproveReject"
          layout="vertical"
          form={form}
          onFinish={handleSaveModal}
          className="flex flex-col gap-y-4"
        >
          <Alert
            message={customMessage ?? defaultMessage}
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "16x", color: "#65481C" }}
              />
            }
            type={alertType}
            showIcon
            className="p-0 m-0"
          />
          {showApproval && (
            <NxApprovalInput
              form={form}
              hierarchyDetails={approvalHierarchyDetails}
              options={approvalOptions}
              handleSelectHierarchy={handleSelectHierarchy}
              loading={actionLoading || loadingApprovalOptions || loadingHierarchyDetails}
              tableLoading={loadingHierarchyDetails}
            />
          )}
          <Form.Item
            name={"remark"}
            label={"Remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
            className="w-full no-margin-form"
          >
            <InputComponent
              group
              rows={1}
              type="textarea"
              placeholder={"Type your remark"}
              disabled={actionLoading}
            />
          </Form.Item>
        </Form>
      </div>
    </NxModal>
  );
};

export default NxActivateInactivateModal;
