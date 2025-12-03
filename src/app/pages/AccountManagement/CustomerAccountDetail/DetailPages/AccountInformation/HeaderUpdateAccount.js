import { Fragment } from "react";
import React from "react";
import DetailText from "../../../../../../components/DetailText";
import BaseContainer from "../../../../../../components/BaseContainer";

const HeaderUpdateAccount = ({ data_accountDetail = {}, data_header = [] }) => {
  return (
    <Fragment>
      <BaseContainer header={data_header[0]}>
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
          <DetailText label="Description">
            {data_accountDetail?.accountSummary?.description}
          </DetailText>
          {/* <DetailText label="Customer Reference ID">
            {data_accountDetail?.accountSummary?.customerRefId}
          </DetailText> */}
          <DetailText label="Status">
            {/* <div className=" flex justify-start">
              <StatusComponent
                colour={data_accountDetail?.accountSummary?.customerStatus}
              >
                <div className="flex justify-center px-5"> */}
            {data_accountDetail?.accountSummary?.customerStatus}
            {/* </div>
              </StatusComponent>
            </div> */}
          </DetailText>
        </div>
      </BaseContainer>
    </Fragment>
  );
};

export default HeaderUpdateAccount;
