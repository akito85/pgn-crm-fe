import React, { useState, useEffect } from "react";
import RadioTabs from "../../../../../../../components/RadioTabs";
import { useSelector } from "react-redux";
import DetailText from "../../../../../../../components/DetailText";
import { Spin } from "antd";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import {
  getAccountCategory,
  getAccountGroupType,
  getAccountSegment,
  getAccountType,
  getBudget,
  getBudgetYear,
  getClassificationType,
  getIndustrialSector,
  getMaritalStatus,
  getMeterReadingCode,
  getPriority,
  getSex,
  getTeritory,
  getCustomerType,
  getIdentificationType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import AttachmentForm from "../../Form/CustomerAccountInformation/AttachmentForm";
import { handleDate } from "../../../../Utils";

const AccountInformation = ({
  dataCheck,
  dataCI,
  dataAI,
  dataCustomer,
  dispatch = () => {},
  listAttachment = [],
}) => {
  // Selector
  const {
    data_customerType,
    data_identificationType,
    loading,
    data_sex,
    data_maritalStatus,
    data_MRC,
    data_accountCategory,
    data_accountSegment,
    data_accountGroupType,
    data_accountType,
    data_classificationType,
    data_priority,
    data_industrialSector,
    data_budgetYear,
    data_budget,
    data_teritory,
  } = useSelector((state) => state.account);

  // Use Effect
  useEffect(() => {
    dispatch(getCustomerType());
    dispatch(getIdentificationType());
    dispatch(getSex());
    dispatch(getMaritalStatus());
    dispatch(getMeterReadingCode());
    dispatch(getAccountCategory());
    dispatch(getAccountSegment());
    dispatch(getAccountType());
    dispatch(getClassificationType());
    dispatch(getPriority());
    dispatch(getIndustrialSector());
    dispatch(getBudgetYear());
    dispatch(getBudget());
    dispatch(getTeritory());
    dispatch(getCustomerType());
    dispatch(getIdentificationType());
  }, []);

  useEffect(() => {
    if (dataAI?.segment) {
      dispatch(getAccountGroupType(dataAI?.segment));
    }
  }, [dataAI]);

  // State
  const [valuePage, setValuePage] = useState("");

  // Customer Information
  const labelSex = data_sex
    ?.filter((a) => a.id === dataCI?.sex)
    ?.find((b) => b.name)?.name;

  const labelMaritalStatus = data_maritalStatus
    ?.filter((a) => a.id === dataCI?.maritalStatus)
    ?.find((b) => b.name)?.name;

  const labelCT = data_customerType
    ?.filter((a) => a.id === dataCI?.customerType)
    ?.find((b) => b.name)?.name;

  const labelIT = data_identificationType
    ?.filter((a) => a.id === dataCI?.identificationType)
    ?.find((b) => b.name)?.name;

  // Account Information
  const labelCategory = data_accountCategory
    ?.filter((a) => a.id === dataAI?.accountCategory)
    ?.find((b) => b.name)?.name;

  const labelMRC = data_MRC
    ?.filter((a) => a.id === dataAI?.meterReadingCode)
    ?.find((b) => b.name)?.name;

  const labelAccountSegment = data_accountSegment
    ?.filter((a) => a.id === dataAI?.accountSegment)
    ?.find((b) => b.name)?.name;

  const labelAccountGroupType = data_accountGroupType
    ?.filter((a) => a.id === dataAI?.accountGroupType)
    ?.find((b) => b.name)?.name;

  const labelAccountType = data_accountType
    ?.filter((a) => a.id === dataAI?.accountType)
    ?.find((b) => b.name)?.name;

  const labelClassificationType = data_classificationType
    ?.filter((a) => a.id === dataAI?.accountRuleId)
    ?.find((b) => b.name)?.name;

  const labelPriorityType = data_priority
    ?.filter((a) => a.id === dataAI?.priority)
    ?.find((b) => b.name)?.name;

  // const labelIndustrialSector = data_industrialSector
  //   ?.filter((a) => a.id === dataAI?.industrialSector)
  //   ?.find((b) => b.name)?.name;

  const labelIndustrialSector = data_industrialSector?.reduce(
    (result, item) => {
      if (
        item.children &&
        item.children.find((child) => child.value === dataAI?.industrialSector)
      ) {
        result = item.children.find(
          (child) => child.value === dataAI?.industrialSector,
        ).title;
      }
      return result;
    },
    "",
  );

  const labelBudgetYear = data_budgetYear
    ?.filter((a) => a.id === dataAI?.budgetYear)
    ?.find((b) => b.name)?.name;

  const labelBudget = data_budget
    ?.filter((a) => a.id === dataAI?.budget)
    ?.find((b) => b.name)?.name;

  const labelTeritory = data_teritory
    ?.filter((a) => a.id === dataAI?.teritory)
    ?.find((b) => b.name)?.name;

  const tabPages = [
    { value: "Customer/Account Information" },
    { value: "Attachment" },
  ];

  const attachmentInformation = () => {
    return (
      <>
        <div className="w-full p-5">
          <AttachmentForm type={"preview"} data={listAttachment} />
        </div>
      </>
    );
  };

  const customerAccountInformation = () => {
    return (
      <>
        {/* {dataCheck !== true ? ( */}
        <div className="w-full p-5">
          <p className="text-primary uppercase font-bold">
            customer information
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"First Name"}>
              {(dataCI?.firstName || "").toUpperCase()}
            </DetailText>
            <DetailText label={"Middle Name"}>
              {(dataCI?.middleName || "").toUpperCase()}
            </DetailText>
            <DetailText label={"Last Name"}>
              {(dataCI?.lastName || "").toUpperCase()}
            </DetailText>

            <DetailText label={"Customer Name"}>
              {`${(dataCI?.firstName || "").toUpperCase()} ${(dataCI?.middleName || "").toUpperCase()} ${(dataCI?.lastName || "").toUpperCase()}`}
            </DetailText>

            <DetailText label={"Birth/Founded Date"}>
              {handleDate(dataCI?.foundedBirthDate2)}
            </DetailText>
            <DetailText label={"Birth/Founded Place"}>
              {dataCI?.foundedBirthPlace}
            </DetailText>
            <DetailText label={"Sex"}>{labelSex}</DetailText>
            <DetailText label={"Marital Status"}>
              {labelMaritalStatus}
            </DetailText>
            <DetailText label={"Search Key"}>{dataCI?.searchKey}</DetailText>
            <DetailText label={"Description"}>{dataCI?.description}</DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account information
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"Account Group"}>
              {dataCustomer?.accountGroup?.name}
            </DetailText>
            <DetailText label={"Customer Management"}>
              {dataCustomer?.customerManagement?.name}
            </DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account location information
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"SOR"}>{dataCustomer?.sor?.name}</DetailText>
            <DetailText label={"Cost Center"}>
              {dataCustomer?.cc?.name}
            </DetailText>
            <DetailText label={"Meter Reading Code"}>{labelMRC}</DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account identification
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"Account Name"}>
              {dataAI?.accountName}
            </DetailText>
            <DetailText label={"Account Registration Number"}>
              {dataAI?.registrationNumber}
            </DetailText>
            <DetailText label={"Category"}>{labelCategory}</DetailText>
            <DetailText label={"Description"}>{dataAI?.description}</DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account segment information
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"Account Segment"}>
              {labelAccountSegment}
            </DetailText>
            <DetailText label={"Account Group Type"}>
              {labelAccountGroupType}
            </DetailText>
            <DetailText label={"Account Type"}>{labelAccountType}</DetailText>
            <DetailText label={"Classification Type"}>
              {labelClassificationType}
            </DetailText>
            <DetailText label={"Priority"}>{labelPriorityType}</DetailText>
            <DetailText label={"Corporate Customer"}>
              {dataAI?.corporateFlag === false ? "No" : "Yes"}
            </DetailText>
            <DetailText label={"Rating & Billing Exception"}>
              {dataAI?.exceptionFlag === false ? "No" : "Yes"}
            </DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account industrial sector
          </p>

          <div className="w-full grid grid-cols-1 gap-4">
            <DetailText label={"Industrial Sector"}>
              {labelIndustrialSector}
            </DetailText>
          </div>

          <p className="text-primary uppercase font-bold pt-[30px]">
            account budget
          </p>

          <div className="w-full grid grid-cols-3 gap-4">
            <DetailText label={"Budget Year"}>{labelBudgetYear}</DetailText>
            <DetailText label={"Budget"}>{labelBudget}</DetailText>
            <DetailText label={"Teritory"}>{labelTeritory}</DetailText>
          </div>
        </div>
        {/* ) : null} */}
      </>
    );
  };

  const layout = (valuePage) => {
    switch (valuePage) {
      case "Customer/Account Information":
        return customerAccountInformation();
      case "Attachment":
        return attachmentInformation();
      default:
        return customerAccountInformation();
    }
  };

  return (
    <Spin spinning={loading}>
      {/* {dataCheck !== true ? ( */}
      <RadioTabs
        data={
          dataCustomer?.registered
            ? tabPages.filter((tabPage) => tabPage.value !== "Attachment")
            : tabPages
        }
        onChange={(e) => setValuePage(e.target.value)}
        currentPosition={valuePage}
      />
      {/* ) : null} */}
      <div className="mt-[30px]">{layout(valuePage)}</div>
    </Spin>
  );
};

export default AccountInformation;
