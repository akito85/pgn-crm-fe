import { Fragment } from "react";
import React from "react";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const UpdateCustomerConfirmation = ({
  data = {},
  dataTable = [],
  customerType,
}) => {
  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"CUSTOMER IDENTIFICATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label="Customer Type">{data?.customerType}</DetailText>
        <DetailText label="Identification Type">
          {data?.identificationType}
        </DetailText>
        <DetailText label="Customer Identiication Number">
          {data?.customerIdentificationNumber}
        </DetailText>
      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"CUSTOMER IINFORMATION"}
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {customerType !== 58 ? (
          <>
            <DetailText label="First Name">{data?.firstName}</DetailText>
            <DetailText label="Middle Name">{data?.middleName}</DetailText>
            <DetailText label="Last Name">{data?.lastName}</DetailText>
          </>
        ) : null}
        <DetailText label="Customer Name">{data?.customerName}</DetailText>
        <DetailText label="Birth/Founded Date">
          {moment(data?.foundedBirthDate).format("DD MMM YYYY")}
        </DetailText>
        <DetailText label="Birth/Founded Place">
          {data?.foundedBirthPlace}
        </DetailText>
        {customerType !== 58 ? (
          <>
            <DetailText label="Sex">{data?.sex}</DetailText>
            <DetailText label="Marital Status">
              {data?.maritalStatus}
            </DetailText>
          </>
        ) : null}
        <DetailText label="Search key">{data?.searchKey}</DetailText>
        <DetailText label="Description">{data?.description}</DetailText>
      </div>

      <AttachmentSectionForm data={dataTable} type={"detail"} />
    </Fragment>
  );
};

export default UpdateCustomerConfirmation;
