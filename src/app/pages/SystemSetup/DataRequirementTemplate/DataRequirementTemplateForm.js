import React, { useState, useEffect } from "react";
import { Button, Form, Select, Spin, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxModal from "../../../../components/Nx/NxModal";
import InputComponent from "../../../../components/InputComponent";
import SVGIcon from "../../../../assets/Icon/index";

import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  createDataRequirementTemplate,
  updateDataRequirementTemplate,
  getDataRequirementTemplateDetail,
  getDataRequirementTypes,
  resetDataRequirementTemplate,
} from "../../../../redux/slices/system_setup/dataRequirementTemplate";
import {
  getSrTypes,
  getSrCategories,
  getSrSubcategories,
  getSrWorkOrderTypes,
} from "../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { requiredMessage } from "../../../../utils";

const getDropdownOptions = (items) => {
  if (!items) return [];
  const arr = Array.isArray(items) ? items : items?.data || [];
  return arr.map((item) => ({
    value: item.glbTypeValId?.toString() || item.id?.toString(),
    label: item.name || item.glbTypeValName,
  }));
};

const DataRequirementTemplateForm = ({ type }) => {
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data_detail, loading, data_requirement_types, loading_requirement_types } = useSelector(
    (state) => state.dataRequirementTemplate
  );

  const {
    list_srTypes,
    list_srCategories,
    list_srSubcategories,
    list_srWorkOrderTypes,
  } = useSelector((state) => state.serviceRequest);

  const id = location?.state?.id;
  const isUpdate = type === "update";

  const [sourceType, setSourceType] = useState("Service Request");
  const [details, setDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    dispatch(getSrTypes());
    dispatch(getSrCategories());
    dispatch(getSrSubcategories());
    dispatch(getSrWorkOrderTypes());
    dispatch(getDataRequirementTypes());
  }, [dispatch]);

  useEffect(() => {
    if (isUpdate && id) {
      dispatch(getDataRequirementTemplateDetail(id));
    }
    return () => { dispatch(resetDataRequirementTemplate()); };
  }, [dispatch, isUpdate, id]);

  useEffect(() => {
    if (isUpdate && data_detail) {
      form.setFieldsValue({
        name: data_detail.name,
        sourceType: data_detail.sourceType,
        type: data_detail.type,
        category: data_detail.category,
        subCategory: data_detail.subCategory,
        description: data_detail.description,
      });
      setSourceType(data_detail.sourceType || "Service Request");
      setDetails(
        (data_detail.details || []).map((d, i) => ({ ...d, key: d.id ?? i }))
      );
    }
  }, [data_detail, form, isUpdate]);

  const handleSourceTypeChange = (value) => {
    setSourceType(value);
    form.setFieldsValue({ type: undefined, category: undefined, subCategory: undefined });
  };

  const handleOpenModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      detailForm.setFieldsValue({ type: record.type });
    } else {
      detailForm.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    detailForm.resetFields();
  };

  const handleSaveDetail = () => {
    detailForm.validateFields().then((values) => {
      const typeItem = (data_requirement_types || []).find((item) => item.value === values.type);
      const enriched = { ...values, typeName: typeItem?.name || values.type };
      if (editingRecord) {
        setDetails((prev) =>
          prev.map((d) =>
            d.key === editingRecord.key ? { ...d, ...enriched } : d
          )
        );
      } else {
        setDetails((prev) => [...prev, { ...enriched, key: Date.now() }]);
      }
      handleCloseModal();
    });
  };

  const handleDeleteDetail = (record) => {
    setDetails((prev) => prev.filter((d) => d.key !== record.key));
  };

  const handleSubmit = (values) => {
    const payload = {
      name: values.name,
      sourceType: values.sourceType,
      type: values.type,
      category: values.category,
      subCategory: values.sourceType === "Service Request" ? values.subCategory : null,
      description: values.description,
      details: details.map((d) => ({ type: d.type })),
    };

    if (isUpdate) {
      dispatch(updateDataRequirementTemplate({ ...payload, id }))
        .unwrap()
        .then(() => navigate(SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE));
    } else {
      dispatch(createDataRequirementTemplate(payload))
        .unwrap()
        .then(() => navigate(SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE));
    }
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE, breadcrumbName: "Data Requirement Template" },
    { path: "", breadcrumbName: isUpdate ? "Update" : "Create" },
  ];

  const detailColumns = [
    {
      title: "No",
      key: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => {
        if (record.typeName) return record.typeName;
        const found = (data_requirement_types || []).find((item) => item.value === record.type);
        return found?.name || record.type || "-";
      },
    },
    {
      title: "ACTION",
      key: "action",
      width: 100,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit">
            <div className="pt-1 cursor-pointer">
              <SVGIcon
                name="IconEdit"
                color="#0075bf"
                width={20}
                onClick={() => handleOpenModal(record)}
              />
            </div>
          </Tooltip>
          <Tooltip title="Delete">
            <div className="pt-1 cursor-pointer">
              <SVGIcon
                name="IconDelete"
                color="#BE3036"
                width={20}
                onClick={() => handleDeleteDetail(record)}
              />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <NxBreadCrumb routes={routes} />

      {loading && isUpdate && !data_detail ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ sourceType: "Service Request" }}
          className="flex flex-col gap-y-4"
        >
          {/* Template Information */}
          <NxCardContainer header="TEMPLATE INFORMATION">
            <NxBaseContainer border>
              <div className="w-full grid grid-cols-3 gap-4">
                <Form.Item
                  name="name"
                  label="Name"
                  className="no-margin-form"
                  rules={[{ required: true, message: requiredMessage("Name") }]}
                >
                  <InputComponent placeholder="Enter template name" />
                </Form.Item>

                <Form.Item
                  name="sourceType"
                  label="Source Type"
                  className="no-margin-form"
                  rules={[{ required: true, message: requiredMessage("Source Type") }]}
                >
                  <Select
                    placeholder="Select source type"
                    onChange={handleSourceTypeChange}
                    options={[
                      { value: "Service Request", label: "Service Request" },
                      { value: "Work Order", label: "Work Order" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="type"
                  label="Type"
                  className="no-margin-form"
                  rules={[{ required: true, message: requiredMessage("Type") }]}
                >
                  <Select
                    placeholder="Select type"
                    options={
                      sourceType === "Service Request"
                        ? getDropdownOptions(list_srTypes)
                        : getDropdownOptions(list_srWorkOrderTypes)
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Category"
                  className="no-margin-form"
                  rules={[{ required: true, message: requiredMessage("Category") }]}
                >
                  <Select
                    placeholder="Select category"
                    options={getDropdownOptions(list_srCategories)}
                  />
                </Form.Item>

                {sourceType === "Service Request" && (
                  <Form.Item
                    name="subCategory"
                    label="Sub Category"
                    className="no-margin-form"
                    rules={[{ required: true, message: requiredMessage("Sub Category") }]}
                  >
                    <Select
                      placeholder="Select sub category"
                      options={getDropdownOptions(list_srSubcategories)}
                    />
                  </Form.Item>
                )}
              </div>

              <Form.Item
                name="description"
                label="Description"
                className="no-margin-form"
              >
                <InputComponent
                  type="textarea"
                  rows={3}
                  placeholder="Enter description"
                />
              </Form.Item>
            </NxBaseContainer>
          </NxCardContainer>

          {/* Data Requirement */}
          <NxCardContainer header="DATA REQUIREMENT">
            <NxBaseContainer border>
              <div className="w-full flex justify-end">
                <Button
                  icon={<SVGIcon name="IconButtonCreate" width={14} />}
                  type="submit"
                  onClick={() => handleOpenModal()}
                >
                  Add
                </Button>
              </div>

              <NxTable
                idTable="detail-items-table"
                dataSource={details}
                columns={detailColumns}
                rowKey="key"
                usePagination={false}
                useSelect={false}
                showAdvanceSearch={false}
                tableScrolled={{ y: 400, x: "max-content" }}
              />
            </NxBaseContainer>
          </NxCardContainer>

          {/* Action Bar */}
          <NxBaseContainer border>
            <div className="flex justify-end gap-x-2">
              <Button
                type="menu"
                onClick={() => navigate(SYSTEM_SETUP_ROUTES.VIEW_DATA_REQUIREMENT_TEMPLATE)}
              >
                Cancel
              </Button>
              <Button type="submit" htmlType="submit" loading={loading}>
                {isUpdate ? "Update" : "Create"}
              </Button>
            </div>
          </NxBaseContainer>
        </Form>
      )}

      {/* Modal Add/Edit Data Requirement */}
      <NxModal
        isOpen={isModalOpen}
        handleCancel={handleCloseModal}
        handleOk={handleCloseModal}
        title={editingRecord ? "EDIT DATA REQUIREMENT" : "ADD DATA REQUIREMENT"}
        width={600}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="menu" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveDetail}>
              {editingRecord ? "Update" : "Add"}
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <Form form={detailForm} layout="vertical">
              <Form.Item
                name="type"
                label="Type"
                className="no-margin-form"
                rules={[{ required: true, message: requiredMessage("Type") }]}
              >
                <Select
                  placeholder="Select type"
                  loading={loading_requirement_types}
                  options={(data_requirement_types || []).map((item) => ({
                    value: item.value,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Form>
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
};

export default DataRequirementTemplateForm;
