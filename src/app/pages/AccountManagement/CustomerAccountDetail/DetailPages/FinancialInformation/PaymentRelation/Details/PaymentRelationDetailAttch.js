import { Tooltip } from "antd";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment, useState } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../../../../components/TablePaginationNew";


const PaymentRelationDetailAttch = ({
  dataAttachment = [],
  getColumnSearchProps = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dummy data
  const dummyData = [
    {
      id: "1",
      type: "PDF",
      fileName: "Document_Report_2025.pdf",
      fileSize: "2.5 MB"
    },
    {
      id: "2",
      type: "Excel",
      fileName: "Sales_Data_Q4.xlsx",
      fileSize: "1.8 MB"
    },
    {
      id: "3",
      type: "Word",
      fileName: "Project_Proposal.docx",
      fileSize: "850 KB"
    },
    {
      id: "4",
      type: "Image",
      fileName: "Brand_Guidelines.png",
      fileSize: "3.2 MB"
    },
    {
      id: "5",
      type: "PDF",
      fileName: "Contract_Agreement.pdf",
      fileSize: "1.2 MB"
    },
    {
      id: "6",
      type: "PDF",
      fileName: "Document_Report_2025.pdf",
      fileSize: "2.5 MB"
    },
    {
      id: "7",
      type: "Excel",
      fileName: "Sales_Data_Q4.xlsx",
      fileSize: "1.8 MB"
    },
    {
      id: "8",
      type: "Word",
      fileName: "Project_Proposal.docx",
      fileSize: "850 KB"
    },
    {
      id: "9",
      type: "Image",
      fileName: "Brand_Guidelines.png",
      fileSize: "3.2 MB"
    },
    {
      id: "10",
      type: "PDF",
      fileName: "Contract_Agreement.pdf",
      fileSize: "1.2 MB"
    },
    {
      id: "11",
      type: "PDF",
      fileName: "Document_Report_2025.pdf",
      fileSize: "2.5 MB"
    },
    {
      id: "12",
      type: "Excel",
      fileName: "Sales_Data_Q4.xlsx",
      fileSize: "1.8 MB"
    },
    {
      id: "13",
      type: "Word",
      fileName: "Project_Proposal.docx",
      fileSize: "850 KB"
    },
    {
      id: "14",
      type: "Image",
      fileName: "Brand_Guidelines.png",
      fileSize: "3.2 MB"
    },
    {
      id: "15",
      type: "PDF",
      fileName: "Contract_Agreement.pdf",
      fileSize: "1.2 MB"
    },
  ];

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;

  const handleViewFile = (fileData) => {
    // Placeholder for view file action
    console.log("View file:", fileData);
    // Add your file viewing logic here
  };

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "fileCategoryName",
      width: 75,
      sorter: true,
      ...getColumnSearchProps("fileCategoryName"),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      width: 300,
      sorter: true,
      ...getColumnSearchProps("fileName"),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      width: 100,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("fileSize"),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="View">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEye"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleViewFile(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <BaseContainer header={"ATTACHMENTS"}>
        <TablePaginationNew
          dataSource={dataAttachment.map((item, idx) => ({
            ...item,
            key: item.id || idx,
          }))}
          tableScrolled={{ y: 525, x: 1500 }}
          columns={columns}
          current={page}
          onChange={setPage}
          onSizeChanger={setPageSize}
          type="FE"
        />

      </BaseContainer>
    </Fragment>
  );
};

export default PaymentRelationDetailAttch;
