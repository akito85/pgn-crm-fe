import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import moment from "moment";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import EFakturSectionForm from "./EFakturSectionForm ";
import ModalBack from "../../../../../components/Modal/ModalBack";
import ConfirmationLayout from "./ConfirmationLayout";
import { dateFormatting } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import CardContainer from "../../../../../components/CardContainer";
import {
  createEFaktur,
  updateEFaktur,
  getDetailEFaktur,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  getListCategory,
} from "../../../../../redux/slices/rating_billing_invoice/efakturSlice";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const EFakturForm = ({ type }) => {
  // Selector
  const {
    loading,
    dataListAppHierDetail,
    dataListAppHierId,
    dataDetail,
  } = useSelector((state) => state.efaktur);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id, efakturNumber } = location?.state || {};

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [flag, setFlag] = useState(1);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [valuePage, setValuePage] = useState("Create-Faktur");
  const [tabPages, setTabPages] = useState([
    {
      value: "Create-Faktur",
      paramValue: [
        "fakturType",
        "fakturDate",
        "taxPeriod",
        "fakturCode",
        "taxYear",
        "country",
        "description",
        "customerName",
        "email",
        "taxIdentificationNumber",
        "npwp",
        "customerAddress",
        "downPayment",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const isLoading = loading || loadingForm;

  // Use Effect
  useEffect(() => {
    dispatch(getListApprovalHierarchy());
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailEFaktur(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalHierarchyDetail({ id: selectedHierarchy }));
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
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  // Functional Set Data Update
  const dataUpdate = useCallback(
    (dataDetail) => {
      const apphierId = dataDetail?.apphierId || 1;
      const obj = {
        fakturType: dataDetail?.fakturType,
        fakturDate: moment(dataDetail?.fakturDate),
        taxPeriod: dataDetail?.taxPeriod,
        fakturCode: dataDetail?.fakturCode,
        taxYear: dataDetail?.taxYear,
        country: dataDetail?.country,
        description: dataDetail?.description,
        customerName: dataDetail?.customerName,
        email: dataDetail?.email,
        taxIdentificationNumber: dataDetail?.taxIdentificationNumber,
        npwp: dataDetail?.npwp,
        customerAddress: dataDetail?.customerAddress,
        downPayment: dataDetail?.downPayment,
        apphierId: apphierId,
      };

      form.setFieldsValue(obj);
      setSelectedHierarchy(apphierId);
      setListDataAttachment(
        (dataDetail?.mAttachmentLists || []).map((attachData) => ({
          ...attachData,
          dataType: "exist",
        }))
      );
      setListDataDetail(
        (dataDetail?.detailTransaction || []).map((data, index) => ({
          ...data,
          key: index + 1,
        }))
      );
    },
    [form]
  );

  useEffect(() => {
    if (id && type === "update" && dataDetail?.id === id) {
      dataUpdate(dataDetail);
    }
  }, [id, type, dataDetail, dataUpdate]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Invoice",
    },
    {
      path: INVOICE_ROUTES.EFAKTUR_VIEW,
      breadcrumbName: "Manajemen E-Faktur",
    },
    {
      path:
        type === "create"
          ? INVOICE_ROUTES.EFAKTUR_CREATE
          : INVOICE_ROUTES.EFAKTUR_UPDATE,
      breadcrumbName:
        type === "create" ? "Create E-Faktur" : "Update E-Faktur",
    },
  ];

  // Handle Change Radio Tabs
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  // Handle Clear
  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setAppHierDataDetail([]);
      setAppHierOptions([]);
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setListDataDetail([]);
      setBodyData({});
    } else {
      dataUpdate(dataDetail);
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    setBodyError({});
  };

  const handleMandatory = (
    setListSectionInfo = () => {},
    listDataAttachment,
    errorFields
  ) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0
              )
            : listDataAttachment.length < 1
            ? 1
            : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  // Handle Save Form
  const handleSave = (formValue) => {
    let errorBody = {};
    if (listDataAttachment.length === 0) {
      handleMandatory(setTabPages, listDataAttachment);
    } else {
      handleMandatory(setTabPages, listDataAttachment);

      if (listDataDetail.length === 0) {
        errorBody = {
          title: "Failed",
          description: "Detail Transaction is mandatory. Please insert data.",
        };
        setBodyError(errorBody);
        setModalError(true);
      } else {
        setBodyData({
          ...formValue,
        });
        setModalConfirm(true);
        setTabPages([
          {
            value: "Create-Faktur",
            paramValue: [
              "fakturType",
              "fakturDate",
              "taxPeriod",
              "fakturCode",
              "taxYear",
              "country",
              "description",
              "customerName",
              "email",
              "taxIdentificationNumber",
              "npwp",
              "customerAddress",
              "downPayment",
            ],
          },
          { value: "Approval", paramValue: ["apphierId"] },
          { value: "Attachment" },
        ]);
      }
    }
  };

  // Handle Confirm
  const handleConfirm = () => {
    setModalConfirm(false);
    const modifiedArray = listDataDetail?.map((obj) => {
      const { key, ...rest } = obj;
      return rest;
    });

    const body = {
      ...bodyData,
      id: type === "update" ? id : undefined,
      efakturNumber: type === "update" ? efakturNumber : null,
      detailTransaction: modifiedArray,
      submit: flag === 1 ? false : true,
      fakturDate: moment(bodyData?.fakturDate).format(
        dateFormatting.dateFormal
      ),
    };

    // Replace undefined to null
    const bodyValue = {};
    for (const key in body) {
      if (body.hasOwnProperty(key)) {
        if (typeof body[key] === "undefined") {
          bodyValue[key] = null;
        } else {
          bodyValue[key] = body[key];
        }
      }
    }

    if (type === "create") {
      dispatch(createEFaktur({ body: bodyValue }))
        .unwrap()
        .then(async (dataForm) => {
          const idEFaktur = dataForm.id;
          setLoadingForm(true);
          for (let i = 0; i < listDataAttachment.length; i++) {
            const element = listDataAttachment[i];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/invoice/efaktur/uploadAttachment/${idEFaktur}`,
              body
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          handleClear();
          navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
        })
        .catch((error) => {
          console.log(error, "error");
          if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
            const message =
              error.response?.data?.message || error.message || error.toString();
            setBodyError({ message });
            setModalError(true);
          }
        });
    } else {
      dispatch(updateEFaktur({ body: bodyValue }))
        .unwrap()
        .then(async (data) => {
          setLoadingForm(true);
          const idEFaktur = data.id;
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let i = 0; i < filterDataAttach.length; i++) {
            const element = filterDataAttach[i];
            const body = {
              files: element.file,
              category: element.fileCategoryId,
            };
            await ratingBillingHttpService.uploadAttachment(
              `/v1/dbs/api/invoice/efaktur/uploadAttachment/${idEFaktur}`,
              body
            );
          }
          setLoadingForm(false);
          setModalConfirm(false);
          navigate(INVOICE_ROUTES.EFAKTUR_VIEW);
        })
        .catch((error) => {
          if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
            const message =
              error.response?.data?.message || error.message || error.toString();
            setBodyError({ message });
            setModalError(true);
          }
          setModalConfirm(false);
        });
    }
  };

  // Handle Error Tab Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setTabPages, listDataAttachment, errorFields);
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        <RadioTabs
          data={tabPages}
          onChange={onChange}
          currentPosition={valuePage}
        />

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <div
            className={`${valuePage !== "Create-Faktur" ? "hidden" : ""}`}
          >
            <EFakturSectionForm
              type={type}
              form={form}
              listDataDetail={listDataDetail}
              setListDataDetail={setListDataDetail}
              efakturId={id}
            />
          </div>

          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <CardContainer subHeader={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </CardContainer>
          </div>

          <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
            <CardContainer subHeader={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="efaktur"
                service={ratingBillingHttpService}
                configApplication={configApp.INVOICE_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </CardContainer>
          </div>

          <div className="mt-[10px] flex">
            <ButtonComponent type={"submit"} onClick={() => setModalBack(true)}>
              Back
            </ButtonComponent>

            <div className={"w-full flex justify-end gap-1"}>
              <Form.Item>
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={
                        type === "update"
                          ? `IconButtonReset`
                          : `IconButtonClear`
                      }
                      width={20}
                    />
                  }
                  type="submit"
                  onClick={() => {
                    handleClear();
                  }}
                >
                  {type === "update" ? "Reset" : "Clear"}
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  onClick={() => setFlag(1)}
                >
                  Save as Draft
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent
                  type="submit"
                  htmlType={"submit"}
                  onClick={() => setFlag(2)}
                >
                  Save & Submit
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* Modal Confirmation */}
        <ConfirmationLayout
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          data={bodyData}
          listDataAppHierDetail={appHierDataDetail}
          apiApproval={dataListAppHierId}
          listDataAttachment={listDataAttachment}
          listDataDetail={listDataDetail}
          selectedHierarchy={selectedHierarchy}
          dataOption={appHierOptions}
        />

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              flag === 1 ? "created" : "submitted"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default EFakturForm;