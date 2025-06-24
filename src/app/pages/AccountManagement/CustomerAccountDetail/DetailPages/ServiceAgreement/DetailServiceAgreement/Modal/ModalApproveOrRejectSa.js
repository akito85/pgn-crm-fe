import React from 'react'


import ModalApproveOrReject from '../../../../../../../../components/Modal/ModalApproveOrReject'
import ButtonComponent from '../../../../../../../../components/ButtonComponent'
import InputComponent from '../../../../../../../../components/InputComponent'
import { Form } from 'antd'

const ModalApproveOrRejectSa = ({
  isOpen,
  header,
  approveOrReject,
  handleCancel = () => {},
  handleCancelFooter = () => {},
  handleConfirmFooter = () => {},
  remark,
  onChange = () => {},
  form
}) => {
  return (
    <div>
      <ModalApproveOrReject
        isOpen={isOpen}
        header={`${header} information`}
        message={`Are you sure you want to ${approveOrReject} Service Agreement`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent type={"default"} onClick={handleCancelFooter}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              border={false}
              htmlType="submit"
              form="saApproveRejectForm"
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="saApproveRejectForm"
          form={form}
          onFinish={handleConfirmFooter}
          layout='vertical'
        >
          <Form.Item
            name={"remark"}
            rules={[{ message: "This field is required", required: true }]}
            className="w-full"
            label={"Remark"}
          >

            <InputComponent
              rows={1}
              type="textarea"
              value={remark}
              placeholder={"Type your remark"}
              // onChange={onChange}
            />
          </Form.Item>
        </Form>
      </ModalApproveOrReject>
    </div>
  )
}

export default ModalApproveOrRejectSa