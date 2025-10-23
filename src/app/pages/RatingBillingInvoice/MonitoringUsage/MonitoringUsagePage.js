import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useMonitoringList } from "./useMonirotingList";
import { useDispatch, useSelector } from "react-redux";
import { getApprovalHistory, getListUsagePaginate } from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { usePrevLocContext } from "../../../../utils/usePrevLoc";
import BaseContainer from "../../../../components/BaseContainer";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import RadioTabs from "../../../../components/RadioTabs";
import TablePagination from "../../../../components/TablePagination";
import ModalApprovalUsage from "./ModalApprovalUsage";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const dataTabs = [
  {
    key: "usageList",
    value: "Usage List",
  },
  {
    key: "batchList",
    value: "Batch List",
  },
];

const MonitoringUsagePage = () => {
  // Selector
  const { data_approval_history } = useSelector(
    (state) => state.monitoring_usage
  );

  // Declaration
  const dispatch = useDispatch();
  const { path } = usePrevLocContext();
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


  // const [dataTabs] = useState([
  //   {
  //     key: "usageList",
  //     value: "Usage List",
  //   },
  //   {
  //     key: "batchList",
  //     value: "Batch List",
  //   },
  // ]);

  useEffect(() => {
    if (
      path &&
      path?.pathname?.includes("/rating-billing/monitoring-usage/view")
    ) {
      setTabHeader(dataTabs[1].value);
    } else {
      setTabHeader(dataTabs[0].value);
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

  // onChangeColumns
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

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
    setPage(page);
    setPageSize(sizeChange);
  };
  // onchang tabs
  const changeTabHeader = useCallback((e) => {
    setTabHeader(e.target.value);
    setPage(1);
    setPageSize(10);
    setSearch({})
    setSort('')
    setSearchText("")
    setSearchedColumn('')
    setSearch({});
    onSort("", "", "")
  }, [onSort, setPage, setPageSize, setSearch, setSearchText, setSearchedColumn, setSort]);



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
      return { x: 10000, y: 500 };
    } else {
      return { x: 1300, y: 500 };
    }
  };

  const grantAccessButton = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={
            <SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={24} />
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
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
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
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  const columnActionUsage = useColumnActionPermission(
    ["history"],
    grantAccessUsage
  );

  const columnActionBatch = useColumnActionPermission(
    ["view"],
    grantAccessBatch
  );


  const columns = useMemo(() => {
    if (tabHeader === "Usage List") {
      return [
        ...columnUsage,
        ...columnActionUsage,
      ]
    } else {
      return [...batchColumns, ...columnActionBatch];
    }
  }, [batchColumns, columnActionBatch, columnActionUsage, columnUsage, tabHeader])
  
  const handleList = (tabHeader) => {
    if (tabHeader === "Usage List") {
      return dataUsage;
    } else {
      return dataBatch;
    }
  }
  
  const handleListRefresh = () =>{
    dispatch(getListUsagePaginate({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }))
  }

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex justify-end gap-2"}>
          <Toolbar items={grantAccessButton} />
        </div>

        <BaseContainer header={"MONITORING USAGE"}>
          <RadioTabs
            data={dataTabs}
            onChange={changeTabHeader}
            currentPosition={tabHeader}
          />
          <div className="my-5">
            <TablePagination
              totalData={handleList(tabHeader)?.page?.totalElements}
              dataSource={handleList(tabHeader)?.result}
              columns={columns}
              current={page}
              pageSize={pageSize}
              tableScrolled={tableScroll(tabHeader)}
              onChange={onChangePage}
              onSizeChanger={onChangePage}
              onSort={onSort}
            />
          </div>
        </BaseContainer>
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
