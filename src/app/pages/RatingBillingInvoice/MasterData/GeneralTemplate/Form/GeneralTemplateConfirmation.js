import { Fragment } from "react";
import React from "react";
import { useState } from "react";
import RadioTabs from "../../../../../../components/RadioTabs";
import GeneralTemplateDetailForm from "./GeneralTemplateDetailForm";
import GeneralTempalteAttachment from "./GeneralTemplateAttachment";
import ApprovalComponentGeneral from "../../../../../../components/Approval/ApprovalComponentGeneral";

const listGeneralTemplateSection = [
  { value: "General Template" },
  { value: "Approval" },
  { value: "Attachment" },
];

const GeneralTemplateConfirmation = ({
  dataConfirm = {},
  dataTemplateFile = {},
  dataTemplateType = [],
  dataApproval = {},
  dataApprovalTable = [],
  dataAttachment = [],
  listApproval = [],
}) => {
  const labelApproval = listApproval
    ?.filter((a) => a.appHierId === dataApproval[0].value)
    ?.find((v) => v.appHierId === dataApproval[0].value)?.approvalName;

  const [generalTemplateSection, setGeneralTemplateSection] = useState(
    listGeneralTemplateSection[0].value
  );

  const handleGeneralTemplateSection = (e) => {
    setGeneralTemplateSection(e.target.value);
  };

  const renderSection = () => {
    switch (generalTemplateSection) {
      case listGeneralTemplateSection[0].value:
        return (
          <GeneralTemplateDetailForm
            data={{
              ...dataConfirm,
              type: (dataTemplateType || [])
                ?.filter((item) => item.id === dataConfirm.templateType)
                ?.find((v) => v.id === dataConfirm.templateType)?.value,
            }}
            type={false}
            data_templateType={dataTemplateFile}
          />
        );
      case listGeneralTemplateSection[1].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"APPROVAL INFORMATION"}
            </div>

            {/* <div className="w-full justify-start">
              <DetailText label="Approval Hierarchy">
                {labelApproval}
              </DetailText>
            </div> */}

            <ApprovalComponentGeneral
              showSelect={false}
              dataTable={dataApprovalTable}
              selectedHierarchy={dataApproval}
              approvalName={labelApproval}
              disableSelect={true}
            />
          </>
        );
      case listGeneralTemplateSection[2].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"ATTACHMENT INFORMATION"}
            </div>

            <GeneralTempalteAttachment dataAttachment={dataAttachment} type={"preview"} />
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <Fragment>
      <div className="mt-5">
        <RadioTabs
          data={listGeneralTemplateSection}
          onChange={handleGeneralTemplateSection}
        />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default GeneralTemplateConfirmation;
