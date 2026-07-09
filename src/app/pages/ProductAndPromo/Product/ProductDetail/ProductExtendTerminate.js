import React, { Fragment, useEffect, useRef, useState } from "react";
import { dateFormatting, hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import { Tooltip } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import moment from "moment";
import StatusComponent from "../../../../../components/StatusComponent";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import SVGIcon from "../../../../../assets/Icon/index";
import NxTable from "../../../../../components/Nx/NxTable";
import { useSelector } from "react-redux";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  if (dataIndex === "status") {
    let text;
    const tempData = record[dataIndex];
    switch (tempData) {
      case "WAITING_FOR_APPROVAL":
        text = "Waiting Approval";
        break;
      default:
        text = tempData
          ? tempData.charAt(0).toUpperCase() + tempData.slice(1).toLowerCase()
          : tempData;
        break;
    }
    return text?.toLowerCase().includes(search);
  }
  return (record[dataIndex] || "")?.toLowerCase().includes(search);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    if (fieldSort === "status") {
      let text;
      const tempField = obj[fieldSort];
      switch (tempField) {
        case "WAITING_FOR_APPROVAL":
          text = "Waiting Approval";
          break;
        default:
          text = tempField
            ? tempField.charAt(0).toUpperCase() +
              tempField.slice(1).toLowerCase()
            : tempField;
          break;
      }
      return text?.toLowerCase();
    }
    return (obj[fieldSort] || "")?.toLowerCase();
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
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTION",
      key: "action",
      width: 160,
      align: "left",
      dataIndex: "type",
      filteredValue: search?.["type"] ? [search?.["type"]] : null,
      // onFilter: (value, record) => onFilter("type", value, record),
      sorter: (a, b) => sorter("type", a, b),
      // ...getColumnSearchPropsPaging(
      //   "type",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "type",
          hasValue(search["type"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACTION BY",
      key: "actionBy",
      width: 160,
      align: "left",
      dataIndex: "actionBy",
      filteredValue: search?.["actionBy"] ? [search?.["actionBy"]] : null,
      // onFilter: (value, record) => onFilter("actionBy", value, record),
      sorter: (a, b) => sorter("actionBy", a, b),
      // ...getColumnSearchPropsPaging(
      //   "actionBy",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "actionBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "actionBy",
          hasValue(search["actionBy"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "ACTION DATE",
      key: "actionDate",
      width: 160,
      align: "center",
      dataIndex: "actionDate",
      filteredValue: search?.["actionDate"] ? [search?.["actionDate"]] : null,
      // onFilter: (value, record) => onFilter("actionDate", value, record),
      sorter: (a, b) => sorter("actionDate", a, b),
      // ...getColumnSearchPropsPaging(
      //   "actionDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "actionDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "actionDate",
          hasValue(search["actionDate"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "END DATE BEFORE",
      key: "endDateBefore",
      width: 160,
      align: "center",
      dataIndex: "endDateBefore",
      filteredValue: search?.["endDateBefore"] ? [search?.["endDateBefore"]] : null,
      // onFilter: (value, record) => onFilter("endDateBefore", value, record),
      sorter: (a, b) => sorter("endDateBefore", a, b),
      // ...getColumnSearchPropsPaging(
      //   "endDateBefore",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDateBefore",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDateBefore",
          hasValue(search["endDateBefore"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "END DATE AFTER",
      key: "endDateAfter",
      width: 160,
      align: "center",
      dataIndex: "endDateAfter",
      filteredValue: search?.["endDateAfter"] ? [search?.["endDateAfter"]] : null,
      // onFilter: (value, record) => onFilter("endDateAfter", value, record),
      sorter: (a, b) => sorter("endDateAfter", a, b),
      // ...getColumnSearchPropsPaging(
      //   "endDateAfter",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDateAfter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        renderDateColumn(
          "endDateAfter",
          hasValue(search["endDateAfter"]),
          searchText,
          text,
          "date",
          search
        ),
    },
    {
      title: "REMARK",
      key: "remark",
      width: 180,
      dataIndex: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
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
          search
        ),
      // ...getColumnSearchPropsPaging(
      //   "description",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
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
      key: "status",
      width: 180,
      dataIndex: "status",
      fixed: "right",
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      // onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      key: "status",
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // ...getColumnSearchPropsPaging(
      //   "status",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING FOR APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className={" flex justify-center"}>
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
    {
      title: "ACTION",
      key: "action",
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
const ProductExtendTerminate = ({ data = [] }) => {
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

  const { data: dataUser = {} } = useSelector((state) => state.profile);

  useEffect(() => {
    let result = data.map((item) => {
      return {
        ...item,
        lockType: item.lockType === "LOCKED" ? "Lock" : "Unlock",
        actionDate: item.actionDate
          ? moment(item.actionDate).format(dateFormatting.dateTime)
          : "",
        endDateBefore: item.endDateBefore
          ? moment(item.endDateBefore).format(dateFormatting.date)
          : "",
        endDateAfter: item.endDateAfter
          ? moment(item.endDateAfter).format(dateFormatting.date)
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
    setSearchedColumn(tempSearchColumn);
    setSearch((prevState) => {
      // if (prevState[dataIndex] !== selectedKeys[0]) {
      //   setPage(1);
      // }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    })
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
      <NxCardContainer header={"EXTEND & TERMINATE HISTORY"}>
        <NxTable
          idTable={"product-information-extend-terminate"}
          userId={dataUser?.data?.username}
          showAdvanceSearch={false}
          showSearchBar={false}
          usePagination={false}
          type="FE"
          dataSource={dataTable}
          totalData={totalElements}
          current={page}
          pageSize={pageSize}
          tableScrolled={{ y: 300, x: 2000 }}
          onChange={handleChangeSize}
          columns={columns(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            search,
            handleSearch,
            handleSelectedDetail
          )}
        />
      </NxCardContainer>
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
                    dateFormatting.dateTime
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">
              {selectedData?.createdBy}
            </DetailText>
            <DetailText label="Updated Date">
              {selectedData?.updatedDate
                ? moment(selectedData.updatedDate).format(
                    dateFormatting.dateTime
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

export default ProductExtendTerminate;
