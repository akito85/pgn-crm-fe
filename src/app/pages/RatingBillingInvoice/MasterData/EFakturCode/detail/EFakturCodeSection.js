import CardContainer from "../../../../../../components/CardContainer";
import DetailText from "../../../../../../components/DetailText";
import StatusComponent from "../../../../../../components/StatusComponent";

const EFakturCodeSection = ({ dataEfakturCode = {} }) => {
  return (
    <>
      {/* Efaktur Code Information */}
      <CardContainer header={"Efaktur Code Information"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label={"Code"}>{dataEfakturCode?.code || "-"}</DetailText>
          <DetailText label={"Status"}>
            {dataEfakturCode?.status ? (
              <StatusComponent colour={dataEfakturCode.status} size="small">
                {dataEfakturCode.status}
              </StatusComponent>
            ) : (
              "-"
            )}
          </DetailText>
          <DetailText label={"Status Approval"}>
            {dataEfakturCode?.statusApproval ? (
              <StatusComponent
                colour={dataEfakturCode.statusApproval}
                size="small"
              >
                {dataEfakturCode.statusApproval}
              </StatusComponent>
            ) : (
              "-"
            )}
          </DetailText>
          <div className="col-span-4">
            <DetailText label={"Description"}>
              {dataEfakturCode?.description || "-"}
            </DetailText>
          </div>
        </div>
      </CardContainer>
    </>
  );
};

export default EFakturCodeSection;
