import React, { useState, useRef, useEffect } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { Form, Input, Select, Spin } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";

const expandedRowRender = (record) => {
  const dataExpand = record?.employeeDetail;
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "EMPLOYEE",
      dataIndex: "employeeName",
    },
  ];
  return (
    <div className="flex flex-col py-4 pr-4 pl-[48px]">
      <p className="text-primary text-xs font-bold uppercase">
        {"EMPLOYEE INFORMATION"}
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
      />
    </div>
  );
};

const ModalActivate = ({
  modalActivate,
  setModalActivate,
  handleSaveActivate = () => {},
  formInactivate,
  dataApprovalList = [],
  dataDetailApproval = [],
  handleDetailApproval = () => {},
  handleClearInactive = () => {},
  appHierDataDetail = [],
  setAppHierDataDetail,
  activeOrInactive,
  loading,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (dataDetailApproval || dataDetailApproval.length > 0) {
      const data = (dataDetailApproval || []).map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    }
  }, [dataDetailApproval]);

  const getColumnSearchProps = (
    dataIndex,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
  ) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search`}
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
  const columnInactivateData = (
    searchInput,
    searchedColumn,
    searchText,
    handleSearch,
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        title: "HIERARCHY",
        dataIndex: "approvalLevel",
        ...getColumnSearchProps(
          "approvalLevel",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "POSITION",
        dataIndex: "position",
        ...getColumnSearchProps(
          "position",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
    ];
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return (
    <div>
      {/* Modal Delete Draft */}
      <ModalApproveOrReject
        isOpen={modalActivate}
        header={`${activeOrInactive} INFORMATION`}
        message={`Are you sure want to ${activeOrInactive} Service Agreement`}
        width={1000}
        handleCancel={handleClearInactive}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleClearInactive} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="inactivateForm"
              type="submit"
              htmlType="submit"
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            id="inactivateForm"
            form={formInactivate}
            onFinish={handleSaveActivate}
            layout="vertical"
          >
            <Form.Item
              label={"Approval Hierarchy"}
              name={"appHierId"}
              rules={[
                {
                  message: "This field is required",
                  required: true,
                },
              ]}
              className="pb-6"
            >
              <SelectComponent onChange={(e) => handleDetailApproval(e)}>
                {dataApprovalList?.map((data, index) => (
                  <Select.Option key={index} value={data.appHierId}>
                    {data.approvalName}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>

            {/* Table */}
            {appHierDataDetail.length > 0 && (
              <div className="py-3 mb-6">
                <TablePagination
                  useSelect={false}
                  usePagination={false}
                  dataSource={appHierDataDetail}
                  columns={columnInactivateData(
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                  )}
                  expandable={{
                    expandedRowRender,
                  }}
                />
              </div>
            )}

            <Form.Item
              name={"remark"}
              label={"Remark"}
              rules={[{ message: "This field is required", required: true }]}
            >
              <InputComponent
                group
                rows={1}
                type="textarea"
                placeholder={"Type your remark"}
              />
            </Form.Item>
          </Form>
        </Spin>
      </ModalApproveOrReject>
    </div>
  );
};

export default ModalActivate;
