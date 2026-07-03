import React, { Fragment, useRef, useState } from "react";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting, hasValue, renderColumn } from "../../../../../../utils";
import SVGIcon from "../../../../../../assets/Icon/index";
import NxTable from "../../../../../../components/Nx/NxTable";
import { useSelector } from "react-redux";

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
  search,
  handleDetailHistory
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
      title: "NAME",
      key: "name",
      width: 160,
      dataIndex: "name",
      filteredValue: search?.["name"] ? [search?.["name"]] : null,
      // onFilter: (value, record) => onFilter("name", value, record),
      sorter: (a, b) => sorter("name", a, b),
      // ...getColumnSearchPropsPaging(
      //   "name",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "name",
          hasValue(search["name"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "VALUE",
      width: 160,
      align: "right",
      dataIndex: "value",
      key: "value",
      // onFilter: (value, record) => onFilter("value", value, record),
      filteredValue: search?.["value"] ? [search?.["value"]] : null,
      sorter: (a, b) => sorter("value", a, b),
      // ...getColumnSearchPropsPaging(
      //   "value",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "value",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "value",
          hasValue(search["value"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "UNIT",
      key: "unit",
      width: 160,
      align: "center",
      dataIndex: "uomName",
      filteredValue: search?.["uomName"] ? [search?.["uomName"]] : null,
      // onFilter: (value, record) => onFilter("uomName", value, record),
      sorter: (a, b) => sorter("uomName", a, b),
      // ...getColumnSearchPropsPaging(
      //   "uomName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uomName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "uomName",
          hasValue(search["uomName"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTION",
      key: "description",
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
      // ellipsis: {
      //   showTitle: false,
      // },
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
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: "12%",
      align: "center",
      render: (id, record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetailHistory(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return result;
};
const PDICalculationRule = ({ data = [] }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [modalHistory, setModalHistory] = useState(false);
  const [dataHistory, setDataHistory] = useState(false);
  
  const { data: dataUser = {} } = useSelector((state) => state.profile);

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
    })
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleDetailHistory = (record) => {
    setModalHistory(true);
    setDataHistory(record);
  };

  return (
    <Fragment>
      <NxTable
        idTable={"product-information-calculation-rule"}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1500 }}
        onChange={handleChangeSize}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          search,
          handleDetailHistory
        )}
      />
      {/* Modal History Log */}
      {modalHistory ? (
        <ModalCustom
          isOpen={modalHistory}
          handleCancel={() => {
            setModalHistory(false);
          }}
          type="detail"
          header="DETAIL INFORMATION"
          width={800}
          footer={
            <ButtonComponent
              type={"default"}
              onClick={() => {
                setModalHistory(false);
              }}
            >
              Back
            </ButtonComponent>
          }
        >
          <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
            <DetailText label="Record ID">{dataHistory.id}</DetailText>
            <DetailText label="Created Date">
              {dataHistory?.createdDate
                ? moment(dataHistory.createdDate).format(
                    dateFormatting.dateTime
                  )
                : ""}
            </DetailText>
            <DetailText label="Created By">{dataHistory?.createdBy}</DetailText>
            <DetailText label="Updated Date">
              {dataHistory?.updatedDate
                ? moment(dataHistory.updatedDate).format(
                    dateFormatting.dateTime
                  )
                : ""}
            </DetailText>
            <DetailText label="Updated By">{dataHistory?.updatedBy}</DetailText>
          </CardComponent>
        </ModalCustom>
      ) : null}
    </Fragment>
  );
};

export default PDICalculationRule;
