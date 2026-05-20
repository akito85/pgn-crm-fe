import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PreRequisiteTemplateTable from "./PreRequisiteTemplateTable";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { inactivePreRequisiteTemplate } from "../../../../redux/slices/system_setup/preRequisiteTemplate";
import NxModal from "../../../../components/Nx/NxModal";
import { Alert, Button, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const PreRequisiteTemplate = () => {
    const dispatch = useDispatch();
    const {
        loading_inactive_prt,
    } = useSelector((state) => state.preRequisiteTemplate);
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [inactivateId, setInactivateId] = useState(null);
    const [showInactivateModal, setShowInactivateModal] = useState(false);
    const [form] = Form.useForm();

    const handleInactivateModal = (show, newId = null) => {
        if (show) {
            setInactivateId(newId);
            setShowInactivateModal(true);
        } else {
            setInactivateId(null);
            setShowInactivateModal(false);
        }
    };

    const handleInactivate = () => {
        dispatch(inactivePreRequisiteTemplate(inactivateId))
            .unwrap()
            .then(() => {
                form.resetFields();
                handleInactivateModal(false);
                setRefreshSignal((prev) => prev + 1);
            })
            .catch(() => {
                handleInactivateModal(false);
            });
    };

    return (
        <>
        <NxCardContainer border header={"PRE-REQUISITE TEMPLATE LIST"}>
            <NxBaseContainer border>
                <PreRequisiteTemplateTable
                    refreshSignal={refreshSignal}
                    handleInactivateModal={handleInactivateModal}
                />
                <NxModal
                    isOpen={showInactivateModal}
                    handleCancel={() => handleInactivateModal(false)}
                    title={"INACTIVATE INFORMATION"}
                    width={1000}
                    type={"confirmation"}
                    footer={
                        <div className="flex justify-end">
                            <Button onClick={() => handleInactivateModal(false)} type="menu" disabled={loading_inactive_prt}>
                                Cancel
                            </Button>
                            <Button
                                form="inactivate-form"
                                type="submit"
                                htmlType="submit"
                                loading={loading_inactive_prt}
                            >
                                Confirm
                            </Button>
                        </div>
                    }
                    loading={loading_inactive_prt}
                >
                    <div className="p-4">
                        <Form
                            id="inactivate-form"
                            layout="vertical"
                            form={form}
                            onFinish={handleInactivate}
                            className="flex flex-col gap-y-4"
                        >
                            <Alert
                                message={`Are you sure you want to inactivate Pre-Requisite Template - ${inactivateId}?`}
                                icon={<ExclamationCircleOutlined style={{ fontSize: 16, color: "#65481C" }} />}
                                type="warning"
                                showIcon
                                className="p-0 m-0"
                            />
                        </Form>
                    </div>
                </NxModal>
            </NxBaseContainer>
        </NxCardContainer>
        </>
    );
}

export default memo(PreRequisiteTemplate);
