import { Fragment } from "react";
import BaseContainer from "../../../../../../../components/BaseContainer";
import CustomerInformation from "../../../../Customer/DetailPages/CustomerInformation";
import DetailText from "../../../../../../../components/DetailText";


const CustomerServiceRequestHeader = ({
  id = 0,
  data_detail = {},
  data_accountDetail = {},
  dispatch = () => {},
  access_account
}) => {
  const accountInfo = data_accountDetail?.accountInformation || {};

  return (
    <Fragment>
      <BaseContainer header={"CUSTOMER INFORMATION"}>
        <CustomerInformation data={data_detail} type={data_detail?.customerTypeId} />
      </BaseContainer>

      {/* Account Information Section */}
      {accountInfo && Object.keys(accountInfo).length > 0 && (
        <BaseContainer header={"ACCOUNT INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-3">
            <DetailText label="Account">{accountInfo?.accountId || "-"}</DetailText>
            <DetailText label="Account SOR">{accountInfo?.sor || "-"}</DetailText>
            <DetailText label="Account Cost Center">{accountInfo?.costCenter || "-"}</DetailText>
            <DetailText label="Meter Reading Code">{accountInfo?.mrc || "-"}</DetailText>
            <DetailText label="Account Segment">{accountInfo?.accountSegment || "-"}</DetailText>
            <DetailText label="Account Group Type">{accountInfo?.accountGroupType || "-"}</DetailText>
            <DetailText label="Account Type">{accountInfo?.accountType || "-"}</DetailText>
            <DetailText label="Premise Address">{accountInfo?.premiseAddress || "-"}</DetailText>
            <DetailText label="Subdistrict">{accountInfo?.subDistrict || "-"}</DetailText>
            <DetailText label="District">{accountInfo?.district || "-"}</DetailText>
            <DetailText label="City">{accountInfo?.city || "-"}</DetailText>
            <DetailText label="Country">{accountInfo?.country || "-"}</DetailText>
            <DetailText label="Latitude">{accountInfo?.latitude || "-"}</DetailText>
            <DetailText label="Longitude">{accountInfo?.longitude || "-"}</DetailText>
          </div>
        </BaseContainer>
      )}
    </Fragment>
  );
};

export default CustomerServiceRequestHeader;
