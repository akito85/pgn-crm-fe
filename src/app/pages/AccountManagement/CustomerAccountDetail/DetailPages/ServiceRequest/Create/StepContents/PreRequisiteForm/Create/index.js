import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createSrPrerequisite,
  addCreateSrPrerequisite,
  updateCreateSrPrerequisite,
  saveEditedApiPrerequisite,
} from "../../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { Form, Select, Input, Spin, message } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../../../routes/account_management/customer_account_routes";
import { requiredMessage } from "../../../../../../../../../../utils";

import BreadCrumb from "../../../../../../../../../../components/BreadCrumb";
import InputComponent from "../../../../../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../../../../../components/ButtonComponent";
import NxBaseContainer from "../../../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../../../components/Nx/NxDetailText";
import SVGIcon from "../../../../../../../../../../assets/Icon/index";
import NxDate from "../../../../../../../../../../components/Nx/NxDatePicker";
import NxDualSelect from "../../../../../../../../../../components/Nx/NxDualSelect";

import { PointOfSalesInfo } from "./PointOfSalesInfo";

const MAX_DESC_LENGTH = 255;

const termsOptions = [{ label: "Terms 1", value: "t1" }];
const daysOptions = [{ label: "H+1", value: "h+1" }];

const CollapsibleSection = ({ title, expanded, onToggle, children }) => (
  <div className="border border-solid border-[#C8CDD4] bg-white rounded-lg w-full">
    <div
      className="flex justify-between items-center bg-[#F9F9F9] rounded-t-lg uppercase p-4 border-0 border-b border-solid border-[#C8CDD4] cursor-pointer select-none"
      onClick={onToggle}
    >
      <span className="text-[16px] text-primary">{title}</span>
      {expanded ? (
        <UpOutlined className="text-primary text-sm" />
      ) : (
        <DownOutlined className="text-primary text-sm" />
      )}
    </div>
    {expanded && <div className="p-4">{children}</div>}
  </div>
);

const PreRequisiteCreateFrom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    list_srTypes,
    list_srCategories,
    list_srSubcategories,
    list_srPriorities,
    list_srChannels,
    list_srSources,
    list_srPrerequisiteTypes,
  } = useSelector((state) => state.serviceRequest);

  const dropdowns = {
    serviceRequestTypes: list_srTypes,
    serviceRequestCategories: list_srCategories,
    serviceRequestSubcategories: list_srSubcategories,
    serviceRequestPriorities: list_srPriorities,
    serviceRequestChannels: list_srChannels,
    serviceRequestSources: list_srSources,
    serviceRequestPrerequisites: list_srPrerequisiteTypes,
  };

  const {
    account,
    customer,
    serviceRequestData,
    srId,
    accountId: accountIdFromState,
    returnPath,
    returnToStep,
    editData,
    editKey,
  } = location.state || {};

  const isEditMode = !!editData;

  const accountId = accountIdFromState || account?.accountInformation?.accountId;

  const [localForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPos, setIsPos] = useState(false);
  const [descLength, setDescLength] = useState(0);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [srExpanded, setSrExpanded] = useState(true);
  const [prereqExpanded, setPrereqExpanded] = useState(true);

  useEffect(() => {
    if (!isEditMode || !editData) return;
    // prerequisiteType/prerequisiteId for local/API data; convert to string to match Select option values
    const typeValue = (editData.prerequisiteType ?? editData.prerequisiteId)?.toString() ?? undefined;
    // prerequisiteDesc for local, prerequisiteComments or description (from mapItems) for API
    const descValue = editData.prerequisiteDesc ?? editData.prerequisiteComments ?? editData.description ?? "";
    // prerequisiteName for both; fallback to display field "name" added by mapItems
    const nameValue = editData.prerequisiteName ?? editData.name ?? "";
    localForm.setFieldsValue({
      "prerequesite-type": typeValue,
      "prerequisite-name": nameValue,
      "description": descValue !== "-" ? descValue : "",
      "billing-cycle": editData.billingCycle,
      "period": editData.period,
      "currency": editData.currency,
      "transaction-date": editData.transactionDate,
      "invoice-date": editData.invoiceDate,
      "terms-of-payment": editData.termOfPayment ? { left: editData.termOfPayment, right: editData.paymentDays } : undefined,
    });
    if (typeValue) setIsPos(typeValue === "2653");
    if (descValue && descValue !== "-") setDescLength(descValue.length);
  }, []);

  const accountSummary = account?.accountSummary || {};
  const srData = serviceRequestData || {};

  const getDropdownOptions = (dropdownKey) => {
    const source = dropdowns?.[dropdownKey];
    const list = Array.isArray(source) ? source : Array.isArray(source?.data) ? source.data : [];
    return list.map((item) => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName,
    }));
  };

  const getPrerequisiteTypeLabel = (value) => {
    const options = Array.isArray(list_srPrerequisiteTypes) ? list_srPrerequisiteTypes : [];
    const matched = options.find(
      (item) =>
        item?.glbTypeValId?.toString() === value?.toString() ||
        item?.id?.toString() === value?.toString(),
    );
    return matched?.name || matched?.glbTypeValName || value || "-";
  };

  const getDropdownLabel = (dropdownKey, value) => {
    if (!value) return "-";
    const options = getDropdownOptions(dropdownKey);
    const found = options.find((o) => o.value === value?.toString());
    return found?.label || value || "-";
  };

  const handlePrerequisiteTypeChange = (value) => {
    setIsPos(value === "2653");
  };

  const navigateBack = (extraState = {}) => {
    if (returnPath) {
      navigate(returnPath, {
        replace: true,
        state: {
          returnToStep,
          id: srId,
          idAccount: accountId,
          idCustomer: customer?.customerId,
          type: location.state?.type,
          account,
          customer,
          serviceRequestData,
          ...extraState,
        },
      });
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => navigateBack();

  const handleSave = async () => {
    try {
      const values = await localForm.validateFields();
      setLoading(true);

      const prerequisiteData = {
        prerequisiteType: values["prerequesite-type"],
        prerequisiteName: values["prerequisite-name"],
        prerequisiteDesc: values["description"] || "",
        ...(values["billing-cycle"] && { billingCycle: values["billing-cycle"] }),
        ...(values["period"] && { period: values["period"] }),
        ...(values["currency"] && { currency: values["currency"] }),
        ...(values["transaction-date"] && { transactionDate: values["transaction-date"] }),
        ...(values["invoice-date"] && { invoiceDate: values["invoice-date"] }),
        ...(values["terms-of-payment"] && {
          termOfPayment: values["terms-of-payment"]?.left,
          paymentDays: values["terms-of-payment"]?.right,
        }),
      };

      if (srId) {
        if (isEditMode && editKey) {
          // Edit mode in update flow: save locally only, do NOT call API
          dispatch(saveEditedApiPrerequisite({
            key: editKey,
            ...prerequisiteData,
            typeName: getPrerequisiteTypeLabel(prerequisiteData.prerequisiteType),
            name: prerequisiteData.prerequisiteName || getPrerequisiteTypeLabel(prerequisiteData.prerequisiteType),
            description: prerequisiteData.prerequisiteDesc || "-",
          }));
          navigateBack();
        } else {
          // Create new prerequisite in update flow: call API
          await dispatch(
            createSrPrerequisite({ accountId, srId, body: prerequisiteData }),
          ).unwrap();
          navigateBack();
        }
      } else {
        // CREATE flow: SR belum ada, simpan ke Redux agar wizard membacanya saat remount
        const displayData = {
          ...prerequisiteData,
          typeName: getPrerequisiteTypeLabel(prerequisiteData.prerequisiteType),
          name: prerequisiteData.prerequisiteName || getPrerequisiteTypeLabel(prerequisiteData.prerequisiteType),
          description: prerequisiteData.prerequisiteDesc || "-",
          status: "-",
          dueDateLabel: "-",
          completedDateLabel: "-",
          assignedToLabel: "-",
        };
        if (isEditMode && editKey) {
          dispatch(updateCreateSrPrerequisite({ key: editKey, ...displayData }));
        } else {
          dispatch(addCreateSrPrerequisite({ key: `local-${Date.now()}`, ...displayData }));
        }
        navigateBack();
      }
    } catch (err) {
      if (err?.errorFields) {
        message.error("Please fill in all required fields correctly");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    localForm.resetFields();
    setDescLength(0);
    setIsPos(false);
  };

  const routes = [
    { path: "", breadcrumbName: "Account" },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_REQUEST,
      breadcrumbName: "Service Requests",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_REQUEST,
      breadcrumbName: "Create Service Request",
    },
    { path: "", breadcrumbName: "Create Pre-Requisite" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading} className="w-full top-20">
        <div className="flex flex-col gap-4">
          {/* CUSTOMER & ACCOUNT INFORMATION */}
          <CollapsibleSection
            title="CUSTOMER & ACCOUNT INFORMATION"
            expanded={accountExpanded}
            onToggle={() => setAccountExpanded((prev) => !prev)}
          >
            <div className="w-full grid grid-cols-4 gap-4">
              <NxDetailText label="Customer Name">
                {accountSummary?.customerName || "-"}
              </NxDetailText>
              <NxDetailText label="Account Number">
                {accountSummary?.accountNumber || "-"}
              </NxDetailText>
              <NxDetailText label="Account Name">
                {accountSummary?.accountName || "-"}
              </NxDetailText>
              <NxDetailText label="SOR">
                {accountSummary?.sor || "-"}
              </NxDetailText>
              <NxDetailText label="Cost Center">
                {accountSummary?.costCenter || "-"}
              </NxDetailText>
              <NxDetailText label="Meter Reading Codes">
                {accountSummary?.meterReadingCodes || "-"}
              </NxDetailText>
              <NxDetailText label="Segment">
                {accountSummary?.segment || "-"}
              </NxDetailText>
              <NxDetailText label="Account Group Type">
                {accountSummary?.accountGroupType || "-"}
              </NxDetailText>
              <NxDetailText label="Premise Address">
                {accountSummary?.premiseAddress || "-"}
              </NxDetailText>
              <NxDetailText label="Subdistrict">
                {accountSummary?.subdistrict || "-"}
              </NxDetailText>
              <NxDetailText label="District">
                {accountSummary?.district || "-"}
              </NxDetailText>
              <NxDetailText label="City">
                {accountSummary?.city || "-"}
              </NxDetailText>
            </div>
          </CollapsibleSection>

          {/* SERVICE REQUEST INFORMATION */}
          <CollapsibleSection
            title="SERVICE REQUEST INFORMATION"
            expanded={srExpanded}
            onToggle={() => setSrExpanded((prev) => !prev)}
          >
            <div className="w-full grid grid-cols-4 gap-4">
              <NxDetailText label="SR Reference">
                {srData?.srr || srData?.reference || "-"}
              </NxDetailText>
              <NxDetailText label="Type">
                {getDropdownLabel("serviceRequestTypes", srData?.type)}
              </NxDetailText>
              <NxDetailText label="Category">
                {getDropdownLabel("serviceRequestCategories", srData?.category)}
              </NxDetailText>
              <NxDetailText label="Sub Category">
                {getDropdownLabel("serviceRequestSubcategories", srData?.subCategory)}
              </NxDetailText>
              <NxDetailText label="Channel">
                {getDropdownLabel("serviceRequestChannels", srData?.channel)}
              </NxDetailText>
              <NxDetailText label="Priority">
                {getDropdownLabel("serviceRequestPriorities", srData?.priority)}
              </NxDetailText>
              <NxDetailText label="Request Source">
                {getDropdownLabel("serviceRequestSources", srData?.requestSource)}
              </NxDetailText>
              <NxDetailText label="Request Date">
                {NxDate?.formatDate
                  ? NxDate.formatDate(srData?.requestDate)
                  : srData?.requestDate || "-"}
              </NxDetailText>
            </div>
            {srData?.description && (
              <div className="w-full mt-3">
                <NxDetailText label="Description">{srData.description}</NxDetailText>
              </div>
            )}
          </CollapsibleSection>

          {/* PRE-REQUISITE INFORMATION */}
          <Form form={localForm} layout="vertical">
            <CollapsibleSection
              title="PRE-REQUISITE INFORMATION"
              expanded={prereqExpanded}
              onToggle={() => setPrereqExpanded((prev) => !prev)}
            >
              <div className="flex flex-col gap-5">
                <div className="w-full grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="mb-2 font-medium">
                      Type <span className="text-[#ff4d4f]">*</span>
                    </label>
                    <Form.Item
                      name="prerequesite-type"
                      rules={[{ required: true, message: requiredMessage("Type") }]}
                      className="no-margin-form"
                    >
                      <Select
                        placeholder="Select Pre Requisite Types"
                        options={getDropdownOptions("serviceRequestPrerequisites")}
                        onChange={handlePrerequisiteTypeChange}
                      />
                    </Form.Item>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 font-medium">
                      Name <span className="text-[#ff4d4f]">*</span>
                    </label>
                    <Form.Item
                      name="prerequisite-name"
                      rules={[{ required: true, message: requiredMessage("Name") }]}
                      className="no-margin-form"
                    >
                      <InputComponent className="flex-1" />
                    </Form.Item>
                  </div>
                </div>

                {isPos && (
                  <>
                    <div className="w-full grid grid-cols-3 gap-5">
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Billing Cycle</label>
                        <Form.Item
                          name="billing-cycle"
                          rules={[{ required: true, message: requiredMessage("Billing Cycle") }]}
                          className="no-margin-form"
                        >
                          <Select
                            placeholder="Select Billing Cycle"
                            options={getDropdownOptions("serviceRequestPrerequisites")}
                            disabled
                          />
                        </Form.Item>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Period</label>
                        <Form.Item
                          name="period"
                          rules={[{ required: true, message: requiredMessage("Period") }]}
                          className="no-margin-form"
                        >
                          <Select
                            placeholder="Select Billing Period"
                            options={getDropdownOptions("serviceRequestPrerequisites")}
                            disabled
                          />
                        </Form.Item>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Currency</label>
                        <Form.Item
                          name="currency"
                          rules={[{ required: true, message: requiredMessage("Currency") }]}
                          className="no-margin-form"
                        >
                          <Select
                            placeholder="Select Currency"
                            options={getDropdownOptions("serviceRequestPrerequisites")}
                            disabled
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-3 gap-5">
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Transaction Date</label>
                        <Form.Item
                          name="transaction-date"
                          rules={[{ required: true, message: requiredMessage("Transaction Date") }]}
                          className="no-margin-form"
                        >
                          <NxDate placeholder="Select date" displayFormat="DD MMM YYYY" />
                        </Form.Item>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Invoice Date</label>
                        <Form.Item
                          name="invoice-date"
                          rules={[{ required: true, message: requiredMessage("Invoice Date") }]}
                          className="no-margin-form"
                        >
                          <NxDate placeholder="Select date" displayFormat="DD MMM YYYY" />
                        </Form.Item>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-2 font-medium">Term of Payments</label>
                        <Form.Item
                          name="terms-of-payment"
                          rules={[
                            {
                              validator: (_, value) => {
                                if (!value?.left || !value?.right) {
                                  return Promise.reject(new Error("Please select both term and days"));
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                          className="no-margin-form"
                        >
                          <NxDualSelect
                            leftProps={{ placeholder: "Term of Payments", options: termsOptions }}
                            rightProps={{ placeholder: "Days", options: daysOptions }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full flex flex-col">
                  <label className="mb-2 font-medium">Description</label>
                  <Form.Item name="description" className="w-full no-margin-form">
                    <Input.TextArea
                      rows={5}
                      maxLength={MAX_DESC_LENGTH}
                      placeholder="Type your remark"
                      onChange={(e) => setDescLength(e.target.value.length)}
                    />
                  </Form.Item>
                  <span className="text-xs text-gray-500 mt-1">
                    You have {descLength} of {MAX_DESC_LENGTH} characters remaining
                  </span>
                </div>
              </div>
            </CollapsibleSection>

            {isPos && <PointOfSalesInfo />}

            {/* Footer */}
            <NxBaseContainer border className="mt-6">
              <div className="steps-action flex w-full justify-between gap-x-2">
                <ButtonComponent type="menu" onClick={handleCancel}>
                  Cancel
                </ButtonComponent>
                <div className="flex w-full justify-end gap-x-4">
                  <ButtonComponent
                    type="reject"
                    icon={<SVGIcon name="IconButtonClear" width={24} />}
                    onClick={handleClearData}
                  >
                    Clear Data
                  </ButtonComponent>
                  <ButtonComponent
                    htmlType="button"
                    loading={loading}
                    isPrimary
                    onClick={handleSave}
                  >
                    Save
                  </ButtonComponent>
                </div>
              </div>
            </NxBaseContainer>
          </Form>
        </div>
      </Spin>
    </>
  );
};

export default PreRequisiteCreateFrom;
