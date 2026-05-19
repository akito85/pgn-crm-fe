import { memo, useState } from "react";
import PreRequisiteTemplateTable from "./PreRequisiteTemplateTable";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxActivateInactivateModal from "../../../../components/Nx/NxActivateInactivateModal";

const PreRequisiteTemplate = () => {
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [inactivateId, setInactivateId] = useState(0);
    const [showInactivateModal, setShowInactivateModal] = useState(false);

    const handleInactivateModal = (
        show,
        newId = 0,
    ) => {
        if (show) {
            setInactivateId(newId);
            setShowInactivateModal(true);
        } else {
            setInactivateId(0);
            setShowInactivateModal(false);
        }
    }
    
    return (
        <>
        <NxCardContainer border header={"PRE-REQUISITE TEMPLATE LIST"}>
            <NxBaseContainer border>
                <PreRequisiteTemplateTable
                    refreshSignal={refreshSignal}
                    handleInactivateModal={handleInactivateModal}
                />
                <NxActivateInactivateModal
                    isOpen={showInactivateModal}
                    header={"INACTIVATE"}
                    handleCloseModal={() => handleInactivateModal(false)}
                    customMessage={`Are you sure you want to inactivate Pre-Requisite Template - ${inactivateId}?`}
                    // onFinish={({ remark, appHierId }, handleClear) => {
                    //     handleInactivate
                    // }}
                />
            </NxBaseContainer>
        </NxCardContainer>
        </>
    );
}

export default memo(PreRequisiteTemplate);