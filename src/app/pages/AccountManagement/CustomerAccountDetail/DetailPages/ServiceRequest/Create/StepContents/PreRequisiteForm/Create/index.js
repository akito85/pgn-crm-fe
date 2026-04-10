import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createPrerequisiteForServiceRequest } from "../../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
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
    data_types,
    data_categories,
    data_subcategories,
    data_priorities,
    data_channels,
    data_sources,
    data_prerequisite_types,
  } = useSelector((state) => state.serviceRequest);

  const dropdowns = {
    serviceRequestTypes: data_types,
    serviceRequestCategories: data_categories,
    serviceRequestSubcategories: data_subcategories,
    serviceRequestPriorities: data_priorities,
    serviceRequestChannels: data_channels,
    serviceRequestSources: data_sources,
    serviceRequestPrerequisites: data_prerequisite_types,
  };

  const {
    account,
    customer,
    serviceRequestData,
    srId,
    accountId: accountIdFromState,
    returnPath,
    returnToStep,
  } = location.state || {};

  const accountId = accountIdFromState || account?.accountInformation?.accountId;

  const [localForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPos, setIsPos] = useState(false);
  const [descLength, setDescLength] = useState(0);
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [srExpanded, setSrExpanded] = useState(true);
  const [prereqExpanded, setPrereqExpanded] = useState(true);

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
        prerequisiteId: values["prerequesite-type"],
        prerequisiteName: values["prerequisite-name"],
        prerequisiteComments: values["description"] || "",
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
        // UPDATE flow: SR sudah ada, simpan langsung ke backend
        await dispatch(
          createPrerequisiteForServiceRequest({ accountId, srId, body: prerequisiteData }),
        ).unwrap();
        navigateBack();
      } else {
        // CREATE flow: SR belum ada, kirim data kembali ke wizard untuk disimpan lokal
        navigateBack({ newPrerequisite: prerequisiteData });
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
