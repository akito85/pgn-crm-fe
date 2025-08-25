import React, {useState} from 'react'
import { Alert, Form } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import ModalCustom from '../../../../../../../components/Modal/ModalCustom';
import ButtonComponent from '../../../../../../../components/ButtonComponent';
import InputComponent from '../../../../../../../components/InputComponent';

const ModalActivateContact = ({
  isOpen,
  typeModal,
  closeModal = () => {}
}) => {
  const [form] = Form.useForm();
  const [remark, setRemark] = useState("");
  
  const handleCloseModal = () =>{
    closeModal((prevState) => prevState = false)
    handleClear();
  }

  const handleClear = () => {
    setRemark("");
    form.resetFields();
  };

  const handleSaveModalInactivateFinal = async (formValue) => {
    // const body = { ...formValue, id: entityId };
    // await dispatch(inactiveEntity(body))
    //   .unwrap()
    //   .then(() => {
    //     dispatch(getAllEntityPaginate({ page, pageSize }));
    //     handleCancelModalInactivateFinal();
    //   });
  };
  return (
    <div>
      <ModalCustom
        header={`${
          typeModal === "ACTIVE" ? "ACTIVATE" : "INACTIVATE"
        } INFORMATION`}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={() => {
          handleCloseModal()
        }}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={handleCloseModal}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="contactInactivateForm"
              type="submit"
              htmlType="submit"
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
      <Form
          id="contactInactivateForm"
          form={form}
          onFinish={handleSaveModalInactivateFinal}
        >
          <div className="flex flex-col gap-6">
            <Alert
              message={`Are you sure you want to ${
                typeModal === "ACTIVE" ? "activate" : "inactivate"
              } contact?`}
              icon={<InfoCircleOutlined />}
              type={"warning"}
              showIcon
              className="inactivate-alert"
            />
            <Form.Item
              name={"remark"}
              rules={[{ message: "This field is required", required: true }]}
              className="w-full"
            >
              <InputComponent
                group
                rows={1}
                type="textarea"
                value={remark}
                placeholder={"Type your remark"}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>
    </div>
  )
}

export default ModalActivateContact