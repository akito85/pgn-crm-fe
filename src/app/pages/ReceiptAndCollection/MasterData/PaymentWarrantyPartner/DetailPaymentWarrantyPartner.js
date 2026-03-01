import DetailSection from "../../../../../components/DetailSection";
import DetailText from "../../../../../components/DetailText";
import { renderDateConverter } from "../../../../../utils";

const DetailPaymentWarrantyPartner = (props) => {
  const { data } = props;
  const ratingData = data?.ratings?.[0] || {};

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-5">
        <DetailText label="Partner Code">{data?.partner?.partnerCode}</DetailText>
        <DetailText label="Partner Guarantee Issuer">{data?.partner?.partnerGuaranteeIssuer}</DetailText>
        <DetailText label="Partner Type">{data?.partner?.partnerType}</DetailText>
        <DetailText label="Rating">{ratingData.rating || "-"}</DetailText>
        <DetailText label="Criteria">{ratingData.criteria || "-"}</DetailText>
        <DetailText label="Rating Date">{ratingData.ratingDate ? renderDateConverter(ratingData.ratingDate) : "-"}</DetailText>
        <DetailText label="Start Date">{ratingData.startDate ? renderDateConverter(ratingData.startDate) : "-"}</DetailText>
        <DetailText label="End Date">{ratingData.endDate ? renderDateConverter(ratingData.endDate) : "-"}</DetailText>
      </div>
    </div>
  );
};

export default DetailPaymentWarrantyPartner;
