import moment from "moment";
import { Fragment, useState } from "react";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import DetailText from "../../../../../components/DetailText";
import RadioTabs from "../../../../../components/RadioTabs";
import { dateFormatting } from "../../../../../utils";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";
import { getReceiptListColumns } from "./ReceiptListColumns";


const ContentModalConfirm = ({
  data,
  listDataAttachment = [],
  listDataAppHierDetail = [],
  tabData = [],
  dataOption,
  selectedHierarchy,
  receiptList = [],
}) => {
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (current, size) => {
    setPage(1);
    setPageSize(size);
  };

  const columnsReceipt = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT DATA",
      dataIndex: "receiptData",
      key: "receiptData",
      width: 150,
    },
    {
      title: "RECEIPT ID",
      dataIndex: "receiptId",
      key: "receiptId",
      width: 150,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 150,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 250,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "CUR",
      dataIndex: "currency",
      key: "currency",
      width: 80,
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (value) => value ? value.toLocaleString("id-ID") : 0,
      align: "right",
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      key: "remark",
      width: 200,
    },
    {
      title: "EGL",
      dataIndex: "egl",
      key: "egl",
      width: 100,
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 100,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", opacity: 0.5, cursor: "not-allowed" }}>
          <SVGIcon
            name="IconDelete"
            width={24}
          />
        </div>
      ),
    },
  ];

  const showSection = () => {
    switch (valuePage) {
      case tabData[0].value:
        return (
          <div className="flex flex-col gap-5 w-full">
            <div>
              <div className="text-primary text-xs font-bold uppercase mb-3">
                TRANSFER TO RECEIPT INFORMATION
              </div>
              <div className="grid grid-cols-3 w-full gap-5">
                <DetailText label={"Deduction Period"}>
                  {data?.deductionPeriod}
                </DetailText>

                <DetailText label={"Type"}>
                  {data?.type}
                </DetailText>

                <DetailText label={"Deduaction Date"}>
                  {data?.deductionDate}
                </DetailText>
              </div>
            </div>

            <div>
              <div className="text-primary text-xs font-bold uppercase mb-3">
                RECEIPT INFORMATION
              </div>
              <TableRBI
                columns={columnsReceipt}
                dataSource={receiptList.slice((page - 1) * pageSize, page * pageSize)}
                pagination={false}
                tableScrolled={{ x: 1800 }}
                totalData={receiptList?.length || 0}
                current={page}
                pageSize={pageSize}
                onChange={handlePageChange}
                onSizeChanger={handleSizeChange}
              />
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
        {/* Removed generic header since it is now inside the specific tab sections for more control or as per design */}
        {showSection()}
      </div>
    </div>
  );
};

export default ContentModalConfirm;
