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
import {
  getTypeDDL,
  createSetting,
  createValidasiSetting,
  getAllApprovalList,
  getDetailSetting,
  getListApprovalById,
  getListCategory,
  updateSetting,
  getPartnerListByCa,
  getCollectionAgentList,
  getPaymentChannelListByCa
} from "../../../../../redux/slices/receipt_collection/setting";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import SettingsForm from "./SettingsForm";
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
import { FormStepper, FormFooter } from "../../../../../components/FormStepNavigation";
import { saveDraftSetting } from "../../../../../redux/slices/receipt_collection/setting";

const ListFormSettings = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataType,
    dataPartnerList,
    dataCollectionAgentList,
    dataPaymentChannelList
  } = useSelector((state) => state.receiptSetting);

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
      dispatch(getDetailSetting(id));
    }
  }, [dispatch, id, type]);




  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getTypeDDL());
    // dispatch(getPartnerList());
    dispatch(getCollectionAgentList());
    // dispatch(getPaymentChannelList());
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
        id: data_detail?.settings.id,
        dateStart: data_detail?.settings?.dateStart ?? "",
        dateEnd: data_detail?.settings?.dateEnd ?? "",
        hourStart: data_detail?.settings?.hourStart ?? "",
        hourEnd: data_detail?.settings?.hourEnd ?? "",
        minuteStart: data_detail?.settings?.minuteStart ?? "",
        minuteEnd: data_detail?.settings?.minuteEnd ?? "",
        caCode: data_detail?.settings?.caCode ?? "",
        partnerCode: data_detail?.settings?.partnerCode ?? "",
        ciCode: data_detail?.settings?.ciCode ?? "",
        type: data_detail?.settings?.type,
        apphierId: data_detail?.settings?.appHierId,
      });

      setSelectedHierarchy(data_detail?.settings?.appHierId);

      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, id]);

  const [tabData, setTabData] = useState([
    {
      title: "Payment Channel Configuration",
      value: "Setting",
      paramValue: [
        "dateStart",
        "dateEnd",
        "hourStart",
        "hourEnd",
        "minuteStart",
        "minuteEnd",
        "caCode",
        "partnerCode",
        "ciCode",
        "type",
      ],
    },
    { title: "Approval", value: "Approval", paramValue: ["apphierId"] },
    { title: "Attachment", value: "Attachment" },
  ]);

  const [current, setCurrent] = useState(0);
  const [loadingSave, setLoadingSave] = useState(false);

  const next = async () => {
    try {
      await form.validateFields(tabData[current].paramValue);
      setCurrent(current + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [sendBody, setSendBody] = useState();

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
      dateStart: formValue.dateStart,
      dateEnd: formValue.dateEnd,
      hourStart: formValue.hourStart,
      hourEnd: formValue.hourEnd,
      minuteStart: formValue.minuteStart,
      minuteEnd: formValue.minuteEnd,
      caCode: formValue.caCode,
      partnerCode: formValue.partnerCode,
      ciCode: formValue.ciCode,
      type: formValue.type,
      apphierId: formValue.apphierId,
    };

    setSendBody(dataValue);
    const bodyValidasiUpdate = {
      ...dataValue,
      id: data_detail?.settings?.id,
    };
    if (type !== "update") {
      dispatch(createValidasiSetting(dataValue))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
        });
    } else {
      dispatch(createValidasiSetting(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
          setSendBody(bodyValidasiUpdate)
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

  const handleSaveDraft = () => {
    const formValue = form.getFieldsValue();
    const dataValue = {
      dateStart: formValue.dateStart,
      dateEnd: formValue.dateEnd,
      hourStart: formValue.hourStart,
      hourEnd: formValue.hourEnd,
      minuteStart: formValue.minuteStart,
      minuteEnd: formValue.minuteEnd,
      caCode: formValue.caCode,
      partnerCode: formValue.partnerCode,
      ciCode: formValue.ciCode,
      type: formValue.type,
      apphierId: formValue.apphierId,
      id: data_detail?.settings?.id,
    };
    dispatch(saveDraftSetting(dataValue))
      .unwrap()
      .then(() => {
        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS);
      });
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setCurrent(0);
    } else {
      dispatch(getDetailSetting(id));
      setCurrent(0);
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
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_SETTINGS,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];


  //kriim bodyy
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
      dispatch(updateSetting(sendBody))
        .unwrap()
        .then(async () => {
          const id = data_detail?.settings?.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.settings?.id,
              files: element.file,
              category: "RECEIPT_SETTING",
              fileCategoryId: element.fileCategoryId,
            };
            const response = await receiptCollectionHttpService.uploadImage(
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
          setLoadingSave(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
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
      dispatch(createSetting(sendBody))
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
              category: "RECEIPT_SETTING",
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          handleCancelModalConfirm();
          handleClear();
          dispatch(showModalSuccess(successMessageCreate));
          setLoadingSave(false);
        })
        .catch((error) => {
          setLoadingSave(false);
          setModalConfirm(false);
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
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
        <FormStepper
          current={current}
          steps={tabData}
          onPrev={prev}
          onNext={next}
        />
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
            <SettingsForm
              dataType={dataType}
              form={form}
              dataPartnerList={dataPartnerList}
              dataCollectionAgentList={dataCollectionAgentList}
              dataPaymentChannelList={dataPaymentChannelList}
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
                typeSelector="receiptSetting"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </BaseContainer>
          </div>
          <FormFooter
            current={current}
            totalSteps={tabData.length}
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
          <div className="w-full flex justify-end gap-3 p-4">
            <ButtonComponent
              onClick={handleCancelModalConfirm}
              className="!border-[#0075BF] !text-[#0075BF]"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={handleSave}
              isPrimary
              loading={loadingSave}
            >
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
    </>
  );
};

export default ListFormSettings;
