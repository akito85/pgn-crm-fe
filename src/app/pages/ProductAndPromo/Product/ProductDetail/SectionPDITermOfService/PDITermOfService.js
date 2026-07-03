import React, { useRef, useState } from "react";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import ContentModalTosPDI from "./ContentModalTosPDI";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { hasValue, renderColumn } from "../../../../../../utils";
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
  search,
  handleSearch,
  handleDetail
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
      title: "TERM OF SERVICE",
      key: "tosName",
      // width: 160,
      dataIndex: "tosName",
      filteredValue: search?.["tosName"] ? [search?.["tosName"]] : null,
      // onFilter: (value, record) => onFilter("tosName", value, record),
      sorter: (a, b) => sorter("tosName", a, b),
      // ...getColumnSearchPropsPaging(
      //   "tosName",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "tosName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "tosName",
          hasValue(search["tosName"]),
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
      // width: 180,
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
          search
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

const PDITermOfService = ({ data = [] }) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [modalTosDetail, setModalTosDetail] = useState(false);
  const [search, setSearch] = useState({});

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
  const handleCloseModalTosDetail = () => {
    setModalTosDetail(false);
  };
  const handleSelectedDetail = (r) => {
    setSelectedData(r);
    setModalTosDetail(true);
  };
  return (
    <>
      <NxTable
        idTable={"product-information-term-of-service"}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 1200 }}
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
      <ModalCustom
        isOpen={modalTosDetail}
        handleCancel={handleCloseModalTosDetail}
        header={"TERM OF SERVICE DETAIL"}
        width={1000}
        type={"detail"}
        footer={
          <div className="w-full flex justify-end p-4">
            <ButtonComponent onClick={handleCloseModalTosDetail} type="default">
              Back
            </ButtonComponent>
          </div>
        }
      >
        <ContentModalTosPDI
          data={selectedData?.productTosDetailDtos || []}
          dataObj={selectedData}
        />
      </ModalCustom>
    </>
  );
};

export default PDITermOfService;
