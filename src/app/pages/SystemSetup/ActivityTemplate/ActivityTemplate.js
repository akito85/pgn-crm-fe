import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ActivityTemplateTable from "./ActivityTemplateTable";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxModal from "../../../../components/Nx/NxModal";
import { inactiveActivityTemplate } from "../../../../redux/slices/system_setup/activityTemplate";

const ActivityTemplate = () => {
    const dispatch = useDispatch();
    const { loading_inactive_at } = useSelector((state) => state.activityTemplate);
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [inactivateId, setInactivateId] = useState(null);
    const [inactivateName, setInactivateName] = useState(null);
    const [showInactivateModal, setShowInactivateModal] = useState(false);
    const [form] = Form.useForm();

    const handleInactivateModal = (show, id = null, name = null) => {
        if (show) {
            setInactivateId(id);
            setInactivateName(name);
            setShowInactivateModal(true);
        } else {
            setInactivateId(null);
            setInactivateName(null);
            setShowInactivateModal(false);
        }
    };

    const handleInactivate = () => {
        dispatch(inactiveActivityTemplate(inactivateId))
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
        <NxCardContainer border header={"ACTIVITY TEMPLATE LIST"}>
            <NxBaseContainer border>
                <ActivityTemplateTable
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
                            <Button
                                onClick={() => handleInactivateModal(false)}
                                type="menu"
                                disabled={loading_inactive_at}
                            >
                                Cancel
                            </Button>
                            <Button
                                form="inactivate-at-form"
                                type="submit"
                                htmlType="submit"
                                loading={loading_inactive_at}
                            >
                                Confirm
                            </Button>
                        </div>
                    }
                    loading={loading_inactive_at}
                >
                    <div className="p-4">
                        <Form
                            id="inactivate-at-form"
                            layout="vertical"
                            form={form}
                            onFinish={handleInactivate}
                            className="flex flex-col gap-y-4"
                        >
                            <Alert
                                message={`Are you sure you want to inactivate Activity Template - ${inactivateName ?? inactivateId}?`}
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
};

export default memo(ActivityTemplate);
