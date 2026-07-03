import { useCallback, useEffect, useRef, useState } from "react";
import CardComponent from "../../../../components/Card/CardComponent";
import TablePagination from "../../../../components/TablePagination";
import DetailText from "../../../../components/DetailText";
import { hasValue, renderDateConverter } from "../../../../utils";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import { updatePagination } from "../../../../utils/updatePagination";
import NxTable from "../../../../components/Nx/NxTable";
import { useSelector } from "react-redux";

const DetailPosition = ({
  data_detail,
  handleCancelModal = () => {},
  data_position,
}) => {
  // use state
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [typeColumn, setTypeColumn] = useState("string");

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  // handle set data
  const handleSetData = useCallback((data_detail, data_position) => {
    const idMap = data_position?.reduce((acc, item) => {
      acc[item.id] = item?.name;
      return acc;
    }, {});

    if (data_detail && hasValue(data_detail?.id)) {
      const transformData = {
        ...data_detail,
        positionId: hasValue(data_detail?.positionId)
          ? idMap[data_detail?.positionId]
          : null,
        parentId: hasValue(data_detail?.parentId)
          ? idMap[data_detail?.parentId]
          : null,
      };

      setData(transformData);
    } else {
      const transformData = {
        positionId: data_detail?.positionName,
        parentId: data_detail?.positionParent,
        description: data_detail?.remark,
      };
      setData(transformData);
    }
  }, []);

  useEffect(() => {
    if (data_detail && data_position) {
      handleSetData(data_detail[0], data_position);
    }
  }, [data_detail, data_position, handleSetData]);

  // handle change pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPage(pageChange);
  };

  // handle search table
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    switch (dataIndex) {
      case "createdDate":
      case "updatedDate":
        setTypeColumn("datetime");
        break;

      default:
        setTypeColumn("string");
        break;
    }
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // column
  const column = [
    {
      title: "NO",
      // dataIndex: "name",
      // key: "name",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "EMPLOYEE NUMBER",
      dataIndex: "empNumber",
      key: "empNumber",
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction("empNumber", a, b),
      ...getColumnSearchProps(
        "empNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        searchedColumn === "empNumb" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "EMPLOYEE NAME",
      dataIndex: "empName",
      key: "empName",
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => sorterFunction("empName", a, b),
      ...getColumnSearchProps(
        "empName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        searchedColumn === "empName" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "PERIOD",
      dataIndex: "periode",
      key: "periode",
      align: "center",
      sorter: (a, b) => sorterFunction("periode", a, b),
      ...getColumnSearchProps(
        "periode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        searchedColumn === "periode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CREATED DATE",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
      ...getColumnSearchProps(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "datetime"
      ),
      render: (text) =>
        searchedColumn === "createdDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {renderDateConverter(text, "date")}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CREATED BY",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => sorterFunction("createdBy", a, b),
      ...getColumnSearchProps(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        searchedColumn === "createdBy" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "UPDATED DATE",
      dataIndex: "updatedDate",
      key: "updatedDate",
      align: "center",
      sorter: (a, b) => sorterFunction("updatedDate", a, b, "date"),
      ...getColumnSearchProps(
        "updatedDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "datetime"
      ),
      render: (text) =>
        searchedColumn === "updatedDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {renderDateConverter(text, "date")}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "UPDATED BY",
      dataIndex: "updatedBy",
      key: "updatedBy",
      sorter: (a, b) => sorterFunction("updatedBy", a, b),
      ...getColumnSearchProps(
        "updatedBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        searchedColumn === "updatedBy" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
  ];

  console.log(data);

  return (
    <div>
      <CardComponent header={"Position Information"}>
        <div className={"w-full grid grid-cols-3"}>
          <DetailText label={"Position"}>{data?.positionId}</DetailText>
          <DetailText label={"Parent"}>{data?.parentId}</DetailText>
          <DetailText label={"Description"}>{data?.description}</DetailText>
        </div>
      </CardComponent>
      {hasValue(data?.id) && (
        <>
          <CardComponent header={"History Log Information"}>
            <div className={"w-full grid grid-cols-5"}>
              <DetailText label={"Record Id"}>{data?.id}</DetailText>
              <DetailText label={"Created Date"}>
                {hasValue(data?.createdDate) &&
                  renderDateConverter(data?.createdDate, "datetime")}
              </DetailText>
              <DetailText label={"Created By"}>{data?.createdBy}</DetailText>
              <DetailText label={"Updated Date"}>
                {hasValue(data?.updatedDate) &&
                  renderDateConverter(data?.updatedDate, "datetime")}
              </DetailText>
              <DetailText label={"Updated By"}>{data?.updatedBy}</DetailText>
            </div>
          </CardComponent>

          <div>
            <div className="my-4">
              <p className="text-primary text-xs font-semibold uppercase">
                ASSIGNMENT LIST
              </p>
            </div>
            <NxTable
              idTable={"table-detail-position"}
              userId={dataUser?.data?.username}
              dataSource={updatePagination(
                data?.employee,
                "data",
                searchedColumn,
                searchText,
                page,
                pageSize,
                typeColumn
              )}
              totalData={updatePagination(
                data?.employee,
                "length",
                searchedColumn,
                searchText,
                page,
                pageSize,
                typeColumn
              )}
              columns={column}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              tableScrolled={{
                x: 1700,
                y: 300,
              }}
              usePagination={false}
              showAdvanceSearch={false}
              showSearchBar={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPosition;
