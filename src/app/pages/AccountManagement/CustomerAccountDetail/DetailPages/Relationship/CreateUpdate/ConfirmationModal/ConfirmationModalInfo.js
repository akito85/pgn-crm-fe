import moment from "moment";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  return (
    <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-4">
        <NxDetailText label="Relationship Type">{data.relationshipTypeName || "-"}</NxDetailText>
        <NxDetailText label="Relationship Category">{data.relationshipCategoryName || "-"}</NxDetailText>
        <NxDetailText label="Related Name">{data.relatedName || data.objectName || "-"}</NxDetailText>
        <NxDetailText label="Related Number">{data.relatedNumber || data.objectValue || "-"}</NxDetailText>
        <NxDetailText label="Start Date">{data.startDateDisplay || "-"}</NxDetailText>
        <NxDetailText label="End Date">{data.endDateDisplay || "-"}</NxDetailText>
      </div>
      <div className="w-full mt-4">
        <NxDetailText label="Description">{data.description || "-"}</NxDetailText>
      </div>
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
