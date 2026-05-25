import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Spin } from "antd";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import DateComponent from "../../../../../components/DateComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import { getConfigFileRBIData } from "../../../../../redux/slices/attachmentSlice";
import { uploadAttachments } from "../../../../../utils/uploadHelper";
import { showModalError } from "../../../../../redux/slices/general_slice";
import {
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/rating_billing_invoice/billing";
import {
  getUomOptions,
  getMutationTypeOptions,
  getMutationCategoryOptions,
  getPeriodOptions,
  createMutationDetail,
  getCategoryListGasDeposit,
  getPriceByBillingPeriod,
} from "../../../../../redux/slices/rating_billing_invoice/gasDeposit";

const ModalCreateMutationDetail = ({
  isOpen,
  handleCancel = () => {},
  handleRefresh = () => {},
  selectedData = {},
  withApprovalAndAttachment = true,
  accountNumber,
  initialValues = null,
  submitLabel = "Submit",
  modalTitle = "Create Mutation Detail",
  defaultBillingPeriod,
  defaultUom,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { data_approval, data_approval_list } = useSelector(
    (state) => state.billing,
  );

  const {
    data_uom_options: uomOptions,
    data_mutation_type_options: mutationTypeOptions,
    data_mutation_category_options: mutationCategoryOptions,
    data_period_options: billingPeriodOptions,
  } = useSelector((state) => state.gasDepositRbi);

  const categoryOptions = useMemo(() => mutationCategoryOptions || [], [mutationCategoryOptions]);

  // Step state
  const [currentStep, setCurrentStep] = useState(0);

  // Approval state
  const [selectedHierarchy, setSelectedHierarchy] = useState(undefined);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [boolean, setBoolean] = useState(false);

  // Attachment state
  const [listDataAttachment, setListDataAttachment] = useState([]);

  // Price options state
  const [priceOptionsData, setPriceOptionsData] = useState({ result: [], page: {} });
  const [loadingPriceOptions, setLoadingPriceOptions] = useState(false);
  const [priceSearch, setPriceSearch] = useState("");
  const selectedBillingPeriod = Form.useWatch("billingPeriod", form);
  const selectedMutationType = Form.useWatch("mutationType", form);
  const activeAccountNumber = accountNumber || selectedData?.accountNumber;
  const priceOptions = priceOptionsData?.result || [];
  const pricePageInfo = priceOptionsData?.page || {};
  const PRICE_PAGE_SIZE = 20;
  const isRedeemMutation = String(selectedMutationType || "").trim().toUpperCase() === "REDEEM";

  const getSelectedPriceOption = (priceValue) =>
    priceOptions.find((item) => String(item?.value) === String(priceValue));

  // Fetch dropdown options & approval list
  useEffect(() => {
    if (isOpen) {
      dispatch(getUomOptions());
      dispatch(getMutationTypeOptions());
      dispatch(getMutationCategoryOptions());
      dispatch(getPeriodOptions());
      dispatch(getAllApprovalList());
      form.setFieldsValue({
        source: "MANUAL",
        type: "Adjustment",
        billingPeriod: initialValues?.billingPeriod || defaultBillingPeriod,
        uom: initialValues?.uom || defaultUom,
      });
    }
  }, [dispatch, isOpen, form, defaultBillingPeriod, defaultUom, initialValues?.billingPeriod, initialValues?.uom]);

  useEffect(() => {
    if (!isOpen || !initialValues) return;
    form.setFieldsValue(initialValues);
  }, [form, initialValues, isOpen]);

  // Map approval hierarchy list to options
  useEffect(() => {
    if (data_approval && data_approval.length > 0) {
      const options = data_approval.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      }));
      setAppHierOptions(options);
    } else {
      setAppHierOptions([]);
    }
  }, [data_approval]);

  // Map approval hierarchy detail to table data
  useEffect(() => {
    if (boolean && data_approval_list && data_approval_list.length > 0) {
      const data = data_approval_list.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: (a.employeeDetail || []).map((b, i) => ({
          ...b,
          key: i + 1,
        })),
      }));
      setAppHierDataDetail(data);
    }
  }, [data_approval_list, boolean]);

  const handleSelectHierarchy = (value) => {
    setSelectedHierarchy(value);
    form.setFieldsValue({ apphierId: value });
    dispatch(getListApprovalById(value));
    setBoolean(true);
  };

  // Steps definition
  const steps = useMemo(() => {
    const baseSteps = [{ title: "CREATE" }];
    if (withApprovalAndAttachment) {
      baseSteps.push({ title: "APPROVAL" }, { title: "ATTACHMENT" });
    }
    return baseSteps;
  }, [withApprovalAndAttachment]);

  const handleNext = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields([
          "billingPeriod",
          "mutationDate",
          "mutationType",
          "category",
          "uom",
          "quantity",
          "price",
          "amount",
          "type",
          "description",
        ]);
      } catch {
        return;
      }
    }

    if (withApprovalAndAttachment && currentStep === 1) {
      try {
        await form.validateFields(["apphierId"]);
      } catch {
        return;
      }
    }

    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const handleCancelForm = () => {
    form.resetFields();
    setCurrentStep(0);
    setSelectedHierarchy(undefined);
    setAppHierDataDetail([]);
    setBoolean(false);
    setListDataAttachment([]);
    setPriceOptionsData({ result: [], page: {} });
    setPriceSearch("");
    handleCancel();
  };

  useEffect(() => {
    if (!isOpen) return;

    if (!activeAccountNumber || !selectedBillingPeriod) {
      setPriceOptionsData({ result: [], page: {} });
      form.setFieldsValue({ price: null, amount: "" });
      return;
    }

    setLoadingPriceOptions(true);
    dispatch(
      getPriceByBillingPeriod({
        accountNumber: activeAccountNumber,
        billingPeriod: selectedBillingPeriod,
        page: 1,
        pageSize: PRICE_PAGE_SIZE,
        search: priceSearch,
        isLoadMore: false,
      }),
    ).then((res) => {
      const payload = res?.payload;
      const options = Array.isArray(payload?.result) ? payload.result : [];

      setPriceOptionsData({
        result: options,
        page: payload?.page || {},
      });
      setLoadingPriceOptions(false);

      if (!options.length) {
        form.setFieldsValue({ price: null, amount: "" });
        return;
      }

      const currentPrice = form.getFieldValue("price");
      const hasCurrentPrice = options.some(
        (item) => String(item?.value) === String(currentPrice),
      );
      if (!hasCurrentPrice) {
        const defaultPriceOption = options[0];
        const qty = Number.parseFloat(form.getFieldValue("quantity")) || 0;
        const parsedDefaultPrice = Number.parseFloat(defaultPriceOption?.price) || 0;
        form.setFieldsValue({
          price: defaultPriceOption?.value ?? null,
          amount: qty * parsedDefaultPrice || "",
        });
        return;
      }

      const qty = Number.parseFloat(form.getFieldValue("quantity")) || 0;
      const selectedPriceOption = options.find(
        (item) => String(item?.value) === String(currentPrice),
      );
      const parsedPrice = Number.parseFloat(selectedPriceOption?.price) || 0;

      form.setFieldsValue({
        price: currentPrice,
        amount: qty * parsedPrice || "",
      });
    });
  }, [dispatch, form, isOpen, activeAccountNumber, selectedBillingPeriod, priceSearch]);

  const handlePricePopupScroll = (event) => {
    const target = event?.target;
    if (!target || loadingPriceOptions) return;

    const isAtBottom =
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 8;
    const currentPage = Number(pricePageInfo?.currentPage || 1);
    const totalPages = Number(pricePageInfo?.totalPages || 1);

    if (isAtBottom && currentPage < totalPages) {
      setLoadingPriceOptions(true);
      dispatch(
        getPriceByBillingPeriod({
          accountNumber: activeAccountNumber,
          billingPeriod: selectedBillingPeriod,
          page: currentPage + 1,
          pageSize: PRICE_PAGE_SIZE,
          search: priceSearch,
          isLoadMore: true,
        }),
      ).then((res) => {
        const payload = res?.payload;
        const nextOptions = Array.isArray(payload?.result) ? payload.result : [];
        setPriceOptionsData((prev) => {
          const existing = prev?.result || [];
          const existingKeys = new Set(existing.map((item) => `${item?.id}-${item?.label}`));
          const uniqueNext = nextOptions.filter((item) => !existingKeys.has(`${item?.id}-${item?.label}`));
          return {
            result: [...existing, ...uniqueNext],
            page: payload?.page || prev?.page || {},
          };
        });
        setLoadingPriceOptions(false);
      });
    }
  };

  const handleSave = async () => {
    let values;
    try {
      values = await form.validateFields([
        "source",
        "billingPeriod",
        "mutationDate",
        "mutationType",
        "category",
        "uom",
        "quantity",
        "price",
        "amount",
        "type",
        "description",
        ...(withApprovalAndAttachment ? ["apphierId"] : []),
      ]);
    } catch {
      return;
    }

    // Used in create page slicing before gasDepositId exists
    if (!selectedData?.gasDepositId) {
      handleCancelForm();
      handleRefresh(values);
      return;
    }

    if (withApprovalAndAttachment && listDataAttachment.length === 0) {
      dispatch(
        showModalError({
          title: "Failed",
          description: "Attachment is required.",
        }),
      );
      return;
    }

    const body = {
      gasDepositId: selectedData.gasDepositId,
      apphierId: values.apphierId,
      billPeriode: values.billingPeriod,
      mutationDate: values.mutationDate,
      transType: values.mutationType,
      source: values.source,
      mutationType: values.mutationType,
      category: values.category,
      uom: values.uom,
      volumeAmount: values.quantity,
      price: getSelectedPriceOption(values.price)?.price ?? values.price,
      amountValue: values.amount,
      description: values.description,
      attachments: [],
    };

    dispatch(createMutationDetail(body)).then(async (res) => {
      if (!res.error) {
        const mutationId = res.payload?.data?.mutationId || res.payload?.data?.id;

        if (listDataAttachment.length > 0 && mutationId) {
          await uploadAttachments(
            listDataAttachment,
            mutationId,
            "GAS_DEPOSIT_MUTATION",
            (formData) =>
              ratingBillingHttpService.uploadAttachment(
                `/v1/dbs/api/attachment/upload/v1`,
                formData,
                () => {},
              ),
          );
        }

        handleCancelForm();
        handleRefresh(values);
      }
    });
  };

  return (
    <>
      <style>{`
        .black-text-disabled .ant-input[disabled],
        .black-text-disabled .ant-select-disabled .ant-select-selection-item {
          color: rgba(0, 0, 0, 0.85) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.85) !important;
        }
        .black-text-disabled .ant-input[disabled]::placeholder {
          color: rgba(0, 0, 0, 0.25) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.25) !important;
        }
        .black-text-disabled .ant-select-disabled .ant-select-selection-placeholder {
          color: rgba(0, 0, 0, 0.25) !important;
          -webkit-text-fill-color: rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>
      <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header={modalTitle}
      handleCancel={handleCancelForm}
      width={1000}
      footer={
        <div className="flex w-full justify-between items-center">
          <div>
            {currentStep < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
          </div>
          <div className="flex gap-x-3">
            {currentStep > 0 && (
              <ButtonComponent onClick={handlePrev} type={"default"}>
                Previous
              </ButtonComponent>
            )}
            {currentStep < steps.length - 1 && (
              <ButtonComponent onClick={handleNext} type={"submit"}>
                Next
              </ButtonComponent>
            )}
            {currentStep === steps.length - 1 && (
              <ButtonComponent type={"submit"} onClick={handleSave}>
                {submitLabel}
              </ButtonComponent>
            )}
          </div>
        </div>
      }
    >
      <Form layout="vertical" form={form} id="formMutationDetail" className="black-text-disabled">
        {/* ========== STEP 1: MUTATION DETAIL FORM ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 0 ? "hidden" : ""}`}
        >
          <BaseContainer border header="MUTATION INFORMATION" className="mb-3">
            <div className="grid grid-cols-5 gap-3">
              <Form.Item
                label="Source"
                name="source"
                rules={[{ required: true, message: "Please input Source!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent disabled placeholder="MANUAL" />
              </Form.Item>

              <Form.Item
                label="Billing Period"
                name="billingPeriod"
                rules={[{ required: true, message: "Please select Billing Period!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent
                  placeholder="Select Billing Period"
                  options={billingPeriodOptions}
                />
              </Form.Item>

              <Form.Item
                label="Mutation Date"
                name="mutationDate"
                rules={[{ required: true, message: "Please select Mutation Date!" }]}
                style={{ marginBottom: 0 }}
              >
                <DateComponent placeholder="Select Date" dateDisable={() => false} />
              </Form.Item>

              <Form.Item
                label="Mutation Type"
                name="mutationType"
                rules={[{ required: true, message: "Please select Mutation Type!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Mutation Type">
                  {mutationTypeOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label="Select Category"
                name="category"
                rules={[{ required: true, message: "Please select Category!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select Category" options={categoryOptions} />
              </Form.Item>

              <Form.Item
                label="UOM"
                name="uom"
                rules={[{ required: true, message: "Please select UOM!" }]}
                style={{ marginBottom: 0 }}
              >
                <SelectComponent placeholder="Select UOM">
                  {uomOptions.map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Please input Quantity!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent
                  placeholder="Input.."
                  prefix={isRedeemMutation ? "-" : undefined}
                  onChange={(event) => {
                    const qty = Math.abs(Number.parseFloat(event?.target?.value) || 0);
                    const selectedPriceOption = getSelectedPriceOption(
                      form.getFieldValue("price"),
                    );
                    const price = Number.parseFloat(selectedPriceOption?.price) || 0;
                    form.setFieldsValue({ amount: qty * price || "" });
                  }}
                />
              </Form.Item>

              <Form.Item label="Price" name="price" style={{ marginBottom: 0 }} rules={[{ required: true, message: "Please select Price!" }]}>
                <SelectComponent
                  placeholder={
                    !activeAccountNumber
                      ? "Account Number not found"
                      : !selectedBillingPeriod
                        ? "Select Billing Period first"
                        : "Select Price"
                  }
                  options={priceOptions}
                  disabled={!activeAccountNumber || !selectedBillingPeriod}
                  showSearch
                  onSearch={setPriceSearch}
                  onClear={() => setPriceSearch("")}
                  onPopupScroll={handlePricePopupScroll}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {loadingPriceOptions && (
                        <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                          <Spin size="small" />
                          <span>Loading more price...</span>
                        </div>
                      )}
                    </>
                  )}
                  onChange={(val) => {
                    const qty = Math.abs(Number.parseFloat(form.getFieldValue("quantity")) || 0);
                    const selectedPriceOption = getSelectedPriceOption(val);
                    const p = Number.parseFloat(selectedPriceOption?.price) || 0;
                    form.setFieldsValue({ amount: qty * p || "" });
                  }}
                  filterOption={(input, option) =>
                    String(option?.label || "")
                      .toLowerCase()
                      .includes(String(input || "").toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Amount is required!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent
                  prefix={isRedeemMutation ? "-" : undefined}
                  disabled
                  placeholder="auto"
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Type is required!" }]}
                style={{ marginBottom: 0 }}
              >
                <InputComponent disabled placeholder="Adjustment" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please input Description!" }]}
                className="col-span-5"
                style={{ marginBottom: 0 }}
              >
                <InputComponent type="textarea" rows={3} placeholder="Input.." />
              </Form.Item>
            </div>
          </BaseContainer>
        </div>

        {/* ========== STEP 2: APPROVAL INFORMATION ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 1 ? "hidden" : ""}`}
          style={{ display: withApprovalAndAttachment ? undefined : "none" }}
        >
          <p className="text-primary uppercase font-bold mb-4">
            Approval Information
          </p>

          <ApprovalComponentGeneral
            type="create"
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            updateSelectedHierarchy={handleSelectHierarchy}
          />
        </div>

        {/* ========== STEP 3: ATTACHMENT ========== */}
        <div
          className={`steps-content my-[20px] ${currentStep !== 2 ? "hidden" : ""}`}
          style={{ display: withApprovalAndAttachment ? undefined : "none" }}
        >
          <p className="text-primary uppercase font-bold mb-4">
            Attachment Information
          </p>

          <AttachmentComponent
            type="create"
            typeSelector="gasDepositRbi"
            data={listDataAttachment}
            updateData={setListDataAttachment}
            dispatch={dispatch}
            getAPICategory={getCategoryListGasDeposit}
            service={ratingBillingHttpService}
            configApplication={configApp.RATING_BILLING_SERVICE}
            getAPIGuard={getConfigFileRBIData}
            typeRBI="data"
            mandatory={true}
          />
        </div>
      </Form>
    </ModalCustom>
    </>
  );
};

export default ModalCreateMutationDetail;

ModalCreateMutationDetail.propTypes = {
  isOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  selectedData: PropTypes.object,
  withApprovalAndAttachment: PropTypes.bool,
  accountNumber: PropTypes.string,
  initialValues: PropTypes.object,
  submitLabel: PropTypes.string,
  modalTitle: PropTypes.string,
  defaultBillingPeriod: PropTypes.string,
  defaultUom: PropTypes.string,
};
