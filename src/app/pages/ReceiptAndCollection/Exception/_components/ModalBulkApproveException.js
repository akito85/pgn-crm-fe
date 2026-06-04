import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import NxModal from "../../../../../components/Nx/NxModal";
import { NxFormStepper } from "../../../../../components/Nx/NxFormStepNavigation";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";
import { showModalError } from "../../../../../redux/slices/general_slice";
import {
  getPaginateExceptionForApproval,
  bulkApproveException,
} from "../../../../../redux/slices/receipt_collection/exceptionSlice";
import { renderColumn, hasValue } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { debounce } from "lodash";

const MAX_REMARK = 255;

const steps = [
  { key: "exception", title: "EXCEPTION" },
  { key: "confirmation", title: "CONFIRMATION" },
];

const ModalBulkApproveException = ({ isOpen, handleClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(
    (state) => state.exception
  );

  const [form] = Form.useForm();
  const searchInput = useRef(null);

  const [current, setCurrent] = useState(0);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [allData, setAllData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(false);

  const fetchPage = useCallback(async (page, replace = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await dispatch(
        getPaginateExceptionForApproval({ search, page: page + 1, pageSize: 10, sort })
      ).unwrap();
      const rows = result?.result ?? [];
      const nextHasMore = page < (result?.page?.totalPages ?? 0) - 1;
      setAllData((prev) => {
        const base = replace ? [] : prev;
        const offset = base.length;
        const keyed = rows.map((r, i) => ({ ...r, _rowKey: offset + i }));
        return replace ? keyed : [...base, ...keyed];
      });
      setHasMore(nextHasMore);
      hasMoreRef.current = nextHasMore;
      pageRef.current = page;
    } catch (e) {
      console.error("fetchPage error", e);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [dispatch, search, sort]);

  useEffect(() => {
    if (!isOpen) return;
    pageRef.current = 0;
    setAllData([]);
    setHasMore(false);
    fetchPage(0, true);
  }, [isOpen, search, sort]); // intentionally excludes fetchPage

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleGlobalSearch = useCallback(
    debounce((value) => {
      setSearch((prev) => {
        const next = { ...prev };
        if (value) {
          next.all = value;
        } else {
          delete next.all;
        }
        return next;
      });
    }, 500),
    []
  );

  useEffect(() => () => handleGlobalSearch.cancel(), [handleGlobalSearch]);

  const onSort = (_, __, sorter) => {
    setSort(
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
  };

  const onLoadMore = useCallback(() => {
    if (!hasMoreRef.current || isFetchingRef.current) return Promise.resolve();
    return fetchPage(pageRef.current + 1, false);
  }, [fetchPage]);

  // Auto-load next page if table body has no scrollable overflow after data loads
  useEffect(() => {
    if (!hasMore || allData.length === 0) return;
    const timer = setTimeout(() => {
      const tableBody = document.querySelector("#exception-bulk-approve-list .ant-table-body");
      if (tableBody && tableBody.scrollHeight <= tableBody.clientHeight + 5) {
        onLoadMore();
      }
    }, 150);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allData, hasMore]);

  const next = async () => {
    try {
      if (!selectedRowKeys.length) {
        dispatch(showModalError({ title: "Failed", description: "Please select at least one exception" }));
        return;
      }
      await form.validateFields(["remark"]);
      setCurrent(1);
    } catch {}
  };

  const prev = () => setCurrent(0);

  const handleSave = async (action) => {
    try {
      const values = await form.validateFields();
      await dispatch(
        bulkApproveException({
          excAccountIds: [...new Set(selectedRows.map((r) => r.excAccountId))],
          action,
          remark: values.remark,
        })
      ).unwrap();
      resetAndClose();
      onSuccess?.();
    } catch {}
  };

  const resetAndClose = () => {
    setCurrent(0);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSearch({});
    setAllData([]);
    setHasMore(false);
    pageRef.current = 0;
    isFetchingRef.current = false;
    hasMoreRef.current = false;
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    form.resetFields();
    handleClose();
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  const columns = useMemo(
    () => [
      {
        title: "NO",
        key: "no",
        width: 55,
        align: "left",
        render: (_, __, index) => index + 1,
      },
      {
        title: "CUSTOMER NUMBER",
        dataIndex: "customerNumber",
        key: "customerNumber",
        sorter: true,
        align: "left",
        filteredValue: [search?.customerNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "customerNumber", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("customerNumber", hasValue(search["customerNumber"]), searchText, text, false, "input", search),
      },
      {
        title: "CUSTOMER NAME",
        dataIndex: "customerName",
        key: "customerName",
        sorter: true,
        align: "left",
        filteredValue: [search?.customerName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "customerName", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("customerName", hasValue(search["customerName"]), searchText, text, false, "input", search),
      },
      {
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        key: "accountNumber",
        sorter: true,
        align: "left",
        filteredValue: [search?.accountNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "accountNumber", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("accountNumber", hasValue(search["accountNumber"]), searchText, text, false, "input", search),
      },
      {
        title: "ACCOUNT NAME",
        dataIndex: "accountName",
        key: "accountName",
        sorter: true,
        align: "left",
        filteredValue: [search?.accountName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "accountName", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("accountName", hasValue(search["accountName"]), searchText, text, false, "input", search),
      },
      {
        title: "COST CENTER",
        dataIndex: "costCenter",
        key: "costCenter",
        sorter: true,
        align: "left",
        filteredValue: [search?.costCenter] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search, "costCenter", searchInput, searchedColumn, searchText, handleSearch, true
        ),
        render: (text) =>
          renderColumn("costCenter", hasValue(search["costCenter"]), searchText, text, false, "input", search),
      },
    ],
    [search, searchText, searchedColumn]
  );

  const remarkValue = Form.useWatch("remark", form) ?? "";

  return (
    <NxModal
      isOpen={isOpen}
      title="APPROVAL EXCEPTION"
      handleCancel={resetAndClose}
      width={1000}
      loading={loading}
      footer={
        <div className="flex justify-between items-center">
          <ButtonComponent type="default" onClick={resetAndClose} disabled={loading}>
            Cancel
          </ButtonComponent>
          <div className="flex gap-2">
            <ButtonComponent
              type="default"
              onClick={prev}
              disabled={current < 1 || loading}
            >
              Previous
            </ButtonComponent>
            {current === 0 && (
              <ButtonComponent type="submit" onClick={next} disabled={loading}>
                Next
              </ButtonComponent>
            )}
            {current === 1 && (
              <>
                <ButtonComponent
                  type="reject"
                  icon={<SVGIcon width={14} height={14} name="IconSquareX" />}
                  onClick={() => handleSave("REJECT")}
                  loading={loading}
                  disabled={loading}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  icon={<SVGIcon width={14} height={14} name="IconSquareCheck" />}
                  onClick={() => handleSave("APPROVE")}
                  loading={loading}
                  disabled={loading}
                >
                  Approve
                </ButtonComponent>
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
        onNext={next}
        inModal
      />

      <div className="p-4">
        {/* ── STEP 1: EXCEPTION ─────────────────────────────────── */}
        <div className={current !== 0 ? "hidden" : ""}>
          <Form form={form} layout="vertical">
            <div
              className="mb-4 rounded-lg overflow-hidden"
              style={{ border: "1px solid #d1d5db" }}
            >
              <div
                className="px-4 py-2 font-semibold text-sm"
                style={{ background: "#EBF5FB", color: "#0063A2" }}
              >
                EXCEPTION INFORMATION
              </div>
              <div className="p-2">
                <TableRBI
                  idTable="exception-bulk-approve-list"
                  dataSource={allData}
                  columns={columns}
                  onSort={onSort}
                  loading={isLoading}
                  tableScrolled={{ y: 350 }}
                  rowSelection={rowSelection}
                  rowKey="_rowKey"
                  useInfiniteScroll={true}
                  hasMore={hasMore}
                  onLoadMore={onLoadMore}
                  onSearch={(e) => handleGlobalSearch(e.target.value)}
                />
              </div>
            </div>

            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: "Remark is required" }]}
              className="mb-1"
            >
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
                rows={4}
                maxLength={MAX_REMARK}
                placeholder="Remark..."
              />
            </Form.Item>
            <p className="text-xs text-gray-400 mb-0">
              You have {MAX_REMARK - remarkValue.length} of {MAX_REMARK} characters remaining
            </p>
          </Form>
        </div>

        {/* ── STEP 2: CONFIRMATION ──────────────────────────────── */}
        <div className={current !== 1 ? "hidden" : ""}>
          <TableRBI
            dataSource={selectedRows}
            columns={columns}
            current={1}
            pageSize={selectedRows.length || 10}
            totalData={selectedRows.length}
            loading={false}
            tableScrolled={{ y: 400 }}
            rowKey="_rowKey"
          />
        </div>
      </div>
    </NxModal>
  );
};

export default ModalBulkApproveException;
