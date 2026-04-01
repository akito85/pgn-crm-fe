import CardContainer from "../../../../../../components/CardContainer";
import DetailText from "../../../../../../components/DetailText";

const EFakturCodeSection = ({ dataEfakturCode = {} }) => {
  return (
    <>
      {/* Efaktur Code Information */}
      <CardContainer header={"Efaktur Code Information"}>
        <div className="w-full grid grid-cols-4 gap-3">
          <DetailText label={"Code"}>{dataEfakturCode?.code || "-"}</DetailText>
          <div className="col-span-3">
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
