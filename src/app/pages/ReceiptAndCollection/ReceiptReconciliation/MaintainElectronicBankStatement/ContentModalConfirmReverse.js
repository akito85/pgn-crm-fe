import { Fragment, useState } from "react";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import TablePagination from "../../../../../components/TablePagination";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import TableForceFE from "./DataDetailTabs/TableForceFE";
import TableReverseFE from "./DataDetailTabs/TableReverseFE";

const ContentModalConfirmReverse = ({
  data,
  listDataAttachment = [],
  columns = [],
  pageSize = [],
  listDataDetail = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataTable = [],
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <>
            {/* <TablePagination
              dataSource={dataTable}
              columns={columns}
              pageSize={pageSize}
              tableScrolled={{ x: 2000, y: 525 }}
            /> */}
            <TableReverseFE data={dataTable} key={4} type={4} />
            <DetailText label={"Remark"}>{data?.remark}</DetailText>
          </>
        );

      case tabData[1].value:
        return (
          <ApprovalSectionForm
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy,
              )?.[0].name || ""
            }
            dataTable={listDataAppHierDetail}
            selectedHierarchy
          />
        );
      case tabData[2].value:
        return (
          <AttachmentSectionForm type={"preview"} data={listDataAttachment} />
        );
      default:
        return <Fragment></Fragment>;
    }
  };
  const handlePricingInfo = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handlePricingInfo} />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-sm font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          {/* <div className="text-primary text-xs font-bold uppercase">
            {"PAYMENT ITEM INFORMATION"}
          </div> */}
        </div>
      ) : null}
    </div>
  );
};

export default ContentModalConfirmReverse;
