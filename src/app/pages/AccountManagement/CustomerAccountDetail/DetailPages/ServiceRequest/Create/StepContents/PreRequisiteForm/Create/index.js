import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin, Select, Form, Input } from "antd";
import { ClearOutlined } from "@ant-design/icons";

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

const PreRequisiteCreateFrom = (props) => {
  const { EventType } = props;

  const dispatch = useDispatch();
  const { data_customerDetail, loading, loadingAccount } = useSelector(
    (state) => state.customerAccount,
  );
  const {
    access_account,
    data_accountDetail,
    loading: loadingAccountDetail,
  } = useSelector((state) => state.accountManagement);
  const isLoading = loading || loadingAccount || loadingAccountDetail || "";

  const location = useLocation();
  const id = location?.state?.id;

  console.log(id);

  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
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
      breadcrumbName: "Pre-Requesite",
    },
    {
      path: "",
      breadcrumbName: "Create",
    },
  ];

  const data = [];
  const accountInfo = [];
  const ServiceRequestDummy = {
    serviceRequestNumber: "SR20240800000002",
    serviceRequestReference: "SR20240800000004",
    costCenter: "015 - AREA BOGOR",
    type: "Field Service",
    category: "Gas Management",
    subCategory: "Gas Termination",
    channel: "Manual",
    priority: "High",
    requestSource: "Customer",
    requestDate: "21 Jan 2022 12:34:34",
    openDate: "21 Jan 2022 12:34:34",
    resolvedDate: "21 Jan 2022 12:34:34",
    closedDate: "21 Jan 2022 12:34:34",
    ageHour: "3.4",
    statusApproval: "Approved",
    statusPreRequisite: "Completed",
    status: "Open",
    description: "-",
  };

  return (
    <LayoutMenu>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <NxPanel title={"ACCOUNT INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Account">
              {accountInfo?.accountId || "-"}
            </DetailText>
            <DetailText label="Account SOR">
              {accountInfo?.sor || "-"}
            </DetailText>
            <DetailText label="Account Cost Center">
              {accountInfo?.costCenter || "-"}
            </DetailText>
            <DetailText label="Meter Reading Code">
              {accountInfo?.mrc || "-"}
            </DetailText>
            <DetailText label="Account Segment">
              {accountInfo?.accountSegment || "-"}
            </DetailText>
            <DetailText label="Account Group Type">
              {accountInfo?.accountGroupType || "-"}
            </DetailText>
            <DetailText label="Account Type">
              {accountInfo?.accountType || "-"}
            </DetailText>
            <DetailText label="Premise Address">
              {accountInfo?.premiseAddress || "-"}
            </DetailText>
            <DetailText label="Subdistrict">
              {accountInfo?.subDistrict || "-"}
            </DetailText>
            <DetailText label="District">
              {accountInfo?.district || "-"}
            </DetailText>
            <DetailText label="City">{accountInfo?.city || "-"}</DetailText>
            <DetailText label="Country">
              {accountInfo?.country || "-"}
            </DetailText>
            <DetailText label="Latitude">
              {accountInfo?.latitude || "-"}
            </DetailText>
            <DetailText label="Longitude">
              {accountInfo?.longitude || "-"}
            </DetailText>
          </div>
        </NxPanel>

        <NxPanel title={"SERVICE REQUEST"}>
          <div className="w-full grid grid-cols-4 gap-4">
            {/* Service Request Information */}
            <DetailText label="Service Request Number">
              {data?.serviceRequestNumber ||
                ServiceRequestDummy.serviceRequestNumber}
            </DetailText>
            <DetailText label="Service Request Reference">
              <u>
                {data?.serviceRequestReference ||
                  ServiceRequestDummy.serviceRequestReference}
              </u>
            </DetailText>
            <DetailText label="Cost Center">
              {data?.costCenter || ServiceRequestDummy.costCenter}
            </DetailText>
            <DetailText label="Type">
              {data?.type || ServiceRequestDummy.type}
            </DetailText>
            <DetailText label="Category">
              {data?.category || ServiceRequestDummy.category}
            </DetailText>
            <DetailText label="Sub Category">
              {data?.subCategory || ServiceRequestDummy.subCategory}
            </DetailText>
            <DetailText label="Channel">
              {data?.channel || ServiceRequestDummy.channel}
            </DetailText>
            <DetailText label="Priority">
              {data?.priority || ServiceRequestDummy.priority}
            </DetailText>
            <DetailText label="Request Source">
              {data?.requestSource || ServiceRequestDummy.requestSource}
            </DetailText>
            <DetailText label="Request Date">
              {data?.requestDate || ServiceRequestDummy.requestDate}
            </DetailText>
            <DetailText label="Open Date">
              {data?.openDate || ServiceRequestDummy.openDate}
            </DetailText>
            <DetailText label="Resolved Date">
              {data?.resolvedDate || ServiceRequestDummy.resolvedDate}
            </DetailText>
            <DetailText label="Closed Date">
              {data?.closedDate || ServiceRequestDummy.closedDate}
            </DetailText>
            <DetailText label="Age (Hour)">
              {data?.ageHour || ServiceRequestDummy.ageHour}
            </DetailText>
            <DetailText label="Status Approval">
              {data?.statusApproval || ServiceRequestDummy.statusApproval}
            </DetailText>
            <DetailText label="Status Pre-Requisite">
              {data?.statusPreRequisite ||
                ServiceRequestDummy.statusPreRequisite}
            </DetailText>
            <DetailText label="Status">
              {data?.status || ServiceRequestDummy.status}
            </DetailText>
          </div>
          <div className="w-full">
            <DetailText label="Description">
              {data?.description || ServiceRequestDummy.description}
            </DetailText>
          </div>
        </NxPanel>

        <NxPanel title={"PRE-REQUISITE INFORMATION"}>
          <div className="w-full grid grid-cols-2 gap-5">
            <div class="flex flex-col">
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
                  placeholder="Select Type"
                  options={[
                    { value: "technical", label: "Technical" },
                    { value: "billing", label: "Billing" },
                    { value: "customer_service", label: "Customer Service" },
                    { value: "maintenance", label: "Maintenance" },
                    // Add more options as needed
                  ]}
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
            onClick={() => {
              console.log("setModalBack");
            }}
          >
            Back
          </ButtonComponent>
          <div className="flex w-full justify-end gap-x-4">
            <ButtonComponent
              onClick={() => {
                console.log("Reset");
              }}
              type={"submit"}
              icon={
                <ClearOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                  }}
                />
              }
            >
              Reset
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
      </Spin>
    </LayoutMenu>
  );
};

export default PreRequisiteCreateFrom;
