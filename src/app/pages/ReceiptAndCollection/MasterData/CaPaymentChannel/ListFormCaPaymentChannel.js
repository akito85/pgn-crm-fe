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
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
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
    saveDraftCaPaymentChannel,
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

    const [loadingSave, setLoadingSave] = useState(false);
    const [current, setCurrent] = useState(0);
    const [sendBody, setSendBody] = useState({});

    const [steps, setSteps] = useState([
        {
            title: "Payment Channel Mapping",
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
        { title: "Approval", value: "Approval", paramValue: ["apphierId"] },
        { title: "Attachment", value: "Attachment" },
    ]);

    const next = () => {
        const fieldsToValidate = steps[current]?.paramValue;
        if (fieldsToValidate) {
            form
                .validateFields(fieldsToValidate)
                .then(() => {
                    if (current < steps.length - 1) {
                        setCurrent(current + 1);
                    }
                })
                .catch((error) => {
                    handleError({
                        values: form.getFieldsValue(),
                        errorFields: error.errorFields,
                    });
                });
        } else {
            if (current < steps.length - 1) {
                setCurrent(current + 1);
            }
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSaveDraft = async () => {
        setLoadingSave(true);
        const formValue = form.getFieldsValue();
        const body = {
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

        dispatch(saveDraftCaPaymentChannel(body))
            .unwrap()
            .then(async (data) => {
                let id = data.id;
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
                setLoadingSave(false);
                dispatch(
                    showModalSuccess({
                        title: "Successfull",
                        description: `Your data has been saved as draft`,
                        return: true,
                    })
                );
            })
            .catch((error) => {
                setLoadingSave(false);
            });
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
        setSteps((prevState) => {
            const res = prevState.map((item) => {
                if (!item.paramValue || item.paramValue.length < 0) {
                    return {
                        ...item,
                    };
                }
                const errorBadge = errorFields.reduce(
                    (current, next) =>
                        item.paramValue.includes(next.name[0]) ? current + 1 : current,
                    0
                );
                return {
                    ...item,
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
        breadcrumbName: "System Setup",
      },
      {
        path: "",
        breadcrumbName: "Master Data",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_PAYMENT_CHANNEL,
        breadcrumbName: "Payment Channel Mapping",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_CA_PAYMENT_CHANNEL,
        breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
      },
    ];

    //kirim body
    const handleSave = async () => {
        setLoadingSave(true);
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
                    setLoadingSave(false);
                    handleCancelModalConfirm();
                    form.resetFields();
                    setSelectedHierarchy("");
                    setListDataAttachment([]);
                    dispatch(showModalSuccess(successMessageUpdate));
                    handleClear();
                })
                .catch((error) => {
                    setLoadingSave(false);
                    setModalConfirm(false);
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
                    setLoadingSave(false);
                    handleCancelModalConfirm();
                    handleClear();
                    dispatch(showModalSuccess(successMessageCreate));
                })
                .catch((error) => {
                    setLoadingSave(false);
                    setModalConfirm(false);
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
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loadingForm}>
                <FormStepper steps={steps} current={current} />
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                    onFinishFailed={handleError}
                >
                    <div
                        style={{
                            display: current !== 0 ? "none" : undefined,
                        }}
                    >
                        <CaPaymentChannelForm
                            form={form}
                            dataCollectionAgentList={dataCollectionAgentList}
                            dataPaymentChannelList={dataPaymentChannelList}
                            dataPartnerList={dataPartnerList}
                            dataTypeList={dataTypeList}
                        />
                    </div>
                    <div
                        style={{
                            display: current !== 1 ? "none" : undefined,
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
                            display: current !== 2 ? "none" : undefined,
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
                    <FormFooter
                        current={current}
                        totalSteps={steps.length}
                        onPrev={prev}
                        onNext={next}
                        onCancel={handleBack}
                        onClear={handleClear}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={() => form.submit()}
                        type={type}
                    />
                </Form>
            </Spin>
            <ModalCustom
                isOpen={modalConfirm}
                handleCancel={handleCancelModalConfirm}
                header={"Confirmation"}
                width={1000}
                type={"confirmation"}
                footer={
                    <div className="w-full flex justify-between gap-5 p-4 items-center">
                        <ButtonComponent
                            onClick={handleCancelModalConfirm}
                            type="default"
                            label="Cancel"
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            type="submit"
                            onClick={handleSave}
                            loading={loadingSave}
                            label="Confirm"
                        >
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <ContentModalConfirm
                    data={sendBody}
                    tabData={steps}
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
        </>
    );
};


export default ListFormCaPaymentChannel;
