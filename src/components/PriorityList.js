import React, { useState, useMemo, useRef } from "react";
import { Tabs, Tag, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import TableRBI from "./TableRBI";
import SVGIcon from "../assets/Icon/index";
import { applyFixedColumns } from "../utils/applyFixedColumns";

const PriorityList = ({ data, onItemClick }) => {
  const searchInput = useRef(null);
  const [activeTab, setActiveTab] = useState("1");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const getBaseColumns = () => [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "rank",
      title: "RANK",
      dataIndex: "rank",
      width: 100,
      align: "center",
      sorter: true,
      render: (rank) => (
        <span style={{ fontWeight: 500 }}>
          #{rank}
        </span>
      ),
    },
    {
      key: "accountNum",
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNum",
      width: 250,
      align: "left",
      sorter: true,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      key: "count",
      title: "COUNT",
      dataIndex: "count",
      width: 150,
      align: "right",
      sorter: true,
      render: (count) => (
        <span style={{ fontWeight: 600 }}>
          {count ? count.toLocaleString("id-ID") : 0}
        </span>
      ),
    },
  ];

  const getActionColumn = (type) => ({
    key: "action",
    title: "ACTION",
    width: 100,
    align: "center",
    render: (record) => (
      <Tooltip title="View Details">
        <div 
          className="pt-1 cursor-pointer"
          onClick={() => onItemClick(type)}
        >
          <SVGIcon name="IconDetail" width={24} />
        </div>
      </Tooltip>
    ),
  });

  const getProcessedColumns = (type) => {
    const baseColumns = getBaseColumns();
    const actionColumn = getActionColumn(type);
    
    const allColumns = [...baseColumns, actionColumn].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return applyFixedColumns(allColumns, fixedColumns);
  };

  const getColumnDefinitions = (type) => {
    const baseColumns = getBaseColumns();
    const actionColumn = getActionColumn(type);
    
    return [...baseColumns, actionColumn].map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  };

  const onSort = (_, __, sorter) => {
    // Handle sorting if needed
    console.log('Sort:', sorter);
  };

  const tabItems = [
    {
      key: "1",
      label: "Pending Transactions",
      icon: <ClockCircleOutlined />,
      data: data?.priorPendingTransactions || [],
      type: "pendingTransactions",
    },
    {
      key: "2",
      label: "Pending Approvals",
      icon: <CheckCircleOutlined />,
      data: data?.priorApprovalBatches || [],
      type: "pendingApprovals",
    },
    {
      key: "3",
      label: "Gap Rating vs Billing",
      icon: <WarningOutlined />,
      data: data?.priorGapRatingBilling || [],
      type: "gapRatingBilling",
    },
    {
      key: "4",
      label: "Gap Pra-Billing vs Master",
      icon: <SyncOutlined />,
      data: data?.priorGapPrabillingMaster || [],
      type: "gapPraBillingMaster",
    },
  ];

  const items = tabItems.map((item) => ({
    key: item.key,
    label: item.label,
    children: (
      <TableRBI
        dataSource={item.data}
        columns={getProcessedColumns(item.type)}
        current={page}
        pageSize={pageSize}
        onChange={handleChangePage}
        onSizeChanger={handleChangePage}
        totalData={item.data.length}
        tableScrolled={{ x: 800, y: 300 }}
        onSort={onSort}
        columnDefinitions={getColumnDefinitions(item.type)}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        loading={false}
      />
    ),
  }));

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={items}
      />
    </div>
  );
};

export default PriorityList;