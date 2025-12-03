import React, { Fragment, useEffect, useRef, useState } from "react";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import StatusComponent from "../../../../../../components/StatusComponent";
import { Tooltip } from "antd";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import {
  dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
import SVGIcon from "../../../../../../assets/Icon/index";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  return (record[dataIndex]?.toString() || "")?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return (obj[fieldSort]?.toString() || "").toLowerCase();
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
  search,
  handleSearch,
  handleDetail,
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRODUCT NAME",
      width: 160,
      align: "left",
      dataIndex: "productName",
      filteredValue: search?.["productName"] ? [search?.["productName"]] : null,
      // onFilter: (value, record) => onFilter("productName", value, record),
      sorter: (a, b) => sorter("productName", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "productName",
          hasValue(search["productName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DISCOUNT TYPE",
      width: 160,
      dataIndex: "discountTypeName",
      // onFilter: (value, record) => onFilter("discountTypeName", value, record),
      filteredValue: search?.["discountTypeName"]
        ? [search?.["discountTypeName"]]
        : null,
      sorter: (a, b) => sorter("discountTypeName", a, b),
      // ...getColumnSearchPropsPaging(
      //   "discountTypeName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discountTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "discountTypeName",
          hasValue(search["discountTypeName"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DISCOUNT VALUE",
      width: 180,
      align: "right",
      dataIndex: "discountAmount",
      filteredValue: search?.["discountAmount"]
        ? [search?.["discountAmount"]]
        : null,
      // onFilter: (value, record) => onFilter("discountAmount", value, record),
      sorter: (a, b) => sorter("discountAmount", a, b),
      // ...getColumnSearchPropsPaging(
      //   "discountAmount",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      // render: (text) =>
      //   searchedColumn === "discountAmount" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text === 0 ? text.toString() : text || ""}
      //     />
      //   ) : (
      //     text
      //   ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "discountAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "discountAmount",
          hasValue(search["discountAmount"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      width: 160,
      align: "center",
      dataIndex: "startDate",
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      // onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      // ...getColumnSearchPropsPaging(
      //   "startDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      width: 160,
      align: "center",
      dataIndex: "endDate",
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      // onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      // ...getColumnSearchPropsPaging(
      //   "endDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "DESCRIPTIONS",
      width: 180,
      dataIndex: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      // ...getColumnSearchPropsPaging(
      //   "description",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      // render: (text) => {
      //   if (searchedColumn === "description") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "STATUS",
      width: 160,
      dataIndex: "status",
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      // onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      key: "status",
      // ...getColumnSearchPropsPaging(
      //   "status",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
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
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, r) => (
        <div className="flex justify-center align-middle gap-2">
          <Tooltip title="Detail">
            <div onClick={() => handleDetail(r)}>
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        </div>
      ),
    },
  ];

  return result;
};

const PDIProductBundling = ({ data = [] }) => {
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [modalDetail, setModalDetail] = useState(false);

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
        status: valueStatus(),
        startDate: item.startDate
          ? moment(item.startDate).format("DD MMM YYYY")
          : "",
        endDate: item.endDate ? moment(item.endDate).format("DD MMM YYYY") : "",
        discountValue: item.discountAmount
          ? parseInt(item.discountAmount) + ""
          : "",
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
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      // if (prevState[dataIndex] !== selectedKeys[0]) {
      //   setPage(1);
      // }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleSelectedDetail = (r) => {
    setSelectedData(r);
    setModalDetail(true);
  };

  return (
    <Fragment>
      <TablePaginationNew
        type="FE"
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 2300 }}
        onChange={handleChangeSize}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          search,
          handleSearch,
          handleSelectedDetail,
        )}
      />

      {modalDetail ? (
        <ModalCustom
          isOpen={modalDetail}
          handleCancel={() => {
            setModalDetail(false);
          }}
          header={"ELIGIBILITY PRODUCT DETAIL"}
          width={1000}
          type={"detail"}
          footer={
            <div className="w-full flex justify-end p-4">
              <ButtonComponent
                onClick={() => {
                  setModalDetail(false);
                }}
                type="default"
              >
                Back
              </ButtonComponent>
            </div>
          }
        >
          <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
            <DetailText label="Record ID">{selectedData?.id}</DetailText>
            <DetailText label="Created Date">
              {selectedData?.createdDate
                ? moment(selectedData.createdDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">
              {selectedData?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {selectedData?.updatedDate
                ? moment(selectedData.updatedDate).format(
                    dateFormatting.dateTime,
                  )
                : ""}
            </DetailText>
            <DetailText label="Updated By">
              {selectedData?.updatedBy}
            </DetailText>
          </CardComponent>
        </ModalCustom>
      ) : null}
    </Fragment>
  );
};

export default PDIProductBundling;
