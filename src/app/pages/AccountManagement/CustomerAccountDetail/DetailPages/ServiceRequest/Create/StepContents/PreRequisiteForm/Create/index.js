import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Select, Form, Input, message } from "antd";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../../../../routes/account_management/customer_account_routes";

import { getCustomerDetail } from "../../../../../../../../../../redux/slices/account_management/Customer/customerAccount";
import { getAccountStandardDetail } from "../../../../../../../../../../redux/slices/account_management/accountManagement";
import { requiredMessage } from "../../../../../../../../../../utils";

import LayoutMenu from "../../../../../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../../../../../components/BreadCrumb";
import InputComponent from "../../../../../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../../../../components/DetailText";
import SVGIcon from "../../../../../../../../../../assets/Icon/index";

import NxPanel from "../../../../../../../../../../components/Nx/NxPanel";
import NxDualSelect from "../../../../../../../../../../components/Nx/NxDualSelect";
import NxDate from "../../../../../../../../../../components/Nx/NxDatePicker";

import { PointOfSalesInfo } from "./PointOfSalesInfo"

const PreRequisiteCreateFrom = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dropdowns } = useSelector((state) => state.serviceRequest);

  const {
    account,
    customer,
    serviceRequestData,
    fromWizard,
    returnPath,
    returnToStep,
    prerequisiteFormData,
  } = location.state || {};

  const [localForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPos, setIsPos] = useState(false);

  const accountInfo = account?.accountInformation || {};
  const accountSummary = account?.accountSummary || {};
  const srData = serviceRequestData || {};

  const termsOptions = [{"label": "Terms 1", "value": "t1"}]
  const daysOptions = [{"label": "H+1", "value": "h+1"}]

  // Restore form data if returning from another step
  useEffect(() => {
    if (prerequisiteFormData) {
      localForm.setFieldsValue(prerequisiteFormData);
    }
  }, [prerequisiteFormData, localForm]);

  // Create safe accessor functions
  const getDropdownOptions = (dropdownKey) => {
    if (!dropdowns || !dropdowns[dropdownKey] || !dropdowns[dropdownKey].data) {
      return [];
    }
    return dropdowns[dropdownKey].data.map((item) => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName,
    }));
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


  const handlePrerequisiteTypeChange = (value) => {
    if (value === "2653") {
      setIsPos(true)
    } else {
      setIsPos(false)
    }
  };

  const handleBack = () => {
    // Get current form values before navigating back
    const currentFormValues = localForm.getFieldsValue();

    if (returnPath) {
      navigate(returnPath, {
        replace: true,
        state: {
          returnToStep: returnToStep,
          id: location.state?.id,
          idAccount:
            location.state?.idAccount || account?.accountInformation?.accountId,
          idCustomer: location.state?.idCustomer || customer?.customerId,
          type: location.state?.type,
          // Preserve form data when going back
          prerequisiteFormData: currentFormValues,
          // Pass through all other state that may be needed
          account: account,
          customer: customer,
          serviceRequestData: serviceRequestData,
        },
      });
    } else {
      navigate(-1);
    }
  };

  // Handle form submission
  const handleSave = async () => {
    try {
      // Validate all form fields
      const values = await localForm.validateFields();
      
      console.log("Form validated successfully!");
      console.log("Raw form values:", values);

      // Process the form values
      const formattedData = {
        // Basic prerequisite information
        prerequisiteType: values["prerequesite-type"],
        prerequisiteName: values["prerequisite-name"],
        billingCycle: values["billing-cycle"],
        period: values["period"],
        currency: values["currency"],
        
        // Dates (format as needed for your API)
        transactionDate: NxDate.formatDateForAPI(values["transaction-date"]),
        invoiceDate: NxDate.formatDateForAPI(values["invoice-date"]),
        
        // Terms of payment - extracted from dual select
        termOfPayment: values["terms-of-payment"]?.left || null,
        paymentDays: values["terms-of-payment"]?.right || null,
        
        // Description
        description: values["description"],
        
        // Additional context from service request
        serviceRequestId: srData?.id,
        accountId: accountInfo?.accountId,
        customerId: customer?.customerId,
      };

      console.log("Formatted data for API:", formattedData);

      // Show loading state
      setLoading(true);

      // TODO: Replace this with your actual API call
      // Example:
      // const response = await dispatch(createPrerequisite(formattedData)).unwrap();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      message.success("Pre-requisite created successfully!");

      // Navigate back or to another page after successful save
      if (returnPath) {
        navigate(returnPath, {
          state: {
            id: location.state?.id,
            idAccount: location.state?.idAccount,
            idCustomer: location.state?.idCustomer,
            account: account,
            customer: customer,
            serviceRequestData: serviceRequestData,
            // Clear the prerequisite form data since we saved
            prerequisiteFormData: null,
          },
        });
      } else {
        navigate(-1);
      }

    } catch (error) {
      console.error("Form validation or save failed:", error);
      
      if (error.errorFields) {
        // Validation errors
        message.error("Please fill in all required fields correctly");
        console.log("Validation errors:", error.errorFields);
      } else {
        // API or other errors
        message.error(error.message || "Failed to save pre-requisite");
      }
    } finally {
      setLoading(false);
    }
  };

  // Optional: Preview current form values
  const handlePreview = () => {
    const values = localForm.getFieldsValue();
    console.log("Current form values:", values);
    
    // Show in a modal or log
    console.log("Terms of Payment:", {
      term: values["terms-of-payment"]?.left,
      days: values["terms-of-payment"]?.right,
    });
    
    message.info("Check console for current form values");
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading} className={"w-full top-20"}>
        <NxPanel title={"ACCOUNT INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Account">
              {srData?.srFormAccountId || accountInfo?.accountId || "-"}
            </DetailText>
            <DetailText label="Account SOR">
              {srData?.srFormAccountSor || accountInfo?.sor || "-"}
            </DetailText>
            <DetailText label="Account Cost Center">
              {srData?.srFormAccountCostCenter ||
                accountSummary?.costCenter ||
                "-"}
            </DetailText>
            <DetailText label="Meter Reading Code">
              {srData?.srFormMeterReadingCode ||
                accountSummary?.meterReadingCodes ||
                "-"}
            </DetailText>
            <DetailText label="Account Segment">
              {srData?.srFormAccountSegment || accountInfo?.segment || "-"}
            </DetailText>
            <DetailText label="Account Group Type">
              {srData?.srFormAccountGroupType ||
                accountInfo?.accountGroupType ||
                "-"}
            </DetailText>
            <DetailText label="Account Type">
              {srData?.srFormAccountType || accountInfo?.accountType || "-"}
            </DetailText>
            <DetailText label="Premise Address">
              {srData?.srFormPremiseAddress || "-"}
            </DetailText>
            <DetailText label="Subdistrict">
              {srData?.srFormSubdistrict || "-"}
            </DetailText>
            <DetailText label="District">
              {srData?.srFormDistrict || "-"}
            </DetailText>
            <DetailText label="City">{srData?.srFormCity || "-"}</DetailText>
            <DetailText label="Country">
              {srData?.srFormCountry || "-"}
            </DetailText>
            <DetailText label="Latitude">{"-"}</DetailText>
            <DetailText label="Longitude">{"-"}</DetailText>
          </div>
        </NxPanel>

        <NxPanel title={"SERVICE REQUEST"}>
          <div className="w-full grid grid-cols-4 gap-4">
            <DetailText label="Service Request Reference">
              {srData?.srr || "-"}
            </DetailText>
            <DetailText label="Cost Center">
              {srData?.srFormAccountCostCenter ||
                accountSummary?.costCenter ||
                "-"}
            </DetailText>
            <DetailText label="Type">
              {dropdowns?.serviceRequestTypes?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() === srData?.type?.toString() ||
                  item.id?.toString() === srData?.type?.toString(),
              )?.name ||
                srData?.type ||
                "-"}
            </DetailText>
            <DetailText label="Category">
              {dropdowns?.serviceRequestCategories?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() ===
                    srData?.category?.toString() ||
                  item.id?.toString() === srData?.category?.toString(),
              )?.name ||
                srData?.category ||
                "-"}
            </DetailText>
            <DetailText label="Sub Category">
              {dropdowns?.serviceRequestSubcategories?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() ===
                    srData?.subCategory?.toString() ||
                  item.id?.toString() === srData?.subCategory?.toString(),
              )?.name ||
                srData?.subCategory ||
                "-"}
            </DetailText>
            <DetailText label="Channel">
              {dropdowns?.serviceRequestChannels?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() ===
                    srData?.channel?.toString() ||
                  item.id?.toString() === srData?.channel?.toString(),
              )?.name ||
                srData?.channel ||
                "-"}
            </DetailText>
            <DetailText label="Priority">
              {dropdowns?.serviceRequestPriorities?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() ===
                    srData?.priority?.toString() ||
                  item.id?.toString() === srData?.priority?.toString(),
              )?.name ||
                srData?.priority ||
                "-"}
            </DetailText>
            <DetailText label="Request Source">
              {dropdowns?.serviceRequestSources?.data?.find(
                (item) =>
                  item.glbTypeValId?.toString() ===
                    srData?.requestSource?.toString() ||
                  item.id?.toString() === srData?.requestSource?.toString(),
              )?.name ||
                srData?.requestSource ||
                "-"}
            </DetailText>
            <DetailText label="Request Date">
              {NxDate.formatDate(srData?.requestDate)}
            </DetailText>
          </div>
          <div className="w-full mt-3">
            <DetailText label="Description">
              {srData?.description || "-"}
            </DetailText>
          </div>
        </NxPanel>

        <Form form={localForm} layout="vertical" onFinish={handleSave}>
          <NxPanel title={"PRE-REQUISITE INFORMATION"}>
            <div className="w-full grid grid-cols-3 gap-5 mb-5">
              <div className="flex flex-col">
                <label className="mb-2 font-medium">Type</label>
                <Form.Item
                  key="prerequsite-type"
                  name={"prerequesite-type"}
                  rules={[
                    {
                      message: requiredMessage("Type"),
                      required: true,
                    },
                  ]}
                  className="no-margin-form"
                >
                  <Select
                    placeholder="Select Pre Requisite Types"
                    loading={!dropdowns?.serviceRequestPrerequisites?.data}
                    options={getDropdownOptions("serviceRequestPrerequisites")}
                    onChange={handlePrerequisiteTypeChange}
                  />
                </Form.Item>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium">Name</label>
                <Form.Item
                  key="prerequsite-name"
                  name={"prerequisite-name"}
                  className="no-margin-form"
                  rules={[
                    {
                      message: requiredMessage("Name"),
                      required: true,
                    },
                  ]}
                >
                  <InputComponent className="flex-1" />
                </Form.Item>
              </div>
            </div>
            { isPos && (
            <>
              <div className="w-full grid grid-cols-3 gap-5 mb-5">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Billing Cycle</label>
                  <Form.Item
                    key="billing-cycle"
                    name={"billing-cycle"}
                    rules={[
                      {
                        message: requiredMessage("Billing Cycle"),
                        required: true,
                      },
                    ]}
                    className="no-margin-form"
                  >
                    <Select
                      placeholder="Select Billing Cycle"
                      loading={!dropdowns?.serviceRequestPrerequisites?.data}
                      options={getDropdownOptions("serviceRequestPrerequisites")}
                      disabled={true}
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Period</label>
                  <Form.Item
                    key="period"
                    name={"period"}
                    rules={[
                      {
                        message: requiredMessage("period"),
                        required: true,
                      },
                    ]}
                    className="no-margin-form"
                  >
                    <Select
                      placeholder="Select Billing Period"
                      loading={!dropdowns?.serviceRequestPrerequisites?.data}
                      options={getDropdownOptions("serviceRequestPrerequisites")}
                      disabled={true}
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Currency</label>
                  <Form.Item
                    key="currency"
                    name={"currency"}
                    rules={[
                      {
                        message: requiredMessage("Currency"),
                        required: true,
                      },
                    ]}
                    className="no-margin-form"
                  >
                    <Select
                      placeholder="Select Currency"
                      loading={!dropdowns?.serviceRequestPrerequisites?.data}
                      options={getDropdownOptions("serviceRequestPrerequisites")}
                      disabled={true}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 gap-5">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Transaction Date</label>
                  <Form.Item
                    key="transaction-date"
                    name={"transaction-date"}
                    rules={[
                      {
                        message: requiredMessage("transaction-date"),
                        required: true,
                      },
                    ]}
                    className="no-margin-form"
                  >
                   <NxDate 
                      label="Transaction Date"
                      placeholder="Select date"
                      displayFormat="DD MMM YYYY"
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Invoice Date</label>
                  <Form.Item
                    key="invoice-date"
                    name={"invoice-date"}
                    rules={[
                      {
                        message: requiredMessage("Invoice Date"),
                        required: true,
                      },
                    ]}
                    className="no-margin-form"
                  >
                   <NxDate 
                      label="Invoice Date"
                      placeholder="Select date"
                      displayFormat="DD MMM YYYY"
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col">
                  <label className="mb-2 font-medium">Term of Payments</label>
                  <Form.Item
                    key="terms-of-payment"
                    name={"terms-of-payment"}
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || !value.left || !value.right) {
                            return Promise.reject(new Error('Please select both term and days'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                    className="no-margin-form"
                  >
                    <NxDualSelect
                      leftProps={{
                        placeholder: "Term of Payments",
                        options: termsOptions,
                      }}
                      rightProps={{
                        placeholder: "Days",
                        options: daysOptions,
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </>
            )}
            <div className="w-full flex flex-col mt-5">
              <label className="mb-2 font-medium">Description</label>
              <Form.Item
                name={"description"}
                rules={[
                  { message: requiredMessage("Description"), required: true },
                ]}
                className="w-full"
              >
                <InputComponent
                  group
                  rows={5}
                  type="textarea"
                  value=""
                  placeholder={"Type your remark"}
                />
              </Form.Item>
            </div>
          </NxPanel>

          { isPos && (<PointOfSalesInfo />) }

          <div className="steps-action my-8 flex w-full justify-between gap-x-2">
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              onClick={handleBack}
            >
              Back
            </ButtonComponent>
            <div className="flex w-full justify-end gap-x-4">

              {/*
              <ButtonComponent
                onClick={handlePreview}
                type={"submit"}
              >
                Preview Values
              </ButtonComponent>
              */}

              <ButtonComponent
                onClick={() => {
                  localForm.resetFields();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconClear" width={24} />}
              >
                Clear
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                loading={loading}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>
    </LayoutMenu>
  );
};

export default PreRequisiteCreateFrom;
