import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import TablePagination from "../../../../../components/TablePagination";
import { intToNPWP } from "../../../../../utils/npwp";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";

const ContentModalConfirmBank = ({
  data,
  listDataAttachment = [],
  columns = [],
  pageSize = [],
  listDataDetail = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataTable = [],
  isBranch,
  expandedRowRender,
  current,
  onSort,
  handleChange,
  dataBank,
  type,
  totalData,
  dataOption,
  selectedHierarchy,
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const npwp = data?.npwp;
  // const formattedNPWP = npwp
  //   ? `${npwp.substring(0, 2)}.${npwp.substring(2, 5)}.${npwp.substring(
  //       5,
  //       8
  //     )}.${npwp.charAt(8)}-${npwp.substring(9, 12)}.${npwp.substring(13)}`
  //   : "";
  const bankCode = (dataBank || []).filter(
    (item) => item.bankCode === data?.bankCode,
  );
  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <>
            <div className="grid grid-cols-4 w-full gap-5">
              <DetailText label={"Is Branch"}>
                {data?.isBranch === true ? "True" : ""}
              </DetailText>
              {data?.isBranch === true ? (
                <>
                  <DetailText label={"Bank Code"}>
                    {bankCode[0]?.bankCodeName || ""}
                  </DetailText>
                </>
              ) : (
                <DetailText label={"Bank Code"}>{data?.bankCode}</DetailText>
              )}
              <DetailText label={"Bank Name"}>{data?.bankName}</DetailText>
              <DetailText label={"Short Bank Name"}>
                {data?.bankShortName}
              </DetailText>
            </div>
            <div className="w-full grid grid-cols-4 gap-5">
              {isBranch === true ? (
                <DetailText label={"Branch Name"}>
                  {data?.branchName}
                </DetailText>
              ) : null}
              <DetailText label={"Tax Identification Number (NPWP)"}>
                {intToNPWP(data?.npwp)}
              </DetailText>
              <DetailText label={"Phone Number"}>
                {/* {type === "update"
                  ? `62${data?.phoneNumber}`
                  : ` ${data?.phoneNumber}`} */}
                {data?.phoneNumber}
              </DetailText>
              <DetailText label={"Email"}>{data?.email}</DetailText>
            </div>
            <div className="grid grid-cols-1 w-full">
              <DetailText label={"Address"}>{data?.address}</DetailText>
            </div>
          </>
        );
      case tabData[1].value:
        return (
          <ApprovalComponentGeneral
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
  const handleBankInfo = (e) => {
    setValuePage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <RadioTabs data={tabData} onChange={handleBankInfo} />
      <div className="flex flex-col gap-4">
        <div className="text-primary text-xs font-bold uppercase">
          {`${valuePage} INFORMATION`}
        </div>
        {showSection()}
      </div>
      {valuePage === tabData[0].value ? (
        <div className="flex flex-col gap-4">
          <div className="text-primary text-xs font-bold uppercase">
            {`CONTACT LIST INFORMATION`}
          </div>
          <TablePagination
            dataSource={dataTable}
            totalData={totalData}
            current={current}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columns}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 2000 }}
            expandable={{
              expandedRowRender,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ContentModalConfirmBank;
