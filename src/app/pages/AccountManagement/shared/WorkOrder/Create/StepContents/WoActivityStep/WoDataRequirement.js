import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Select, Tooltip } from "antd";
import SVGIcon from "../../../../../../../../assets/Icon";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../components/Nx/NxModal";
import { requiredMessage } from "../../../../../../../../utils";
import { getWoDataRequirementValues } from "../../../../../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";

export default function WoDataRequirement({ dropdowns, form, accountId }) {
  const dispatch = useDispatch();
  const { detail_woDataRequirementValues, loading_listWoDataRequirements } = useSelector(
    (state) => state.workOrder
  );

  const [isDataRequirement, setIsDataRequirement] = useState(false);
  const [dataRequirement, setDataRequirement] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedTypeValue, setSelectedTypeValue] = useState(null);
  const [modalForm] = Form.useForm();

  useEffect(() => {
    const formData = form.getFieldValue("woFormDataRequirements");
    if (formData && formData.length > 0) {
      setDataRequirement(formData.map((item, index) => ({ ...item, no: index + 1 })));
    }
  }, [form]);

  const getDropdownItems = (key) => {
    const d = dropdowns?.[key];
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  };

  const getDropdownOptions = (key) =>
    getDropdownItems(key).map((item) => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName,
    }));

  const MAX_DATA_REQUIREMENTS = 111;

  const getNextNumber = () => {
    if (dataRequirement.length >= MAX_DATA_REQUIREMENTS) {
      throw new Error(`Maximum of ${MAX_DATA_REQUIREMENTS} data requirements allowed`);
    }
    if (dataRequirement.length === 0) return 1;
    return Math.max(...dataRequirement.map((item) => item.no || 0)) + 1;
  };

  const columnMain = [
    { title: "No",     dataIndex: "no",    key: "no",    align: "center", width: 8 },
    { title: "Type",   dataIndex: "type",  key: "type",  width: 30 },
    { title: "Value",  dataIndex: "value", key: "value" },
    {
      title: "ACTION", align: "center", width: 15, fixed: "right",
      render: (_, r) => (
        <div className="flex w-full justify-center gap-4">
          <Tooltip title="Edit">
            <div className="pt-1 cursor-pointer">
              <SVGIcon name="IconEdit" color="#0075bf" width={20} onClick={() => handleEdit(r)} />
            </div>
          </Tooltip>
          <Tooltip title="Delete">
            <div className="pt-1 cursor-pointer">
              <SVGIcon name="IconDelete" color="#BE3036" width={20} onClick={() => handleDelete(r)} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleTypeChange = (typeId, option) => {
    const typeValue = option?.typeValue;
    setSelectedTypeId(typeId);
    setSelectedTypeValue(typeValue);
    modalForm.setFieldsValue({ woFormDataRequirementValue: undefined });
    if (typeId && typeValue && !detail_woDataRequirementValues[typeValue]) {
      dispatch(getWoDataRequirementValues({ typeValue, accountId }));
    }
  };

  const handleEdit = (record) => {
    setSelectedTypeId(record.typeId);
    setSelectedTypeValue(record.typeValue);
    if (record.typeValue && !detail_woDataRequirementValues[record.typeValue]) {
      dispatch(getWoDataRequirementValues({ typeValue: record.typeValue, accountId }));
    }
    modalForm.setFieldsValue({ woFormDataRequirementType: record.typeId });
    setEditingRecord(record);
    setIsDataRequirement(true);
  };

  const handleDelete = (record) => {
    const updated = dataRequirement
      .filter((item) => item.key !== record.key)
      .map((item, index) => ({ ...item, no: index + 1 }));
    setDataRequirement(updated);
    form.setFieldsValue({ woFormDataRequirements: updated });
  };

  const handleCancel = () => {
    modalForm.resetFields();
    setEditingRecord(null);
    setSelectedTypeId(null);
    setSelectedTypeValue(null);
    setIsDataRequirement(false);
  };

  const handleSelectValue = (valueRecord) => {
    const typeLabel = getDropdownOptions("woDataRequirements")
      .find((opt) => opt.value === selectedTypeId)?.label;
    let updatedData;
    if (editingRecord) {
      updatedData = dataRequirement.map((item) =>
        item.key === editingRecord.key
          ? { ...item, type: typeLabel, typeId: selectedTypeId, typeValue: selectedTypeValue, value: valueRecord.label, valueId: valueRecord.id }
          : item
      );
    } else {
      try {
        const newRecord = {
          key: Date.now(),
          no: getNextNumber(),
          type: typeLabel,
          typeId: selectedTypeId,
          typeValue: selectedTypeValue,
          value: valueRecord.label,
          valueId: valueRecord.id,
        };
        updatedData = [...dataRequirement, newRecord];
      } catch (error) {
        console.log(error.message);
        return;
      }
    }
    setDataRequirement(updatedData);
    form.setFieldsValue({ woFormDataRequirements: updatedData });
    modalForm.resetFields();
    setEditingRecord(null);
    setSelectedTypeId(null);
    setSelectedTypeValue(null);
    setIsDataRequirement(false);
  };

  return (
    <>
      <NxCardContainer header="DATA REQUIREMENT">
        <NxBaseContainer border>
          <div className="w-full flex justify-end items-center gap-4">
            <Button
              icon={<SVGIcon name="IconButtonCreate" width={14} />}
              type="submit"
              border={false}
              onClick={() => setIsDataRequirement(true)}
            >
              Choose
            </Button>
          </div>
          <NxTable
            idTable="WoDataRequirement"
            usePagination={false}
            useSelect={true}
            tableScrolled={{ y: 400, x: "max-content" }}
            dataMain={dataRequirement}
            columnMain={columnMain}
            showAdvanceSearch={false}
          />
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={isDataRequirement}
        handleCancel={handleCancel}
        handleOk={handleCancel}
        title="CHOOSE DATA REQUIREMENT"
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5">
            <Button onClick={handleCancel}>Back</Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <Form form={modalForm} layout="vertical">
              <Form.Item
                name="woFormDataRequirementType"
                label="Type"
                rules={[{ required: true, message: requiredMessage("Type") }]}
                className="no-margin-form"
              >
                <Select
                  placeholder="Select Data Requirement Type"
                  loading={!getDropdownItems("woDataRequirements").length}
                  options={getDropdownItems("woDataRequirements").map((item) => ({
                    value: item.glbTypeValId?.toString() || item.id?.toString(),
                    label: item.name || item.glbValue,
                    typeValue: item.glbValue,
                  }))}
                  onChange={handleTypeChange}
                />
              </Form.Item>
            </Form>
            <NxTable
              idTable="WoDataRequirementValues"
              className="mt-4"
              usePagination={false}
              tableScrolled={{ y: 400, x: "max-content" }}
              useSelect={false}
              loading={loading_listWoDataRequirements}
              dataMain={(detail_woDataRequirementValues[selectedTypeValue] || []).map((item, idx) => ({
                ...item, key: item.id, no: idx + 1,
              }))}
              columnMain={[
                { title: "NO",    dataIndex: "no",    key: "no",    align: "center", width: 8 },
                { title: "VALUE", dataIndex: "label", key: "label" },
                {
                  title: "ACTION", align: "center", width: 15, fixed: "right",
                  render: (_, r) => (
                    <Tooltip title="Add">
                      <div className="flex justify-center cursor-pointer">
                        <PlusCircleOutlined
                          style={{ color: "#0075bf", fontSize: 22 }}
                          onClick={() => handleSelectValue(r)}
                        />
                      </div>
                    </Tooltip>
                  ),
                },
              ]}
              showAdvanceSearch={true}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
}
