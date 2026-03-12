import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";

const ModalPreRequisiteDetail = (props) => {
  const { isOpen, handleCancel, handleOk, data = {} } = props;

  const footer = (
    <div className="flex justify-end">
      <ButtonComponent type="menu" onClick={handleCancel}>
        Back
      </ButtonComponent>
    </div>
  );

  return (
    <NxModal
      isOpen={isOpen}
      width={900}
      title={"Detail Pre-Requisite Information"}
      footer={footer}
      handleCancel={handleCancel}
      handleOk={handleOk}
    >
      <div className="flex flex-col gap-4 p-4">
        {/* PRE-REQUISITE INFORMATION */}
        <NxBaseContainer border header="PRE-REQUISITE INFORMATION">
          <div className="p-4 flex flex-col gap-4">
            <div className="w-full grid grid-cols-2 gap-4">
              <NxDetailText label="Type">{data?.type || "-"}</NxDetailText>
              <NxDetailText label="Name">{data?.name || "-"}</NxDetailText>
            </div>
            <div className="w-full">
              <NxDetailText label="Description">{data?.description || "-"}</NxDetailText>
            </div>
          </div>
        </NxBaseContainer>

        {/* HISTORY LOG INFORMATION */}
        <NxBaseContainer
          border
          header="HISTORY LOG INFORMATION"
          headerBackgroundVisible
          headerBackgroundColor="#F9FAFB"
        >
          <div className="p-4">
            <div
              className="w-full rounded-lg border border-solid border-[#C8CDD4] bg-white p-4 grid gap-4"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              <NxDetailText label="Record ID">
                {data?.id || "-"}
              </NxDetailText>
              <NxDetailText label="Created Date">
                {data?.createdDate || "-"}
              </NxDetailText>
              <NxDetailText label="Created By">
                {data?.createdBy || "-"}
              </NxDetailText>
              <NxDetailText label="Updated Date">
                {data?.updatedDate || "-"}
              </NxDetailText>
              <NxDetailText label="Updated By">
                {data?.updatedBy || "-"}
              </NxDetailText>
            </div>
          </div>
        </NxBaseContainer>
      </div>
    </NxModal>
  );
};

export default ModalPreRequisiteDetail;
