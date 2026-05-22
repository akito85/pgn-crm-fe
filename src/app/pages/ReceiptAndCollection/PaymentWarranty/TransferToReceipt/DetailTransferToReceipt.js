import SubSectionCard from "../../../../../components/SubSectionCard";
import DetailText from "../../../../../components/DetailText";

const DetailTransferToReceipt = ({ data_detail }) => {
  return (
    <SubSectionCard title="TRANSFER TO RECEIPT INFORMATION">
      <div className="w-full grid grid-cols-4 gap-x-6 gap-y-4">
        <DetailText label="From Customer Number">{data_detail?.fromCustomerId || ""}</DetailText>
        <DetailText label="From Customer Name">{data_detail?.fromCustomerName || ""}</DetailText>
        <DetailText label="Area Code">{data_detail?.areaCode || ""}</DetailText>
        <DetailText label="Category">{data_detail?.category || ""}</DetailText>
        <div className="col-span-4">
          <DetailText label="Description">{data_detail?.description || ""}</DetailText>
        </div>
      </div>
    </SubSectionCard>
  );
};

export default DetailTransferToReceipt;
