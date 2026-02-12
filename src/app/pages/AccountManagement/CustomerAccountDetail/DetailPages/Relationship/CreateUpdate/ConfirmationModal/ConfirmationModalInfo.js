import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../components/Nx/NxDetailText";

const ConfirmationModalInfo = ({
  values = {},
}) => {
  return (
    <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-4">
        <NxDetailText label="Relationship Type">{values.relationshipTypeName || "-"}</NxDetailText>
        <NxDetailText label="Relationship Category">{values.relationshipCategoryName || "-"}</NxDetailText>
        <NxDetailText label="Related Name">{values.relatedName || values.objectName || "-"}</NxDetailText>
        <NxDetailText label="Related Number">{values.relatedNumber || values.objectValue || "-"}</NxDetailText>
        <NxDetailText label="Start Date">{values.startDateDisplay || "-"}</NxDetailText>
        <NxDetailText label="End Date">{values.endDateDisplay || "-"}</NxDetailText>
      </div>
      <div className="w-full mt-4">
        <NxDetailText label="Description">{values.description || "-"}</NxDetailText>
      </div>
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
