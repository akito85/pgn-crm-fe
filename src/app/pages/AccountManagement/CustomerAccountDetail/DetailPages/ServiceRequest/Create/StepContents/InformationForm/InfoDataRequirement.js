import { useState, useEffect } from "react";
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

export default function InfoDataRequirement({ form, dropdowns }) {
  const dispatch = useDispatch();
  const { data_filter, loading_filter } = useSelector((state) => state.dataRequirementTemplate);

  const [dataRequirement, setDataRequirement] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = Form.useForm();

  const type = Form.useWatch("type", form);
  const category = Form.useWatch("category", form);
  const subCategory = Form.useWatch("subCategory", form);

  // Sync local table state with form data on mount (persistence across step navigation)
  useEffect(() => {
    const formData = form.getFieldValue("srFormDataRequirements");
    if (formData && formData.length > 0) {
      setDataRequirement(formData.map((item, index) => ({ ...item, no: index + 1 })));
    }
  }, [form]);

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

  // Auto-populate table when template data arrives
  useEffect(() => {
    if (data_filter?.details) {
      const populated = data_filter.details.map((item, index) => ({
        key: item.id ?? index,
        no: index + 1,
        type: item.type,
        typeId: item.id,
      }));
      setDataRequirement(populated);
      form.setFieldsValue({ srFormDataRequirements: populated });
    }
  }, [data_filter]);

  const getDropdownItems = (dropdownKey) => {
    const dropdown = dropdowns?.[dropdownKey];
    if (!dropdown) return [];
    if (Array.isArray(dropdown)) return dropdown;
    if (Array.isArray(dropdown?.data)) return dropdown.data;
    return [];
  };

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

  const handleModalAdd = () => {
    modalForm.validateFields().then((values) => {
      const typeItem = getDropdownItems("serviceRequestDataRequirements").find(
        (item) =>
          (item.glbTypeValId?.toString() || item.id?.toString()) === values.type
      );
      const newRecord = {
        key: Date.now(),
        no: (dataRequirement.length > 0 ? Math.max(...dataRequirement.map((i) => i.no)) : 0) + 1,
        type: typeItem?.name || typeItem?.glbTypeValName || values.type,
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
      title: "ACTION",
      align: "center",
      width: 15,
      fixed: "right",
      render: (_, record) => (
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
                    value: item.glbTypeValId?.toString() || item.id?.toString(),
                    label: item.name || item.glbTypeValName,
                  }))}
                />
              </Form.Item>
            </Form>
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
}
