import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../components/DetailText";
import RadioTabs from "../../../../components/RadioTabs";
import TablePagination from "../../../../components/TablePagination";
import { dateFormatting } from "../../../../utils";
import AttachmentSectionForm from "../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const ContentModalConfirmPayment = ({
  data,
  listDataAttachment = [],
  columns = [],
  pageSize = [],
  listDataDetail = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataTable = [],
  totalData,
  onChange,
  page,
  dataOption,
  selectedHierarchy,
  checked,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="grid grid-cols-3 w-full">
            <DetailText label={"Payment Method Code"}>
              {data?.paymentMethodCode}
            </DetailText>
            <DetailText label={"Payment Method Name"}>{data?.name}</DetailText>
            <DetailText label={"Is Bank Method"}>
              {checked === true ? "True" : "False"}
            </DetailText>
            <DetailText label={"Start Date"}>
              {moment(data?.startDate).format(dateFormatting.date)}
            </DetailText>
            <DetailText label={"End Date"}>
              {data?.endDate
                ? moment(data?.endDate).format(dateFormatting.date)
                : ""}
            </DetailText>
            <div className="col-span-3">
              <DetailText label={"Description"}>{data?.description}</DetailText>
            </div>
          </div>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
            showSelect={false}
            disableSelect={true}
            approvalName={
              (dataOption || []).filter(
                (data) => data.value === selectedHierarchy
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
  const handleMethod = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handleMethod} />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          {/* <div className="text-primary text-xs font-bold uppercase">
            {"PAYMENT ITEM INFORMATION"}
          </div> */}

          <TablePagination
            dataSource={dataTable}
            columns={columns}
            pageSize={pageSize}
            current={page}
            totalData={totalData}
            onChange={onChange}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ContentModalConfirmPayment;
