import { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Select, Spin, Steps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import SVGIcon from "../../../../../../../assets/Icon/index";
import ApprovalSectionForm from "../../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import Attachment from "../../ServiceAgreement/CreateServiceAgreement/Attachment";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalBack from "../../../../../../../components/Modal/ModalBack";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";
import { dateFormatting } from "../../../../../../../utils";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import {
  createWarrantyTerm,
  updateWarrantyTerm,
  getDetailWarrantyTerm,
  getListAppHierWarranty,
  getListAppHierDetailWarranty,
  getListAttachmentCategory,
} from "../../../../../../../redux/slices/account_management/detailAccount/warrantySlice";


import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import HeaderDetail from "../../../HeaderDetail";
import NxBreadCrumb from "../../../../../../../components/Nx/NxBreadCrumb";
import ContentModalConfirm from "./ContentModalConfirm";


const routes = (item) => [
  { path: "", breadcrumbName: "Account Management" },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
    breadcrumbName: "Account - Standard",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
    breadcrumbName: "Detail Account",
    state: { idAccount: item.idAccount },
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
    breadcrumbName: "Detail Service Agreement",
    state: {
      idSA: item.idSA,
      idAccount: item.idAccount,
      idCustomer: item.idCustomer,
      type: item.type,
    },
  },
  {
    path: "",
    breadcrumbName:
      item.typeForm === "create" ? "Create Warranty Term" : "Update Warranty Term",
  },
];

const STEP_0_FIELDS = [
  "docNumber",
  "docDate",
  "startDate",
  "endDate",
  "currency",
  "amount",
  "description",
];

// ─── Warranty Information Step ────────────────────────────────────────────────
const WarrantyInformationStep = ({ currency, startDate, description }) => (
  <NxBaseContainer border header="WARRANTY TERM INFORMATION">
    <div className="w-full grid grid-cols-3 gap-4">
      <Form.Item
        label="Document Number"
        name="docNumber"
        rules={[{ required: true, message: "Document Number is required" }]}
      >
        <Input placeholder="Enter Document Number" />
      </Form.Item>

      <Form.Item
        label="Document Date"
        name="docDate"
        rules={[{ required: true, message: "Document Date is required" }]}
      >
        <DatePicker className="w-full" format="DD MMM YYYY" />
      </Form.Item>

      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Start Date is required" }]}
      >
        <DatePicker className="w-full" format="DD MMM YYYY" />
      </Form.Item>

      <Form.Item
        label="End Date"
        name="endDate"
        // End Date is NOT required
      >
        <DatePicker
          className="w-full"
          format="DD MMM YYYY"
          disabledDate={(current) =>
            startDate ? current.isBefore(moment(startDate).startOf("day")) : false
          }
        />
      </Form.Item>

      <Form.Item
        label="Currency"
        name="currency"
        rules={[{ required: true, message: "Currency is required" }]}
      >
        <Select placeholder="Select Currency">
          <Select.Option value="IDR">IDR</Select.Option>
          <Select.Option value="USD">USD</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: "Amount is required" },
          {
            validator: (_, value) => {
              if (value !== undefined && value !== null && value !== "" && Number(value) === 0) {
                return Promise.reject(new Error("Amount must be greater than 0"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          placeholder="Enter Amount"
          controls={false}
          style={{ width: "100%" }}
          size="middle"
          precision={currency === "USD" ? 2 : 0}
          formatter={(value) => {
            if (value === undefined || value === null || value === "") return "";
            const isUSD = currency === "USD";
            if (isUSD) {
              const num = parseFloat(`${value}`);
              if (isNaN(num)) return "";
              const parts = num.toFixed(2).split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
              return parts.join(",");
            }
            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }}
          parser={(value) => {
            if (!value) return "";
            const isUSD = currency === "USD";
            if (isUSD) return value.replace(/\./g, "").replace(",", ".");
            return value.replace(/\./g, "");
          }}
          min={0}
          onKeyDown={(e) => {
            const allowed = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"];
            if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
            if (currency === "USD" && e.key === ",") return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
          }}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Description is required" }]}
        className="col-span-3"
      >
        <Input.TextArea rows={4} placeholder="Enter Description" maxLength={255} />
      </Form.Item>
      <span className="col-span-3 text-xs -mt-3 text-[#92979D]">
        You have{" "}
        {description === undefined || description === null ? 255 : 255 - String(description).length}{" "}
        of 255 characters remaining
      </span>
    </div>
  </NxBaseContainer>
);

// ─── Component ────────────────────────────────────────────────────────────────
const CreateWarrantyTerm = ({ typeForm }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);

  const { idAccount, idCustomer, type, id, idSA } = location?.state || {};

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [typeSubmit, setTypeSubmit] = useState(1);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [warrantyObj, setWarrantyObj] = useState({});

  const {
    loading = false,
    dataListAppHierIdForm = [],
    dataListAppHierDetailForm = [],
    dataDetail = {},
    dataAttachmentCategory = [],
  } = useSelector((state) => state.saWarranty);

  const isLoading = loading || loadingForm;

  // ─── Populate form on update ──────────────────────────────────────────
  const assertData = useCallback(
    (detail) => {
      const approvalHierarchy = detail.appHierId || 0;
      setSelectedHierarchy(approvalHierarchy);
      const body = {
        docNumber: detail?.docNumber,
        docDate: detail?.docDate ? moment(detail.docDate) : undefined,
        startDate: detail?.startDate ? moment(detail.startDate) : undefined,
        endDate: detail?.endDate ? moment(detail.endDate) : undefined,
        currency: detail?.currency,
        amount: detail?.amount,
        description: detail?.description,
        approvalHierarchy,
      };
      setWarrantyObj(body);
      form.setFieldsValue(body);
      setListDataAttachment(
        (detail?.mattachments || []).map((att, i) => ({
          ...att,
          key: i + 1,
          fileSize: bytesConverter(att.fileSize || 0),
          dataType: "exist",
        }))
      );
    },
    [form]
  );

  useEffect(() => {
    if (typeForm === "update" && dataDetail?.id) {
      assertData(dataDetail);
    }
  }, [typeForm, dataDetail, assertData]);

  useEffect(() => {
    if (typeForm === "update" && id) {
      dispatch(getDetailWarrantyTerm(id));
    }
  }, [dispatch, typeForm, id]);

  useEffect(() => {
    dispatch(getListAppHierWarranty());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getListAttachmentCategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListAppHierDetailWarranty({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  // ─── Steps definition ─────────────────────────────────────────────────
  const isStep0Valid =
    !!warrantyObj.docNumber &&
    !!warrantyObj.docDate &&
    !!warrantyObj.startDate &&
    !!warrantyObj.currency &&
    warrantyObj.amount !== undefined &&
    warrantyObj.amount !== null &&
    warrantyObj.amount !== "" &&
    !!warrantyObj.description;

  const steps = [
    {
      title: "Warranty Term Information",
      content: (
        <WarrantyInformationStep
          currency={warrantyObj.currency}
          startDate={warrantyObj.startDate}
          description={warrantyObj.description}
        />
      ),
      disabled: !isStep0Valid,
    },
    
    {
      title: "Approval",
      content: (
        <ApprovalSectionForm
          dataTable={dataListAppHierDetailForm}
          dataOption={dataListAppHierIdForm}
          selectedHierarchy={selectedHierarchy}
          updateSelectedHierarchy={setSelectedHierarchy}
        />
      ),
      disabled: !selectedHierarchy,
    },
    {
      title: "Attachment",
      content: (
        <Attachment
          data={listDataAttachment}
          updateData={setListDataAttachment}
          type={typeForm}
          categoryOptions={dataAttachmentCategory}
        />
      ),
      disabled: false,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const buildWarrantyPayload = useCallback(
    ({ flag = typeSubmit, validationType = null } = {}) => ({
      id: typeForm === "update" ? id : undefined,
      saId: idSA,
      documentNumber: warrantyObj?.docNumber || null,
      documentDate: warrantyObj?.docDate
        ? moment(warrantyObj.docDate).format(dateFormatting.date)
        : null,
      startDate: warrantyObj?.startDate
        ? moment(warrantyObj.startDate).format(dateFormatting.date)
        : null,
      endDate: warrantyObj?.endDate
        ? moment(warrantyObj.endDate).format(dateFormatting.date)
        : null,
      currency: warrantyObj?.currency || null,
      amount:
        warrantyObj?.amount !== undefined &&
        warrantyObj?.amount !== null &&
        warrantyObj?.amount !== ""
          ? warrantyObj.amount
          : null,
      description: warrantyObj?.description || null,
      appHierId: selectedHierarchy || null,
      flag,
      remark: warrantyObj?.remark || "",
      validationType,
    }),
    [id, idSA, selectedHierarchy, typeForm, typeSubmit, warrantyObj]
  );

  // ─── Navigation ───────────────────────────────────────────────────────
  const next = useCallback(() => {
    setCurrent((prev) => prev + 1);
    return Promise.resolve(true);
  }, []);

  const validateStepBeforeNext = useCallback(async () => {
    if (current !== 0) {
      return true;
    }

    await form.validateFields(STEP_0_FIELDS);

    const endPoint =
      typeForm === "create"
        ? "/v1/dbs/api/warranty-term/validate-create"
        : "/v1/dbs/api/warranty-term/validate-update";

    await dispatch(
      validateCreateUpdate({
        body: buildWarrantyPayload({ flag: 2, validationType: "DATA" }),
        services: accountManagementService,
        endPoint,
        type: typeForm,
      })
    ).unwrap();

    return true;
  }, [buildWarrantyPayload, current, dispatch, form, typeForm]);

  const prev = () => setCurrent((prev) => prev - 1);

  const scrollRightHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 250;
  };
  const scrollLeftHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 250;
  };

  const handleButtonNext = async () => {
    if (loadingNext) return;

    try {
      setLoadingNext(true);
      const ok = await validateStepBeforeNext();
      if (ok) {
        await next();
        scrollRightHandler();
      }
    } catch (error) {
      return;
    } finally {
      setLoadingNext(false);
    }
  };

  const handleSetCurrent = async (targetStep) => {
    if (loadingNext) return;
    if (targetStep === current) return;
    if (targetStep < current) {
      setCurrent(targetStep);
      return;
    }
    if (targetStep !== current + 1 || steps[current].disabled) return;
    await handleButtonNext();
  };

  const hasIncompleteStep = steps.some((s) => s.disabled);
  const hasAttachment = listDataAttachment.length > 0;
  const isSubmitDisabled = hasIncompleteStep || !hasAttachment;

  // ─── Submit ───────────────────────────────────────────────────────────
  const handleSubmitForm = () => {
    if (typeSubmit === 2 && !hasAttachment) return;
    setModalConfirm(true);
  };
  const handleCancelModalConfirm = () => setModalConfirm(false);

  const resolveAttachmentCategoryId = (attachment) =>
    attachment?.categoryId ||
    attachment?.fileCategoryId ||
    attachment?.category?.value ||
    null;

  const handleProcessModalConfirm = async () => {
    if (loadingForm) return;
    setLoadingForm(true);

      const body = buildWarrantyPayload();

    const thunk = typeForm === "create" ? createWarrantyTerm : updateWarrantyTerm;

    try {
      const data = await dispatch(thunk(body)).unwrap();
      const recordId = typeForm === "create" ? data?.id : id;

      const attachmentsToUpload =
        typeForm === "create"
          ? listDataAttachment
          : listDataAttachment.filter((a) => a.dataType !== "exist");

      for (const element of attachmentsToUpload) {
        const categoryId = resolveAttachmentCategoryId(element);
        if (!categoryId) throw new Error("Attachment category is required");
        // TODO: confirm upload endpoint URL
        await accountManagementService.uploadAttachment(
          `/v1/dbs/api/warranty-term/upload-attachment`,
          { files: element.file, category: categoryId, refId : recordId }
        );
      }

      handleCancelModalConfirm();
      handleClear();
    } catch (error) {
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
        setBodyError({ message });
        setModalError(true);
      }
    } finally {
      setLoadingForm(false);
    }
  };

  const handleClear = () => {
    if (typeForm === "create") {
      form.resetFields();
      setWarrantyObj({});
      setListDataAttachment([]);
      setSelectedHierarchy(undefined);
    } else {
      assertData(dataDetail);
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleProcessModalConfirm();
    setModalError(false);
    setBodyError({});
  };

  // ─── Form onChange sync ───────────────────────────────────────────────
  const handleFieldChange = (changedFields) => {
    const updates = {};
    changedFields.forEach(({ name, value }) => {
      if (name && name[0]) updates[name[0]] = value;
    });
    if (Object.keys(updates).length > 0) {
      setWarrantyObj((prev) => ({ ...prev, ...updates }));
    }
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <NxBreadCrumb
          routes={routes({ idAccount, idCustomer, type, idSA, typeForm })}
        />
        <div className="flex flex-col w-full gap-4">
          <HeaderDetail
            dispatch={dispatch}
            idAccount={idAccount}
            idCustomer={idCustomer}
            type={type}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          />
        </div>

        {/* Steps navigation */}
        <NxBaseContainer border className="mt-8">
          <div className="flex flex-row gap-x-6 justify-center">
            <span className="mt-[10px]">
              <LeftCircleOutlined
                style={{ fontSize: "24px", color: "#0075bf" }}
                onClick={scrollLeftHandler}
              />
            </span>
            <div ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
              <Steps
                current={current}
                items={items}
                labelPlacement="vertical"
                onChange={handleSetCurrent}
              />
            </div>
            <span className="mt-[10px]">
              <RightCircleOutlined
                style={{ fontSize: "24px", color: "#0075bf" }}
                onClick={scrollRightHandler}
              />
            </span>
          </div>
        </NxBaseContainer>

        {/* Form */}
        <Form
          id="warrantyTermForm"
          form={form}
          layout="vertical"
          onFinish={handleSubmitForm}
          onFieldsChange={handleFieldChange}
        >
          <div className="steps-content mt-6">{steps[current].content}</div>

          {/* Action buttons */}
          <NxBaseContainer border className="mt-6">
            <div className="steps-action flex w-full justify-between gap-x-2">
              <ButtonComponent
                type="menu"
                onClick={() => setModalBack(true)}
              >
                Cancel
              </ButtonComponent>
              <div className="flex w-full justify-end gap-x-4">
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name={typeForm === "update" ? "IconButtonReset" : "IconButtonClear"}
                      width={24}
                    />
                  }
                  type="reject"
                  onClick={handleClear}
                >
                  {typeForm === "update" ? "Reset" : "Clear"}
                </ButtonComponent>

                {current > 0 && (
                  <ButtonComponent
                    onClick={() => {
                      prev();
                      scrollLeftHandler();
                    }}
                    type="menu"
                  >
                    Previous
                  </ButtonComponent>
                )}

                <ButtonComponent
                  disabled={hasIncompleteStep}
                  form="warrantyTermForm"
                  htmlType="submit"
                  type="secondary"
                  onClick={() => setTypeSubmit(1)}
                >
                  Save as Draft
                </ButtonComponent>

                {current < steps.length - 1 && (
                  <ButtonComponent
                    onClick={handleButtonNext}
                    disabled={steps[current].disabled || loadingNext}
                    loading={loadingNext}
                    type="submit"
                    icon={<SVGIcon name="IconArrowNarrowRight" width={24} />}
                  >
                    Next
                  </ButtonComponent>
                )}

                {current === steps.length - 1 && (
                  <ButtonComponent
                    disabled={isSubmitDisabled}
                    form="warrantyTermForm"
                    htmlType="submit"
                    type="approve"
                    onClick={() => setTypeSubmit(2)}
                  >
                    Submit
                  </ButtonComponent>
                )}
              </div>
            </div>
          </NxBaseContainer>
        </Form>

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

        {/* Modal Confirm */}
        {modalConfirm && (
          <ContentModalConfirm
            isOpen={modalConfirm}
            loadingSubmit={loadingForm}
            handleCancel={handleCancelModalConfirm}
            handleConfirm={handleProcessModalConfirm}
            warrantyObj={warrantyObj}
            selectedHierarchy={selectedHierarchy}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={dataListAppHierDetailForm}
            listApproval={dataListAppHierIdForm}
          />
        )}

        {/* Modal Error Retry */}
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
              typeForm === "update" ? "updated" : "created"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default CreateWarrantyTerm;
