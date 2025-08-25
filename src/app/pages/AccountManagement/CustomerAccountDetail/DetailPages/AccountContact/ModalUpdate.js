import React from 'react'
import ModalCustom from '../../../../../../components/Modal/ModalCustom'
import { Checkbox, Form } from 'antd'
import InputComponent from '../../../../../../components/InputComponent';

const ModalUpdate = ({
  isOpen,
  closeModal = () => {} ,
}) => {
  
  const [form] = Form.useForm();
  const handleCloseModalUpdate = () =>{
    closeModal((prevState) => prevState = false)
  }

  return (
    <ModalCustom
      header={"Update Contact"}
      isOpen={isOpen}
      handleCancel={() => {
        handleCloseModalUpdate()
      }}
      type={"confirmation"}
      width={1000}
    >
      <Form layout='vertical' form={form} onFinish={''}>
        <div className={"grid grid-cols-3 w-full gap-x-6"}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your First Name",
              },
            ]}
          >
            <InputComponent mandatory type="text"/>
          </Form.Item>
          <Form.Item
            label="Middle Name"
            name="middleName"
          >
            <InputComponent type="text"/>
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
          >
            <InputComponent type="text"/>
          </Form.Item>
          <Form.Item
            label="Job TItle"
            name="jobTItle"
          >
            <InputComponent type="text"/>
          </Form.Item>
          <Form.Item
            label="Contact Address"
            name="contactAddress"
          >
            <InputComponent type="text"/>
          </Form.Item>
          <Form.Item name="primaryContact" valuePropName="checked" noStyle>
            <div className='flex flex-col pt-[25px]'>
              <Checkbox>Primary Contact</Checkbox>
              <span className='text-[10px]'>Check if this contact is primary. You can only have 1 primary contact.</span>
            </div>
          </Form.Item>
        </div>
        <div className={"grid grid-cols-1 w-full gap-x-6"}>
          <Form.Item
            label="Contact Address"
            name="contactAddress"
          >
            <InputComponent type="textarea"/>
          </Form.Item>
        </div>
      </Form>
    </ModalCustom>
  )
}

export default ModalUpdate