import React from "react";
import { Form } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../../utils";
import BaseContainer from "../../../../../components/BaseContainer";

const ModalCustomerType = ({
  isOpen,
  onCancel,
  onConfirm,
  selectedType,
  setSelectedType,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const customerTypes = [
    { label: "Customer", value: "customer" },
    { label: "Prospective Customer", value: "prospective" },
  ];

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      if (values.customerType) {
        onConfirm(values.customerType);
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  React.useEffect(() => {
    if (isOpen && selectedType) {
      form.setFieldsValue({ customerType: selectedType });
    }
  }, [isOpen, selectedType, form]);

  const footer = (
    <div className="flex justify-between gap-2 px-6 pb-4">
      <ButtonComponent onClick={handleCancel} disabled={loading}>
        Cancel
      </ButtonComponent>
      <ButtonComponent
        type="submit"
        onClick={handleConfirm}
        isLoading={loading}
        disabled={loading}
      >
        Next
      </ButtonComponent>
    </div>
  );

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      header="Select Customer Type"
      width={800}
      centered={true}
      footer={footer}
      type="confirmation"
      loading={loading}
      closable={!loading}
    >
      <BaseContainer
        border
        className="mb-0"
      >
        <Form layout="vertical" form={form}>
          <div className="space-y-0">
            <Form.Item
              label="Customer Type"
              name="customerType"
              rules={formMessageRequired("Customer Type")}
              style={{ padding: 0 }}
            >
              <SelectComponent
                placeholder="Choose Customer Type..."
                options={customerTypes}
                onChange={(value) => setSelectedType(value)}
              />
            </Form.Item>
          </div>
        </Form>
      </BaseContainer>
    </ModalCustom>
  );
};

export default ModalCustomerType;
