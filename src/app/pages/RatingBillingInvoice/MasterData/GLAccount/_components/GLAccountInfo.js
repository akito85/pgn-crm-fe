import React from "react";
import { useSelector } from "react-redux";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";

const GLAccountInfo = ({ data }) => {
  const { data_special_gl_list } = useSelector((state) => state.glAccount);

  // Find special GL name
  const selectedSpecialGLName = React.useMemo(() => {
    if (!data?.specialGlValue || !data_special_gl_list) return "-";
    const selected = data_special_gl_list.find(
      (item) => item.glbTypeValId === data.specialGlValue
    );
    return selected ? selected.name : "-";
  }, [data?.specialGlValue, data_special_gl_list]);

  return (
    <CardComponent header={"GL Account Information"} cols={2}>
      <DetailText label="GL Account Number">
        {data?.glAccount || "-"}
      </DetailText>
      <DetailText label="GL Account Description">
        {data?.glAccountDesc || "-"}
      </DetailText>
      <DetailText label="Special GL">{selectedSpecialGLName}</DetailText>
      <DetailText label="Reference">{data?.reference || "-"}</DetailText>
    </CardComponent>
  );
};

export default GLAccountInfo;
