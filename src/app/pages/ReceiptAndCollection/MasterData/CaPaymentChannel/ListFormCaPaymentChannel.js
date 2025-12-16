import {
    LeftOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
    createCaPaymentChannel,
    createValidasiCaPaymentChannel,
    getAllApprovalListCaPaymentChannel,
    getDetailCaPaymentChannel,
    getListApprovalByIdCaPaymentChannel,
    getListCategoryCaPaymentChannel,
    updateCaPaymentChannel,
    getCollectionAgentList,
    getPaymentChannelList,
    getPartnerList,
    getType,
} from "../../../../../redux/slices/receipt_collection/caPaymentChannel";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import CaPaymentChannelForm from "./CaPaymentChannelForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
    showModalError,
    showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const ListFormCaPaymentChannel = (props) => {
    const { type } = props;
    const {
        data_detail,
        dataListAppHierId,
        dataListAppHierDetail,
        loading,
        dataCollectionAgentList,
        dataPaymentChannelList,
        dataPartnerList,
        dataTypeList,
    } = useSelector((state) => state.caPaymentChannel);

    // Declaration
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const formValue = form.getFieldsValue();
    const location = useLocation();
    const { id } = location?.state || {};
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [selectedHierarchy, setSelectedHierarchy] = useState();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalBack, setModalBack] = useState(false);
    const [appHierOptions, setAppHierOptions] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);
    const [loadingForm, setLoadingForm] = useState(loading);

    useEffect(() => {
        if (id && type === "update") {
            dispatch(getDetailCaPaymentChannel(id));
        }
    }, [dispatch, id, type]);

    useEffect(() => {
        dispatch(getAllApprovalListCaPaymentChannel());
        dispatch(getCollectionAgentList());
        dispatch(getPaymentChannelList());
        dispatch(getPartnerList());
        dispatch(getType());
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
            dispatch(getListApprovalByIdCaPaymentChannel({ id: selectedHierarchy }));
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

    useEffect(() => {
        if (
            formValue.approvalHierarchy &&
            !appHierOptions
                .map((item) => item.value)
                .includes(formValue.approvalHierarchy)
        ) {
            form.setFieldsValue({ approvalHierarchy: null });
            setSelectedHierarchy(null);
        }
    }, [formValue, appHierOptions, form]);

    useEffect(() => {
        if (id && data_detail) {
            form.setFieldsValue({
                id: data_detail?.peOpCaCi?.id,
                caCode: data_detail?.peOpCaCi?.caCode,
                ciCode: data_detail?.peOpCaCi?.ciCode,
                name: data_detail?.peOpCaCi?.name,
                partnerCode: data_detail?.peOpCaCi?.partnerCode,
                type: data_detail?.peOpCaCi?.type,
                effStartDate:
                    data_detail?.peOpCaCi?.effStartDate === null
                        ? moment()
                        : moment(data_detail?.peOpCaCi?.effStartDate).clone(),
                effEndDate:
                    data_detail?.peOpCaCi?.effEndDate === null
                        ? ""
                        : moment(data_detail?.peOpCaCi?.effEndDate).clone(),
                apphierId: data_detail?.peOpCaCi?.apphierId,
            });

            setSelectedHierarchy(data_detail?.peOpCaCi?.apphierId);

            setListDataAttachment(
                (data_detail?.attachmentDtoList || []).map((attachData) => ({
                    ...attachData,
                    fileSize: bytesConverter(attachData.fileSize || 0),
                    dataType: "exist",
                }))
            );
        }
    }, [data_detail, id]);

    // Define tabData before using it in useState
    const [tabData, setTabData] = useState([
        {
            value: "Ca Payment Channel",
            paramValue: [
                "caCode",
                "ciCode",
                "name",
                "partnerCode",
                "type",
                "effStartDate",
                "effEndDate",
            ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
    ]);

    const [valuePage, setValuePage] = useState(tabData[0].value);
    const [sendBody, setSendBody] = useState();
    const onChange = (e) => {
        setValuePage(e.target.value);
    };

    useEffect(() => {
        if (
            formValue.apphierId &&
            !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
        ) {
            form.setFieldsValue({ apphierId: null });
            setSelectedHierarchy(null);
        }
    }, [formValue, appHierOptions, form]);

    const handleSubmitForm = (formValue) => {
        const dataValue = {
            caCode: formValue.caCode,
            ciCode: formValue.ciCode,
            name: formValue.name,
            partnerCode: formValue.partnerCode,
            type: formValue.type,
            effStartDate: moment(formValue.effStartDate).format(dateFormatting.date),
            effEndDate: formValue.effEndDate
                ? moment(formValue.effEndDate).format(dateFormatting.date)
                : null,
            apphierId: formValue.apphierId,
        };

        setSendBody(dataValue);
        const bodyValidasiUpdate = {
            ...dataValue,
            id: data_detail?.id,
        };
        if (type !== "update") {
            dispatch(createValidasiCaPaymentChannel(dataValue))
                .unwrap()
                .then(async (data) => {
                    const sukses = data?.success;
                    if (sukses === false) {
                        setModalConfirm(false);
                    }
                    setModalConfirm(true);
                });
        } else {
            dispatch(createValidasiCaPaymentChannel(bodyValidasiUpdate))
                .unwrap()
                .then(async (data) => {
                    const sukses = data?.success;
                    if (sukses === false) {
                        setModalConfirm(false);
                    }
                    setModalConfirm(true);
                    setSendBody(bodyValidasiUpdate);
                });
        }
    };

    const handleCancelModalConfirm = () => {
        setModalConfirm(false);
    };

    // Validation Button Back
    const handleBack = () => {
        if (
            form.getFieldValue() === null ||
            Object.keys(form.getFieldValue()).length === 0
        ) {
            navigate(-1);
        } else {
            setModalBack(true);
        }
    };

    const handleClear = () => {
        if (type === "create") {
            form.resetFields();
            setSelectedHierarchy("");
            setListDataAttachment([]);
        } else {
            dispatch(getDetailCaPaymentChannel(id));
        }
    };

    //handle Error
    const handleError = ({ values, errorFields, outOfDate }) => {
        setTabData((prevState) => {
            const res = prevState.map((item) => {
                if (!item.paramValue || item.paramValue.length < 0) {
                    return {
                        value: item.value,
                        paramValue: item.paramValue,
                    };
                }
                const errorBadge = errorFields.reduce(
                    (current, next) =>
                        item.paramValue.includes(next.name[0]) ? current + 1 : current,
                    0
                );
                return {
                    value: item.value,
                    paramValue: item.paramValue,
                    errorBadge,
                };
            });
            return res;
        });
    };

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_PAYMENT_CHANNEL,
            breadcrumbName: "Ca Payment Channel",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_CA_PAYMENT_CHANNEL,
            breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
        },
    ];

    //kirim body
    const handleSave = async () => {
        setModalConfirm(false);
        const successMessageCreate = {
            title: "Successfull",
            description: `Your data has been submited`,
            return: true,
        };

        const successMessageUpdate = {
            title: "Successfull",
            description: `Your data has been submited`,
            return: true,
        };

        if (type === "update") {
            dispatch(updateCaPaymentChannel(sendBody))
                .unwrap()
                .then(async () => {
                    setLoadingForm(true);
                    const filterDataAttach = listDataAttachment.filter(
                        (item) => item.dataType !== "exist"
                    );
                    for (let icon = 0; icon < filterDataAttach.length; icon++) {
                        const element = filterDataAttach[icon];
                        const body = {
                            referensiId: data_detail?.id,
                            files: element.file,
                            category: "CA_PAYMENT_CHANNEL",
                            fileCategoryId: element.fileCategoryId,
                        };
                        await receiptCollectionHttpService.uploadImage(
                            `/v1/dbs/api/attachment/upload/v1`,
                            body
                        );
                    }
                    setLoadingForm(false);
                    handleCancelModalConfirm();
                    form.resetFields();
                    setSelectedHierarchy("");
                    setListDataAttachment([]);
                    dispatch(showModalSuccess(successMessageUpdate));
                    handleClear();
                })
                .catch((error) => {
                    if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
                        const message =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        dispatch(showModalError(message));
                    }
                });
        } else {
            dispatch(createCaPaymentChannel(sendBody))
                .unwrap()
                .then(async (data) => {
                    let id = data.id;
                    setLoadingForm(true);
                    for (let icon = 0; icon < listDataAttachment.length; icon++) {
                        const element = listDataAttachment[icon];

                        const body = {
                            files: element.file,
                            fileCategoryId: element.fileCategoryId,
                            referensiId: id,
                            category: "CA_PAYMENT_CHANNEL",
                        };
                        await receiptCollectionHttpService.uploadImage(
                            `/v1/dbs/api/attachment/upload/v1`,
                            body
                        );
                    }
                    setLoadingForm(false);
                    handleCancelModalConfirm();
                    handleClear();
                    dispatch(showModalSuccess(successMessageCreate));
                })
                .catch((error) => {
                    if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
                        const message =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        dispatch(showModalError(message));
                    }
                });
        }
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loadingForm}>
                <RadioTabs
                    data={tabData}
                    onChange={onChange}
                    currentPosition={valuePage}
                />
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                    onFinishFailed={handleError}
                >
                    <div
                        style={{
                            display: valuePage !== tabData[0].value ? "none" : undefined,
                        }}
                    >
                        <CaPaymentChannelForm form={form} dataCollectionAgentList={dataCollectionAgentList} dataPaymentChannelList={dataPaymentChannelList} dataPartnerList={dataPartnerList} dataTypeList={dataTypeList} />
                    </div>
                    <div
                        style={{
                            display: valuePage !== tabData[1].value ? "none" : undefined,
                        }}
                    >
                        <BaseContainer header={"APPROVAL INFORMATION"}>
                            <ApprovalComponentGeneral
                                dataTable={appHierDataDetail}
                                dataOption={appHierOptions}
                                selectedHierarchy={selectedHierarchy}
                                updateSelectedHierarchy={setSelectedHierarchy}
                            />
                        </BaseContainer>
                    </div>
                    <div
                        style={{
                            display: valuePage !== tabData[2].value ? "none" : undefined,
                        }}
                    >
                        <BaseContainer header={"ATTACHMENT INFORMATION"}>
                            <AttachmentComponent
                                type={type}
                                data={listDataAttachment}
                                updateData={setListDataAttachment}
                                typeSelector="caPaymentChannel"
                                dispatch={dispatch}
                                getAPICategory={getListCategoryCaPaymentChannel}
                                service={receiptCollectionHttpService}
                                configApplication={configApp.PAYMENT_SERVICE}
                                typeRBI={"data"}
                            />
                        </BaseContainer>
                    </div>
                    <div className="flex w-full justify-between align-middle my-3">
                        <ButtonComponent
                            type={"submit"}
                            onClick={() => handleBack()}
                            icon={
                                <LeftOutlined
                                    style={{
                                        color: "#fff",
                                        fontSize: 24,
                                        justifyItems: "center",
                                    }}
                                />
                            }
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
            <ModalCustom
                isOpen={modalConfirm}
                handleCancel={handleCancelModalConfirm}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-end gap-5 p-4">
                        <ButtonComponent onClick={handleCancelModalConfirm} type="default">
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent type="submit" onClick={handleSave}>
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirm
                    data={sendBody}
                    tabData={tabData}
                    listDataAttachment={listDataAttachment}
                    listDataAppHierDetail={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                />
            </ModalCustom>

            {/* Modal Back*/}
            <ModalConfirm
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
                width={600}
            >
                <div className="flex justify-center mt-5 gap-[20px]">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className="text-[18px] font-bold">
                        Are you sure you want to back?
                    </p>
                </div>
            </ModalConfirm>
        </LayoutMenu>
    );
};

export default ListFormCaPaymentChannel;
