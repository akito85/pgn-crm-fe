import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, CheckOutlined, FilterOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Popconfirm, Button, Space, Form, Select, Tooltip } from "antd";

import SVGIcon from "../../../../../../../../../assets/Icon";

import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../components/Nx/NxModal";

import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../../../../components/InputComponent";

import { requiredMessage, toTitleCase } from "../../../../../../../../../utils";

export default function InfoDataRequirement({
  dropdowns,
  form
}) {
  const [isDataRequirement, setIsDataRequirement] = useState(false);
  const [dataRequirement, setDataRequirement] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
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

  // Create safe accessor functions
  const getDropdownOptions = (dropdownKey) => {
    if (!dropdowns || !dropdowns[dropdownKey] || !dropdowns[dropdownKey].data) {
      return [];
    }
    return dropdowns[dropdownKey].data.map(item => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName
    }));
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
      width: 80
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
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

  const handleEdit = (record) => {
    modalForm.setFieldsValue({
      srFormDataRequirementType: record.typeId,
      srFormDataRequirementValue: record.value
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
    setIsDataRequirement(false);
  }

  const handleOk = () => {
    modalForm.validateFields()
      .then((values) => {
        // Get label from dropdown for display
        const typeLabel = getDropdownOptions('serviceRequestDataRequirements')
          .find(opt => opt.value === values.srFormDataRequirementType)?.label;

        let updatedData;

        if (editingRecord) {
          // Update existing record - keep the same no
          updatedData = dataRequirement.map((item) =>
            item.key === editingRecord.key
              ? {
                  ...item,
                  type: typeLabel,
                  typeId: values.srFormDataRequirementType,
                  value: values.srFormDataRequirementValue
                }
              : item
          );
        } else {
          // Create new record with next sequential number
          try {
            // Get next number (might throw if max reached)
            const newRecord = {
              key: Date.now(), // unique key
              no: getNextNumber(),
              type: typeLabel,
              typeId: values.srFormDataRequirementType,
              value: values.srFormDataRequirementValue
            };
            updatedData = [...dataRequirement, newRecord];
          } catch (error) {
            // Show error message to user
            console.log(error.message);
          }
        }

        // Update table data
        setDataRequirement(updatedData);

        // Update main form with the array
        form.setFieldsValue({
          srFormDataRequirements: updatedData
        });

        // Reset and close
        modalForm.resetFields();
        setEditingRecord(null);
        setIsDataRequirement(false);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  }

  return(
    <>
      <NxCardContainer header={"DATA REQUIREMENT"}>
        <NxBaseContainer border>
        <div className="w-full flex justify-between items-center gap-5 mb-5">
          {/* Filter Button - Left side */}
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <FilterOutlined
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
              width: "128px",
              height: "48px",
              borderRadius: "5px"
            }}
          >
            Filters
          </ButtonComponent>
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
          usePagination={true}
          useSelect={true}
          dataMain={dataRequirement}
          columnMain={columnMain}
        />
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={isDataRequirement}
        handleCancel={handleCancel}
        handleOk={handleOk}
        title="ADD DATA REQUIREMENT"
        width={1100}
        type="custom"
        footer={[
          <div className="flex justify-end items-end w-full">
            <div className="flex flex-row gap-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="primary"
                className="h-9 px-5 justify-center items-center"
                style={{
                  backgroundColor: "#0075bf",
                  borderColor: "#0075bf",
                  borderRadius: "5px",
                  minWidth: "112px",
                  color: "#ffffff"
                }}
                onClick={handleOk}
              >
                Save
              </Button>
            </div>
          </div>
        ]}
      >
        <Form
          form={modalForm}
          layout="vertical"
        >
          <div className="w-full flex flex-col gap-5">
            <Form.Item
              key="srFormDataRequirementType"
              name="srFormDataRequirementType"
              label="Data Requirement Type"
              rules={[
                {
                  message: requiredMessage("Data Requirement Type"),
                  required: true,
                },
              ]}
              className="no-margin-form"
              labelCol={{ span: 24 }}  // Full width for label
              wrapperCol={{ span: 24 }} // Full width for input
            >
              <Select
                placeholder="Select Data Requirement"
                loading={!dropdowns?.serviceRequestDataRequirements?.data}
                options={getDropdownOptions('serviceRequestDataRequirements')}
              />
            </Form.Item>
            <Form.Item
              key="srFormDataRequirementValue"
              name="srFormDataRequirementValue"
              label="Data Requirement Value"
              rules={[
                {
                  message: requiredMessage("Data Requirement Value"),
                  required: true,
                },
              ]}
              className="no-margin-form"
              labelCol={{ span: 24 }}  // Full width for label
              wrapperCol={{ span: 24 }} // Full width for input
            >
              <InputComponent type={"textarea"}/>
            </Form.Item>
          </div>
        </Form>
      </NxModal>
    </>
  )
}
