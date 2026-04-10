import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { columnVATransaction } from "./TableVATransaction";
import { getOPTransactionList } from "../../../../../../redux/slices/receipt_collection/bankSlice";

const FunctionalTableOPTransaction = ({ id }) => {
  const dispatch = useDispatch();
  const { dataOPTransaction } = useSelector((state) => state.bank);

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchContent, setSearchContent] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const columns = columnVATransaction(
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
    () => {},
    () => {},
    () => null
  );

  useEffect(() => {
    if (!id) return;
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    if (searchContent) {
      tempSearch += `searchContent~${searchContent},`;
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getOPTransactionList({
        id,
        page,
        pageSize,
        sort,
        search: tempSearch,
      })
    );
  }, [id, page, pageSize, sort, search, searchContent, dispatch]);

  const handleChange = (p, ps) => {
    setPage(p);
    setPageSize(ps);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div className="my-3">
      <div className="flex justify-end items-center mb-3 gap-2">
        <ButtonComponent
          type="default"
          onClick={() => {}}
          icon={<FilterOutlined style={{ fontSize: "14px" }} />}
        >
          Advanced Search
        </ButtonComponent>
        <Input
          placeholder="Search Content"
          style={{ width: 200, height: 32, fontSize: 12 }}
          value={searchContent}
          onChange={(e) => {
            setSearchContent(e.target.value);
            setPage(1);
          }}
          allowClear
        />
      </div>
      <TablePagination
        dataSource={dataOPTransaction?.result}
        pageSize={pageSize}
        columns={columns}
        current={page}
        onChange={handleChange}
        onSizeChanger={handleChange}
        totalData={dataOPTransaction?.page?.totalElements}
        onSort={onSort}
        tableScrolled={{ x: "max-content" }}
      />
    </div>
  );
};

export default FunctionalTableOPTransaction;
