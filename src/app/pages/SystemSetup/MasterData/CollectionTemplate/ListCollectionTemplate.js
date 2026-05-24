import { Tooltip, Checkbox, Form, Input, Modal } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import DetailCollectionTemplate from "./DetailCollectionTemplate";
import ModalBulkApprovalTemplate from "./ModalBulkApprovalTemplate";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import TableRBI from "../../../../../components/TableRBI";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  getListCollectionTemplate,
  getDownloadCollectionTemplate,
  getApprovalHistory,
  getAvailableApproval,
  getSelectedApproval,
  approveCollectionTemplate,
  rejectCollectionTemplate,
  approveInactiveCollectionTemplate,
  approveActivatedCollectionTemplate,
  requestInactiveCollectionTemplate,
  requestActivateCollectionTemplate,
  getDetailCollectionTemplate,
} from "../../../../../redux/slices/system_setup/master_data/collectionTemplate";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import { collectionTemplateColumns } from "./columns/collectionTemplateColumns";

const ListCollectionTemplate = () => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const detailRef = useRef(null);
  const [form] = Form.useForm();

  // State
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  // Detail State
  const [selectedId, setSelectedId] = useState(null);

  // Modal States
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalApproval, setModalApproval] = useState(false);
  const [chooseId, setChooseId] = useState(null);
  const [modalInactive, setModalInactive] = useState(false);
  const [chooseInactiveId, setChooseInactiveId] = useState(null);
  // Bulk Approval Modal
  const [bulkApprovalOpen, setBulkApprovalOpen] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("collectionTemplateFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: [],
          right: ["no", "status", "statusApproval", "action"],
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "collectionTemplateFixedColumns",
      JSON.stringify(fixedColumns),
    );
  }, [fixedColumns]);

  const { loading, data, pagination, dataApprovalHistory, data_detail } =
    useSelector((state) => state.collectionTemplate);

  const normalizeStatus = (value) =>
    (value || "").toString().trim().toUpperCase();

  // Waiting Approval data for bulk modal
  const waitingApprovalData = useMemo(
    () =>
      (data || []).filter(
        (item) =>
          (item.statusApproval || "").toLowerCase() === "waiting approval",
      ),
    [data],
  );

  // Handle Refresh
  const handleViewDetail = (record) => {
    const id = record.collectionTemplateId || record.id;
    setSelectedId(id);
    dispatch(getDetailCollectionTemplate(id));
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleRefresh = useCallback(() => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});

    const sortArray = sort ? [sort] : [];

    dispatch(
      getListCollectionTemplate({
        page: 1,
        size: 100,
        sort: sortArray,
        search: searchObject,
        isLoadMore: false,
      }),
    );
    setPage(1);
  }, [dispatch, search, sort]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  // Approval History
  useEffect(() => {
    if (dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create:
            dataApprovalHistory?.dataApprover?.PAY_COLLECTION_TEMPLATE || [],
          inactive:
            dataApprovalHistory?.dataApprover
              ?.INACTIVE_PAY_COLLECTION_TEMPLATE || [],
          activate:
            dataApprovalHistory?.dataApprover
              ?.ACTIVATED_PAY_COLLECTION_TEMPLATE || [],
        },
        dataHistory: {
          create:
            dataApprovalHistory?.dataHistory?.PAY_COLLECTION_TEMPLATE || [],
          inactive:
            dataApprovalHistory?.dataHistory
              ?.INACTIVE_PAY_COLLECTION_TEMPLATE || [],
          activate:
            dataApprovalHistory?.dataHistory
              ?.ACTIVATED_PAY_COLLECTION_TEMPLATE || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (record) => {
    const id = record.collectionTemplateId || record.id;
    dispatch(getApprovalHistory(id));
    setOpenModalHistory(true);
  };

  const handleOpenApproval = (record) => {
    setChooseId(record);
    setModalApproval(true);
    form.resetFields();
  };

  const handleCloseApproval = () => {
    setChooseId(null);
    setModalApproval(false);
    form.resetFields();
  };

  const handleSubmitApproval = (action) => {
    form.validateFields().then((values) => {
      const templateId = chooseId.collectionTemplateId || chooseId.id;
      const approvalType = chooseId?.approvalType;
      const isInactive = approvalType === "INACTIVE_PAY_COLLECTION_TEMPLATE";
      const isActivated = approvalType === "ACTIVATED_PAY_COLLECTION_TEMPLATE";

      let thunkCall;
      if (isInactive) {
        thunkCall = approveInactiveCollectionTemplate({
          id: templateId,
          body: { remark: values.remark, action },
        });
      } else if (isActivated) {
        thunkCall = approveActivatedCollectionTemplate({
          id: templateId,
          body: { remark: values.remark, action },
        });
      } else {
        thunkCall =
          action === "APPROVE"
            ? approveCollectionTemplate({
                id: templateId,
                body: { remark: values.remark },
              })
            : rejectCollectionTemplate({
                id: templateId,
                body: { remark: values.remark },
              });
      }

      dispatch(thunkCall)
        .unwrap()
        .then(() => {
          handleCloseApproval();
          handleRefresh();
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "An error occurred";
          setBodyError({ message });
          setModalError(true);
        });
    });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleInactive = (record) => {
    setChooseInactiveId(record);
    setModalInactive(true);
  };

  const handleCancelInactive = () => {
    setChooseInactiveId(null);
    setModalInactive(false);
  };

  const handleOkInactive = (res, handleClear) => {
    const selectedStatus = normalizeStatus(chooseInactiveId?.status);
    const isActivateRequest = selectedStatus === "INACTIVE";
    const dataValue = {
      id: chooseInactiveId.collectionTemplateId || chooseInactiveId.id,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(
      (isActivateRequest
        ? requestActivateCollectionTemplate
        : requestInactiveCollectionTemplate)(dataValue),
    )
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelInactive();
        handleRefresh();
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred";
        setBodyError({ message });
        setModalError(true);
      });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination?.totalPages || 0;
    if (nextPage <= totalPages) {
      const searchObject = Object.keys(search)
        .filter((key) => search[key])
        .reduce((obj, key) => {
          obj[key] = search[key];
          return obj;
        }, {});
      const sortArray = sort ? [sort] : [];
      await dispatch(
        getListCollectionTemplate({
          page: nextPage,
          size: loadMoreSize,
          sort: sortArray,
          search: searchObject,
          isLoadMore: true,
        }),
      );
      setPage(nextPage);
    }
  };

  const currentData = useMemo(() => data || [], [data]);
  const hasMore = currentData.length < (pagination?.totalElements || 0);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      if (!selectedKeys[0]) {
        const newState = { ...prevState };
        delete newState[dataIndex];
        return newState;
      }
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    const searchObject = Object.keys(search)
      .filter((key) => search[key])
      .reduce((obj, key) => {
        obj[key] = search[key];
        return obj;
      }, {});
    const sortArray = sort ? [sort] : [];
    dispatch(
      getDownloadCollectionTemplate({
        page: 1,
        size: pagination?.totalElements || 1000,
        sort: sortArray,
        search: searchObject,
      }),
    );
  };

  const itemGrantAccess = [
    // Toolbar items
    {
      action: "Approve",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={
            <SVGIcon
              name="IconSubmitApprover"
              style={{ fontSize: "20px", color: "white" }}
            />
          }
          onClick={() => setBulkApprovalOpen(true)}
        >
          Approve
        </ButtonComponent>
      ),
    },
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={
            <SVGIcon name="IconButtonDownload" style={{ fontSize: "20px" }} />
          }
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_COLLECTION_TEMPLATE}>
          <ButtonComponent
            icon={
              <SVGIcon name="IconButtonCreate" style={{ fontSize: "20px" }} />
            }
            type="submit"
          >
            Create Template
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Table column actions
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Tooltip title="Detail">
          <span
            className="cursor-pointer"
            onClick={() => handleViewDetail(record)}
          >
            <SVGIcon
              name="IconDetail"
              width={20}
              color={
                selectedId === (record.collectionTemplateId || record.id)
                  ? "#0075bf"
                  : undefined
              }
            />
          </span>
        </Tooltip>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          normalizeStatus(record.status) === "DRAFT" ||
          normalizeStatus(record.statusApproval) === "REJECTED";

        const content =
          data > 3 ? (
            isEditable ? (
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_COLLECTION_TEMPLATE}
                state={{
                  id: record.collectionTemplateId || record.id,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
                  border={false}
                  type={"action"}
                >
                  <span className="text-black ml-0">Update</span>
                </ButtonComponent>
              </Link>
            ) : (
              <div className="flex items-center cursor-not-allowed px-2 py-1">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" color="#8D91A0" width={24} />
                </span>
                <span className="text-gray-400 ml-2 pointer-events-none">
                  Update
                </span>
              </div>
            )
          ) : isEditable ? (
            <Tooltip title="Update">
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_COLLECTION_TEMPLATE}
                state={{
                  id: record.collectionTemplateId || record.id,
                  status: record.status,
                  statusApproval: record.statusApproval,
                }}
              >
                <SVGIcon name="IconEdit" width={24} color="#ACC424" />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Update">
              <div className="cursor-not-allowed">
                <span className="pointer-events-none">
                  <SVGIcon name="IconEdit" width={24} color="#8D91A0" />
                </span>
              </div>
            </Tooltip>
          );

        return content;
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const rowStatus = normalizeStatus(record.status);
        const rowStatusApproval = normalizeStatus(record.statusApproval);
        const canInactivate =
          rowStatus === "ACTIVE" && rowStatusApproval === "APPROVED";
        const canActivate =
          rowStatus === "INACTIVE" && rowStatusApproval !== "WAITING APPROVAL";
        const isActivateOrInactivate = canInactivate || canActivate;

        const Content =
          data_length > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
                  checked={rowStatus !== "ACTIVE"}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
              type={"action"}
            >
              <span className="text-black ml-1">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={rowStatus === "ACTIVE" ? "Inactivate" : "Activate"}>
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={!isActivateOrInactivate}
                  checked={rowStatus !== "ACTIVE"}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "Approval",
      type: "table",
      render: (record, data_length) => {
        const canApprove = record.statusApproval === "WAITING APPROVAL";

        const Content =
          data_length > 3 ? (
            canApprove ? (
              <ButtonComponent
                icon={
                  <SVGIcon name="IconApproval" color={"#0075bf"} width={20} />
                }
                type={"action"}
                border={false}
                onClick={() => handleOpenApproval(record)}
              >
                <span className="text-black ml-0">Approval</span>
              </ButtonComponent>
            ) : (
              <div className="flex items-center px-2 py-1">
                <SVGIcon name="IconApproval" color="#8D91A0" width={20} />
                <span className="text-gray-400 ml-2">Approval</span>
              </div>
            )
          ) : (
            <Tooltip title="Approval">
              <div className="pt-1">
                <SVGIcon
                  name="IconApproval"
                  width={20}
                  color={canApprove ? "#0075bf" : "#8D91A0"}
                  className={!canApprove ? "cursor-not-allowed" : undefined}
                  onClick={
                    canApprove ? () => handleOpenApproval(record) : undefined
                  }
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
              }
              type={"action"}
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black ml-0"}>Approval History</span>
            </ButtonComponent>
          ) : (
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

        return Content;
      },
    },
  ];

  const columns = useMemo(
    () =>
      collectionTemplateColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [searchedColumn, searchText, search],
  );

  const actionColumns = useColumnActionPermission(
    ["View", "Update", "Activate", "Approve", "History"],
    itemGrantAccess,
  ).map((col) => ({
    ...col,
    width: 75,
    align: "center",
  }));

  const baseColumns = useMemo(() => {
    const allColumns = [...columns, ...actionColumns];
    return allColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [columns, actionColumns]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    baseColumns.forEach((col) => {
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) {
        leftFixed.push(col);
      } else if (fixedColumns.right.includes(colKey)) {
        rightFixed.push(col);
      } else {
        normal.push(col);
      }
    });

    const reorderedColumns = [...leftFixed, ...normal, ...rightFixed];

    return reorderedColumns.map((col) => {
      const newCol = { ...col };
      const colKey = col.key || col.dataIndex || col.title;
      if (fixedColumns.left.includes(colKey)) {
        newCol.fixed = "left";
      } else if (fixedColumns.right.includes(colKey)) {
        newCol.fixed = "right";
      } else {
        delete newCol.fixed;
      }
      return newCol;
    });
  }, [baseColumns, fixedColumns]);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];
    return currentData.map((item, index) => ({
      ...item,
      status: (item.status || "").toUpperCase(),
      statusApproval: (item.statusApproval || "").toUpperCase(),
      key: item.collectionTemplateId || item.id || index,
    }));
  }, [currentData]);

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: "", breadcrumbName: "Collection Template" },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">COLLECTION TEMPLATE LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemGrantAccess} />
            </div>
          </div>
        }
      >
        <TableRBI
          key={`collection-template-${page}-${currentData.length}`}
          idTable="collection-template-table"
          showExport={false}
          dataSource={dataSourceWithKeys}
          columns={processedColumns}
          totalData={pagination?.totalElements || 0}
          onSort={onSort}
          handleDownload={handleDownload}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loading}
          usePagination={false}
          useInfiniteScroll={true}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadMoreThreshold={20}
          tableScrolled={{ y: 525, x: 800 }}
          onRefresh={handleRefresh}
          showRefresh={true}
        />
      </CardContainer>

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={openModalHistory}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      {/* Modal Approve / Reject */}
      <Modal
        open={modalApproval}
        title={
          chooseId?.approvalType === "INACTIVE_PAY_COLLECTION_TEMPLATE"
            ? "Approval - Inactivate Request"
            : chooseId?.approvalType === "ACTIVATED_PAY_COLLECTION_TEMPLATE"
              ? "Approval - Activate Request"
              : "Approval - Collection Template"
        }
        onCancel={handleCloseApproval}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <p className="mb-4 text-gray-600">
            {chooseId?.approvalType === "INACTIVE_PAY_COLLECTION_TEMPLATE"
              ? `Process the inactivate request for template "${chooseId?.templateCode || ""}"`
              : chooseId?.approvalType === "ACTIVATED_PAY_COLLECTION_TEMPLATE"
                ? `Process the activate request for template "${chooseId?.templateCode || ""}"`
                : `Process the approval for template "${chooseId?.templateCode || ""}"`}
          </p>
          <Form.Item
            name="remark"
            label="Remark"
            rules={[{ required: true, message: "Please enter a remark" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter remark" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <ButtonComponent type="default" onClick={handleCloseApproval}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              danger
              onClick={() => handleSubmitApproval("REJECT")}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent onClick={() => handleSubmitApproval("APPROVE")}>
              Approve
            </ButtonComponent>
          </div>
        </Form>
      </Modal>

      {/* Modal Error */}
      <ModalError
        isOpen={modalError}
        handleOk={handleCloseModalError}
        handleCancel={handleCloseModalError}
        customText={"Close"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{bodyError.message}</p>
        </div>
      </ModalError>

      {/* Modal Inactivate/Activate */}
      <ModalInactivateWithHierarchy
        selector={"collectionTemplate"}
        dispatch={dispatch}
        getAPIOption={getAvailableApproval}
        getAPIDetail={getSelectedApproval}
        alertMessage={`Are you sure you want to ${
          normalizeStatus(chooseInactiveId?.status) === "INACTIVE"
            ? "activate"
            : "inactivate"
        } this Collection Template with code ${
          chooseInactiveId?.templateCode || ""
        }?`}
        openModalInactivate={modalInactive}
        handleCloseModalInactivate={handleCancelInactive}
        onFinish={handleOkInactive}
      />

      {/* Inline Detail Section */}
      {selectedId && (
        <div ref={detailRef} className="mt-4">
          <DetailCollectionTemplate
            data={data_detail}
            loading={loading}
            onCreateDetail={true}
          />
        </div>
      )}

      {/* Bulk Approval Modal */}
      <ModalBulkApprovalTemplate
        open={bulkApprovalOpen}
        onClose={() => setBulkApprovalOpen(false)}
        waitingData={waitingApprovalData}
        dispatch={dispatch}
        onRefresh={handleRefresh}
        onError={(message) => {
          setBodyError({ message });
          setModalError(true);
        }}
      />
    </>
  );
};

export default ListCollectionTemplate;
