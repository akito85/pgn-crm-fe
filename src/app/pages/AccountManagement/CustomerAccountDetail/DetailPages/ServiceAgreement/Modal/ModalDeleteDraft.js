import React from 'react'
import { WarningOutlined } from '@ant-design/icons'
import { ModalConfirm } from '../../../../../../../components/Modal/ModalPopUp'
import { Alert } from 'antd'

const ModalDeleteDraft = ({
  modalDeleteDraft,
  handleClearDeleteDraft,
  handleOk
}) => {
  return (
    <ModalConfirm
      isOpen={modalDeleteDraft}
      width={400}
      handleCancel={handleClearDeleteDraft}
      handleOk={handleOk}
      useOk={true}
    >
    {/* content section */}
      <div className="flex justify-center mt-5 gap-[20px]">
        <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
        <p className="text-[18px] font-bold">Are you sure you want delete it ?</p>
      </div>
      {/* <div className='m-auto block w-full'>
        <Alert 
          message="Warning! your data will deleted permanently" 
          type="error"
        />
      </div> */}
    </ModalConfirm>
  )
}

export default ModalDeleteDraft