import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import DOMPurify from "dompurify";
import { renderDateConverter } from "../../../../../utils";

const DetailPaymentWarrantyPartner = (props) => {
  const { data } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-5">
        <DetailText label="Partner Code">{DOMPurify.sanitize(data?.partner?.partnerCode)}</DetailText>
        <DetailText label="Partner Guarantee Issuer">{DOMPurify.sanitize(data?.partner?.partnerGuaranteeIssuer)}</DetailText>
        <DetailText label="Partner Type">{DOMPurify.sanitize(data?.partner?.partnerType)}</DetailText>
        <DetailText label="Start Date">{data?.partner?.startDate ? renderDateConverter(data?.partner?.startDate) : "-"}</DetailText>
        <DetailText label="End Date">{data?.partner?.endDate ? renderDateConverter(data?.partner?.endDate) : "-"}</DetailText>
      </div>
    </div>
  );
};

export default DetailPaymentWarrantyPartner;
