import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../../components/BaseContainer";
import { Form, Spin } from "antd";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { FormStepper, FormFooter } from "../../../../../../components/FormStepNavigation";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { useCallback, useEffect, useState } from "react";
import SVGIcon from "../../../../../../assets/Icon/index";
import GeneralTempalteAttachment from "../Form/GeneralTemplateAttachment";
import GeneralTempalteCreateUpdateForm from "../Form/GeneralTemplateCreateUpdateForm";
import moment from "moment";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { handleDate, handleMandatory } from "../Utils/Utils";
import GeneralTemplateConfirmation from "../Form/GeneralTemplateConfirmation";
import {
  createGeneralTemplate,
  getApprovalList,
  getApprovalListDetail,
  getDetailDraftGeneralTemplate,
  getDetailGeneralTemplate,
  getGeneralTemplateType,
  updateGeneralTemplate,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import {
  showModalSuccess,
  validateCreateUpdate,
} from "../../../../../../redux/slices/general_slice";
import { dateFormatting } from "../../../../../../utils";

const CreateAndUpdateGeneralTemplate = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierId,
    dataListAppHierDetail,
    data_template_type,
    data_detail,
    data_detail_draft,
  } = useSelector((state) => state.general_template);

  //declare
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const id = location.state?.id || undefined;
  const statusType = location.state?.status || undefined;

  // Stepper state
  const [current, setCurrent] = useState(0);

  const steps = [
    { title: "CREATE", value: "General Template" },
    { title: "APPROVAL", value: "Approval" },
    { title: "ATTACHMENT", value: "Attachment" },
  ];

  //state data
  const [tabData, setTabData] = useState([
    {
      value: "General Template",
      paramValue: [
        "name",
        "templateType",
        "startDate",
        "endDate",
        "description",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(steps[0].value);

  const [dataListDetailApproval, setDataListDetailApproval] = useState([]);
  const [dataApprovalId, setDataApprovalId] = useState();
  const [dataApproval, setDataApproval] = useState([]);

  const [typeSubmit, setTypeSubmit] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});

  //state attachment
  const [dataAttachment, setDataAttachment] = useState([]);

  //general template
  const [fileList, setFileList] = useState([]);
  const [startDate, setStartDate] = useState();

  //state retry
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //modal
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);

  // Update valuePage when current changes
  useEffect(() => {
    setValuePage(steps[current].value);
  }, [current]);

  // Stepper navigation functions
  const next = () => {
    const fieldsToValidate = tabData[current]?.paramValue;
    if (fieldsToValidate) {
      form
        .validateFields(fieldsToValidate)
        .then(() => {
          if (current < steps.length - 1) {
            setCurrent(current + 1);
          }
        })
        .catch((error) => {
          console.log("Validation failed:", error);
        });
    } else {
      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  //handle
  const handleFormUpdateApprovalChecked = useCallback(
    (data_detail) => {
      form.setFieldsValue({
        apphierId: data_detail.approvalHierarchy,
      });
      setDataApprovalId(data_detail.approvalHierarchy);
    },
    [form]
  );

  const handleFormSetUpdate = useCallback(
    (data_detail, data_template_type) => {
      setStartDate(moment(data_detail.startDate));
      form.setFieldsValue({
        ...data_detail,
        templateType:
          data_template_type
            ?.filter((a) => a.value === data_detail.type)
            ?.find((item) => item.value === data_detail.type)?.id || null,
        name: data_detail.templateName,
        startDate: data_detail.startDate ? moment(data_detail.startDate) : null,
        endDate: data_detail.endDate ? moment(data_detail.endDate) : null,
      });

      if (data_detail.fileTemplate) {
        setFileList((prevState) => {
          const res = {
            ...data_detail?.fileTemplate,
            name: data_detail?.fileTemplate?.fileName,
            fileSize: bytesConverter(data_detail?.fileTemplate?.size || 0),
            percent: 100,
            dataType: "exist",
          };
          return [res];
        });
      }

      setDataAttachment([
        ...(data_detail?.attachment || []).map((item) => {
          return {
            ...item,
            createdDate: moment(item.createdDate).format(dateFormatting.date),
            uploadBy: item.createdBy,
            uploadDate: moment(item.createdDate).format(dateFormatting.date),
            dataType: "exist",
          };
        }),
      ]);
    },
    [form]
  );

  // useEffect start
  useEffect(() => {
    dispatch(getGeneralTemplateType());
    dispatch(getApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (type === "update" && id && statusType) {
      dispatch(getDetailGeneralTemplate(id));
      dispatch(getDetailDraftGeneralTemplate(id));
    }
  }, [dispatch, type, id, statusType]);

  useEffect(() => {
    if (
      type === "update" &&
      data_template_type &&
      data_template_type.length > 0 &&
      id
    ) {
      if (
        data_detail?.status === "ACTIVE" &&
        data_detail?.statusApproval === "DRAFT" &&
        data_detail_draft?.templateId === id
      ) {
        const body = {
          ...data_detail_draft,
          type: data_detail_draft?.templateType?.name,
          attachment: data_detail?.attachment,
        };
        handleFormSetUpdate(body, data_template_type, id);
      } else {
        if (data_detail?.templateId === id) {
          handleFormSetUpdate(data_detail, data_template_type, id);
        }
      }
    }
  }, [
    data_detail,
    data_detail_draft,
    data_template_type,
    type,
    id,
    handleFormSetUpdate,
  ]);

  useEffect(() => {
    //ddl approval for update had hierarchy or not
    if (
      dataListAppHierId &&
      dataListAppHierId.length > 0 &&
      data_detail &&
      type === "update"
    ) {
      if (
        data_detail?.status === "ACTIVE" &&
        data_detail?.statusApproval === "DRAFT" &&
        data_detail_draft?.templateId === id
      ) {
        const body = {
          ...data_detail_draft,
          type: data_detail_draft?.templateType?.name,
          attachment: data_detail?.attachment,
          fileTemplate: data_detail?.fileTemplate,
        };
        handleFormUpdateApprovalChecked(body);
      } else {
        if (data_detail?.templateId === id) {
          handleFormUpdateApprovalChecked(data_detail);
        }
      }
    }
  }, [
    data_detail,
    dataListAppHierId,
    data_detail_draft,
    type,
    id,
    handleFormUpdateApprovalChecked,
  ]);

  useEffect(() => {
    //ddl approval
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));

      setDataApproval(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    //get table
    if (dataApprovalId && dataApprovalId !== undefined) {
      dispatch(getApprovalListDetail({ id: dataApprovalId }));
    }
  }, [dispatch, dataApprovalId]);

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
      setDataListDetailApproval(data);
    } else {
      setDataListDetailApproval([]);
    }
  }, [dataListAppHierDetail]);

  //general template form
  const handleStartDate = (e) => {
    form.resetFields(["endDate"]);
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/rbi/invoice/template/validate-create"
        : `/v1/dbs/api/rbi/invoice/template/validate-update/${id}`;

    try {
      await dispatch(
        validateCreateUpdate({
          body: formValue,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const onFinish = async (e) => {
    if (dataAttachment.length === 0 || fileList.length === 0) {
      handleMandatory(setTabData, dataAttachment, fileList);
    } else {
      handleMandatory(setTabData, dataAttachment, fileList);

      const bodyValidation = {
        ...e,
        templateName: e.name,
        approvalHierarchy: e.apphierId,
        startDate: moment(e.startDate).format("DD MMM YYYY HH:mm:ss"),
        endDate: e?.endDate
          ? moment(e.endDate).format("DD MMM YYYY HH:mm:ss")
          : "",
        description: e?.description ? e?.description : "",
        isSubmit: typeSubmit,
      };
      delete bodyValidation.name;
      delete bodyValidation.uploadTemplate;
      delete bodyValidation.apphierId;

      const isDataValid = await checkDataValidity(bodyValidation);

      if (isDataValid) {
        const body = {
          ...e,
          description: e.description || null,
          startDate: handleDate(e.startDate),
          endDate: handleDate(e.endDate),
        };
        setDataConfirm(body);
        setModalConfirm(true);
      } else {
        setModalConfirm(false);
      }
    }
  };

  const handleDescriptionSuccess = useCallback(
    (data, type) => {
      let text = "";
      switch (type) {
        case "create":
          text = `Your data has been ${
            data.isSubmit ? "submitted" : "created"
          }.`;
          break;
        case "update":
          text = `Your data has been ${
            data.isSubmit ? "submitted" : "updated"
          }.`;
          break;
        default:
          break;
      }
      const successMessage = {
        title: "Successful",
        description: text,
      };
      dispatch(showModalSuccess(successMessage));
    },
    [dispatch]
  );

  const handleSendDataFile = async (data) => {
    if (fileList[0]?.dataType !== "exist") {
      const body_upload = {
        files: fileList[0].file,
        refId: data.templateId,
      };
      await ratingBillingHttpService.uploadAttachment(
        `/v1/dbs/api/rbi/invoice/template/upload-file`,
        body_upload
      );
    }
    const filterDataAttach = dataAttachment.filter(
      (item) => item.dataType !== "exist"
    );
    for (let icon = 0; icon < filterDataAttach.length; icon++) {
      const element = filterDataAttach[icon];
      const body = {
        files: element.file,
        refId: data.templateId,
        categoryId: element.fileCategoryId,
      };
      await ratingBillingHttpService.uploadAttachment(
        `/v1/dbs/api/rbi/invoice/template/upload-attachment`,
        body
      );
    }
  };

  const handleSendData = (data) => {
    setLoadingSave(true);
    const body = {
      ...data,
      templateName: data.name,
      approvalHierarchy: data.apphierId,
      startDate: moment(data.startDate).format("DD MMM YYYY HH:mm:ss"),
      endDate: data?.endDate
        ? moment(data.endDate).format("DD MMM YYYY HH:mm:ss")
        : "",
      description: data?.description ? data?.description : "",
      isSubmit: typeSubmit,
    };
    delete body.name;
    delete body.uploadTemplate;
    delete body.apphierId;

    dispatch(
      type === "update"
        ? updateGeneralTemplate({ body, id })
        : createGeneralTemplate(body)
    )
      .unwrap()
      .then(async (data) => {
        setLoadingForm(true);
        try {
          await handleSendDataFile(data);
          handleDescriptionSuccess(body, type);
          handleClearOrReset(type);
        } catch (error) {
          const message =
            error?.response?.data?.data ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to upload file";
          setBodyError({ message, value: data });
          setModalError(true);
          setLoadingForm(false);
        }
        setLoadingSave(false);
        setModalConfirm(false);
      })
      .catch((error) => {
        setLoadingSave(false);
        setModalConfirm(false);
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: data });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => {
    handleSendData(bodyError.value);
    setModalError(false);
  };

  const handleErrorSubmit = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabData, dataAttachment, fileList, errorFields);
    
    // Set error badges on tabs
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

  const handleClearOrReset = (type_action = "create") => {
    if (type_action === "update") {
      dispatch(getDetailGeneralTemplate(id));
      dispatch(getDetailDraftGeneralTemplate(id));
    } else {
      form.resetFields();
      setFileList([]);
      setDataApprovalId();
      setDataListDetailApproval([]);
      setDataAttachment([]);
      setTypeSubmit(false);
      setStartDate(undefined);
      setTabData([
        {
          value: "General Template",
          paramValue: [
            "name",
            "templateType",
            "startDate",
            "endDate",
            "description",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
    }
    setCurrent(0);
    setLoadingForm(false);
  };

  // Handle Back button
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
    handleClearOrReset(type);
  };

  const handleSaveDraft = () => {
    setTypeSubmit(false);
    form.submit();
  };

  const handleSaveSubmit = () => {
    setTypeSubmit(true);
    form.submit();
  };

  // routes
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
      path: RBI_ROUTES.GENEREAL_TEMPLATE_VIEW,
      breadcrumbName: "General Template",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "create" ? "Create" : "Update"
      } General Template`,
    },
  ];

  return (
    <>
      <Spin spinning={loading || loadingForm}>
        <BreadCrumb routes={routes} />
        
        <FormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={next}
        />

        <Form
          id={"form"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
          onFinishFailed={handleErrorSubmit}
          scrollToFirstError={true}
        >
          <div
            style={{
              display: valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
            <GeneralTempalteCreateUpdateForm
              type={type}
              statusType={statusType}
              optionTemplateType={data_template_type}
              fileList={fileList}
              startDate={startDate}
              handleStartDate={handleStartDate}
              setFileList={setFileList}
              dispatch={dispatch}
            />
          </div>
          
          <div
            style={{
              display: valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={dataListDetailApproval}
                dataOption={dataApproval}
                selectedHierarchy={dataApprovalId}
                updateSelectedHierarchy={setDataApprovalId}
              />
            </BaseContainer>
          </div>
          
          <div
            style={{
              display: valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <GeneralTempalteAttachment
                dispatch={dispatch}
                dataAttachment={dataAttachment}
                setDataAttachment={setDataAttachment}
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
            onSubmit={handleSaveSubmit}
            type={type}
            loading={loadingSave}
          />
        </Form>

        {/* Modal Retry */}
        {modalError ? (
          <ModalError
            isOpen={modalError}
            handleOk={handleRetry}
            handleCancel={() => {
              setModalError(false);
            }}
            customText={"Try Again"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">
                {`Your data was not ${
                  type === "create" ? "Created." : "Updated."
                } ${bodyError?.message}`}
              </p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}

        {/* Modal Back*/}
        {modalBack ? (
          <ModalConfirm
            isOpen={modalBack}
            handleCancel={() => setModalBack(false)}
            handleOk={() => navigate(-1)}
            width={400}
          >
            <div className="flex justify-center mt-5 gap-[20px]">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
              <p className="text-[18px] font-bold">
                Are you sure you want to back?
              </p>
            </div>
          </ModalConfirm>
        ) : null}

        {/* Modal Confirm */}
        {modalConfirm ? (
          <ModalCustom
            isOpen={modalConfirm}
            type={"confirmation"}
            header={`Confirmation`}
            width={900}
            handleCancel={() => {
              setModalConfirm(false);
              setTypeSubmit(false);
            }}
            footer={
              <div className="w-full flex justify-end gap-5">
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    setModalConfirm(false);
                    setTypeSubmit(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  onClick={() => {
                    handleSendData(dataConfirm);
                  }}
                  loading={loadingSave}
                  disabled={loading || loadingForm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <GeneralTemplateConfirmation
              dataConfirm={dataConfirm}
              dataAttachment={dataAttachment}
              dataTemplateFile={fileList}
              dataApproval={dataApproval}
              dataApprovalId={dataApprovalId}
              dataApprovalTable={dataListDetailApproval}
              listApproval={dataListAppHierId}
              dataTemplateType={data_template_type}
            />
          </ModalCustom>
        ) : null}
      </Spin>
    </>
  );
};

export default CreateAndUpdateGeneralTemplate;