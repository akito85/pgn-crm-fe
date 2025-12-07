import React, { useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";
import { getPositionEmployee } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/digitalSignature";
import { Image } from "antd";

const DigitalSignatureSection = ({
  dataDetailSignature = {},
  dataHistory = {},
}) => {
  const dispatch = useDispatch();
  const { data_position_employee, loading } = useSelector(
    (state) => state.digitalSignature
  );

  useEffect(() => {
    if (dataDetailSignature.employeeCode) {
      dispatch(
        getPositionEmployee({ employeeCode: dataDetailSignature.employeeCode })
      );
    }
  }, [dataDetailSignature.employeeCode, dispatch]);

  const renderPosition = () => {
    if (loading) return "Loading...";
    if (!data_position_employee || data_position_employee.length === 0)
      return "-";

    // Jika data_position_employee adalah array
    if (Array.isArray(data_position_employee)) {
      return data_position_employee.join(", ");
    }

    return (
      data_position_employee.position || data_position_employee.name || "-"
    );
  };

  return (
    <>
      {/* Efaktur Code Information */}
      <BaseContainer header={"Digital Signature Information"}>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex w-full gap-3 justify-between">
            <DetailText label={"Name"}>
              {dataDetailSignature?.name || "-"}
            </DetailText>

            <DetailText label={"Employee"}>
              {dataDetailSignature?.employeeCode || "-"}
            </DetailText>

            <DetailText label={"Primary Position"}>
              {renderPosition()}
            </DetailText>
          </div>

          <div className="flex gap-3">
            <DetailText label={"Status"}>
              {dataDetailSignature?.status || "-"}
            </DetailText>
            <DetailText label={"Status Approval"}>
              {dataDetailSignature?.statusApproval || "-"}
            </DetailText>
          </div>

          <div className="flex w-full">
            <DetailText label={"Description"}>
              {dataDetailSignature?.description || "-"}
            </DetailText>
          </div>

          <div className="flex w-fit">
            <DetailText label={"Signature"}>
              {dataDetailSignature.signatureBase64 &&
              dataDetailSignature.signatureMethod === "DRAW" ? (
                <Image
                  src={dataDetailSignature.signatureBase64}
                  width={50}
                  alt="Signature"
                />
              ) : (
                "-"
              )}
            </DetailText>
          </div>
        </div>
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-3">
          <DetailText label={"Record ID"}>
            {dataHistory?.recordId || "-"}
          </DetailText>
          <DetailText label={"Created Date"}>
            {dataHistory?.createdDate
              ? moment(dataHistory.createdDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Created By"}>
            {dataHistory?.createdBy || "-"}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {dataHistory?.updatedDate
              ? moment(dataHistory.updatedDate).format(dateFormatting.dateTime)
              : "-"}
          </DetailText>
          <DetailText label={"Updated By"}>
            {dataHistory?.updatedBy || "-"}
          </DetailText>
        </div>
      </BaseContainer>
    </>
  );
};

export default DigitalSignatureSection;
