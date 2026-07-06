import React, { useRef, useState } from "react";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import NxTable from "../../../../../components/Nx/NxTable";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  const result = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTION BY",
      width: 240,
      sorter: true,
      dataIndex: "actionBy",
      ...getColumnSearchProps(
        "actionBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTION DATE",
      width: 240,
      sorter: true,
      dataIndex: "actionDate",
      ...getColumnSearchProps(
        "actionDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "actionDate" ? (
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
          "-"
        ),
    },
    {
      title: "END DATE BEFOR",
      width: 240,
      sorter: true,
      dataIndex: "endDateBefore",
      ...getColumnSearchProps(
        "endDateBefore",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "END DATE AFTER",
      width: 240,
      sorter: true,
      dataIndex: "endDateAfter",
      ...getColumnSearchProps(
        "endDateAfter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
  ];
  return result;
};
const ModalEndDateHistory = ({
  openModal = false,
  handleClose = () => {},
  dataObj = {},
  dataTable = [],
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const computeDisplayData = () => {
    let result = [...dataTable];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort]?.toLowerCase();
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  };
  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };
  const filteredSortedData = computeDisplayData();
  const displayData = filteredSortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={handleClose}
      header={"END DATE HISTORY"}
      width={1200}
      type={"detail"}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent onClick={handleClose} type="default">
            Back
          </ButtonComponent>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CardComponent header={"PRICING INFORMATION"} cols={4}>
          <DetailText label={"Price Code"}>{dataObj.priceCode}</DetailText>
          <DetailText label={"Price Detail"}>{dataObj.priceDetail}</DetailText>
          <DetailText label={"Price Description"}>
            {dataObj.description}
          </DetailText>
        </CardComponent>
        <NxTable
          idTable="end-date-history-table"
          dataSource={displayData}
          totalData={filteredSortedData.length}
          current={page}
          pageSize={pageSize}
          tableScrolled={{ y: 300, x: true }}
          onChange={handleChangeSize}
          onSizeChanger={handleChangeSize}
          columns={columns(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          onSort={onSort}
          usePagination={true}
          showSearchBar={false}
          showAdvanceSearch={false}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalEndDateHistory;
