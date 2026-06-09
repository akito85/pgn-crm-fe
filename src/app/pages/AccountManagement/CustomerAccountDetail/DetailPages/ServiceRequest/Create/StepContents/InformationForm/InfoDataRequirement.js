import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Select, Tooltip } from "antd";

import SVGIcon from "../../../../../../../../../assets/Icon";
import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../components/Nx/NxModal";

import { requiredMessage } from "../../../../../../../../../utils";
import {
  getDataRequirementTemplateByFilter,
  resetDataRequirementTemplate,
} from "../../../../../../../../../redux/slices/system_setup/dataRequirementTemplate";
import { getSrDataRequirementValues } from "../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getDropdownItems as getItems } from "./srFormUtils";

export default function InfoDataRequirement({ form, dropdowns, idAccount, isUpdate = false }) {
  const dispatch = useDispatch();
  const { data_filter, loading_filter } = useSelector((state) => state.dataRequirementTemplate);
  const {
  detail_srDataRequirementValues,
  loading_srDataRequirementValues,
  list_srDataRequirements,
} = useSelector((state) => state.serviceRequest);

  const [dataRequirement, setDataRequirement] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editModalForm] = Form.useForm();
  const selectedEditType = Form.useWatch("editType", editModalForm);

  const type = Form.useWatch("type", form);
  const category = Form.useWatch("category", form);
  const subCategory = Form.useWatch("subCategory", form);

  const getDropdownItems = (dropdownKey) => getItems(dropdowns, dropdownKey);

  // Sync local table state with form data on mount (persistence across step navigation)
  useEffect(() => {
    const formData = form.getFieldValue("srFormDataRequirements");
    if (formData && formData.length > 0) {
      setDataRequirement(formData.map((item, index) => ({ ...item, no: index + 1 })));
    }
  }, [form]);

  // In UPDATE mode: populate form from the existing SR's data requirements
  useEffect(() => {
    if (!isUpdate) return;
    if (!list_srDataRequirements.length) return;
    const existing = form.getFieldValue("srFormDataRequirements");
    if (existing?.length > 0) return;

    const populated = list_srDataRequirements.map((item, index) => ({
      key: item.id ?? index,
      no: index + 1,
      type: item.type,
      typeId: item.requirementType ?? item.id,
      value: item.value ?? "",
    }));
    setDataRequirement(populated);
    form.setFieldsValue({ srFormDataRequirements: populated });
  }, [isUpdate, list_srDataRequirements]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fetch template when type, category, subCategory are all set
  useEffect(() => {
    if (type && category && subCategory) {
      dispatch(
        getDataRequirementTemplateByFilter({
          sourceType: "Service Request",
          type,
          category,
          subCategory,
        })
      );
    } else {
      dispatch(resetDataRequirementTemplate());
    }
  }, [type, category, subCategory]);

  // Auto-populate table when template data arrives — skip in update mode
  useEffect(() => {
    if (!data_filter?.details) return;
    if (isUpdate) return;
    const populated = data_filter.details.map((item, index) => ({
      key: item.id ?? index,
      no: index + 1,
      type: item.type,
      typeId: item.id,
    }));
    setDataRequirement(populated);
    form.setFieldsValue({ srFormDataRequirements: populated });
  }, [data_filter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data requirement values when user selects a type in edit modal
  useEffect(() => {
    if (!idAccount || selectedEditType == null) return;
    const items = getDropdownItems("serviceRequestDataRequirements");
    const matched = items.find((i) => (i.glbTypeValId ?? i.id) === selectedEditType);
    if (matched?.glbValue) {
      dispatch(getSrDataRequirementValues({ typeValue: matched.glbValue, accountId: idAccount }));
    }
  }, [selectedEditType, idAccount]);

  // Build selectable rows for the choose table
  const chooseTableData = useMemo(() => {
    if (selectedEditType == null) return [];
    const items = getDropdownItems("serviceRequestDataRequirements");
    const matched = items.find((i) => (i.glbTypeValId ?? i.id) === selectedEditType);
    const source = matched?.glbValue
      ? (detail_srDataRequirementValues[matched.glbValue] ?? [])
      : [];
    return (Array.isArray(source) ? source : []).map((item, index) => ({
      key: item.id ?? index,
      no: index + 1,
      id: item.id,
      value: item.label,
    }));
  }, [detail_srDataRequirementValues, selectedEditType, dropdowns]);

  const handleDelete = (record) => {
    const updatedData = dataRequirement
      .filter((item) => item.key !== record.key)
      .map((item, index) => ({ ...item, no: index + 1 }));
    setDataRequirement(updatedData);
    form.setFieldsValue({ srFormDataRequirements: updatedData });
  };

  const handleModalOpen = () => {
    modalForm.resetFields();
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  const handleEditOpen = (record) => {
    setEditRecord(record);
    editModalForm.setFieldsValue({ editType: record.typeId });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditRecord(null);
    editModalForm.resetFields();
    setIsEditModalOpen(false);
  };

  const handleSelectDataRequirement = (row) => {
    const typeId = selectedEditType ?? editRecord?.typeId;
    const items = getDropdownItems("serviceRequestDataRequirements");
    const matched = items.find((i) => (i.glbTypeValId ?? i.id) === typeId);
    const typeName = matched?.name || matched?.glbTypeValName || editRecord?.type || String(typeId);
    const updatedData = dataRequirement.map((item) =>
      item.key === editRecord?.key
        ? {
            ...item,
            typeId,
            type: typeName,
            value: row.value ?? row.name ?? "",
          }
        : item
    );
    setDataRequirement(updatedData);
    form.setFieldsValue({ srFormDataRequirements: updatedData });
    handleEditCancel();
  };

  const handleModalAdd = () => {
    modalForm.validateFields().then((values) => {
      const items = getDropdownItems("serviceRequestDataRequirements");
      const matched = items.find((i) => (i.glbTypeValId ?? i.id) === values.type);
      const typeName = matched?.name || matched?.glbTypeValName || String(values.type);
      const newRecord = {
        key: Date.now(),
        no: (dataRequirement.length > 0 ? Math.max(...dataRequirement.map((i) => i.no)) : 0) + 1,
        type: typeName,
        typeId: values.type,
      };
      const updatedData = [...dataRequirement, newRecord];
      setDataRequirement(updatedData);
      form.setFieldsValue({ srFormDataRequirements: updatedData });
      modalForm.resetFields();
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 8,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "ACTION",
      align: "center",
      width: 15,
      fixed: "right",
      render: (_, record) => (
        <div className="flex gap-4 px-4">
          <Tooltip title="Edit">
            <div className="pt-1 cursor-pointer flex justify-center">
              <SVGIcon
                name="IconEdit"
                color={"#1890FF"}
                width={20}
                onClick={() => handleEditOpen(record)}
              />
            </div>
          </Tooltip>
          <Tooltip title="Delete">
            <div className="pt-1 cursor-pointer flex justify-center">
              <SVGIcon
                name="IconDelete"
                color={"#BE3036"}
                width={20}
                onClick={() => handleDelete(record)}
              />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <NxCardContainer header={"DATA REQUIREMENT"}>
        <NxBaseContainer border>
          <div className="w-full flex justify-end items-center">
            <Button
              icon={<SVGIcon name="IconButtonCreate" width={14} />}
              type={"submit"}
              border={false}
              onClick={handleModalOpen}
            >
              Add
            </Button>
          </div>

          <NxTable
            idTable={"DataRequirement"}
            usePagination={false}
            useSelect={false}
            tableScrolled={{ y: 400, x: "max-content" }}
            dataSource={dataRequirement}
            columns={columns}
            showAdvanceSearch={false}
            loading={loading_filter}
          />
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={isModalOpen}
        handleCancel={handleModalCancel}
        title={"ADD DATA REQUIREMENT"}
        width={600}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="menu" onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleModalAdd}>
              Add
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <Form form={modalForm} layout="vertical">
              <Form.Item
                name="type"
                label="Type"
                className="no-margin-form"
                rules={[{ required: true, message: requiredMessage("Type") }]}
              >
                <Select
                  placeholder="Select Data Requirement Type"
                  loading={getDropdownItems("serviceRequestDataRequirements").length === 0}
                  options={getDropdownItems("serviceRequestDataRequirements").map((item) => ({
                    value: item.glbTypeValId ?? item.id,
                    label: item.name || item.glbTypeValName,
                  }))}
                />
              </Form.Item>
            </Form>
          </NxBaseContainer>
        </div>
      </NxModal>

      <NxModal
        isOpen={isEditModalOpen}
        handleCancel={handleEditCancel}
        title={"CHOOSE DATA REQUIREMENT"}
        width={1500}
        footer={
          <div className="flex justify-end">
            <Button type="menu" onClick={handleEditCancel}>Back</Button>
          </div>
        }
      >
        <div className="p-4 flex flex-col gap-4">
          <NxBaseContainer border>
            <Form form={editModalForm} layout="vertical">
              <Form.Item name="editType" label="Type" className="no-margin-form">
                <Select
                  placeholder="Select Type"
                  options={getDropdownItems("serviceRequestDataRequirements").map((item) => ({
                    value: item.glbTypeValId ?? item.id,
                    label: item.name || item.glbTypeValName,
                  }))}
                />
              </Form.Item>
            </Form>
          </NxBaseContainer>

          <NxBaseContainer border>
            <NxTable
              idTable={"ChooseDataRequirement"}
              usePagination={false}
              useSelect={false}
              showAdvanceSearch={false}
              tableScrolled={{ y: 300, x: "max-content" }}
              dataSource={chooseTableData}
              loading={loading_srDataRequirementValues}
              columns={[
                { title: "No", dataIndex: "no", key: "no", align: "center", width: 60 },
                { title: "Value", dataIndex: "value", key: "value" },
                {
                  title: "Action",
                  key: "action",
                  align: "center",
                  width: 80,
                  render: (_, row) => (
                    <Tooltip title="Select">
                      <div className="pt-1 cursor-pointer flex justify-center">
                        <SVGIcon
                          name="IconAddTable"
                          color={"#1890FF"}
                          width={20}
                          onClick={() => handleSelectDataRequirement(row)}
                        />
                      </div>
                    </Tooltip>
                  ),
                },
              ]}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
}
