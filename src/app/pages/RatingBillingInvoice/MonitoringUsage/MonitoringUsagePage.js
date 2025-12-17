import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Spin, Tooltip, Tabs } from "antd";
import { Link, NavLink } from "react-router-dom";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useMonitoringList } from "./useMonirotingList";
import { useDispatch, useSelector } from "react-redux";
import { getApprovalHistory, getListUsagePaginate } from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { usePrevLocContext } from "../../../../utils/usePrevLoc";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import TableRBI from "../../../../components/TableRBI";
import ModalApprovalUsage from "./ModalApprovalUsage";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import CardContainer from "../../../../components/CardContainer";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const MonitoringUsagePage = () => {
  // Selector
  const { data_approval_history } = useSelector(
    (state) => state.monitoring_usage
  );

  // Declaration
  const dispatch = useDispatch();
  const { path } = usePrevLocContext();
  const searchInput = useRef(null);
  const [tabHeader, setTabHeader] = useState("Usage List");
  const {
    dataBatch,
    dataUsage,
    columns: columnUsage,
    batchColumns,
    data_usage,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    onSort,
    onClickApproval,
    data_approval,
    handleDownload,
    search,
    setSearch,
    setSearchText,
    setSearchedColumn,
    setSort,
    sort
  } = useMonitoringList(tabHeader);

  // Use State
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalApproval, setModalApproval] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action", "status"],
  }));

  useEffect(() => {
    if (
      path &&
      path?.pathname?.includes("/rating-billing/monitoring-usage/view")
    ) {
      setTabHeader("Batch List");
    } else {
      setTabHeader("Usage List");
    }
  }, [path]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.CREATE_USAGE || [],
        dataHistory: data_approval_history?.dataHistory?.CREATE_USAGE || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  const handleApprovalHistory = async (record) => {
    try {
      setModalApprovalHistory(true);
      await dispatch(getApprovalHistory(record?.recordId))?.unwrap();
    } catch (error) {
      console.error("Error fetching approval history:", error);
    }
  };

  // onChange page
  const onChangePage = (page, sizeChange) => {
    const tempPage = pageSize !== sizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(sizeChange);
  };

  // onchange tabs
  const changeTab = (key) => {
    setTabHeader((prevState) => {
      if (prevState !== key) {
        setPage(1);
        setPageSize(10);
        setSearch({});
        setSort('');
        setSearchText("");
        setSearchedColumn('');
      }
      return key;
    });
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: "",
      breadcrumbName: "Monitoring Usage",
    },
  ];

  const tableScroll = (tabHeader) => {
    if (tabHeader === "Usage List") {
      return { x: 8000, y: 525 };
    } else {
      return { x: 800, y: 525 };
    }
  };

  const grantAccessButton = [
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={
            <SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={20} />
          }
          type={"submit"}
          border={false}
          onClick={() => {
            onClickApproval();
            setModalApproval(true);
            setDataTableSelect(data_approval);
          }}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={RBI_ROUTES.MONITORING_USAGE_UPLOAD}>
          <ButtonComponent
            icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={24} />}
            type={"submit"}
            border={false}
          >
            Upload Usage
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];

  const grantAccessUsage = [
    {
      action: "History",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval History">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={20}
                onClick={() => handleApprovalHistory(record)}
              />
          </Tooltip>
        );
      },
    },
  ];

  const grantAccessBatch = [
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.MONITORING_USAGE_DETAIL}
            state={{ id: record?.batchId }}
          >
            <Tooltip title="Detail">
                <SVGIcon name="IconDetail" width={20} />
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const columnActionUsage = useColumnActionPermission(
    ["history"],
    grantAccessUsage
  ).map((col) => ({
    ...col,
    width: 80,
    align: "center",
  }));

  const columnActionBatch = useColumnActionPermission(
    ["view"],
    grantAccessBatch
  ).map((col) => ({
    ...col,
    width: 80,
    align: "center",
  }));

  const allColumns = useMemo(() => {
    let baseColumns = tabHeader === "Usage List" ? columnUsage : batchColumns;
    let actionColumns = tabHeader === "Usage List" ? columnActionUsage : columnActionBatch;
    
    const columnsWithKeys = [...baseColumns, ...actionColumns].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
      width: col.width || 150,
    }));
    
    return columnsWithKeys;
  }, [batchColumns, columnActionBatch, columnActionUsage, columnUsage, tabHeader]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const handleList = (tabHeader) => {
    if (tabHeader === "Usage List") {
      return dataUsage;
    } else {
      return dataBatch;
    }
  }
  
  const handleListRefresh = () => {
    dispatch(getListUsagePaginate({ 
      search: encodeURIComponent(JSON.stringify(search)), 
      page, 
      pageSize, 
      sort 
    }))
  }

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] font-bold text-primary">
                MONITORING USAGE
              </p>
              <Toolbar items={grantAccessButton} />
            </div>
          }
        >
          <Tabs
            activeKey={tabHeader}
            onChange={changeTab}
            type="line"
            size="small"
          >
            <Tabs.TabPane tab="Usage List" key="Usage List">
              <div className="my-5">
                <TableRBI
                  totalData={handleList(tabHeader)?.page?.totalElements}
                  dataSource={handleList(tabHeader)?.result}
                  columns={processedColumns}
                  current={page}
                  pageSize={pageSize}
                  tableScrolled={tableScroll(tabHeader)}
                  onChange={onChangePage}
                  onSizeChanger={onChangePage}
                  onSort={onSort}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  loading={loading}
                  handleDownload={handleDownload}
                />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Batch List" key="Batch List">
              <div className="my-5">
                <TableRBI
                  totalData={handleList(tabHeader)?.page?.totalElements}
                  dataSource={handleList(tabHeader)?.result}
                  columns={processedColumns}
                  current={page}
                  pageSize={pageSize}
                  tableScrolled={tableScroll(tabHeader)}
                  onChange={onChangePage}
                  onSizeChanger={onChangePage}
                  onSort={onSort}
                  columnDefinitions={columnDefinitions}
                  fixedColumns={fixedColumns}
                  setFixedColumns={setFixedColumns}
                  loading={loading}
                  handleDownload={handleDownload}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </CardContainer>
      </LayoutMenu>

      {modalApproval ? (
        <ModalApprovalUsage
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          dataUsage={dataTableSelect}
          handleListRefresh={handleListRefresh}
        />
      ) : null}

      <ModalHistory
        isOpen={modalApprovalHistory && dataApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        width={850}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />
    </Spin>
  );
};

export default MonitoringUsagePage;