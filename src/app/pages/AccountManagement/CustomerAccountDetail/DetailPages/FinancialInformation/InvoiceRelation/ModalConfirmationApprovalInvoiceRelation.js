import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../../../../utils";
import StatusComponent from "../../../../../../../components/StatusComponent";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../utils/getColumnSearchProps";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { useRef, useState } from "react";

const ModalConfirmationApprovalInvoiceRelation = ({
  dataSource,
  isOpen,
  handleCloseModal,
  onFinish,
  approveOrReject,
}) => {
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  /**
   * @param {string[]} selectedKeys 
   * @param {() => {}} confirm 
   * @param {string} dataIndex 
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({
        ...prevState,
        [dataIndex]: selectedKeys[0],
      })
    );
  };

  const columns = [
    {
      key: "no",
      title: "NO",
      width: 50,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "accountNumber",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
      filteredValue: [search?.accountNumber] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "accountNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
      ),
    },
    {
      key: "priorty",
      title: "PRIORITY",
      dataIndex: "priorty",
      width: 100,
      sorter: true,
      filteredValue: [search?.priorty] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "priorty",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "startDate",
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      align: "center",
      filteredValue: [search?.startDate] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (startDate) => moment(startDate, dateFormatting.f_date).format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      align: "center",
      filteredValue: [search?.endDate] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (endDate) => endDate ? moment(endDate, dateFormatting.f_date).format(dateFormatting.date) : "",
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 100,
      sorter: true,
      align: "center",
      fixed: "right",
      filteredValue: [search?.statusApproval] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (status) => {
        const displayText = {
          "approved": "Approved",
          "waitingApproval": "Waiting Approval",
          "pending": "Pending",
          "rejected": "Rejected"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      width: 100,
      filteredValue: [search?.status] || null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (status) => {
        const displayText = {
          "active": "Active",
          "inactive": "inactive",
        };

        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        )
      },
    },
  ];

  return (
    <ModalApproveOrReject
      isOpen={isOpen}
      handleCloseModal={handleCloseModal}
      onFinish={onFinish}
      width={1000}
      approveOrReject={approveOrReject}
      customMessage={"Are you sure you want to approve selected data?"}
      header={"CONFIRMATION"}
    >
      <NxTable
        dataSource={dataSource}
        totalData={dataSource.length}
        columns={columns}
        tableScrolled={{ y: 200, x: 1500 }}
        usePagination={false}
      />
    </ModalApproveOrReject>
  )
}

export default ModalConfirmationApprovalInvoiceRelation;