import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DownloadOutlined, FilterOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Select, Tooltip } from "antd";

import SVGIcon from "../../../../../../../../../assets/Icon";

import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../components/Nx/NxModal";

import ButtonComponent from "../../../../../../../../../components/ButtonComponent";

import { requiredMessage } from "../../../../../../../../../utils";
import { getDataRequirementValuesByType } from "../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

export default function InfoDataRequirement({
  dropdowns,
  form,
  accountId
}) {
  const dispatch = useDispatch();
  const { data_data_requirement_values, loading_data_requirement_values } = useSelector(
    (state) => state.serviceRequest
  );

  const [isDataRequirement, setIsDataRequirement] = useState(false);
  const [dataRequirement, setDataRequirement] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [selectedTypeValue, setSelectedTypeValue] = useState(null);
  const [modalForm] = Form.useForm();

  const navigate = useNavigate();

  // Sync local table state with form data on mount (for persistence across step navigation)
  useEffect(() => {
    const formData = form.getFieldValue('srFormDataRequirements');
    if (formData && formData.length > 0) {
      // Ensure all records have proper no values
      const dataWithNumbers = formData.map((item, index) => ({
        ...item,
        no: index + 1
      }));
      setDataRequirement(dataWithNumbers);
    }
  }, [form]);

  // Create safe accessor functions that handle both array and { data: [] } formats
  const getDropdownItems = (dropdownKey) => {
    const dropdown = dropdowns?.[dropdownKey];
    if (!dropdown) return [];
    if (Array.isArray(dropdown)) return dropdown;
    if (Array.isArray(dropdown?.data)) return dropdown.data;
    return [];
  };

  const getDropdownOptions = (dropdownKey) => {
    return getDropdownItems(dropdownKey).map(item => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName
    }));
  };

  const isDropdownLoaded = (dropdownKey) => {
    return getDropdownItems(dropdownKey).length > 0;
  };

  // A limiter for sercurity purpose
  const MAX_DATA_REQUIREMENTS = 111;

  const getNextNumber = () => {
    // Business rule: Check if we've reached maximum allowed records
    if (dataRequirement.length >= MAX_DATA_REQUIREMENTS) {
      throw new Error(`Maximum of ${MAX_DATA_REQUIREMENTS} data requirements allowed`);
    }
    
    if (dataRequirement.length === 0) {
      return 1;
    }
    
    const maxNo = Math.max(...dataRequirement.map(item => item.no || 0));
    return maxNo + 1;
  }

  const columnMain = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      width: 8
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 30
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: "ACTION",
      align: "center",
      width: 15,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Edit">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEdit"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => handleEdit(r)}
                />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDelete"
                  color={"#BE3036"}
                  width={20}
                  onClick={() => handleDelete(r)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ]

  const handleTypeChange = (typeId, option) => {
    const typeValue = option?.typeValue;
    setSelectedTypeId(typeId);
    setSelectedTypeValue(typeValue);
    modalForm.setFieldsValue({ srFormDataRequirementValue: undefined });
    if (typeId && accountId && typeValue && !data_data_requirement_values[typeValue]) {
      dispatch(getDataRequirementValuesByType({ typeValue, accountId }));
    }
  };

  const handleEdit = (record) => {
    setSelectedTypeId(record.typeId);
    setSelectedTypeValue(record.typeValue);
    if (record.typeValue && accountId && !data_data_requirement_values[record.typeValue]) {
      dispatch(getDataRequirementValuesByType({ typeValue: record.typeValue, accountId }));
    }
    modalForm.setFieldsValue({
      srFormDataRequirementType: record.typeId,
    });
    setEditingRecord(record);
    setIsDataRequirement(true);
  }

  const handleDelete = (record) => {
    // Remove the record
    const updatedData = dataRequirement.filter(item => item.key !== record.key);
    
    // Reassign numbers to all remaining records
    const renumberedData = updatedData.map((item, index) => ({
      ...item,
      no: index + 1
    }));
    
    setDataRequirement(renumberedData);
    form.setFieldsValue({
      srFormDataRequirements: renumberedData
    });
  }

  const handleCancel = () => {
    modalForm.resetFields();
    setEditingRecord(null);
    setSelectedTypeId(null);
    setSelectedTypeValue(null);
    setIsDataRequirement(false);
  }

  const handleSelectValue = (valueRecord) => {
    const typeLabel = getDropdownOptions('serviceRequestDataRequirements')
      .find(opt => opt.value === selectedTypeId)?.label;

    let updatedData;

    if (editingRecord) {
      updatedData = dataRequirement.map((item) =>
        item.key === editingRecord.key
          ? {
              ...item,
              type: typeLabel,
              typeId: selectedTypeId,
              typeValue: selectedTypeValue,
              value: valueRecord.label,
              valueId: valueRecord.id,
            }
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
    form.setFieldsValue({ srFormDataRequirements: updatedData });

    modalForm.resetFields();
    setEditingRecord(null);
    setSelectedTypeId(null);
    setSelectedTypeValue(null);
    setIsDataRequirement(false);
  }

  return(
    <>
      <NxCardContainer header={"DATA REQUIREMENT"}>
        <NxBaseContainer border>
        <div className="w-full flex justify-between items-center gap-5 mb-5">
          <div className="flex justify-end items-center gap-2.5">
            {/* Download List Button */}
            <ButtonComponent
              type={"submit"}
              onClick={() => {}}
              icon={
                <DownloadOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px"
              }}
            >
              Download List
            </ButtonComponent>

            {/* Approval Button */}
            <ButtonComponent
              type={"submit"}
              onClick={() => {setIsDataRequirement(true)}}
              icon={
                <PlusOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              style={{
                backgroundColor: "#0075bf",
                color: "#fff",
                borderColor: "#0075bf",
                border: "1px solid #0075bf",
                borderRadius: "5px",
                height: "48px"
              }}
            >
              Create
            </ButtonComponent>
          </div>
        </div>

        <NxTable
          idTable={"DataRequirement"}
          className="border-[0.5px] border-[#c8cdd4] border-solid "
          usePagination={false}
          useSelect={true}
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
        header={"CHOOSE DATA REQUIREMENT"}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5">
            <Button key="back" onClick={handleCancel}>
              Back
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <Form
              form={modalForm}
              layout="vertical"
            >
              <Form.Item
                key="srFormDataRequirementType"
                name="srFormDataRequirementType"
                label="Type"
                rules={[
                  {
                    message: requiredMessage("Type"),
                    required: true,
                  },
                ]}
                className="no-margin-form"
              >
                <Select
                  placeholder="Select Data Requirement Type"
                  loading={!isDropdownLoaded('serviceRequestDataRequirements')}
                  options={getDropdownItems('serviceRequestDataRequirements').map(item => ({
                    value: item.glbTypeValId?.toString() || item.id?.toString(),
                    label: item.name || item.glbValue,
                    typeValue: item.glbValue,
                  }))}
                  onChange={handleTypeChange}
                />
              </Form.Item>
            </Form>

            <NxTable
              idTable={"DataRequirementValues"}
              className="border-[0.5px] border-[#c8cdd4] border-solid mt-4"
              usePagination={false}
              useSelect={false}
              loading={loading_data_requirement_values}
              dataMain={(data_data_requirement_values[selectedTypeValue] || []).map((item, idx) => ({
                ...item,
                key: item.id,
                no: idx + 1,
              }))}
              columnMain={[
                {
                  title: 'NO',
                  dataIndex: 'no',
                  key: 'no',
                  align: 'center',
                  width: 8,
                },
                {
                  title: 'VALUE',
                  dataIndex: 'label',
                  key: 'label',
                },
                {
                  title: 'ACTION',
                  align: 'center',
                  width: 15,
                  fixed: 'right',
                  render: (v, r) => (
                    <Tooltip title="Add">
                      <div className="flex justify-center cursor-pointer">
                        <PlusCircleOutlined
                          style={{ color: '#0075bf', fontSize: 22 }}
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
  )
}
