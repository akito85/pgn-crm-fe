import React from "react";
import moment from "moment";
import { Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { dateFormatting } from "../../../../../../utils";
import DetailText from "../../../../../../components/DetailText";
import { previewInvoiceTemplate } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/invoiceTemplate";

const InvoiceTemplateInfo = ({
  data,
  apiInvoiceType = [],
  apiMeterai = [],
  apiSignature = [],
  apiTemplate = [],
  apiCriteria = [],
  preview = "confirmation",
}) => {
  // Declaration
  const dispatch = useDispatch();

  const labelInvoiceType = apiInvoiceType
    ?.filter((a) => a.id === data?.invoiceType)
    ?.find((v) => v.name)?.name;

  const labelMeterai = apiMeterai
    ?.filter((a) => a.id === data?.meterai)
    ?.find((v) => v.name)?.name;

  const labelSignature = apiSignature
    ?.filter((a) => a.id === data?.signature)
    ?.find((v) => v.name)?.name;

  const labelTemplate = apiTemplate
    ?.filter((a) => a.id === data?.template)
    ?.find((v) => v.name)?.name;

  const handleShow = () => {
    let id = data?.template.id;
    let filename = data?.template.name;
    let extension = filename.match(/\.([^.]+)$/);
    dispatch(
      previewInvoiceTemplate({
        id: id,
        extension: extension[1],
        filename: filename,
      })
    );
  };

  // Find Name Criteria on Modal Confirm
  const matchedObjectsCriteria = apiCriteria?.filter((obj) =>
    data?.criteria?.includes(obj.id)
  );
  const matchedNamesCriteria = matchedObjectsCriteria
    ?.map((obj) => obj.text)
    ?.reduce((current, next) => current + `, ${next}`, "");

  // Find Name Criteria on Detail
  const criteriaName = data?.criteriaDtoList
    ?.map((a) => a.criteriaName)
    ?.reduce((current, next) => current + `, ${next}`, "");

  return (
    <div className="w-full grid grid-cols-4 gap-4">
      {preview === "detail" ? (
        <>
          <DetailText label={"Name"}>{data?.invoiceName}</DetailText>
          <DetailText label={"Invoice Type"}>
            {data?.invoiceType?.name}
          </DetailText>
          <DetailText label={"Meterai"}>{data?.meterai?.name}</DetailText>
          <DetailText label={"Signature"}>{data?.signature?.name}</DetailText>
          <div className="w-full flex flex-row gap-4">
            <DetailText label={"Template"}>{data?.template?.name}</DetailText>
            <div className="pt-5">
              <Tooltip title="Preview">
                <EyeOutlined
                  style={{ fontSize: "18px", color: "#4B465C" }}
                  onClick={() => handleShow()}
                />
              </Tooltip>
            </div>
          </div>
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
          <DetailText label={"Status"}>
            {data?.status}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {data?.statusApproval}
          </DetailText>
          <div className="col-span-4">
            <DetailText label={"Criteria"}>{criteriaName?.slice(2) || data?.criteria}</DetailText>
          </div>
          <div className="col-span-4">
            <DetailText label={"Description"}>{data?.description}</DetailText>
          </div>
        </>
      ) : (
        <>
          <DetailText label={"Name"}>{data?.invoiceName}</DetailText>
          <DetailText label={"Invoice Type"}>{labelInvoiceType}</DetailText>
          <DetailText label={"Meterai"}>{labelMeterai}</DetailText>
          <DetailText label={"Signature"}>{labelSignature}</DetailText>
          <DetailText label={"Template"}>{labelTemplate}</DetailText>
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

export default InvoiceTemplateInfo;
