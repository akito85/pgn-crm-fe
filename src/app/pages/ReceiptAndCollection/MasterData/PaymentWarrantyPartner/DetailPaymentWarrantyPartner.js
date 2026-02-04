import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";

const DetailPaymentWarrantyPartner = (props) => {
  const { data } = props;



  return (
    <div className="flex flex-col gap-2">
      <DetailSection header={"PARTNER INFORMATION"}>
        <div className="grid grid-cols-5 gap-5">
          <DetailText label="Partner Name">{data?.partner?.partnerName}</DetailText>
          <DetailText label="Partner Type">{data?.partner?.partnerType}</DetailText>
          <DetailText label="Swift Code">{data?.partner?.swiftCode}</DetailText>
          <DetailText label="NPWP">{data?.partner?.npwp}</DetailText>
          <DetailText label="License Number">{data?.partner?.licenseNum}</DetailText>
          <DetailText label="Parent ID">{data?.partner?.parentId}</DetailText>
        </div>
      </DetailSection>

      <DetailSection header={"ADDRESS INFORMATION"}>
        <div className="grid grid-cols-4 gap-5">
          <DetailText label="Street">{data?.partner?.streetName}</DetailText>
          <DetailText label="Building">{data?.partner?.building}</DetailText>
          <DetailText label="Address Number">{data?.partner?.addressNum}</DetailText>
          <DetailText label="District">{data?.partner?.district}</DetailText>
          <DetailText label="City">{data?.partner?.city}</DetailText>
          <DetailText label="Province">{data?.partner?.province}</DetailText>
          <DetailText label="Country">{data?.partner?.country}</DetailText>
          <DetailText label="Zip Code">{data?.partner?.zipCode}</DetailText>
        </div>
      </DetailSection>

      <DetailSection header={"CONTACT INFORMATION"}>
        <div className="grid grid-cols-3 gap-5">
          <DetailText label="Contact Person">{data?.partner?.contactPerson}</DetailText>
          <DetailText label="Phone Number">{data?.partner?.phoneNum}</DetailText>
          <DetailText label="Email">{data?.partner?.email}</DetailText>
        </div>
      </DetailSection>
    </div>
  );
};

export default DetailPaymentWarrantyPartner;
