import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Table, Tooltip, Space, Button } from "antd";
import { SearchOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { getAllContacts } from "../../../../../redux/slices/rating_billing_invoice/installment";

const ModalChooseContact = ({
  isOpen,
  setModalChooseContact,
  onChooseContact,
  onOpenCreateContact,
}) => {
  const dispatch = useDispatch();
  const { data_all_contacts, loading } = useSelector((state) => state.installment || {});

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdDate~desc");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const searchTextRef = useRef("");
  const searchedColumnRef = useRef("");

  useEffect(() => {
    if (isOpen) {
      setPage(0);
      setSearch("");
      setSort("createdDate~desc");
      setSelectedRowKeys([]);
      dispatch(getAllContacts({ search: "", page: 0, pageSize, sort: "createdDate~desc" }));
    }
  }, [isOpen, dispatch]);

  const handleTableChange = (pagination, filters, sorter) => {
    const newPage = pagination.current - 1;
    const newPageSize = pagination.pageSize;
    setPage(newPage);
    setPageSize(newPageSize);

    let sortStr = "createdDate~desc";
    if (sorter && sorter.order) {
      const field = sorter.field || sorter.columnKey;
      const order = sorter.order === "ascend" ? "asc" : "desc";
      sortStr = `${field}~${order}`;
    }
    setSort(sortStr);

    dispatch(getAllContacts({ search, page: newPage, pageSize: newPageSize, sort: sortStr }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    searchTextRef.current = selectedKeys[0];
    searchedColumnRef.current = dataIndex;
    const searchStr = selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`;
    setSearch(searchStr);
    setPage(0);
    dispatch(getAllContacts({ search: searchStr, page: 0, pageSize, sort }));
  };

  const handleResetSearch = (clearFilters, confirm) => {
    clearFilters();
    confirm();
    searchTextRef.current = "";
    searchedColumnRef.current = "";
    setSearch("");
    setPage(0);
    dispatch(getAllContacts({ search: "", page: 0, pageSize, sort }));
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleResetSearch(clearFilters, confirm)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {}, 100);
      }
    },
    render: (text) =>
      searchedColumnRef.current === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchTextRef.current]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Contact Name",
      dataIndex: "contactName",
      key: "contactName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("contactName"),
    },
    {
      title: "Job",
      dataIndex: "job",
      key: "job",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("job"),
      render: (text) => text || "-",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("position"),
      render: (text) => text || "-",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("address"),
      render: (text) => {
        if (!text) return "-";
        const maxLength = 30;
        const isLong = text.length > maxLength;
        const displayText = isLong ? `${text.substring(0, maxLength)}...` : text;
        return (
          <Tooltip title={isLong ? text : ""}>
            <span>{displayText}</span>
          </Tooltip>
        );
      },
    },
  ];

  const dataSource = (data_all_contacts?.result || []).map((item, idx) => ({
    ...item,
    key: item.contactId || idx,
  }));

  const totalElements = data_all_contacts?.page?.totalElements || 0;

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
    },
    type: "checkbox",
  };

  const handleChoose = () => {
    const selectedContacts = dataSource.filter((item) =>
      selectedRowKeys.includes(item.key)
    );
    if (onChooseContact) {
      onChooseContact(selectedContacts);
    }
    setModalChooseContact(false);
  };

  const handleClose = () => {
    setSelectedRowKeys([]);
    setModalChooseContact(false);
  };

  return (
    <ModalCustom
      header="CHOOSE CONTACT"
      isOpen={isOpen}
      type="confirmation"
      handleCancel={handleClose}
      width={1000}
      footer={
        <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
          <ButtonComponent onClick={handleClose} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            onClick={handleChoose}
            disabled={selectedRowKeys.length === 0}
          >
            Choose ({selectedRowKeys.length})
          </ButtonComponent>
        </div>
      }
    >
      <div className="flex w-full justify-end gap-x-2 pb-6">
        <ButtonComponent
          type="submit"
          onClick={() => {
            setModalChooseContact(false);
            if (onOpenCreateContact) {
              onOpenCreateContact();
            }
          }}
          icon={<PlusOutlined style={{ fontSize: "14px" }} />}
        >
          Create Contact
        </ButtonComponent>
      </div>
      <div className="flex flex-col gap-y-4">
        <Table
          className="custom-table-small"
          columns={columns}
          dataSource={dataSource}
          rowSelection={rowSelection}
          pagination={{
            current: page + 1,
            pageSize: pageSize,
            total: totalElements,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} contacts`,
          }}
          onChange={handleTableChange}
          size="small"
          bordered={true}
          scroll={{ y: 400 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "12px 24px", backgroundColor: "#f9f9f9" }}>
                <Table
                  className="custom-table-small"
                  columns={[
                    { title: "Type", dataIndex: "type", key: "type", width: 120 },
                    { title: "Value", dataIndex: "value", key: "value", width: 250 },
                  ]}
                  dataSource={(record.contactDetails || []).map((detail, dIdx) => ({
                    ...detail,
                    key: dIdx,
                  }))}
                  pagination={false}
                  size="small"
                  showHeader={true}
                  bordered={true}
                  style={{ backgroundColor: "#fff", borderRadius: 4 }}
                />
              </div>
            ),
            rowExpandable: (record) => (record.contactDetails || []).length > 0,
          }}
          loading={loading}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalChooseContact;