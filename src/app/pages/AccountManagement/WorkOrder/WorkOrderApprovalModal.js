import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import InputComponent from "../../../../components/InputComponent";
import DetailText from "../../../../components/DetailText";
import NxTable from "../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../components/Nx/NxFormStepNavigation";
import SVGIcon from "../../../../assets/Icon/index";
import { showModalError } from "../../../../redux/slices/general_slice";
import {
  getWoApprovals,
  approveOrRejectWo,
} from "../../../../redux/slices/account_management/detailAccount/WorkOrderSlice";
import StatusComponent from "../../../../components/StatusComponent";

const WO_APPROVAL_COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  { title: "WO NUMBER",  dataIndex: "woNumber",       width: 180, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "TYPE",       dataIndex: "woTypeName",     width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "CATEGORY",   dataIndex: "woCategoryName", width: 140, sorter: true, filter: true, render: (v) => v || "-" },
  { title: "STATUS",     dataIndex: "status",  width: 120, render: (v) => v ? (
      <div className="flex justify-center">
        <StatusComponent colour={(v || "").toLowerCase()} margin={false} size="small">
          {(v || "").replace(/_/g, " ")}
        </StatusComponent>
      </div>
    ) : "-", },
];

const WorkOrderApprovalModal = ({
  isOpen,
  accountId,
  srId,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  const {
    list_woApprovals,
    pagination_listWoApprovals,
    loading_listWoApprovals,
    loading_approveWo,
    loading_rejectWo,
  } = useSelector((state) => state.workOrder);

  const loadingApproval = loading_approveWo || loading_rejectWo;

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (isOpen && accountId) {
      dispatch(getWoApprovals({ accountId, body: { page: 1, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [], srId: srId || null }, isLoadMore: false }));
      setPage(1);
    }
  }, [dispatch, isOpen, accountId, srId, search, sort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (nextPage <= (pagination_listWoApprovals.totalPage || 0)) {
      dispatch(getWoApprovals({ accountId, body: { page: nextPage, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [], srId: srId || null }, isLoadMore: true }));
      setPage(nextPage);
    }
  };

  const hasMore = list_woApprovals.length < (pagination_listWoApprovals.totalElement || 0);

  const onSort = (_, __, sorter) => {
    setSort(sorter.order ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}` : "");
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys([...keys]);
      setSelectedRows(rows.map((r) => ({ ...r })));
    },
    preserveSelectedRowKeys: true,
  };

  const steps = [
    { key: "wo",   title: "WORK ORDER" },
    { key: "conf", title: "CONFIRMATION" },
  ];

  const next = async () => {
    try {
      if (current === 0) {
        if (!selectedRowKeys.length) {
          dispatch(showModalError({ title: "Failed", description: "Please select at least one record." }));
          return;
        }
        await form.validateFields(["remark"]);
        setCurrent(1);
      }
    } catch (_) {}
  };

  const prev = () => setCurrent(0);

  const resetForm = () => {
    afterFinish();
    setCurrent(0);
    form.resetFields();
    handleCancel();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSearch({});
    setPage(1);
    setSort("");
  };

  const handleCancelForm = () => {
    handleCancel();
    setCurrent(0);
    form.resetFields();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSearch({});
    setPage(1);
    setSort("");
  };

  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();
      const body = selectedRows.map((row) => ({
        id: row.id,
        approvalId: row.tappId,
        action,
        description: values.remark,
      }));
      dispatch(approveOrRejectWo({ accountId, body, action }))
        .unwrap()
        .then(() => resetForm())
        .catch(() => {});
    } catch (_) {}
  };

  return (
    <NxModal
      isOpen={isOpen}
      type="confirmation"
      title="APPROVAL WORK ORDER"
      handleCancel={handleCancelForm}
      width={1000}
      hidePadding={true}
      loading={loadingApproval}
      footer={
        <div className="flex justify-between">
          <Button type="menu" onClick={handleCancelForm} disabled={loadingApproval}>
            Cancel
          </Button>
          <div className="flex">
            <Button onClick={prev} type="menu" disabled={current < 1 || loadingApproval}>
              Previous
            </Button>
            {current < steps.length - 1 && (
              <Button onClick={next} type="submit" disabled={loadingApproval}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <>
                <Button
                  type="reject"
                  onClick={() => handleSave("REJECT")}
                  icon={<SVGIcon width={14} height={14} name="IconSquareX" />}
                  className="flex-row-reverse"
                  disabled={!loading_rejectWo && loadingApproval}
                  loading={loading_rejectWo}
                >
                  Reject
                </Button>
                <Button
                  type="approve"
                  onClick={() => handleSave("APPROVE")}
                  icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                  className="flex-row-reverse"
                  disabled={!loading_approveWo && loadingApproval}
                  loading={loading_approveWo}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <NxFormStepper steps={steps} current={current} onPrev={prev} onNext={next} inModal />
      <div className="p-4">
        <div className={current !== 0 ? "hidden" : ""}>
          <Form layout="vertical" form={form}>
            <NxBaseContainer border header="Work Order List — Ready to Approve">
              <NxTable
                dataSource={list_woApprovals}
                columns={WO_APPROVAL_COLUMNS}
                totalData={pagination_listWoApprovals.totalElement}
                tableScrolled={{ x: "max-content" }}
                onSort={onSort}
                loading={loading_listWoApprovals}
                showExport={false}
                rowSelection={rowSelection}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
              <Form.Item
                name="remark"
                label="Remark"
                rules={[{ required: true, message: "Please input remark!" }]}
                className="no-margin-form"
              >
                <InputComponent rows={1} type="textarea" placeholder="Type remark for approval/rejection" />
              </Form.Item>
            </NxBaseContainer>
          </Form>
        </div>
        <div className={current !== 1 ? "hidden" : ""}>
          <NxBaseContainer border header="Confirmation">
            <div className="flex flex-col gap-y-4">
              <NxTable
                dataSource={selectedRows}
                columns={WO_APPROVAL_COLUMNS}
                tableScrolled={{ x: "max-content" }}
                usePagination={false}
                useInfiniteScroll={false}
              />
              <DetailText label="Remark" className="flex flex-col gap-y-2">
                {form.getFieldValue("remark")}
              </DetailText>
            </div>
          </NxBaseContainer>
        </div>
      </div>
    </NxModal>
  );
};

export default WorkOrderApprovalModal;
