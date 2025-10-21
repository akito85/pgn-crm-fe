import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Spin,
  Input,
  Form,
  Alert,
  Popover,
  Checkbox,
  Tooltip,
  Space,
  DatePicker,
} from "antd";
import Highlighter from "react-highlight-words";

import SVGIcon from "../../../../../../../assets/Icon/index";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import StatusComponent from "../../../../../../../components/StatusComponent";
import {
  FilterOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getListChooseContact } from "../../../../../../../redux/slices/account_management/detailAccount/accountContactSlice";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";

const expandedRowRender = (record) => {
  const contactDetail = record?.contactDetails;
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "typeName",
    },
    {
      title: "VALUE",
      dataIndex: "fullValue",
    },
  ];

  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">CONTACT DETAIL</p>
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

const ModalChooseContactComp = ({
  isOpen,
  dataChooseContact,
  getDetailContactById = () => {},
  setModalChooseContact = () => {},
  setModalCreateNewContact,
  type,
  setIsIdChoose,
  isIdChoose,
  id,
}) => {
  const dispatch = useDispatch();
  const { data_detail, loading } = useSelector(
    (state) => state.accountManagement,
  );

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

  const [typeModal, setTypeModal] = useState("");
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    dispatch(getListChooseContact({ id: id, page, pageSize, sort, search }));
  }, [dispatch, id, page, pageSize, sort, search]);

  // mapping for push key data
  useEffect(() => {
    if (
      dataChooseContact?.data &&
      dataChooseContact?.data?.result?.length > 0
    ) {
      setTotalElement(dataChooseContact?.data?.page?.totalElements);
      const data = dataChooseContact?.data?.result?.map((a, index) => ({
        ...a,
        key: index + 1,
        contactDetail: a.contactDetail?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [dataChooseContact]);

  const handleCloseModal = () => {
    setModalChooseContact((prevState) => (prevState = false));
  };

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
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

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("contactName"),
    },
    {
      title: "JOB TITLE",
      dataIndex: "jobTitle",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("jobTitle"),
    },
    // {
    //   title: "CONTACT ADDRESS",
    //   dataIndex: "contactAddress",
    //   width: 350,
    //   sorter: true,
    //   ...getColumnSearchProps("contactAddress"),
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (text) =>
    //     searchedColumn === "contactAddress" ? (
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
    //     ) : text ? (
    //       <Tooltip placement="topLeft" title={text}>
    //         {text}
    //       </Tooltip>
    //     ) : (
    //       "-"
    //     ),
    // },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 350,
      sorter: true,
      ...getColumnSearchProps("description"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
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
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "SOURCE",
      dataIndex: "source",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("source"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("status"),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{index}</StatusComponent>
        </div>
      ),
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
                  isIdChoose != r?.contactId
                    ? () => {
                        setIsIdChoose(r?.contactId);
                        getDetailContactById(r?.contactId);
                      }
                    : undefined
                }
                style={{
                  color: "#0075BF",
                  cursor:
                    isIdChoose == r?.contactId ? "not-allowed" : "pointer",
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <ModalCustom
        header={"CHOOSE CONTACT"}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={() => handleCloseModal()}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCloseModal} type="default">
              Back
            </ButtonComponent>
          </div>
        }
      >
        <div className="flex w-full justify-end gap-x-2 pb-6">
          <ButtonComponent
            type="submit"
            onClick={() => {
              setModalCreateNewContact(true);
            }}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create
          </ButtonComponent>
        </div>
        <div className={"w-full"}>
          <TablePagination
            dataSource={dataTable}
            columns={columns}
            pageSize={pageSize}
            current={page}
            expandable={{ expandedRowRender }}
            totalData={totalElements}
            onChange={handleChange}
            onSizeChanger={handleChangeSize}
            tableScrolled={{ x: 2000, y: 300 }}
            onSort={onSort}
          />
        </div>
      </ModalCustom>
    </div>
  );
};

export default ModalChooseContactComp;
