import { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDeleteItemOverride = () => {},
  handleUpdateItemOverride = () => {},
  type,
  typeUpdate,
  dataTaxImplicationRule,
  dataTransCode
) => {
  const temp = [
    {
      title: "NO",
      width: 90,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "IMPLICATION TYPE",
      width: 240,
      sorter: true,
      align: "left",
      dataIndex: "implicationType",
      ...getColumnSearchPropsPaging(
        "implicationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "TRANSACTION CODE",
      width: 240,
      sorter: true,
      align: "left",
      dataIndex: "transactionCode",
      ...getColumnSearchPropsPaging(
        "transactionCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => {
        return (
          <span>{dataTransCode?.find((item) => item?.id === text)?.code}</span>
        );
      },
    },
    {
      title: "DESCRIPTION",
      width: 160,
      sorter: true,
      dataIndex: "description",
      ...getColumnSearchPropsPaging(
        "desc",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "isGunggung") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center w-full gap-4">
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  onClick={() => handleUpdateItemOverride(r)}
                  name="IconEdit"
                  width={24}
                />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  onClick={() => handleDeleteItemOverride(r.key)}
                  name="IconDelete"
                  width={24}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];
  return type === "view" ||
    (typeUpdate === "update" && dataTaxImplicationRule.status === "ACTIVE")
    ? temp.filter((col) => col.title !== "ACTION")
    : temp;
};

const expandedRowRender = (record) => {
  const columns = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => {
    return [
      {
        title: "NO",
        width: 90,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "CONDITION NAME",
        dataIndex: "conditionName",
        sorter: true,
        align: "left",
        ...getColumnSearchPropsPaging(
          "conditionName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "OPERATOR",
        dataIndex: "operator",
        sorter: true,
        align: "left",
        ...getColumnSearchPropsPaging(
          "operator",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "VALUE",
        dataIndex: "value",
        sorter: true,
        align: "right",
        ...getColumnSearchPropsPaging(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (value, r) => {
          return (
            <div
              className={
                r?.conditionName === "TAX EXEMPTION SUBMISSION"
                  ? "text-left"
                  : "text-right"
              }
            >
              {value}
            </div>
          );
        },
      },
    ];
  };
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase pt-4">
        CONDITION DETAIL INFORMATION
      </p>
      <TablePaginationNew
        useSelect={false}
        usePagination={false}
        dataSource={record?.dataDetail}
        columns={columns()}
        className={"mb-4"}
      />
    </div>
  );
};
const TableTaxImplicationRuleOverride = ({
  data = [],
  handleDeleteItemOverride = () => {},
  handleUpdateItemOverride = () => {},
  type,
  typeUpdate,
  dataTaxImplicationRule,
  dataTransCode,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const searchInput = useRef(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (data && data?.length > 0) {
      const dataItem = data?.map((a, index) => ({
        ...a,
        key: index + 1,
        dataDetail: a.dataDetail?.map((b, index) => ({
          ...b,
          conditionName: b.conditionName.label,
          operator: b.operator.label,
          key: index + 1,
        })),
      }));
      setDataSource(dataItem);
    } else {
      setDataSource([]);
    }
  }, [data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };
  return (
    <div>
      <TablePaginationNew
        dataSource={dataSource || []}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleDeleteItemOverride,
          handleUpdateItemOverride,
          type,
          typeUpdate,
          dataTaxImplicationRule,
          dataTransCode
        )}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSort={onSort}
        totalData={dataSource?.length || 0}
        tableScrolled={{
          x: 1500,
          y: 300,
        }}
        expandable={{
          expandedRowRender,
        }}
      ></TablePaginationNew>
    </div>
  );
};

export default TableTaxImplicationRuleOverride;
