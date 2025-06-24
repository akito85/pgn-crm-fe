import React, { useState, useEffect, useRef } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import {
  columnsApprovalPromo,
  columnsExpandApprovalPromo,
} from "../Table/TableApprovalPromo";
import { useDispatch, useSelector } from "react-redux";
import TablePagination from "../../../../../components/TablePagination";
import SelectComponent from "../../../../../components/SelectComponent";
import { Form } from "antd";

// Column Approval Expand
const expandedRowRender = (record) => {
  const columns = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => {
    return [
      ...columnsExpandApprovalPromo(
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
        columns={columns}
      />
    </div>
  );
};

const Approval = (props) => {
  const { idUpdate } = props;

  // Selector

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [dataTable, setDataTable] = useState([]);

  // Use Effect
  // useEffect(() => {
  //   dispatch(getAllApprovalList());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (idUpdate !== null) {
  //     dispatch(getListApprovalById(idUpdate));
  //   }
  // }, [idUpdate]);

  // useEffect(() => {
  //   if (data_approval_list && data_approval_list.length > 0) {
  //     const data = data_approval_list?.map((a, index) => ({
  //       ...a,
  //       key: index + 1,
  //       employeeDetail: a.employeeDetail.map((b, index) => ({
  //         ...b,
  //         key: index + 1,
  //       })),
  //     }));
  //     setDataTable(data);
  //   }
  // }, [data_approval_list]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  //  Handle Select Approval Hierarchy
  const handleSelect = (e) => {
    // dispatch(getListApprovalById(e));
  };
  return (
    <BaseContainer header={"Approval Informartion"}>
      <div className="w-full grid grid-cols-1 gap-2">
        <div className="w-1/3">
          <Form.Item
            label="Approval Hierarchy"
            name="appHierId"
            rules={[
              {
                required: true,
                message: "Please input your Approval Hierarchy!",
              },
            ]}
          >
            <SelectComponent onChange={(e) => handleSelect(e)}>
              {/* {data_approval &&
                data_approval?.map((data, index) => (
                  <Select.Option value={data.appHierId} key={index}>
                    {data.approvalName}
                  </Select.Option>
                ))} */}
            </SelectComponent>
          </Form.Item>
        </div>
      </div>
      <div className="w-full">
        <TablePagination
          // dataSource={
          //   data_approval_list && data_approval_list.length === 0
          //     ? null
          //     : dataTable
          // }
          columns={columnsApprovalPromo(
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
    </BaseContainer>
  );
};

export default Approval;
