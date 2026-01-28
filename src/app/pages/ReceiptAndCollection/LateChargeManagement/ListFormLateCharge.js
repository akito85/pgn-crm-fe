import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../components/RadioTabs";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../assets/Icon/index";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import {
    submitLateCharge,
    getAllApprovalList,
    getDetailLateChargePayment,
    getListApprovalById,
    getListCategory
} from "../../../../redux/slices/receipt_collection/lateCharge";

import LateChargeForm from "./LateChargeForm";
import ModalSearchCustomer from "./ModalSearchCustomer";
import ContentModalConfirm from "./ContentModalConfirm";

const ListFormLateCharge = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { id } = location?.state || {};

    const {
        loading,
        dataListAppHierId,
        dataListAppHierDetail,
        data_detail
    } = useSelector((state) => state.late);

    const [valuePage, setValuePage] = useState("Late Charge");
    const [showSearchCustomerModal, setShowSearchCustomerModal] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalBack, setModalBack] = useState(false);
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState(null);
    const [formData, setFormData] = useState({});

    const tabData = [
        { value: "Late Charge", paramValue: ["costCenter", "periodTagihan"] },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
    ];

    const routes = [
        { path: "", breadcrumbName: "Receipt & Collection" },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE,
            breadcrumbName: "Late Charge",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_LATE_CHARGE,
            breadcrumbName: type === "create" ? "Create Late Charge" : "Update Late Charge",
        },
    ];

    useEffect(() => {
        dispatch(getAllApprovalList());
        dispatch(getListCategory());
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

    const handleSearchCustomer = () => {
        setShowSearchCustomerModal(true);
    };

    const handleConfirmCustomer = (customer) => {
        form.setFieldsValue({
            costCenter: customer.costCenter || "BEK001-Bekasi",
            customerNumber: customer.customerNumber || "CUS001",
            customerName: customer.customerName || "BEK001",
        });
    };

    const handleSubmitForm = (values) => {
        setFormData(values);
        setModalConfirm(true);
    };

    const handleBack = () => {
        setModalBack(true);
    };

    const handleClear = () => {
        form.resetFields();
    };

    const handleSave = () => {
        setModalConfirm(false);
        // Dispatch submit action here
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
                />
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                >
                    <div style={{ display: valuePage !== "Late Charge" ? "none" : undefined }}>
                        <LateChargeForm form={form} onSearchCustomer={handleSearchCustomer} />
                    </div>

                    <div style={{ display: valuePage !== "Approval" ? "none" : undefined }}>
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <ApprovalComponentGeneral
                                dataTable={appHierDataDetail}
                                dataOption={appHierOptions}
                                selectedHierarchy={selectedHierarchy}
                                updateSelectedHierarchy={setSelectedHierarchy}
                            />
                        </BaseContainer>
                    </div>

                    <div style={{ display: valuePage !== "Attachment" ? "none" : undefined }}>
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <AttachmentComponent
                                type={type}
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

                    <div className="flex w-full justify-between align-middle my-3">
                        <ButtonComponent
                            type="primary"
                            onClick={handleBack}
                            icon={<LeftOutlined style={{ color: "#fff", fontSize: 24, justifyItems: "center" }} />}
                        >
                            Back
                        </ButtonComponent>
                        <div className="flex align-middle gap-3">
                            <ButtonComponent
                                icon={
                                    <SVGIcon
                                        name={
                                            type === "update" ? `IconButtonReset` : `IconButtonClear`
                                        }
                                        width={24}
                                    />
                                }
                                type="submit"
                                onClick={handleClear}
                            >
                                {type === "update" ? "Reset" : "Clear"}
                            </ButtonComponent>
                            <ButtonComponent htmlType="submit" type="submit">
                                Save & Submit
                            </ButtonComponent>
                        </div>
                    </div>
                </Form>
            </Spin>

            <ModalSearchCustomer
                isOpen={showSearchCustomerModal}
                onClose={() => setShowSearchCustomerModal(false)}
                onConfirm={handleConfirmCustomer}
            />

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
                <ContentModalConfirm
                    data={formData}
                    tabData={tabData}
                    listDataAttachment={listDataAttachment}
                    listDataAppHierDetail={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    typeSelector="late"
                />
            </ModalCustom>
        </LayoutMenu>
    );
};

export default ListFormLateCharge;
