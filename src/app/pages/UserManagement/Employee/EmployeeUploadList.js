import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Input } from "antd";
import moment from "moment";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import StatusComponent from "../../../../components/StatusComponent";
import DynamicTableInline from "../../../../components/Table/DynamicTableInline";
import { dateFormatting } from "../../../../utils";

const EmployeeUploadList = ({
  dataEmp,
  dataEmployeeType,
  onChangeData = () => {},
}) => {
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.date)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const column = [
    {
      title: "NO",
      width: 60,
      align: "center",
      dataIndex: "no",
      editable: true,
      render: (text, object, index) => index + 1,
    },
    {
      title: "EMPLOYEE NUMBER",
      dataIndex: "empNumber",
      key: "empNumber",
      align: "left",
      ...getColumnSearchProps("empNumber"),
      sorter: true,
    },
    {
      title: "FIRST NAME",
      dataIndex: "firstName",
      align: "left",
      ...getColumnSearchProps("firstName"),
      sorter: true,
    },
    {
      title: "LAST NAME",
      dataIndex: "lastName",
      align: "left",
      ...getColumnSearchProps("lastName"),
      sorter: true,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      align: "left",
      sorter: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phone",
      align: "left",
      sorter: true,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "EMPLOYEE TYPE",
      dataIndex: "empType",
      align: "left",
      key: "empType",
      inputType: "select",
      options: dataEmployeeType,
      ...getColumnSearchProps("empType"),
      sorter: true,
      editable: true,
      render: (employeeType) => (
        <span>
          <span>
            {
              dataEmployeeType
                ?.filter((a) => a?.label === employeeType)
                .find((b) => b.label)?.label
            }
          </span>
        </span>
      ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      ...getColumnSearchProps("startDate", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "left",
      editable: true,
      sorter: true,
      inputType: "date",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ),
    },
  ];
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPage(pageSize);
  };
  return (
    <>
      <DynamicTableInline
        // header={"LIST UPLOAD EMPLOYEE"}
        tableData={dataEmp}
        onDataChange={onChangeData}
        cols={column}
        mode={"update"}
        showCreateButton={false}
        scrollTable={{ x: 3000, y: 500 }}
        onSort={onSort}
        actionButton={["update", "delete"]}
        usePagination={true}
        totalData={dataEmp?.length}
        pageSize={pageSize}
        current={page}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        useSelect={true}
        useContainer={false}
      />
    </>
  );
};

export default EmployeeUploadList;
