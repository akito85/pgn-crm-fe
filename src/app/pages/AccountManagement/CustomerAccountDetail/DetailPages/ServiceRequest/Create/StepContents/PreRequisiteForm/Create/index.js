import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Select, Form, Input } from "antd";

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

import moment from "moment";

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
  } = location.state || {};

  const [localForm] = Form.useForm();

  const accountInfo = account?.accountInformation || {};
  const accountSummary = account?.accountSummary || {};
  const srData = serviceRequestData || {};

  console.log("PreRequisite Create - Received data:", srData);

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

  const handleBack = () => {
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
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={false} className={"w-full top-20"}>
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
              {srData?.requestDate
                ? moment(srData.requestDate).format("DD MMM YYYY HH:mm:ss")
                : "-"}
            </DetailText>
          </div>
          <div className="w-full mt-3">
            <DetailText label="Description">
              {srData?.description || "-"}
            </DetailText>
          </div>
        </NxPanel>

        <Form form={localForm} layout="vertical">
          <NxPanel title={"PRE-REQUISITE INFORMATION"}>
            <div className="w-full grid grid-cols-2 gap-5">
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
                  onChange={(e) => console.log("setRemark")}
                />
              </Form.Item>
            </div>
          </NxPanel>
          <div className="steps-action my-8 flex w-full justify-between gap-x-2">
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              onClick={handleBack}
            >
              Back
            </ButtonComponent>
            <div className="flex w-full justify-end gap-x-4">
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
                onClick={() => console.log("Processing complete!")}
                type={"submit"}
                htmlType={"submit"}
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
