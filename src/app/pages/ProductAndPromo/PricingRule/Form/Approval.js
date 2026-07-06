import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import SelectComponent from "../../../../../components/SelectComponent";
import { Form, Select } from "antd";
import { getListApprovalById } from "../../../../../redux/slices/product_promo/PricingRule/PricingRuleSlice";
import TablePagination from "../../../../../components/TablePagination";
import { columnsApproval, columnsExpandApproval } from "../Table/TableApproval";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";

// Column Approval Expand
const expandedRowRender = (record) => {
  const columns = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => {
    return [
      ...columnsExpandApproval(
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    ];
  };
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
        columns={columns()}
      />
    </div>
  );
};

const Approval = ({
  dataTable,
  setDataTable,
  idUpdate,
  type,
  apiApproval,
  apiApprovalList,
  boolean,
  setBoolean
}) => {
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    if (type === "update" && idUpdate) {
      dispatch(getListApprovalById(idUpdate));
    }
  }, [idUpdate, type]);

  useEffect(() => {
    if (boolean === true || type === "update") {
      if (apiApprovalList && apiApprovalList.length > 0) {
        const data = apiApprovalList?.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: a.employeeDetail.map((b, index) => ({
            ...b,
            key: index + 1,
          })),
        }));
        setDataTable(data);
      }
    }
  }, [apiApprovalList]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    dispatch(getListApprovalById(e));
    setBoolean(true);
  };

  return (
    <div>
      <NxCardContainer header={"Approval Information"}>
        <div className="w-full grid grid-cols-1 gap-2">
          <div className="w-1/3">
            <Form.Item
              label="Approval Hierarchy"
              name="apphierId"
              rules={[
                {
                  required: true,
                  message: "Please input your Approval Hierarchy!",
                },
              ]}
            >
              <SelectComponent onChange={(e) => handleSelect(e)}>
                {apiApproval &&
                  apiApproval?.map((data, index) => (
                    <Select.Option value={data.appHierId} key={index}>
                      {data.approvalName}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>
        </div>
        <div className="w-full">
          {boolean === true || type === "update" ? (
            <TablePagination
              dataSource={
                apiApprovalList && apiApprovalList.length === 0
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
          ) : null}
        </div>
      </NxCardContainer>
    </div>
  );
};

export default Approval;
