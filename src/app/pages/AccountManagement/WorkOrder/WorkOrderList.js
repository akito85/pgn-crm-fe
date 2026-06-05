import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Tooltip } from "antd";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxDate from "../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../components/StatusComponent";
import SVGIcon from "../../../../assets/Icon/index";
import WorkOrderApprovalModal from "./WorkOrderApprovalModal";
import { getWorkOrders } from "../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";

const COLUMNS = [
  { title: "NO",           width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "WO NUMBER",    dataIndex: "woNumber",       width: 180, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "TYPE",         dataIndex: "woTypeName",     width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "CATEGORY",     dataIndex: "woCategoryName", width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "SOURCE",       dataIndex: "source",         width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "PRIORITY",     dataIndex: "woPriorityName", width: 120, sorter: true, filter: true, render: (v) => v || "-" },
  {
    title: "STATUS", dataIndex: "status", width: 120, sorter: true, filter: true,
    render: (v) => v ? (
      <StatusComponent colour={(v || "").toLowerCase()} margin={false}>
        {(v || "").replace(/_/g, " ")}
      </StatusComponent>
    ) : "-",
  },
  { title: "REQUEST DATE", dataIndex: "requestDate", width: 140, sorter: true, filter: true, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
];

const WorkOrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { idAccount, idCustomer, accountType } = location.state || {};

  const { list_workOrders, pagination_listWo, loading_listWo } = useSelector(
    (state) => state.workOrder
  );

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const fetchList = (pg = 1, isLoadMore = false) => {
    if (!idAccount) return;
    dispatch(
      getWorkOrders({
        accountId: idAccount,
        body: { page: pg, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [] },
        isLoadMore,
      })
    );
  };

  useEffect(() => {
    fetchList(1, false);
    setPage(1);
  }, [dispatch, idAccount, sort, search]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination_listWo.totalPage || 0)) {
      fetchList(nextPage, true);
      setPage(nextPage);
    }
  };

  const hasMore = list_workOrders.length < (pagination_listWo.totalElement || 0);

  const onSort = (_, __, sorter) => {
    setSort(sorter.order ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}` : "");
  };

  const columnsWithAction = [
    ...COLUMNS,
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-1">
          <Tooltip title="View">
            <Button
              type="table-action"
              onClick={() =>
                navigate(ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SR_WORK_ORDER, {
                  state: { woId: record.id, idAccount: idAccount || record.accountId, idCustomer, accountType },
                })
              }
            >
              <SVGIcon name="IconDetail" width={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="table-action"
              onClick={() =>
                navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_WORK_ORDER, {
                  state: {
                    woContext: {
                      type: "standalone",
                      idAccount: idAccount || record.accountId,
                      idCustomer,
                      accountType,
                      isUpdate: true,
                      woId: record.id,
                    },
                  },
                })
              }
            >
              <SVGIcon name="IconEdit" width={20} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <NxCardContainer header="WORK ORDER">
        <NxBaseContainer border>
          {/* Toolbar */}
          <div className="flex justify-end gap-2 mb-3">
            <Button type="menu" icon={<SVGIcon name="IconButtonDownload" width={14} />}>
              Download List
            </Button>
            <Button
              type="secondary"
              onClick={() => setShowApprovalModal(true)}
              icon={<SVGIcon name="IconButtonApproval" width={14} />}
            >
              Approval
            </Button>
            <Button
              type="submit"
              onClick={() =>
                navigate(ACCOUNT_MANAGEMENT_ROUTES.CREATE_WORK_ORDER, {
                  state: {
                    woContext: {
                      type: "standalone",
                      idAccount,
                      idCustomer,
                      accountType,
                      isUpdate: false,
                      woId: null,
                    },
                  },
                })
              }
              icon={<SVGIcon name="IconButtonCreate" width={14} />}
            >
              Create
            </Button>
          </div>

          <NxTable
            idTable="wo-list-table"
            dataSource={list_workOrders.map((item, i) => ({ ...item, key: item.id ?? i }))}
            columns={columnsWithAction}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            totalData={pagination_listWo.totalElement}
            showAdvanceSearch={false}
            showSearchBar={true}
            fontSize="small"
            tablePadding="small"
            tableScrolled={{ x: "max-content" }}
            loading={loading_listWo}
            onSort={onSort}
          />
        </NxBaseContainer>
      </NxCardContainer>

      <WorkOrderApprovalModal
        isOpen={showApprovalModal}
        accountId={idAccount}
        handleCancel={() => setShowApprovalModal(false)}
        afterFinish={() => fetchList(1, false)}
      />
    </>
  );
};

export default WorkOrderList;
