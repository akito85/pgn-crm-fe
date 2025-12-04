import { useNavigate } from 'react-router-dom';
import { Tooltip } from "antd";
import TablePagination from "../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import { 
  FilterOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import TablePaginationNew from "../../../../../../../../components/TablePaginationNew";


const PaymentRelationDetailAttch = ({
  dataAttachment = [],
  handleChange = () => {},
  handleChangeSize = () => {},
  totalElement = 0,
  page = 1,
  pageSize = 10,
  searchText = "",
  searchedColumn = "",
  onSort = () => {},
  getColumnSearchProps = () => {},
  handleSearch
}) => {
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

  // Use dummy data if no data provided
  const tableData = (Array.isArray(dataAttachment) && dataAttachment.length > 0) ? dataAttachment : [];

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : tableData.length;

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
      render: (text, object, index) => (sanitizedPage - 1) * sanitizedPageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("type"),
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
      width: 150,
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
        <div className="mb-5 flex items-center justify-between">
          {/* Left Side Buttons Group */}
          <div className="flex items-center gap-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => {/* trigger filter */}}
              icon={<FilterOutlined className="text-2xl" />}
            >
              Filter
            </ButtonComponent>
          </div>

          {/* Right Side Buttons Group */}
          <div className="flex items-center gap-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => {/* trigger download list */}}
              icon={<DownloadOutlined className="text-2xl" />}
            >
              Download List
            </ButtonComponent>
          </div>
        </div>

        <TablePaginationNew
          dataSource={dataAttachment.map((item, idx) => ({
            ...item,
            key: item.id || idx,
          }))}
          tableScrolled={{ y: 525, x: 1500 }}
          columns={columns}
          type="FE"
        />

      </BaseContainer>
    </Fragment>
  );
};

export default PaymentRelationDetailAttch;
