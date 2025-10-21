import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../../utils";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Spin } from "antd";
import { useEffect } from "react";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { sorterFunction } from "../../../../../utils/sorterFunction";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";

const JobDetail = (props) => {
  const { data, openModal, closeModal = () => {} } = props;

  const { loading } = useSelector((state) => state.master_job);

  // Declaration
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [typeColumn, setTypeColumn] = useState("string");
  const [search, setSearch] = useState({});

  const handleResetState = useCallback(() => {
    setPage(1);
    setPageSize(10);
    setSearchText("");
    setSearchedColumn("");
    setSearch({});
  }, []);

  useEffect(() => {
    if (data !== null) {
      setDataTable(data?.logActiveInactive);
    }
  }, [data]);

  useEffect(() => {
    if (openModal === false) {
      handleResetState();
    }
  }, [openModal, handleResetState]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    switch (dataIndex) {
      case "operation":
        setTypeColumn("status");
        break;
      case "createdDate":
        setTypeColumn("datetime");
        break;

      default:
        setTypeColumn("string");
        break;
    }
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Function Change Pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTOR",
      dataIndex: "createdBy",
      width: 130,
      sorter: (a, b) => sorterFunction("createdBy", a, b),
      filteredValue: hasValue(search?.createdBy) ? [search?.createdBy] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        renderColumn(
          "createdBy",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      width: 150,
      align: "center",
      sorter: (a, b) => sorterFunction("operation", a, b),
      filteredValue: hasValue(search?.operation) ? [search?.operation] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "operation",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "status",
      ),
      render: (text) =>
        renderColumn(
          "operation",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ACTION DATE",
      dataIndex: "createdDate",
      width: 250,
      align: "center",
      sorter: (a, b) => sorterFunction("createdDate", a, b, "date"),
      filteredValue: hasValue(search?.createdDate)
        ? [search?.createdDate]
        : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datetime",
      ),
      render: (value) =>
        renderDateColumn(
          "createdDate",
          searchedColumn,
          searchText,
          value,
          "datetime",
          search,
        ),
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 350,
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      filteredValue: hasValue(search?.remark) ? [search?.remark] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        renderColumn(
          "remark",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
  ];

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Job"
      width={1000}
      footer={
        <ButtonComponent border={true} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <Spin spinning={loading}>
        <CardComponent header={"JOB INFORMATION"}>
          <div className="w-full grid grid-cols-2">
            <DetailText label="Job Name">{data?.jobName}</DetailText>
            <DetailText label="Status">{toTitleCase(data?.status)}</DetailText>
          </div>
          <div className="w-full">
            <DetailText label="Description">{data?.description}</DetailText>
          </div>
        </CardComponent>

        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record Id">{data?.jobId}</DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Created Date">
            {hasValue(data?.createdDate) &&
              moment(data?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
          <DetailText label="Updated Date">
            {hasValue(data?.updatedDate) &&
              moment(data?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
        </CardComponent>

        <div className="mb-[30px]">
          <div>
            <p className="text-primary text-xs font-semibold uppercase">
              ACTIVATE/INACTIVATE LOG INFORMATION
            </p>
          </div>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              dataSource={dataTable}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              // totalData={updatePagination(dataTable, 'length', searchedColumn, searchText, page, pageSize, typeColumn)}
              tableScrolled={{
                x: 1300,
                y: 300,
              }}
            />
          </div>
        </div>
      </Spin>
    </ModalCustom>
  );
};

export default JobDetail;
