import React, { useState } from "react";
import RadioTabs from "../../../../../../components/RadioTabs";
import InformationInputForm from "./InformationInputForm";

const dataTabs = [{ value: "Customer Account" }, { value: "Attachment" }];

const InformationForm = ({ type, updateBody = () => {} }) => {
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Customer Account" },
    { value: "Attachment" },
  ]);
  const [typeTabInfo, setTypeTabInfo] = useState(listSectionInfo[0].value);
  const handleTabInfo = (e) => {
    setTypeTabInfo(e.target.value);
  };

  return (
    <div className="pt-[20px]">
      <RadioTabs data={dataTabs} onChange={handleTabInfo} />
      <div className={"w-full"}>
        <div
          style={{
            display:
              typeTabInfo !== listSectionInfo[0].value ? "none" : undefined,
          }}
        >
          <div>
            <div className="py-8">
              <InformationInputForm updateBody={updateBody} />
            </div>
          </div>
        </div>
        <div
          style={{
            display:
              typeTabInfo !== listSectionInfo[1].value ? "none" : undefined,
          }}
        >
          <div>B</div>
        </div>
      </div>
    </div>
  );
};

export default InformationForm;
