import React, { useEffect, useRef, useState } from "react";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import { useSelector, useDispatch } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  CloseCircleOutlined,
  WarningOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Alert, Input } from "antd";
import TablePagination from "../../../../../components/TablePagination";
import { columnsApproval } from "../Table/TableApproval";
import Highlighter from "react-highlight-words";
import { getAllApprovalList } from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import InputComponent from "../../../../../components/InputComponent";

const ModalInactivePricingRule = (props) => {
  const {
    isOpen,
    handleCancel,
    handleOk,
    children,
    value,
    onChange = () => {},
  } = props;

  // Selector
  const { data_approval_list } = useSelector((state) => state.pricingRule);

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
      <div className="flex justify-center gap-[20px] mt-[30px]">
        <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
        <p className={"text-[18px] font-bold"}>
          {`Are you sure want to inactivate ?`}
        </p>
      </div>

      <div className="mt-[30px]">
        <Alert
          message="Warning! if you inactivate this data, it can’t be use."
          type={"error"}
        />
      </div>

      <div className="justify-center flex flex-col gap-[30px] mt-[30px]">
        {children}
      </div>

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
            handleSearch
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

const ModalInactiveSuccessPricingRule = (props) => {
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
          <p className="text-[18px] font-bold">Successfull</p>
        </div>
        <p className="pl-11">Your data has been submitted</p>
      </div>
    </ModalSuccess>
  );
};

const ModalInactiveErrorPricingRule = (props) => {
  const { isOpen, handleCancel = () => {}, handleOk = () => {} } = props;
  const { message } = useSelector((state) => state.pricingRule);

  return (
    <ModalError isOpen={isOpen} handleCancel={handleCancel} handleOk={handleOk}>
      <div className="px-8 py-8 justify-center">
        <div className="w-full flex gap-[20px]">
          <SVGIcon name="IconInactive" width={48} />
          <p className="text-[18px] font-bold">Failed</p>
        </div>
        <p className="pl-[70px]">
          {`Your data was not submitted, ${message?.data?.message}.`}
        </p>
        <p className="pl-[70px]">Please try again.</p>
      </div>
    </ModalError>
  );
};

export {
  ModalInactivePricingRule,
  ModalInactiveErrorPricingRule,
  ModalInactiveSuccessPricingRule,
};
