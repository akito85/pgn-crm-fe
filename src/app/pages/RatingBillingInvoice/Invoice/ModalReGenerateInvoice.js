import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Select, Form } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { useEffect } from "react";

const ModalReGenerateInvoice = ({
  isOpen,
  handleCancel = () => {},
  handleConfirm = () => {},
  remark,
  onChange = () => {},
  onChangeSelect = () => { },
  data_format
}) => {
  // Declaration
  const [form] = Form.useForm();
  // const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen === false) {
      form.resetFields()
    }
  }, [form, isOpen])


  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      header={`Regenerate information`}
      message={`Are you sure you want to Regenerate Invoice`}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
            htmlType={'submit'}
            form={'formRegenarate'}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <Form layout="vertical" form={form} id={'formRegenarate'}>
        <div className="w-full grid grid-cols-1 gap-2">
          <Form.Item
            label={"Format Option"}
            name={"formatOption"}
            rules={[
              { required: true, message: "Please input your Format Option!" },
            ]}
          >
            <SelectComponent onChange={onChangeSelect}>
              {data_format &&
                data_format?.map((data, index) => (
                  <Select.Option value={data.glbTypeValId} key={index}>
                    {data.name}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>

          <Form.Item label={"Remark"} name={"remark"}>
            <InputComponent
              rows={1}
              type="textarea"
              value={remark}
              onChange={onChange}
              placeholder={"Type your remark"}
            />
          </Form.Item>
        </div>
      </Form>
    </ModalApproveOrReject>
  );
};

export default ModalReGenerateInvoice;
