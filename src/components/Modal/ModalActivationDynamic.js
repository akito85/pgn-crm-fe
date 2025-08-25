import React from 'react';
import ModalCustom from './ModalCustom';
import ButtonComponent from '../ButtonComponent';
import { Alert, Form } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalActivationDynamic = ({
    isOpen = false,
    handleCloseModal = () => { },
    onFinish = () => { },
    header,
    approveOrReject,
    menu,
    named,
    children,
    customMessage,
    width = 1000,
    form
}) => {


    const handleCancelModalFinal = () => {
        form.resetFields();
        handleCloseModal();
    };


    const handleSaveModal = (data) => {
        onFinish(data, form?.resetFields());
    };


    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancelModalFinal}
            header={`${header} information`}
            width={width}
            type={"confirmation"}
            footer={
                <div className="w-full flex justify-end gap-5 p-4">
                    <ButtonComponent onClick={handleCancelModalFinal} type="default">
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent
                        form="formApproveReject"
                        type="submit"
                        htmlType="submit"
                    >
                        Confirm
                    </ButtonComponent>
                </div>
            }
        >
            <Form
                id="formApproveReject"
                layout="vertical"
                form={form}
                onFinish={handleSaveModal}
            >
                
                {/* alert section */}
                <div className="flex flex-col justify-center gap-6">
                    <Alert
                        message={customMessage ? customMessage : `Are you sure you want to ${approveOrReject} this ${menu} named ${named}?`}
                        icon={
                            <ExclamationCircleOutlined
                                style={{ fontSize: "24px", color: "#65481C" }}
                            />
                        }
                        type={"warning"}
                        showIcon
                        className="p-0 m-0"
                    />

                    {/* dynamic section */}
                    {children}

                </div>
            </Form>
        </ModalCustom>
    );
}

export default ModalActivationDynamic;
