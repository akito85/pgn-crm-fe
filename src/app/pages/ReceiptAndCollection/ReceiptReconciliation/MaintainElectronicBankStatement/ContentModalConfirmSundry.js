import { Fragment, useState } from "react";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import TableSundryFE from "./DataDetailTabs/TableSundryFE";

const ContentModalConfirmSundry = ({
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
  selectCustomer,
  setSelectCustomer,
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

            <TableSundryFE
              data={dataTable}
              key={"4"}
              type={4}
              selectCustomer={selectCustomer}
              setSelectCustomer={setSelectCustomer}
            />
            <DetailText label={"Remark"}>{data?.remark}</DetailText>
          </>
        );

      case tabData[1].value:
        return (
          //   <ApprovalSectionForm
          //     showSelect={false}
          //     dataTable={listDataAppHierDetail}
          //     selectedHierarchy
          //   />
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
  const handleSundry = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handleSundry} />
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

export default ContentModalConfirmSundry;
