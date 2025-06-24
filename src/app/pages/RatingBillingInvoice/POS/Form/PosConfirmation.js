import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import moment from "moment";
import DetailText from "../../../../../components/DetailText";
import PointOfSalesConfirmation from "./Confirmation/PointOfSalesConfirmation";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import PointOfSalesApprovalConfirmation from "./Confirmation/PointOfSalesApprovalConfirmation";
import { useState } from "react";
import RadioTabs from "../../../../../components/RadioTabs";

const listPointOfSalesPage = [
  { value: "Point Of Sales" },
  { value: "Approval" },
  { value: "Attachment" },
];

const PosConfirmation = ({
  dataConfirm = {},
  data_dynamic = {},
  posDetail = [],
  dataApproval = {},
  dataApprovalTable = [],
  dataAttachment = [],
  listApproval = []
}) => {
  const [pointOfSalesPage, setPointOfSalesPage] = useState(
    listPointOfSalesPage[0].value
  );

  const handlePointOfSalesPage = (e) => {
    setPointOfSalesPage(e.target.value);
  };

  const renderSection = () => {
    switch (pointOfSalesPage) {
      case listPointOfSalesPage[0].value:
        return (
          <PointOfSalesConfirmation
            dataConfirm={dataConfirm}
            data_dynamic={data_dynamic}
            posDetail={posDetail}
          />
        );
      case listPointOfSalesPage[1].value:
        return (
          <PointOfSalesApprovalConfirmation
            dataApproval={dataApproval}
            dataApprovalTable={dataApprovalTable}
            listApproval={listApproval}
          />
        );
      case listPointOfSalesPage[2].value:
        return (
          <>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"ATTACHMENT INFORMATION"}
            </div>

            <AttachmentSectionForm type={"preview"} data={dataAttachment} />
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
          data={listPointOfSalesPage}
          onChange={handlePointOfSalesPage}
        />
      </div>
      <div className={"w-full"}>{renderSection()}</div>
    </Fragment>
  );
};

export default PosConfirmation;
