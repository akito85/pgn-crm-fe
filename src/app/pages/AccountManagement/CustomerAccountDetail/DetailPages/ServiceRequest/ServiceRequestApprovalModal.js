import { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "antd";
import InputComponent from "../../../../../../components/InputComponent";
import DetailText from "../../../../../../components/DetailText";
import NxTable from "../../../../../../components/Nx/NxTable";
import {
  approveOrRejectAllServiceRequest,
  getServiceRequestApprovals,
} from "../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getServiceRequestColumns } from "./getServiceRequestColumns";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import NxModal from "../../../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../../../components/Nx/NxFormStepNavigation";
import SVGIcon from "../../../../../../assets/Icon/index";

const STATUS_KEYS = ["statusApproval", "statusPrerequisite", "status"];

/**
 * Modal for approving or rejecting pending service request records.
 * Displays a two-step wizard: select records + enter remark, then confirm.
 * @param {{ accountId: number; isOpen: boolean; handleCancel?: () => void; afterFinish?: () => void }} props
 */
const ServiceRequestApprovalModal = ({
  accountId,
  isOpen,
  handleCancel = () => {},
  afterFinish = () => {},
}) => {
  const {
    list_srApprovals: srApprovals,
    pagination_listSrApprovals: pagination,
    loading_listSrApprovals,
    loading_approveSr,
    loading_rejectSr,
  } = useSelector((state) => state.serviceRequest);

  const loadingApproval = loading_approveSr || loading_rejectSr;

  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Fetch page 1 whenever the modal opens or any filter/sort changes.
  useEffect(() => {
    if (isOpen) {
      const body = { page: 1, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [] };
      dispatch(getServiceRequestApprovals({ idAccount: accountId, body, isLoadMore: false }));
      setPage(1);
    }
  }, [dispatch, isOpen, search, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination.totalPage || 0;
    if (nextPage <= totalPage) {
      const body = { page: nextPage, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [] };
      dispatch(getServiceRequestApprovals({ idAccount: accountId, body, isLoadMore: true }));
      setPage(nextPage);
    }
  };

  const totalElement = pagination.totalElement;
  const hasMore = srApprovals.length < totalElement;

  const onSort = (_, __, sorter) => {
    const dataSort = sorter.order
      ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: (newSelectedRowKeys, newSelectedRows) => {
      setSelectedRowKeys([...newSelectedRowKeys]);
      setSelectedRows(newSelectedRows.map((row) => ({ ...row })));
    },
    preserveSelectedRowKeys: true,
  };

  const steps = [
    { key: "sr", title: "SERVICE REQUEST" },
    { key: "src", title: "CONFIRMATION" },
  ];

  const formFields = [["remark"]];

  const next = async () => {
    try {
      if (current === 0) {
        if (!selectedRowKeys.length) {
          dispatch(showModalError({ title: "Failed", description: "Please select at least one record" }));
          throw new Error("No record selected");
        } else {
          await form.validateFields([formFields[current]]);
          setCurrent((prev) => prev + 1);
        }
      } else {
        form.validateFields([formFields[current]]);
      }
    } catch {}
  };

  const prev = () => setCurrent((prev) => prev - 1);

  const handleButtonNext = () => next();

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
    setSearchText("");
    setSearchedColumn("");
  };

  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setCurrent(0);
    setSearch({});
    setPage(1);
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
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
      dispatch(approveOrRejectAllServiceRequest({ body, action }))
        .unwrap()
        .then(() => resetForm())
        .catch(() => {});
    } catch {}
  };

  const columns = useMemo(
    () =>
      getServiceRequestColumns({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        isApproval: true
      }).filter((col) => !STATUS_KEYS.includes(col.key)),
    [search, searchInput, searchedColumn, searchText]
  );

  return (
    <>
      <NxModal
        isOpen={isOpen}
        type={"confirmation"}
        title="APPROVAL SERVICE REQUEST INFORMATION"
        handleCancel={handleCancelForm}
        width={1000}
        hidePadding={true}
        loading={loadingApproval}
        footer={
          <div className="flex justify-between">
            <Button type={"menu"} onClick={handleCancelForm} disabled={loadingApproval}>
              Cancel
            </Button>
            <div className="flex">
              <Button
                onClick={prev}
                type={"menu"}
                disabled={current < 1 || loadingApproval}
              >
                Previous
              </Button>
              {current < steps.length - 1 && (
                <Button
                  onClick={handleButtonNext}
                  type={"submit"}
                  disabled={current > steps.length - 1 || steps[current].disabled || loadingApproval}
                >
                  Next
                </Button>
              )}
              {current === steps.length - 1 && (
                <>
                  <Button
                    type={"reject"}
                    onClick={() => handleSave("REJECT")}
                    icon={<SVGIcon width={14} height={14} name="IconSquareX" />}
                    className="flex-row-reverse"
                    disabled={!loading_rejectSr && loadingApproval}
                    loading={loading_rejectSr}
                  >
                    Reject
                  </Button>
                  <Button
                    type={"approve"}
                    onClick={() => handleSave("APPROVE")}
                    icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                    className="flex-row-reverse"
                    disabled={!loading_approveSr && loadingApproval}
                    loading={loading_approveSr}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <NxFormStepper
          steps={steps}
          current={current}
          onPrev={prev}
          onNext={handleButtonNext}
          inModal
        />

        <div className="p-4">
          {/* STEP 1: SERVICE REQUEST LIST */}
          <div className={`steps-content ${current !== 0 ? "hidden" : ""}`}>
            <Form layout="vertical" form={form} id={"formApprove"}>
              <div className="w-full grid grid-cols-1 gap-x-4">
                <NxBaseContainer border header={"Service Request List - Ready to Approve"}>
                  <NxTable
                    className={"[&_.ant-checkbox]:scale-90"}
                    dataSource={srApprovals}
                    columns={columns}
                    totalData={totalElement}
                    tableScrolled={{ x: srApprovals.length ? "max-content" : 1200 }}
                    onSort={onSort}
                    loading={loading_listSrApprovals}
                    showExport={false}
                    rowSelection={rowSelection}
                    usePagination={false}
                    useInfiniteScroll={true}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    loadMoreThreshold={20}
                  />
                  <Form.Item
                    key="remark"
                    label={"Remark"}
                    name={"remark"}
                    rules={[{ required: true, message: "Please input your Remark!" }]}
                    className="no-margin-form"
                  >
                    <InputComponent
                      rows={1}
                      type="textarea"
                      placeholder={"Type your remark for approval/rejection"}
                    />
                  </Form.Item>
                </NxBaseContainer>
              </div>
            </Form>
          </div>

          {/* STEP 2: CONFIRMATION */}
          <div className={`steps-content ${current !== 1 ? "hidden" : ""}`}>
            <NxBaseContainer border header={"Confirmation"}>
              <div className="flex flex-col gap-y-4">
                <NxTable
                  dataSource={selectedRows}
                  columns={columns}
                  tableScrolled={{ x: "max-content" }}
                  onSort={onSort}
                  loading={false}
                  usePagination={false}
                  useInfiniteScroll={false}
                />
                <DetailText label={"Remark"} className="flex flex-col gap-y-2">
                  {form.getFieldValue().remark}
                </DetailText>
              </div>
            </NxBaseContainer>
          </div>
        </div>
      </NxModal>
    </>
  );
};

export default ServiceRequestApprovalModal;
