import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Form } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { INVOICE_ROUTES } from "../../../../../routes/invoice/invoice_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import ModalBack from "../../../../../components/Modal/ModalBack";
import BaseContainer from "../../../../../components/BaseContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import { configApp } from "../../../../../constants/configApp";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AdjustmentInvoiceSectionForm from "./Form/AdjustmentInvoiceSectionForm";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { getListCategory } from "../../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";

const AdjustmentInvoiceForm = ({ type }) => {
  // Selector - Placeholder for Redux state
  const loading = false;

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const location = useLocation();
  const { id, invoiceNumber } = location?.state || {};

  // State
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [flag, setFlag] = useState(1);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [valuePage, setValuePage] = useState("Create Adjustment Invoice");
  const [tabPages, setTabPages] = useState([
    {
      value: "Create Adjustment Invoice",
      paramValue: [
        "accountNumber",
        "billingCycle",
        "billingPeriod",
        "invoiceNumber",
        "transactionDate",
        "documentDate",
        "termOfPayment",
        "adjustmentReason",
        "remark",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const isLoading = loading || loadingForm;

  // Use Effect - Placeholder for API calls
  useEffect(() => {
    // TODO: dispatch(getSelectTOP())
    // TODO: dispatch(getListApprovalHierarchy())
  }, [dispatch]);

  useEffect(() => {
    if (id && type === "update") {
      // TODO: dispatch(getDetailAdjustmentInvoice(id))
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      // TODO: dispatch(getListApprovalHierarchyDetail({ id: selectedHierarchy }))
    }
  }, [dispatch, selectedHierarchy]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: INVOICE_ROUTES.ADJUSTMENT_INVOICE_VIEW,
      breadcrumbName: "Adjustment Invoice",
    },
    {
      path:
        type === "create"
          ? INVOICE_ROUTES.ADJUSTMENT_INVOICE_CREATE
          : INVOICE_ROUTES.ADJUSTMENT_INVOICE_CREATE,
      breadcrumbName:
        type === "create"
          ? "Generate Adjustment Invoice"
          : "Update Adjustment Invoice",
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
      setBodyData({});
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave(bodyData);
    setModalError(false);
    setBodyError({});
  };

  // Handle Save Form
  const handleSave = (formValue) => {
    let errorBody = {};
    if (listDataAttachment.length === 0) {
      handleMandatory(setTabPages, listDataAttachment);
    } else {
      handleMandatory(setTabPages, listDataAttachment);
      setBodyData({
        ...formValue,
      });

      // TODO: Implement save logic
      console.log("Form values:", formValue);
      console.log("Attachments:", listDataAttachment);
    }
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
            className={`${
              valuePage !== "Create Adjustment Invoice" ? "hidden" : ""
            }`}
          >
            <AdjustmentInvoiceSectionForm type={type} form={form} />
          </div>

          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
            <BaseContainer header={"Attachment Information"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getListCategory}
                typeSelector="adjustmentBilling"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIData}
                typeRBI={"data"}
                mandatory={true}
              />
            </BaseContainer>
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
                  {type === "update" ? "Reset" : "Clear Data"}
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
                  Next
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>

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

export default AdjustmentInvoiceForm;
