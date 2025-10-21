import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Input, Form, Alert, Popover, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import StatusComponent from "../../../../../../components/StatusComponent";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import moment from "moment";

const data = [
  {
    invoiceId: "Jan 2023",
    bilCycle: "Daily",
    bilPeriod: "Sewa GOR",
    dueDate: "Pcs",
    price: "15000",
    priceUsd: "1.00",
    status: "Active",
    createdBy: "Annisa",
    createdDate: "21 Agustus 2023 11:03:55",
    updatedBy: "Annisa",
    updatedDate: "22 Agustus 2023 11:03:55",
  },
  {
    invoiceId: "Jan 2023",
    bilCycle: "Monthly",
    bilPeriod: "Sewa Tanah",
    dueDate: "M2",
    price: "15000",
    priceUsd: "1.00",
    status: "Active",
    createdBy: "Annisa",
    createdDate: "21 Agustus 2023 11:03:55",
    updatedBy: "Annisa",
    updatedDate: "22 Agustus 2023 11:03:55",
  },
  {
    invoiceId: "Jan 2023",
    bilCycle: "Monthly",
    bilPeriod: "Sewa Tanah",
    dueDate: "M2",
    price: "15000",
    priceUsd: "1.00",
    status: "Inactive",
    createdBy: "Annisa",
    createdDate: "21 Agustus 2023 11:03:55",
    updatedBy: "Annisa",
    updatedDate: "22 Agustus 2023 11:03:55",
  },
];

const AccountBillingTable = ({ handleChangeInteraction = () => {} }) => {
  // const dispatch = useDispatch();
  // const { data_detail, loading } = useSelector(
  //   (state) => state.accountManagement
  // );
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [id, setId] = useState("");
  const [status, setStatus] = useState();
  const [modalDetail, setModalDetail] = useState();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [dataDetail, setDataDetail] = useState("");

  //   useEffect(() => {
  //     dispatch(getAllTosPaginate({ page, pageSize }));
  //   }, [dispatch, page, pageSize]);

  //   //handle on-changes listener
  const handleChange = (page) => {
    setPage(page);
    // dispatch(getAllTosPaginate({ page, pageSize, sort }));
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
    // dispatch(
    //   getAllTosPaginate({ page: tempPage, pageSize: pageSizeChange, sort })
    // );
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDetail = (record) => {
    setDataDetail(record);
  };
  //   const handleDetail = (id) => {
  //     dispatch(getTosDetail(id));
  //   };

  //   const handleOpenModalActivation = () => {
  //     setModalActivionChanges(true);
  //   };
  //   const handleCancelModalActivation = () => {
  //     setModalActivionChanges(false);
  //   };
  //   const handleSubmitModalInactivate = (res, handleClear) => {};

  // Search Column Table
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            display: "block",
          }}
        />
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "INVOICE ID",
      dataIndex: "invoiceId",
      width: 150,
      render: (startDate) => moment(startDate).format("MMM YYYY"),
      sorter: true,
      ...getColumnSearchProps("invoiceId"),
    },
    {
      title: "BILLIG CYCLE",
      dataIndex: "bilCycle",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("bilCycle"),
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "bilPeriod",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("bilPeriod"),
    },
    {
      title: "DUE DATE",
      dataIndex: "dueDate",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("dueDate"),
    },
    {
      title: "PRICE",
      dataIndex: "price",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("price"),
    },
    {
      title: "PRICE USD",
      dataIndex: "priceUsd",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("priceUsd"),
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
      title: "ACTIONS",
      align: "center",
      width: 50,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip>
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  handleDetail(r);
                  setModalDetail(true);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  //   const onSort = (_, __, sort) => {
  //     const dataSort = sort.order
  //       ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
  //       : "";
  //     let obj = { page: 1, pageSize };
  //     if (dataSort) {
  //       obj.sort = dataSort;
  //       setSort(dataSort);
  //     }
  //     dispatch(getAllTosPaginate(obj));
  //   };

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 1300 }}
        // onSort={onSort}
        columns={columns}
      />

      {/* modal detail */}
      {/* <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Customer Management"
        width={700}
        handleCancel={() => {
          setModalDetail(false);
        }}
      >
        <ServiceRequestDetail data_detail={dataDetail} />
      </ModalCustom> */}
    </Fragment>
  );
};

export default AccountBillingTable;
