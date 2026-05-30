import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, DatePicker, Input, Button } from "antd";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";
import { NxFormStepper } from "../../../../../../../../components/Nx/NxFormStepNavigation";
import { requiredMessage } from "../../../../../../../../utils";
import { getWoPicUsers } from "../../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import moment from "moment";

const { TextArea } = Input;

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
  const [current, setCurrent] = useState(0);
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
      setCurrent(0);
      setAttachmentData([]);
      setDeletedAttachments([]);
      setSelectedPositionId(null);
    }
  }, [isOpen, editingRow, form, dispatch]);

  const handlePositionChange = (value) => {
    setSelectedPositionId(value);
    form.setFieldsValue({ picUserId: undefined });
    if (value) dispatch(getWoPicUsers(value));
  };

  const makeOptions = (list) =>
    (Array.isArray(list) ? list : []).map((item) => ({
      value: item.id?.toString() || item.glbTypeValId?.toString(),
      label: item.name || item.glbTypeValName,
    }));

  const picUserOptions = selectedPositionId
    ? makeOptions(list_woPicUsers[selectedPositionId] || [])
    : [];

  const steps = [
    { key: "activity",   title: "Activity" },
    { key: "attachment", title: "Attachment" },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields(["woActName", "picPositionId", "picUserId"]);
      setCurrent(1);
    } catch (_) {}
  };

  const handleSave = () => {
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

  const footer = (
    <div className="flex justify-between">
      <Button type="menu" onClick={onCancel}>Cancel</Button>
      <div className="flex gap-2">
        {current === 1 && (
          <Button type="menu" onClick={() => setCurrent(0)}>Previous</Button>
        )}
        {current === 0 && (
          <Button type="submit" onClick={handleNext}>Next</Button>
        )}
        {current === 1 && (
          <Button type="submit" onClick={handleSave}>Save</Button>
        )}
      </div>
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
      <NxFormStepper steps={steps} current={current} onPrev={() => setCurrent(0)} onNext={handleNext} inModal />

      <div className="p-4">
        {/* Step 0 — Activity */}
        <div className={current !== 0 ? "hidden" : ""}>
          <NxBaseContainer border>
            <Form form={form} layout="vertical">
              <div className="grid grid-cols-2 gap-x-4">
                {/* Activity Name — FREE TEXT */}
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
                    options={makeOptions(dropdowns?.list_woPicPositions || [])}
                    onChange={handlePositionChange}
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
                    options={makeOptions(dropdowns?.list_woActivityStatuses || [])}
                  />
                </Form.Item>

                <Form.Item name="durationDays" label="Duration (Days)" className="no-margin-form">
                  <Input type="number" min={0} placeholder="0" />
                </Form.Item>
              </div>

              <Form.Item name="description" label="Description" className="no-margin-form mt-4">
                <TextArea rows={2} maxLength={255} showCount />
              </Form.Item>
            </Form>
          </NxBaseContainer>
        </div>

        {/* Step 1 — Attachment */}
        <div className={current !== 1 ? "hidden" : ""}>
          <NxBaseContainer border>
            <NxAttachmentInput
              data={attachmentData}
              updateData={setAttachmentData}
              setDeleted={setDeletedAttachments}
              mandatory={false}
            />
          </NxBaseContainer>
        </div>
      </div>
    </NxModal>
  );
};

export default ActivityModal;
