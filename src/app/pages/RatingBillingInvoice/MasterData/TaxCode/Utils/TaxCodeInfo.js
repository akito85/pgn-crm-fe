import moment from "moment";
import DetailText from "../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../utils";

const TaxCodeInfo = ({
  data,
  dataCategory = [],
  apiCriteria = [],
  preview = "confirmation",
}) => {
  const categoryName = dataCategory
    ?.filter((a) => a.id === data?.category)
    ?.find((v) => v.code)?.code;

  // Find Name Criteria on Modal Confirm
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.criteria?.includes(obj.id)
  );
  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  // Find Name Criteria on Detail
  const criteriaName = data?.taxCodeCriteriaDtos
    ?.map((a) => a.criteriaName)
    ?.reduce((current, next) => current + `, ${next}`, "");

  const labelStatus = (index) => {
    let text;
    switch (index) {
      case "WAITING_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = index
          ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
          : index;
        break;
    }
    return text;
  };

  const formatTaxRate = (text) => {
    const tempValue = text ? (text + "").split(".") : [];
    const thousandSeparator = ",";
    const decimalSeparator = ".";
    const descimal = tempValue[1]
      ? `${decimalSeparator}${tempValue[1]}`
      : ``;

    const value =
      tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      descimal + "%";

    if (value) {
      return value;
    }
  };

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {preview === "detail" ? (
        <>
          <DetailText label={"Tax Code"}>{data?.taxCode}</DetailText>
          <DetailText label={"Name"}>{data?.taxCodeName}</DetailText>
          <DetailText label={"Tax Rate (%)"}>{data?.taxRate + "%"}</DetailText>
          <DetailText label={"Category"}>{categoryName}</DetailText>
          <DetailText label={"GL Account"}>{data?.glAccount}</DetailText>
          <DetailText label={"Start Date"}>
            {data?.startDate
              ? moment(data?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {data?.endDate
              ? moment(data?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"Status"}>{labelStatus(data?.status)}</DetailText>
          <DetailText label={"Status Approval"}>{labelStatus(data?.statusApproval)}</DetailText>
          <div className="col-span-4">
            <DetailText label={"Criteria"}>
              {criteriaName?.slice(2) || data?.criteria}
            </DetailText>
          </div>
          <div className="col-span-4">
            <DetailText label={"Description"}>{data?.description}</DetailText>
          </div>
        </>
      ) : (
        <>
          <DetailText label={"Tax Code"}>{data?.taxCode}</DetailText>
          <DetailText label={"Name"}>{data?.taxCodeName}</DetailText>
          <DetailText label={"Tax Rate (%)"}>{formatTaxRate(data?.taxRate)}</DetailText>
          <DetailText label={"Category"}>{categoryName}</DetailText>
          <DetailText label={"GL Account"}>{data?.glAccount}</DetailText>
          <DetailText label={"Start Date"}>
            {data?.startDate
              ? moment(data?.startDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"End Date"}>
            {data?.endDate
              ? moment(data?.endDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <div className="col-span-4">
            <DetailText label={"Criteria"}>
              {matchedNamesCriteria?.slice(2)}
            </DetailText>
          </div>
          <div className="col-span-4">
            <DetailText label={"Description"}>{data?.description}</DetailText>
          </div>
        </>
      )}
    </div>
  );
};
export default TaxCodeInfo;
