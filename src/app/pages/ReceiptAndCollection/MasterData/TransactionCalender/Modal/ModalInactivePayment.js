import React, { useEffect, useRef, useState } from "react";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../../components/Modal/ModalPopUp";
import { useSelector, useDispatch } from "react-redux";
import SVGIcon from "../../../../../../assets/Icon/index";

import { Alert, Input } from "antd";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import TablePagination from "../../../../../../components/TablePagination";
import InputComponent from "../../../../../../components/InputComponent";
import { columnsApproval } from "../TableApproval";
import { getAllApprovalList } from "../../../../../../redux/slices/receipt_collection/transactionCalender";

const ModalInactivePayment = (props) => {
  const {
    isOpen,
    handleCancel,
    handleOk,
    children,
    message,
    value,
    header,
    onChange = () => {},
  } = props;

  // Selector
  const { data_approval_list } = useSelector((state) => state.cycle);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use Effect
  useEffect(() => {
    dispatch(getAllApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (data_approval_list && data_approval_list.length > 0) {
      const data = data_approval_list?.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [data_approval_list]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

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
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
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

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "NO",
        align: "center",
        width: 20,

        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "EMPLOYEE",
        dataIndex: "employeeName",
        ...getColumnSearchProps("employeeName"),
      },
    ];
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase">
          EMPLOYEE INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          className="table-expand-custom"
          dataSource={record?.employeeDetail}
          columns={columns}
        />
      </div>
    );
  };

  return (
    <ModalConfirm
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      width={1000}
      children
    >
      {/* header section */}
      <div
        style={{ background: "#E6F1F9" }}
        className={"rounded-tl-[5px] rounded-tr-[5px] p-4"}
      >
        <div className={"flex gap-x-1.5 items-center"}>
          <span
            style={{
              color: "#4B465C",
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            {header}
          </span>
        </div>
      </div>

      {/* content section */}
      <div className="mx-10 my-4">
        <div className="flex flex-col justify-center gap-[20px] mt-6">
          <Alert
            message={message}
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0"
          />
        </div>
      </div>
      <div className="mx-10 my-4">{children}</div>

      <div className="w-full">
        <TablePagination
          dataSource={
            data_approval_list && data_approval_list.length === 0
              ? null
              : dataTable
          }
          columns={columnsApproval(
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          )}
          expandable={{
            expandedRowRender,
          }}
          useSelect={false}
          usePagination={false}
          className="table-expand-custom"
        />
      </div>

      <div className="pt-[30px]">
        <InputComponent type="textarea" value={value} onChange={onChange} />
      </div>
    </ModalConfirm>
  );
};

const ModalInactiveSuccessPayment = (props) => {
  const { isOpen, handleCancel = () => {}, handleOk = () => {} } = props;
  return (
    <ModalSuccess
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
    >
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <CloseCircleOutlined style={{ fontSize: "24px", color: "#ACC424" }} />
          <p className="text-[18px] font-bold">Success</p>
        </div>
        <p className="pl-11">`Your data has been inactivate`</p>
      </div>
    </ModalSuccess>
  );
};

const ModalInactiveErrorPayment = (props) => {
  const { isOpen, handleCancel = () => {}, handleOk = () => {} } = props;
  const { message } = useSelector((state) => state.cycle);

  return (
    <ModalError isOpen={isOpen} handleCancel={handleCancel} handleOk={handleOk}>
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <SVGIcon name="IconInactive" width={48} />
          <p className="text-[18px] font-bold">Failed</p>
        </div>
        <p className="pl-[70px]">
          {`Your data was not inactivate, ${message?.data?.message}. Please try again.`}
        </p>
      </div>
    </ModalError>
  );
};

export {
  ModalInactivePayment,
  ModalInactiveErrorPayment,
  ModalInactiveSuccessPayment,
};
