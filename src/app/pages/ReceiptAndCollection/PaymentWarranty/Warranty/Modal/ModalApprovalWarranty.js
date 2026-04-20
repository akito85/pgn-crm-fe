import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Popover,
  Tabs,
  Menu,
  Steps,
  Form,
  Button,
  message,
  Tooltip,
} from "antd";
import { FormStepper } from "../../../../../../components/FormStepNavigation";
import { RightOutlined, EditOutlined } from "@ant-design/icons";
import { ModalError, ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import { debounce } from "lodash";
import { IconModal } from "../../../../../../utils/Icon";
import {
  submitApproval,
  getListApprovalWarranty,
  getDetailWarranty,
  getApprovalHistory,
  deleteWarranty,
} from "../../../../../../redux/slices/receipt_collection/warranty";
import { tableApprovalWarranty } from "./TableApprovalWarranty";
import { formMessageRequired } from "../../../../../../utils";
import TableRBI from "../../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { WARRANTY_STATUS, WARRANTY_APPROVAL_STATUS } from "../../../../../../constants/warranty";
import { useNavigate, Link } from "react-router-dom";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../../routes/Receipt&Collection/rc_routes";
import useGrantAccessHooks from "../../../../../../components/useGrantAccessHooks";
import ModalRefund from "./ModalRefund";
import ModalHold from "./ModalHold";
import ModalRelease from "./ModalRelease";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";


const ModalApprovalWarranty = ({
  isOpen,
  handleCancel,
  handleListRefresh = () => {},
}) => {
  // Selector
  const { data_approval_list, loading_approval_list } = useSelector((state) => state.warranty);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dataApproval = data_approval_list?.result || [];

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    // warrantyCode: "left",
    // approvalStatus: "right",
    action: "right",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalHold, setModalHold] = useState(false);
  const [modalRelease, setModalRelease] = useState(false);
  const [modalRefund, setModalRefund] = useState(false);
  const [activeRowKey, setActiveRowKey] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedRecordDelete, setSelectedRecordDelete] = useState(null);

  const { data: dataWarranty } = useSelector((state) => state.warranty);
  const { dataApprovalHistory } = useSelector((state) => state.warranty);
  const { actions: accessList } = useGrantAccessHooks("page");

  // Initial fetch
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getListApprovalWarranty({
          page: 0,
          pageSize: 100,
          search: encodeURIComponent(JSON.stringify(search)),
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen, search]);

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data_approval_list?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getListApprovalWarranty({
          page: nextPage - 1,
          pageSize: pageSize,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataApproval.length < (data_approval_list?.page?.totalElements || 0);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    const shouldResetPage = search[dataIndex] !== selectedKeys[0];
    setSearch((prevState) => {
      const nextState = { ...prevState };
      nextState[dataIndex] = selectedKeys[0];
      return nextState;
    });
    if (shouldResetPage) {
      setPage(1);
    }
  };

  const handleGlobalSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setSearchedColumn(value ? "all" : "");
      setSearch((prevState) => {
        const nextState = { ...prevState };
        if (value) {
          nextState.all = value;
        } else {
          delete nextState.all;
        }
        return nextState;
      });
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleGlobalSearch.cancel();
    };
  }, [handleGlobalSearch]);

  const handleAdvanceSearch = (searchData) => {
    setSearch((prevState) => {
      setPage(1);
      return {
        ...prevState,
        advanceSearch: searchData
      };
    });
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => {
      const isWaitingApproval = record.approvalStatus === WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL;
      const isNotApprover = !record.isApprover;
      
      let differentApprover = false;
      if (dataTableSelect.length > 0) {
        differentApprover = record.appHierId !== dataTableSelect[0].appHierId;
      }

      return {
        disabled: !isWaitingApproval || isNotApprover || differentApprover,
        name: record.warrantyCode,
      };
    },
  };

  const handleDetail = (record) => {
    navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_WARRANTY, { state: { id: record.id } });
  };

  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListApprovalWarranty({
        page: 0,
        pageSize: 100,
        search: reqSearch,
        isLoadMore: false,
      })
    );
  };

  const handleHistory = (record) => {
    setOpenModalHistory(true);
    dispatch(getApprovalHistory({ id: record.id }));
  };

  const handleDelete = (record) => {
    setSelectedRecordDelete(record);
    setModalDelete(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteWarranty(selectedRecordDelete.id)).unwrap().then(() => {
      setModalDelete(false);
      handleRefresh();
    });
  };

  const itemActions = [
    {
       action: "Update",
       render: (record) => {
          const isDraft = record?.status === WARRANTY_STATUS.DRAFT;
          const isApprDraft = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.DRAFT;
          const isApprRejected = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.REJECTED;
          const isActive = record?.status === WARRANTY_STATUS.ACTIVE;
          const isApprApproved = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.APPROVED;

          const isDraftFullyEditable = isDraft && (isApprDraft || isApprRejected);
          const isPartialEditable = isActive && isApprApproved;
          
          const disabled = !(isDraftFullyEditable || isPartialEditable);

          return (
            <ButtonComponent
              border={false}
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  navigate(RECEIPT_AND_COLLECTION_ROUTES.UPDATE_WARRANTY, { state: { id: record?.id } });
                }
              }}
              type="action"
              disabled={disabled}
              icon={<EditOutlined style={{ fontSize: "16px", color: disabled ? "#D3D3D3" : "#000" }} />}
            >
              <span className={disabled ? "text-gray-400" : "text-black"}>Update</span>
            </ButtonComponent>
          );
       }
    },
    {
      action: "Refund",
      render: (record) => {
        const isDisabled = record?.approvalStatus !== "Approved" ||
          (parseFloat(record?.unAppliedAmountReal || record?.unAppliedAmount || 0) <= 0);
        return (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalRefund(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconRefund" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Refund</span>
          </ButtonComponent>
        );
      },
    },
    {
      action: "Hold",
      render: (record) => {
        const isDisabled = !(record?.approvalStatus === "Approved" && record?.status?.toUpperCase() === "UNAPPLIED");
        return (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalHold(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconHold" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Hold</span>
          </ButtonComponent>
        );
      },
    },
    {
      action: "Release",
      render: (record) => {
        const isDisabled = !(record?.status === "Hold" && record?.approvalStatus === "Approved");
        return (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDisabled) {
                setActiveRowKey(record.id);
                setSelectedRecord(record);
                setModalRelease(true);
              }
            }}
            type="action"
            disabled={isDisabled}
            icon={<SVGIcon name="IconSend" color={isDisabled ? "#D3D3D3" : "#000000"} width={16} />}
          >
            <span className={isDisabled ? "text-gray-400" : "text-black"}>Release</span>
          </ButtonComponent>
        );
      },
    },
    {
      action: "history",
      render: (record) => (
        <ButtonComponent
          border={false}
          className="gap-2"
          onClick={(e) => {
            e.stopPropagation();
            handleHistory(record);
          }}
          type="action"
          icon={<SVGIcon name="IconLogHistory" color={"#000"} width={16} />}
        >
          <span className="text-black">Approval History</span>
        </ButtonComponent>
      ),
    },
    {
      action: "Delete",
      render: (record) => {
        const isDraft = record?.status === WARRANTY_STATUS.DRAFT;
        const isApprDraft = record?.approvalStatus === WARRANTY_APPROVAL_STATUS.DRAFT;
        const disabled = !(isDraft && isApprDraft);

        return (
          <ButtonComponent
            border={false}
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) {
                handleDelete(record);
              }
            }}
            type="action"
            disabled={disabled}
            icon={<SVGIcon name="IconDelete" color={disabled ? "#D3D3D3" : "#BE3036"} width={16} />}
          >
            <span className={disabled ? "text-gray-400" : "text-[#BE3036]"}>Delete</span>
          </ButtonComponent>
        );
      }
    },
    {
      action: "View",
      render: (record) => (
        <ButtonComponent
          className="gap-5"
          icon={<SVGIcon name="IconDetail" width={24} color={"#0075bf"} />}
          border={false}
          type="action"
          onClick={(e) => {
            e.stopPropagation();
            handleDetail(record);
          }}
        />
      ),
    },
  ];

  const baseColumns = useMemo(() => {
    return tableApprovalWarranty(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      handleDetail
    );
  }, [search, page, pageSize, searchedColumn, searchText]);

  const actionColumns = useMemo(() => {
    const permissions = accessList?.map(a => a.toLowerCase()) || [];
    // We filter items that have permissions or are standard (View/history)
    const tableActions = itemActions.filter(item => {
      const act = item.action.toLowerCase();
      if (act === "view" || act === "history") return true;
      return permissions.includes(act);
    });
    
    if (tableActions.length === 0) return [];

    return [
      {
        key: "action",
        title: "ACTION",
        fixed: "right",
        width: 100,
        render: (_, record) => {
          const detailAction = tableActions.find(a => a.action.toLowerCase() === "view");
          const otherActions = tableActions.filter(a => a.action.toLowerCase() !== "view");
          
          return (
            <div className="flex justify-center items-center gap-4">
              {otherActions.length > 0 && (
                <Popover
                  trigger="click"
                  placement="bottomRight"
                  showArrow={false}
                  content={
                    <div className="flex flex-col">
                      {otherActions.map(action => (
                        <div key={action.action} onClick={(e) => e.stopPropagation()}>
                           {action.render(record)}
                        </div>
                      ))}
                    </div>
                  }
                >
                  <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <SVGIcon name="IconActionDropdown" width={20} color={"#0075bf"} />
                  </div>
                </Popover>
              )}
              {detailAction && (
                <div onClick={(e) => e.stopPropagation()}>
                   {detailAction.render(record)}
                </div>
              )}
            </div>
          );
        }
      }
    ];
  }, [accessList, itemActions]);

  const processedColumns = useMemo(() => {
    // Filter out the original "action" column from baseColumns if it exists
    const filteredBase = baseColumns.filter(col => col.key !== "action");
    return applyFixedColumns([...filteredBase, ...actionColumns], fixedColumns);
  }, [baseColumns, actionColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const steps = [
    {
      title: "Guarantee Information",
      disabled: dataTableSelect.length === 0,
    },
    {
      title: "Confirmation",
    },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const scrollLeftHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 250;
  };

  const scrollRightHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 250;
  };

  const handleScroll = () => {
    if (containerRef.current) setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleCancelForm = () => {
    handleGlobalSearch.cancel();
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    setCurrent(0);
    form.resetFields();
  };

  const handleSave = async (formValue) => {
    if (isSubmitting) return; // Prevent double submission

    if (current < steps.length - 1) {
      handleButtonNext();
    } else {
      setIsSubmitting(true);
      try {
        const payload = dataTableSelect.map((item) => ({
          id: item.id,
          action: action,
          remark: formValue.remark,
          approvalId: item.approvalId,
        }));

        await dispatch(submitApproval({ body: payload })).unwrap();
        handleCancelForm();
        handleListRefresh();
      } catch (error) {
        message.error('Failed to submit approval. Please try again.');
        console.error("Error", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Approval Guarantee"
        message={
          current === steps.length - 1
            ? "Are you sure you want to approve/reject these guarantees?"
            : "Please choose guarantee to approve or reject"
        }
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-between items-center bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
            <ButtonComponent
              type="default"
              onClick={handleCancelForm}
              className="!border-[#0075BF] !text-[#0075BF]"
            >
              Cancel
            </ButtonComponent>
            <div className="flex items-center gap-3">
              {current > 0 && (
                <Button
                  onClick={() => {
                    prev();
                    scrollLeftHandler();
                  }}
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#DADDE5",
                    color: "#4B465C",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                    border: "1px solid #DADDE5",
                  }}
                >
                  Previous
                </Button>
              )}

              {current < steps.length - 1 ? (
                <Button
                  key="btn-next"
                  htmlType="submit"
                  form="formApproveWarranty"
                  type="primary"
                  disabled={steps[current].disabled}
                  style={{
                    backgroundColor: "#0075BF",
                    borderColor: "#0075BF",
                    color: "#fff",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    key="btn-reject"
                    htmlType="submit"
                    disabled={isSubmitting}
                    onClick={() => setAction("REJECT")}
                    style={{
                      backgroundColor: "#BE3036",
                      borderColor: "#BE3036",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    key="btn-approve"
                    htmlType="submit"
                    form="formApproveWarranty"
                    disabled={isSubmitting}
                    onClick={() => setAction("APPROVE")}
                    style={{
                      backgroundColor: "#388E3C",
                      borderColor: "#388E3C",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <FormStepper 
          steps={steps} 
          current={current} 
          onPrev={() => current > 0 && prev()} 
          onNext={() => current < steps.length - 1 && !steps[current].disabled && next()} 
        />

        <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
          <Form
            layout="vertical"
            form={form}
            id={"formApproveWarranty"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <div className="flex gap-2 justify-between">
                <p className="text-primary uppercase font-bold">Guarantee List</p>
                {selectedRowKeys.length > 0 && (
                  <p className="text-sm font-semibold text-blue-600">
                    {selectedRowKeys.length} selected
                  </p>
                )}
              </div>
              <TableRBI
                idTable="approval-warranty-table"
                dataSource={dataApproval?.map((a, index) => ({
                    ...a,
                    key: a.id || index + 1,
                  }))}
                columns={processedColumns}
                totalData={data_approval_list?.page?.totalElements || 0}
                tableScrolled={{ x: 1500, y: 300 }}
                onSort={onSort}
                showExport={false}
                showSearchBar={true}
                showAdvanceSearch={true}
                onSearch={(e) => handleGlobalSearch(e.target.value)}
                onAdvanceSearch={handleAdvanceSearch}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                rowSelection={rowSelection}
                loading={loading_approval_list}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
              />

              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                >
                  <InputComponent
                    rows={3}
                    type="textarea"
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <div className="flex justify-between items-center mb-4">
              <p className="text-primary uppercase font-bold">Guarantee List</p>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
                <span className="text-blue-600 font-semibold">
                  {dataTableSelect.length} records selected
                </span>
              </div>
            </div>

            <TableRBI
              dataSource={dataTableSelect}
              columns={processedColumns}
              totalData={dataTableSelect.length || 0}
              tableScrolled={{ x: 1500, y: 300 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={false}
              usePagination={false}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/* Auxiliary Modals */}
      <ModalRefund
        isOpen={modalRefund}
        handleCancel={() => setModalRefund(false)}
        handleRefresh={handleRefresh}
        data={selectedRecord}
      />
      <ModalHold
        isOpen={modalHold}
        handleCancel={() => setModalHold(false)}
        handleRefresh={handleRefresh}
        data={selectedRecord}
      />
      <ModalRelease
        isOpen={modalRelease}
        handleCancel={() => setModalRelease(false)}
        handleRefresh={handleRefresh}
        data={selectedRecord}
      />
      <ModalHistory
        isOpen={openModalHistory}
        handleCancel={() => setOpenModalHistory(false)}
        data={dataApprovalHistoryFix}
        title="Approval History"
      />
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleConfirm={handleConfirmDelete}
        type="delete"
        header="Delete Guarantee"
        message="Are you sure you want to delete this guarantee?"
      />
    </div>
  );
};

export default ModalApprovalWarranty;
