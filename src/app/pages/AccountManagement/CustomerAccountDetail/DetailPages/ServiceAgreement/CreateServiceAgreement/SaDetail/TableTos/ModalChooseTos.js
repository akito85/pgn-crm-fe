import React, { useState, useEffect, useRef } from "react";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../../../../../components/TablePagination";
import { DatePicker, Input, Space, Tooltip } from "antd";
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { dateFormatting } from "../../../../../../../../../utils";

const expandedRowRender = (record) => {
  const contactDetail = record?.rtosAttributes;
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
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
      dataIndex: "unit",
    },
    {
      title: "FROM ITEM",
      dataIndex: "fromItem",
    },
  ];

  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">TOS DETAL</p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        className="table-expand-custom"
        dataSource={contactDetail}
        columns={columns}
        tableScrolled={{
          x: 1000,
          y: 300,
        }}
      />
    </div>
  );
};

const ModalChooseTos = ({
  isOpen,
  setModalChooseTos,
  getListChooseTos,
  dispatch,
  idAccount,
  dataListChooseTos,
  handleSelectTos = () => {},
  isIdChoose = [],
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getListChooseTos({ id: idAccount, page, pageSize, sort, search }));
  }, [dispatch, idAccount, page, pageSize, sort, search]);

  useEffect(() => {
    if (dataListChooseTos && dataListChooseTos?.result?.length > 0) {
      const data = dataListChooseTos?.result?.map((a, index) => ({
        ...a,
        key: index + 1,
        saTosDetail: a.saTosDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [isIdChoose, dispatch, dataListChooseTos]);

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TERM OF SERVICE",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <Space>
            <Tooltip title="Choose">
              <PlusCircleOutlined
                onClick={
                  !isIdChoose.includes(r.id) ? () => handleSelectTos(r) : ""
                }
                style={{
                  color: "#0075BF",
                  cursor: isIdChoose.includes(r.id) ? "not-allowed" : "pointer",
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
    dispatch(getListChooseTos({ id: idAccount, page, pageSize, sort, search }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        header={"CHOOSE TERM OF SERVICE"}
        type={"confirmation"}
        handleCancel={() => setModalChooseTos(false)}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={() => setModalChooseTos(false)}
              type="default"
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <div className={"w-full"}>
          <TablePagination
            dataSource={dataTable}
            columns={columns}
            pageSize={pageSize}
            current={page}
            expandable={{ expandedRowRender }}
            totalData={dataListChooseTos?.page?.totalElements}
            onChange={handleChange}
            onSizeChanger={handleChangeSize}
            onSort={onSort}
            tableScrolled={{ x: 1300, y: 300 }}
          />
        </div>
      </ModalCustom>
    </div>
  );
};

export default ModalChooseTos;
