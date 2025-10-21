import React, { useEffect, useState, useRef } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { getColumnSearchProps } from "../../../../../../../utils/getColumnSearchProps";
import TablePagination from "../../../../../../../components/TablePagination";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { getListSelectTosSubmissionPaging } from "../../../../../../../redux/slices/account_management/detailAccount/tosSubmissionSlice";

const expandedRowRender = (record) => {
  const dataExpand = record?.saTosDetail || [];
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ATTRIBUTE",
      dataIndex: "attributeName",
    },
    {
      title: "VALUE",
      dataIndex: "value",
    },
    {
      title: "UNIT",
      dataIndex: "unitName",
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItemName",
    },
  ];
  return (
    <div className="flex flex-col py-4 px-4 mx-[-16px]">
      <p className="text-primary text-xs font-bold uppercase">{"TOS DETAIL"}</p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  );
};

const ModalSelectTos = ({
  idSA,
  modalDetail = false,
  handleCancel = () => {},
  dataObj = {},
  updateObj = () => {},
  updateTable = () => {},
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { dataSelect } = useSelector((state) => state.tosSubmission);

  useEffect(() => {
    setDataTable(
      (dataSelect?.result || []).map((item) => {
        return {
          ...item,
          key: item?.saTosId,
          saTosDetail: (item?.saTosDetail || []).map((itemDetail, index) => {
            return {
              ...itemDetail,
              key: index + 1,
            };
          }),
        };
      }),
    );
    setTotalElement(dataSelect?.page?.totalElements || 0);
  }, [dataSelect]);

  useEffect(() => {
    dispatch(
      getListSelectTosSubmissionPaging({
        id: idSA,
        page,
        pageSize,
        search,
        sort,
      }),
    );
  }, [dispatch, idSA, page, pageSize, search, sort]);

  const handleSelectRow = (record) => {
    updateObj((prevState) => {
      return {
        ...prevState,
        tosId: record?.saTosId,
        tosName: record?.saTosName,
      };
    });
    updateTable(
      (record?.saTosDetail || []).map((item, index) => {
        return {
          key: index + 1,
          attribute:
            item?.attributeName && item?.attributeId
              ? {
                  label: item?.attributeName,
                  value: item?.attributeId,
                }
              : null,
          // value: parseInt(item?.value || ""),
          value:
            typeof item?.value === "string"
              ? parseInt(item?.value)
              : item?.value,
          unit:
            item?.unitName && item?.unitId
              ? {
                  label: item?.unitName,
                  value: item?.unitId,
                }
              : null,
          fromItem:
            item?.fromItemName && item?.fromItemId
              ? {
                  label: item?.fromItemName,
                  value: item?.fromItemId,
                }
              : null,
        };
      }),
    );
    handleCancel();
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch(selectedKeys[0] ? `${dataIndex}~${selectedKeys[0]}` : "");
  };

  const onSort = (_, __, sort) => {
    const dataOrder = sort.order === "ascend" ? "asc" : "desc";
    const dataSort = sort.order ? `${sort.field}~${dataOrder}` : "";
    setSort(dataSort);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TERM OF SERVICE",
      dataIndex: "saTosName",
      width: 240,
      sorter: true,
      ...getColumnSearchProps(
        "saTosName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "REMARK",
      dataIndex: "saTosDescription",
      width: 240,
      sorter: true,
      ...getColumnSearchProps(
        "saTosDescription",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "saTosDescription") {
          return (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
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
      width: 240,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Add">
              <span
                className={`flex justify-center${
                  dataObj?.tosId !== r?.saTosId ? "" : ` cursor-not-allowed`
                }`}
                onClick={
                  dataObj?.tosId !== r?.saTosId
                    ? () => handleSelectRow(r)
                    : undefined
                }
              >
                <SVGIcon
                  name="IconActionCreate"
                  color={dataObj?.tosId !== r?.saTosId ? "#0075bf" : "#8D91A0"}
                  width={24}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  return (
    <ModalCustom
      isOpen={modalDetail}
      handleCancel={handleCancel}
      type="detail"
      header="CHOOSE TERM OF SERVICE"
      width={1000}
      footer={
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Back
        </ButtonComponent>
      }
    >
      <TablePagination
        dataSource={dataTable}
        totalData={totalElements}
        current={page}
        pageSize={pageSize}
        onChange={handleChangeSize}
        tableScrolled={{ y: 300, x: 1200 }}
        columns={columns}
        onSort={onSort}
        expandable={{
          expandedRowRender,
        }}
      />
    </ModalCustom>
  );
};

export default ModalSelectTos;
