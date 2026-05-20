import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";

const ServiceAgreementHistoryLogInformation = ({
  historyData = {},
  showRecordId = false,
  recordIdLabel = "Record ID",
}) => {
  const resolvedRecordId = historyData?.recordId || historyData?.saId || "-";
  const resolvedCreatedDate = historyData?.createdDate || "-";
  const resolvedCreatedBy = historyData?.createdBy || "-";
  const resolvedUpdatedDate = historyData?.updatedDate || historyData?.updateDate || "-";
  const resolvedUpdatedBy = historyData?.updatedBy || "-";

  return (
    <NxCardContainer header="HISTORY LOG INFORMATION">
      <NxBaseContainer border>
        <div className={`w-full grid ${showRecordId ? "grid-cols-5" : "grid-cols-4"} gap-4`}>
          {showRecordId ? (
            <NxDetailText label={recordIdLabel}>{resolvedRecordId}</NxDetailText>
          ) : null}
          <NxDetailText label="Created Date">{resolvedCreatedDate}</NxDetailText>
          <NxDetailText label="Created By">{resolvedCreatedBy}</NxDetailText>
          <NxDetailText label="Updated Date">{resolvedUpdatedDate}</NxDetailText>
          <NxDetailText label="Updated By">{resolvedUpdatedBy}</NxDetailText>
        </div>
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default ServiceAgreementHistoryLogInformation;
