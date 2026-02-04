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
          <BaseContainer border header={"CUSTOMER INFORMATION"}>
            <div className="w-full grid grid-cols-4 gap-x-5">
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
              <DetailText label="Status">
                {data_accountDetail?.accountSummary?.customerStatus
                  ? data_accountDetail?.accountSummary?.customerStatus
                    .charAt(0)
                    .toUpperCase() +
                  data_accountDetail?.accountSummary?.customerStatus
                    .slice(1)
                    .toLowerCase()
                  : ""}
              </DetailText>
              <DetailText label="Description">
                {data_accountDetail?.accountSummary?.description}
              </DetailText>
            </div>
          </BaseContainer>
          <BaseContainer border header={"ACCOUNT INFORMATION"}>
            <div className="w-full grid grid-cols-4 gap-x-4">
              <DetailText label="Account Number">
                {data_accountDetail?.accountSummary?.accountNumber}
              </DetailText>
              <DetailText label="Registration Number">
                {data_accountDetail?.accountSummary?.registrationNumber}
              </DetailText>
              <DetailText label="Account Name">
                {data_accountDetail?.accountSummary?.accountName}
              </DetailText>
              <DetailText label="Category">
                {data_accountDetail?.accountSummary?.accountCategory}
              </DetailText>
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
                {data_accountDetail?.accountSummary?.segment}
              </DetailText>
              <DetailText label="Account Group Type">
                {data_accountDetail?.accountSummary?.accountGroupType}
              </DetailText>
              <DetailText label="Premise Address">
                {data_accountDetail?.accountSummary?.premiseAddress}
              </DetailText>
              <DetailText label="Subdistrict">
                {data_accountDetail?.accountSummary?.subdistrict}
              </DetailText>
              <DetailText label="District">
                {data_accountDetail?.accountSummary?.district}
              </DetailText>
              <DetailText label="City">
                {data_accountDetail?.accountSummary?.city}
              </DetailText>
              <DetailText label="Country">
                {data_accountDetail?.accountSummary?.country}
              </DetailText>
              <DetailText label="Longitude">
                {data_accountDetail?.accountSummary?.longitude}
              </DetailText>
              <DetailText label="Latitude">
                {data_accountDetail?.accountSummary?.latitude}
              </DetailText>
            </div>
          </BaseContainer>
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
