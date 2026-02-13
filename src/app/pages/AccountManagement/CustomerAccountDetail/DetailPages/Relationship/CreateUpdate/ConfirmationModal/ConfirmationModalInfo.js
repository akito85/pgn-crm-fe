import { useEffect } from "react";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import RelationshipInfo from "../StepContents/InformationForm/RelationshipInfo";
import RelatedDetailCard from "../StepContents/InformationForm/RelatedDetailCard";

const ConfirmationModalInfo = ({
  form,
  relatedDetails,
}) => {
  useEffect(() => {
    console.log("form", form);
  }, [])
  return (
    <div className="flex flex-col gap-y-4">
      <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
        <RelationshipInfo form={form} formView={false} />
      </NxBaseContainer>
      <NxBaseContainer border header={"RELATIONSHIP INFORMATION"}>
        <RelatedDetailCard relatedDetails={relatedDetails} />
      </NxBaseContainer>
    </div>
  );
};

export default ConfirmationModalInfo;
