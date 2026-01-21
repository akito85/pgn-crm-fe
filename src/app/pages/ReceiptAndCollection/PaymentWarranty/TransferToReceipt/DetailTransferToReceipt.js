import moment from "moment";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";

const DetailTransferToReceipt = ({ data_detail }) => {
  return (
    <BaseContainer header={"TRANSFER TO RECEIPT INFORMATION"}>
      <div className="w-full grid grid-cols-3 gap-3">
        <DetailText label={"Deduction Period"}>
          {data_detail?.deductionPeriod || "-"}
        </DetailText>

        <DetailText label={"Type"}>
          {data_detail?.type || "-"}
        </DetailText>

        <DetailText label={"Deduction Date"}>
          {data_detail?.deductionDate
            ? moment(data_detail?.deductionDate).format("DD MMM YYYY")
            : "-"}
        </DetailText>
      </div>
    </BaseContainer>
  );
};

export default DetailTransferToReceipt;
