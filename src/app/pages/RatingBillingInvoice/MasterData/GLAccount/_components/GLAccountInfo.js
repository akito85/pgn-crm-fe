import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";

const GLAccountInfo = ({ data }) => {

  return (
    <CardComponent header={"GL Account Information"} cols={2}>
      <DetailText label="GL Account Number">
        {data?.glAccount || "-"}
      </DetailText>
      <DetailText label="GL Account Description">
        {data?.glAccountDesc || "-"}
      </DetailText>
      <DetailText label="Description">{data?.remark || " "}</DetailText>
    </CardComponent>
  );
};

export default GLAccountInfo;
