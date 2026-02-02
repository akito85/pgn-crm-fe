import DetailText from "../../../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../../utils";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";

const ConfirmationModalInfo = ({
  data = {},
}) => {
  return (
    <NxBaseContainer border header={"INVOICE RELATION INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-4">
        <NxDetailText label="Account Number">{data.accountNumber}</NxDetailText>
        <NxDetailText label="Account Name">{data.accountName}</NxDetailText>
        <NxDetailText label="Start Date">{moment(data.startDate, dateFormatting.f_date).format(dateFormatting.date)}</NxDetailText>
        <NxDetailText label="End Date">{data.endDate ? moment(data.endDate, dateFormatting.f_date).format(dateFormatting.date) : ""}</NxDetailText>
      </div>
      <div className="w-full">
        <NxDetailText label="Description">{data.description}</NxDetailText>
      </div>
    </NxBaseContainer>
  );
};

export default ConfirmationModalInfo;
