import NxCardContainer from "../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxAttachmentInput from "../../../../../../../../components/Nx/NxAttachmentInput";

/**
 * @param {{
 *   data: Array,
 *   updateData: Function,
 *   setDeleted: Function,
 * }} props
 */
const WoAttachmentStep = ({ data, updateData, setDeleted }) => {
  return (
    <NxCardContainer header="Attachment Information">
      <NxBaseContainer border>
        <NxAttachmentInput
          data={data}
          updateData={updateData}
          setDeleted={setDeleted}
          mandatory={false}
          autoHeight={true}
        />
      </NxBaseContainer>
    </NxCardContainer>
  );
};

export default WoAttachmentStep;
