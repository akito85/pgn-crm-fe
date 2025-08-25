import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";

const CustomerInformation = ({ data = {}, type }) => {
  return (
    <Fragment>
      <div className="w-full grid grid-cols-4 gap-4">
        {/* cusstomer information */}
        {type !== 58 ? (
          <>
            <DetailText label="First Name">{data?.firstName}</DetailText>
            <DetailText label="Middle Name">{data?.middleName}</DetailText>
            <DetailText label="Last Name">{data?.lastName}</DetailText>
          </>
        ) : null}
        <DetailText label="Customer Number">{data?.customerNumber}</DetailText>
        <DetailText label="Identification Type">
          {data?.identificationType}
        </DetailText>
        <DetailText label="Customer Identification Number">
          {data?.customerIdentificationNumber}
        </DetailText>
        <DetailText label="Customer Name">{data?.customerName}</DetailText>
        <DetailText label="Customer Type">{data?.customerType}</DetailText>
        <DetailText label="Birth/Founded Place">
          {data?.foundedBirthPlace}
        </DetailText>
        <DetailText label="Birth/Founded Date">
          {data?.foundedBirthDate ? moment(data?.foundedBirthDate).format(dateFormatting.date) : ""}
        </DetailText>
        {type !== 58 ? (
          <>
            <DetailText label="Sex">{data?.sex}</DetailText>
            <DetailText label="Marital Status">
              {data?.maritalStatus}
            </DetailText>
          </>
        ) : null}
        <DetailText label="Search Key">{data?.searchKey}</DetailText>
        <DetailText label="Status">
          {/* <div className=" flex justify-start">
              <StatusComponent colour={data?.status}>
                <div className="flex justify-center px-5"> */}
          {data?.status}
          {/* </div>
              </StatusComponent> */}
          {/* </div> */}
        </DetailText>
      </div>
      <div className="w-full">
        <DetailText label="Description">{data?.description}</DetailText>
      </div>

    </Fragment>
  );
};

export default CustomerInformation;
