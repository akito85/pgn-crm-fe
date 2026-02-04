import { Fragment } from "react";
import { useEffect } from "react";
import DetailText from "../../../../components/DetailText";
import { useSelector } from "react-redux";
import {
  getAccountOneTimeDetail,
  getAccountStandardDetail,
} from "../../../../redux/slices/account_management/accountManagement";
import { renderDate } from "../../RatingBillingInvoice/POS/Utils";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import BaseContainer from "../../../../components/BaseContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../components/Nx/NxDetailText";

const HeaderDetail = ({
  data_header = [],
  dispatch = () => { },
  type = "",
  idCustomer = 0,
  idAccount = 0,
  variant = "card", // "default" for legacy, "card" for new design
}) => {
  const { data_accountDetail } = useSelector(
    (state) => state.accountManagement
  );

  useEffect(() => {
    if (idAccount && idCustomer && type) {
      if (type === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, type]);

  // New card-based design (selected if variant is not selected)
  if (variant === "card") {
    return (
      <NxCardContainer header={"CUSTOMER & ACCOUNT INFORMATION"}>
        <div className="flex flex-col gap-y-4">
          <NxBaseContainer border header={"CUSTOMER INFORMATION"}>
            <div className="w-full grid grid-cols-4 gap-4">
              <NxDetailText label="Customer Number">
                {data_accountDetail?.accountSummary?.customerNumber}
              </NxDetailText>
              <NxDetailText label="Identification Type">
                {data_accountDetail?.accountSummary?.customerIdentificationType}
              </NxDetailText>
              <NxDetailText label="Customer Identification Number">
                {data_accountDetail?.accountSummary?.customerIdentificationNumber}
              </NxDetailText>
              <NxDetailText label="Customer Name">
                {data_accountDetail?.accountSummary?.customerName}
              </NxDetailText>
              <NxDetailText label="Customer Type">
                {data_accountDetail?.accountSummary?.customerType}
              </NxDetailText>
              <NxDetailText label="Birth/Founded Date">
                {renderDate(
                  data_accountDetail?.accountSummary?.birthFoundedDate,
                  "date"
                )}
              </NxDetailText>
              <NxDetailText label="Birth/Founded Place">
                {data_accountDetail?.accountSummary?.birthFoundedPlace}
              </NxDetailText>
              <NxDetailText label="Sex">
                {data_accountDetail?.accountSummary?.sex}
              </NxDetailText>
              <NxDetailText label="Marital Status">
                {data_accountDetail?.accountSummary?.maritalStatus}
              </NxDetailText>
              <NxDetailText label="Search Key">
                {data_accountDetail?.accountSummary?.searchKey}
              </NxDetailText>
              <NxDetailText label="Status">
                {data_accountDetail?.accountSummary?.customerStatus
                  ? data_accountDetail?.accountSummary?.customerStatus
                    .charAt(0)
                    .toUpperCase() +
                  data_accountDetail?.accountSummary?.customerStatus
                    .slice(1)
                    .toLowerCase()
                  : ""}
              </NxDetailText>
              <NxDetailText label="Description">
                {data_accountDetail?.accountSummary?.description}
              </NxDetailText>
            </div>
          </NxBaseContainer>
          <NxBaseContainer border header={"ACCOUNT INFORMATION"}>
            <div className="w-full grid grid-cols-4 gap-4">
              <NxDetailText label="Account Number">
                {data_accountDetail?.accountSummary?.accountNumber}
              </NxDetailText>
              <NxDetailText label="Registration Number">
                {data_accountDetail?.accountSummary?.registrationNumber}
              </NxDetailText>
              <NxDetailText label="Account Name">
                {data_accountDetail?.accountSummary?.accountName}
              </NxDetailText>
              <NxDetailText label="Category">
                {data_accountDetail?.accountSummary?.accountCategory}
              </NxDetailText>
              <NxDetailText label="SOR">
                {data_accountDetail?.accountSummary?.sor}
              </NxDetailText>
              <NxDetailText label="Cost Center">
                {data_accountDetail?.accountSummary?.costCenter}
              </NxDetailText>
              <NxDetailText label="Meter Reading Codes">
                {data_accountDetail?.accountSummary?.meterReadingCodes}
              </NxDetailText>
              <NxDetailText label="Customer Management">
                {data_accountDetail?.accountSummary?.customerManagement}
              </NxDetailText>
              <NxDetailText label="Classification Type">
                {data_accountDetail?.accountSummary?.classificationType}
              </NxDetailText>
              <NxDetailText label="Segment">
                {data_accountDetail?.accountSummary?.segment}
              </NxDetailText>
              <NxDetailText label="Account Group Type">
                {data_accountDetail?.accountSummary?.accountGroupType}
              </NxDetailText>
              <NxDetailText label="Premise Address">
                {data_accountDetail?.accountSummary?.premiseAddress}
              </NxDetailText>
              <NxDetailText label="Subdistrict">
                {data_accountDetail?.accountSummary?.subdistrict}
              </NxDetailText>
              <NxDetailText label="District">
                {data_accountDetail?.accountSummary?.district}
              </NxDetailText>
              <NxDetailText label="City">
                {data_accountDetail?.accountSummary?.city}
              </NxDetailText>
              <NxDetailText label="Country">
                {data_accountDetail?.accountSummary?.country}
              </NxDetailText>
              <NxDetailText label="Longitude">
                {data_accountDetail?.accountSummary?.longitude}
              </NxDetailText>
              <NxDetailText label="Latitude">
                {data_accountDetail?.accountSummary?.latitude}
              </NxDetailText>
            </div>
          </NxBaseContainer>
        </div>
      </NxCardContainer>
    );
  }

  // Legacy design (variant="default")
  return (
    <Fragment>
      <NxCardContainer header={data_header[0]}>
        <div className="w-full grid grid-cols-4 gap-4">
          {/* cusstomer information */}
          <DetailText label="Customer Number">
            {data_accountDetail?.accountSummary?.customerNumber}
          </DetailText>
          <DetailText label="Identification Type">
            {data_accountDetail?.accountSummary?.customerIdentificationType}
          </DetailText>
          <DetailText label="Customer Identification Number">
            {data_accountDetail?.accountSummary?.customerIdentificationNumber}
          </DetailText>
          <DetailText label="Customer Name">
            {data_accountDetail?.accountSummary?.customerName}
          </DetailText>
          <DetailText label="Customer Type">
            {data_accountDetail?.accountSummary?.customerType}
          </DetailText>
          <DetailText label="Birth/Founded Date">
            {renderDate(
              data_accountDetail?.accountSummary?.birthFoundedDate,
              "date"
            )}
          </DetailText>
          <DetailText label="Birth/Founded Place">
            {data_accountDetail?.accountSummary?.birthFoundedPlace}
          </DetailText>
          <DetailText label="Sex">
            {data_accountDetail?.accountSummary?.sex}
          </DetailText>
          <DetailText label="Marital Status">
            {data_accountDetail?.accountSummary?.maritalStatus}
          </DetailText>
          <DetailText label="Search Key">
            {data_accountDetail?.accountSummary?.searchKey}
          </DetailText>
          {/* <DetailText label="Customer Reference ID">
            {data_accountDetail?.accountSummary?.customerRefId}
          </DetailText> */}
          <DetailText label="Status">
            {/* <div className=" flex justify-start"> */}
            {/* <StatusComponent
                colour={data_accountDetail?.accountSummary?.customerStatus}
              > */}
            {/* <div className="flex justify-center px-5"> */}
            {data_accountDetail?.accountSummary?.customerStatus
              ? data_accountDetail?.accountSummary?.customerStatus
                .charAt(0)
                .toUpperCase() +
              data_accountDetail?.accountSummary?.customerStatus
                .slice(1)
                .toLowerCase()
              : ""}
            {/* </div> */}
            {/* </StatusComponent> */}
            {/* </div> */}
          </DetailText>
        </div>
        <div className="w-full">
          <DetailText label="Description">
            {data_accountDetail?.accountSummary?.description}
          </DetailText>
        </div>
        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {data_header[1]}
        </div>

        {/* account information */}
        <div className="w-full grid grid-cols-4 gap-4">
          <DetailText label="Account Number">
            {data_accountDetail?.accountSummary?.accountNumber}
          </DetailText>
          <DetailText label="Account Registration Number">
            {data_accountDetail?.accountSummary?.registrationNumber}
          </DetailText>
          <DetailText label="Account Name">
            {data_accountDetail?.accountSummary?.accountName}
          </DetailText>
          <DetailText label="Category">
            {data_accountDetail?.accountSummary?.accountCategory}
          </DetailText>
          <div style={{ display: "none" }}>
            <DetailText label="SOR">
              {data_accountDetail?.accountSummary?.sor}
            </DetailText>
            <DetailText label="Cost Center">
              {data_accountDetail?.accountSummary?.costCenter}
            </DetailText>
            <DetailText label="Meter Reading Codes">
              {data_accountDetail?.accountSummary?.meterReadingCodes}
            </DetailText>
            <DetailText label="Customer Management">
              {data_accountDetail?.accountSummary?.customerManagement}
            </DetailText>
            <DetailText label="Classification Type">
              {data_accountDetail?.accountSummary?.classificationType}
            </DetailText>
            <DetailText label="Segment">
              <span id="segment">
                {data_accountDetail?.accountSummary?.segment}
              </span>
            </DetailText>
            <DetailText label="Account Group Type">
              {data_accountDetail?.accountSummary?.accountGroupType}
            </DetailText>
            {/* <DetailText label="Status"> */}
            {/* <div className=" flex justify-start">
              <StatusComponent
                colour={data_accountDetail?.accountSummary?.accountStatus}
              >
                <div className="flex justify-center px-5"> */}
            {/* {data_accountDetail?.accountSummary?.accountStatus} */}
            {/* </div>
              </StatusComponent>
            </div> */}
            {/* </DetailText> */}
          </div>
        </div>
      </NxCardContainer>
    </Fragment>
  );
};

export default HeaderDetail;
