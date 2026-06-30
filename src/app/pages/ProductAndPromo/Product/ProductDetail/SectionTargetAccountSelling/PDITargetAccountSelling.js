import React, { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import DetailText from "../../../../../../components/DetailText";
import StatusComponent from "../../../../../../components/StatusComponent";
import moment from "moment";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import { columnsTableCriteria } from "../../columnTableCriteria";
import { columnsTableCriteriaAll } from "../../../UtilsProduct/TableCriteriaAllProduct";
import FunctionalCriteriaProduct from"../../../UtilsProduct/FunctionalCriteriaProduct";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  return record[dataIndex]?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toString().toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  dataCriteria = []
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    ...columnsTableCriteria(
      {},
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    {
      title: "START DATE",
      width: 200,
      align: "center",
      dataIndex: "startDateTranslate",
      onFilter: (value, record) =>
        onFilter("startDateTranslate", value, record),
      sorter: (a, b) => sorter("startDateTranslate", a, b),
      inputType: "date",
      ...getColumnSearchPropsPaging(
        "startDateTranslate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "END DATE",
      width: 200,
      align: "center",
      dataIndex: "endDateTranslate",
      onFilter: (value, record) => onFilter("endDateTranslate", value, record),
      sorter: (a, b) => sorter("endDateTranslate", a, b),
      inputType: "date",
      ...getColumnSearchPropsPaging(
        "endDateTranslate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DESCRIPTIONS",
      width: 240,
      dataIndex: "description",
      onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      inputType: "textarea",
      ...getColumnSearchPropsPaging(
        "description",
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
        if (searchedColumn === "description") {
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
      title: "STATUS",
      width: 200,
      dataIndex: "status",
      onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      key: "status",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index) => {
        if (index) {
          return (
            <div className={" flex justify-center"}>
              <StatusComponent colour={index}>{index}</StatusComponent>
            </div>
          );
        }
        return "";
      },
    },
  ];

  const listExclude = [
    "NO",
    "ACTION",
    "START DATE",
    "END DATE",
    "DESCRIPTIONS",
  ];

  return result.filter((col) =>
    !listExclude.includes(col.title)
      ? dataCriteria.includes(col.indexValue)
      : true
  );
};
const PDITargetAccountSelling = ({
  data = [],
  dataObject = {},
  dataCriteria = [],
}) => {
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let result = data.map((item) => {
      const valueStatus = () => {
        if (!item.endDate) {
          if (moment(item.startDate) > moment()) {
            return "Inactive";
          }
          return "Active";
        } else {
          if (
            moment(item.startDate) <= moment() &&
            moment() <= moment(item.endDate)
          ) {
            return "Active";
          }
          return "Inactive";
        }
      };
      return {
        ...item,
        startDateTranslate: item.startDate
          ? moment(item.startDate).format("DD MMM YYYY")
          : "",
        endDateTranslate: item.endDate
          ? moment(item.endDate).format("DD MMM YYYY")
          : "",
        status: valueStatus(),
      };
    });
    setDataTable(result);
    setTotalElement(result.length);
  }, [data]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const valueCriteria = () => {
    return (dataObject.mProductTargetAccountSellingCriteria || []).reduce(
      (prev, current, index) =>
        prev + (index !== 0 ? ", " : "") + current.criteriaName,
      ""
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2 w-full">
        <DetailText label={"Name"}>{dataObject.name}</DetailText>
        <DetailText label={"Criteria"}>{valueCriteria()}</DetailText>
        <div className="col-span-2">
          <DetailText label={"Description"}>
            {dataObject.description}
          </DetailText>
        </div>
      </div>
      {!(dataObject.mProductTargetAccountSellingCriteria || [])
        .map((crit) => (crit.criteria ? parseInt(crit.criteria) : 0))
        .includes(24) &&
      dataCriteria &&
      dataCriteria.length > 0 ? (
        <FunctionalCriteriaProduct
            data={dataTable} //data
            dataCriteria={dataCriteria} //ddl
            type={"detail"}
            selector="product"
            columnsTable={columnsTableCriteriaAll}
            countryCriteriaId={
              (dataObject.mProductTargetAccountSellingCriteria || [])
                .find((item) => item.criteriaName === "Country")
                ?.criteria
                ? parseInt(
                    (dataObject.mProductTargetAccountSellingCriteria || []).find(
                      (item) => item.criteriaName === "Country"
                    ).criteria
                  )
                : undefined
            }
          />
        // <TablePaginationNew
        //   type="FE"
        //   dataSource={dataTable}
        //   totalData={totalElements}
        //   current={page}
        //   pageSize={pageSize}
        //   tableScrolled={{ y: 525, x: 2300 }}
        //   onChange={handleChangeSize}
        //   columns={columns(
        //     page,
        //     pageSize,
        //     searchInput,
        //     searchedColumn,
        //     searchText,
        //     handleSearch,
        //     dataCriteria
        //   )}
        // />
      ) : null}
    </div>
  );
};

export default PDITargetAccountSelling;
