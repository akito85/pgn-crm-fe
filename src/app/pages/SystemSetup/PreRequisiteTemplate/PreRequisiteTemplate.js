import { memo } from "react";
import PreRequisiteTemplateTable from "./PreRequisiteTemplateTable";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";

const PreRequisiteTemplate = () => {
    return (
        <>
        <NxCardContainer border header={"PRE-REQUISITE TEMPLATE LIST"}>
            <NxBaseContainer border>
                <PreRequisiteTemplateTable />
            </NxBaseContainer>
        </NxCardContainer>
        </>
    );
}

export default memo(PreRequisiteTemplate);