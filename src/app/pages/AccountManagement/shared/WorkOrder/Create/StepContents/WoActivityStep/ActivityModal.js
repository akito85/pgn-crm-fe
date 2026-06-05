import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, DatePicker, Input, Button } from "antd";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import NxTabs from "../../../../../../../../components/Nx/NxTabs";
import { requiredMessage } from "../../../../../../../../utils";
import { getWoPicUsers } from "../../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import moment from "moment";
import InputComponent from "../../../../../../../../components/InputComponent";

/**
 * @param {{
 *   isOpen: boolean,
 *   editingRow: object | null,
 *   dropdowns: { list_woPicPositions, list_woPicUsers, list_woActivityStatuses },
 *   onSave: (data: object) => void,
 *   onCancel: () => void,
 * }} props
 */
const ActivityModal = ({ isOpen, editingRow, dropdowns, onSave, onCancel }) => {
  const dispatch = useDispatch();
  const { list_woPicUsers } = useSelector((state) => state.workOrder);

  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("activity");
  const [attachmentData, setAttachmentData] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState(null);

  const isEdit = !!editingRow;

  useEffect(() => {
    if (isOpen && editingRow) {
      form.setFieldsValue({
        woActName: editingRow.woActName || "",
        picPositionId: editingRow.picPositionId,
        picUserId: editingRow.picUserId,
        planDate: editingRow.planDate ? moment(editingRow.planDate) : null,
        activityStatus: editingRow.activityStatus,
        durationDays: editingRow.durationDays,
        description: editingRow.description,
      });
      setSelectedPositionId(editingRow.picPositionId);
      setAttachmentData(editingRow.attachments || []);
      if (editingRow.picPositionId) {
        dispatch(getWoPicUsers(editingRow.picPositionId));
      }
    }
    if (!isOpen) {
      form.resetFields();
      setActiveTab("activity");
      setAttachmentData([]);
      setDeletedAttachments([]);
      setSelectedPositionId(null);
    }
  }, [isOpen, editingRow, form, dispatch]);

  const handleFormValuesChange = useCallback((changedValues) => {
    if ("picPositionId" in changedValues) {
      const value = changedValues.picPositionId;
      setSelectedPositionId(value);
      form.setFieldsValue({ picUserId: undefined });
      if (value) dispatch(getWoPicUsers(value));
    }
  }, [dispatch, form]);

  // M_POSITION: positionId + name  |  R_GLOBAL_TYPE_VALUE: glbTypeValId + glbTypeValName  |  generic: id + name
  const makeOptions = (list) =>
    (Array.isArray(list) ? list : []).map((item) => ({
      value: (item.id ?? item.positionId ?? item.glbTypeValId)?.toString(),
      label: item.name || item.glbTypeValName,
    }));

  // VW_EMPLOYEE_ASSIGNMENT: employeeId + employeeName
  const makePicUserOptions = (list) =>
    (Array.isArray(list) ? list : []).map((item) => ({
      value: (item.employeeId ?? item.id)?.toString(),
      label: item.employeeName || item.name,
    }));

  const picUserOptions = useMemo(
    () => selectedPositionId ? makePicUserOptions(list_woPicUsers[selectedPositionId] || []) : [],
    [selectedPositionId, list_woPicUsers] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSave = async () => {
    try {
      await form.validateFields(["woActName", "picPositionId", "picUserId"]);
    } catch (_) {
      setActiveTab("activity");
      return;
    }
    const values = form.getFieldsValue(true);
    onSave({
      woActName: values.woActName || "",
      picPositionId: values.picPositionId,
      picPosition: makeOptions(dropdowns?.list_woPicPositions || []).find(
        (o) => o.value === values.picPositionId
      )?.label || "",
      picUserId: values.picUserId,
      picUser: picUserOptions.find((o) => o.value === values.picUserId)?.label || "",
      planDate: values.planDate ? values.planDate.format("YYYY-MM-DD") : null,
      activityStatus: values.activityStatus,
      durationDays: values.durationDays || null,
      description: values.description,
      attachments: attachmentData,
      isTemplate: editingRow?.isTemplate ?? false,
      activityTemplDtlId: editingRow?.activityTemplDtlId ?? null,
    });
  };

  const positionOptions = useMemo(
    () => makeOptions(dropdowns?.list_woPicPositions || []),
    [dropdowns?.list_woPicPositions] 
  );

  const statusOptions = useMemo(
    () => makeOptions(dropdowns?.list_woActivityStatuses || []),
    [dropdowns?.list_woActivityStatuses] 
  );

  const tabItems = useMemo(() => [
    {
      key: "activity",
      label: "Activity",
      children: (
        <NxBaseContainer border>
          <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
            <div className="grid grid-cols-3 gap-x-6">
              <Form.Item
                name="woActName"
                label="Activity Name"
                rules={[{ required: true, message: requiredMessage("Activity Name") }]}
                className="no-margin-form"
              >
                <Input
                  placeholder="Enter activity name"
                  disabled={editingRow?.isTemplate === true}
                />
              </Form.Item>

              <Form.Item
                name="picPositionId"
                label="PIC Position"
                rules={[{ required: true, message: requiredMessage("PIC Position") }]}
                className="no-margin-form"
              >
                <Select
                  placeholder="Select Position"
                  options={positionOptions}
                />
              </Form.Item>

              <Form.Item
                name="picUserId"
                label="PIC User"
                rules={[{ required: true, message: requiredMessage("PIC User") }]}
                className="no-margin-form"
              >
                <Select
                  placeholder="Select User"
                  options={picUserOptions}
                  disabled={!selectedPositionId}
                />
              </Form.Item>

              <Form.Item name="planDate" label="Plan Date" className="no-margin-form">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="activityStatus" label="Status" className="no-margin-form">
                <Select
                  placeholder="Select Status"
                  options={statusOptions}
                />
              </Form.Item>

              <Form.Item name="durationDays" label="Duration (Days)" className="no-margin-form">
                <Input type="number" min={0} placeholder="0" />
              </Form.Item>
            </div>

            <Form.Item name="description" label="Description" className="w-full">
              <InputComponent type="textarea" />
            </Form.Item>
          </Form>
        </NxBaseContainer>
      ),
    },
    {
      key: "attachment",
      label: "Attachment",
      children: (
        <NxBaseContainer border>
          <NxAttachmentInput
            data={attachmentData}
            updateData={setAttachmentData}
            setDeleted={setDeletedAttachments}
            mandatory={false}
            autoHeight={false}
          />
        </NxBaseContainer>
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [
    form,
    handleFormValuesChange,
    positionOptions,
    statusOptions,
    picUserOptions,
    selectedPositionId,
    editingRow?.isTemplate,
    attachmentData,
  ]);

  const footer = (
    <div className="flex justify-between">
      <Button type="menu" onClick={onCancel}>Cancel</Button>
      <Button type="submit" onClick={handleSave}>Save</Button>
    </div>
  );

  return (
    <NxModal
      isOpen={isOpen}
      title={isEdit ? "EDIT ACTIVITY" : "CREATE ACTIVITY"}
      handleCancel={onCancel}
      width={900}
      footer={footer}
    >
      <NxTabs
        items={tabItems}
        activeKey={activeTab}
        onChange={setActiveTab}
      />
    </NxModal>
  );
};

export default ActivityModal;
