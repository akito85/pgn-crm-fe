import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../assets/Icon/index";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import {
    getAllApprovalList,
    getListApprovalById,
    getListCategory,
    getListRecalculateType
} from "../../../../../redux/slices/receipt_collection/lateCharge";
import RecalculateForm from "./RecalculateForm";
import ContentModalConfirmRecalculate from "./ContentModalConfirmRecalculate";

const ListFormRecalculate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { record } = location?.state || {};

    const {
        loading,
        dataListAppHierId,
        dataListAppHierDetail,
        dataListRecalculateType
    } = useSelector((state) => state.late);

    const [valuePage, setValuePage] = useState("Adjustment Recalculate");
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalBack, setModalBack] = useState(false);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [formData, setFormData] = useState({});

    const tabData = [
        { value: "Adjustment Recalculate" },
        { value: "Approval" },
        { value: "Attachment" },
    ];

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE,
            breadcrumbName: "Late Charge",
        },
        {
            path: "",
            breadcrumbName: "Create Adjustment Recalculate",
        },
    ];

    useEffect(() => {
        dispatch(getAllApprovalList());
        dispatch(getListCategory());
        dispatch(getListRecalculateType());
    }, [dispatch]);

    useEffect(() => {
        if (dataListAppHierId && dataListAppHierId.length > 0) {
            const tempAppHier = dataListAppHierId.map((appHier) => ({
                name: appHier.approvalName,
                value: appHier.appHierId,
            }));
            setAppHierOptions(tempAppHier);
        }
    }, [dataListAppHierId]);

    useEffect(() => {
        if (selectedHierarchy && selectedHierarchy !== 0) {
            dispatch(getListApprovalById({ id: selectedHierarchy }));
        }
    }, [dispatch, selectedHierarchy]);

    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail.map((b, index) => ({
                    ...b,
                    key: index + 1,
                })),
            }));
            setAppHierDataDetail(data);
        } else {
            setAppHierDataDetail([]);
        }
    }, [dataListAppHierDetail]);

    const onChangeTab = (e) => {
        setValuePage(e.target.value);
    };

    const handleSubmitForm = (values) => {
        console.log("Submit Form Values:", values);
        setFormData(values);
        setModalConfirm(true);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Form Validation Failed:", errorInfo);
    };

    const handleBack = () => {
        setModalBack(true);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSave = () => {
        setModalConfirm(false);
        // Simulation of submission
        navigate(-1);
    };

    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <RadioTabs
                    data={tabData}
                    onChange={onChangeTab}
                    currentPosition={valuePage}
                    className="mb-5"
                />
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                    onFinishFailed={onFinishFailed}
                >
                    <div style={{ display: valuePage !== "Adjustment Recalculate" ? "none" : undefined }}>
                        <BaseContainer header={"ADJUSTMENT RECALCULATE INFORMATION"}>
                            <div className="p-4">
                                <RecalculateForm form={form} record={record} listType={dataListRecalculateType} />
                            </div>
                        </BaseContainer>
                    </div>

                    <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <div className="p-4">
                                <ApprovalComponentGeneral
                                    dataTable={appHierDataDetail}
                                    dataOption={appHierOptions}
                                    selectedHierarchy={selectedHierarchy}
                                    updateSelectedHierarchy={setSelectedHierarchy}
                                />
                            </div>
                        </BaseContainer>
                    </div>

                    <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <AttachmentComponent
                                type="create"
                                data={listDataAttachment}
                                updateData={setListDataAttachment}
                                typeSelector="late"
                                dispatch={dispatch}
                                getAPICategory={getListCategory}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                                typeRBI={"data"}
                            />
                        </BaseContainer>
                    </div>

                    <div className="flex w-full justify-between align-middle my-5">
                        <ButtonComponent
                            type="primary"
                            onClick={handleBack}
                            icon={<LeftOutlined style={{ color: "#fff", fontSize: 24 }} />}
                        >
                            Back
                        </ButtonComponent>
                        <div className="flex align-middle gap-3">
                            <ButtonComponent
                                icon={
                                    <SVGIcon
                                        name={
                                            `IconButtonClear`
                                        }
                                        width={24}
                                    />
                                }
                                type="submit"
                                onClick={handleClear}
                            >
                                {"Clear"}
                            </ButtonComponent>
                            <ButtonComponent htmlType="submit" type="submit">
                                Save & Submit
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>
            </Spin>

            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
                width={600}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">Are you sure you want to back?</p>
                </div>
            </ModalConfirm>

            <ModalCustom
                isOpen={modalConfirm}
                handleCancel={() => setModalConfirm(false)}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-end gap-5 p-4">
                        <ButtonComponent onClick={() => setModalConfirm(false)} type="default">Cancel</ButtonComponent>
                        <ButtonComponent type="submit" onClick={handleSave}>Confirm</ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirmRecalculate
                    data={formData}
                    tabData={tabData}
                    listDataAttachment={listDataAttachment}
                    listDataAppHierDetail={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                />
            </ModalCustom>
        </LayoutMenu>
    );
};

export default ListFormRecalculate;
