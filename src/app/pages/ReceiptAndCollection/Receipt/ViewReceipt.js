import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin, Tooltip, Alert } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import {
  getApprovalHistory,
  getDownloadReceipt,
  getPaginateReceipt,
  deleteReceipt,
} from "../../../../redux/slices/receipt_collection/receipt";
import { columnsReceipt } from "./ColumnReceiptView";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import { Link, NavLink } from "react-router-dom";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import ModalHoldReceipt from "./Table/ModalHoldReceipt";
import ModalRefundReceipt from "./Table/ModalRefundReceipt";
import ModalReleaseReceipt from "./Table/ModalReleaseReceipt";
import { DownloadOutlined, WarningOutlined } from "@ant-design/icons";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { hasValue } from "../../../../utils";

const ViewReceipt = () => {
  // Selector
  const { loading, data, data_detail } = useSelector((state) => state.receipt);
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result?.map((item) => ({
    ...item,
    key: item.id,
  }));

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [openModalApproval, setOpenModalApproval] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [recordSelected, setRecordSelected] = useState({});
  const [body, setBody] = useState();
  const [openModalHold, setOpenModalHold] = useState(false);
  const [openModalRefund, setOpenModalRefund] = useState(false);
  const [openModalRelease, setOpenModalRelease] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  // Handle row selection (Removed as per user request)
  // const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  //   setSelectedData(newSelectedRows);
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  const handleHold = (record) => {
    if (record) {
      setSelectedData([record]);
      setOpenModalHold(true);
    }
  };

  const handleSubmitHold = (data) => {
    console.log("Submit Hold Data:", data);
    // Here you would dispatch an action to save the hold status
    // dispatch(holdReceipt(data))...
    setOpenModalHold(false);
    setSelectedRowKeys([]);
    setSelectedData([]);
    handleFetch(); // Refresh list
  };

  const handleRefund = () => {
    setOpenModalRefund(true);
  };

  const handleSubmitRefund = (data) => {
    console.log("Submit Refund Data:", data);
    setOpenModalRefund(false);
    // dispatch action...
  };

  const handleRelease = () => {
    setOpenModalRelease(true);
  };

  const handleSubmitRelease = (data) => {
    console.log("Submit Release Data:", data);
    setOpenModalRelease(false);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Receipt",
    },
  ];

  // Use Effect
  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateReceipt({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      let changeSelectedKeys;
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }

      if (hasValue(selectedKeys[0]) && (dataIndex === 'isMisc' || dataIndex === 'isReconciled')) {
        if (selectedKeys[0]?.toLowerCase() === 'true') {
          changeSelectedKeys = [true];
        } else if (selectedKeys[0]?.toLowerCase() === 'false') {
          changeSelectedKeys = [false]
        } else {
          changeSelectedKeys = selectedKeys[0]
        }
      } else {
        changeSelectedKeys = selectedKeys
      }
      return {
        ...prevState,
        [dataIndex]: changeSelectedKeys[0],
      };
    });
  };

  console.log(search);
  // handle change page
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // handle sort
  const onSort = (_, __, sort) => {
    let column = "";
    switch (sort?.field) {
      case "unAppliedAmount":
        column = "unAppliedAmountReal";
        break;
      case "appliedAmount":
        column = "appliedAmountReal";
        break;
      case "equivalentUnAppliedAmount":
        column = "equivalentUnAppliedAmountReal";
        break;
      case "equivalentAmount":
        column = "equivalentAmountReal";
        break;
      case "rateAmount":
        column = "rateAmountReal";
        break;
      case "equivalentAppliedAmount":
        column = "equivalentAppliedAmountReal";
        break;
      case "refundAmount":
        column = "refundAmountReal";
        break;
      case "transferAmount":
        column = "transferAmountReal";
        break;
      default:
        column = sort?.field;
        break;
    }
    const dataSort =
      sort.order !== undefined
        ? `${column}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle open modal approval
  const handleModalApprovalHistory = async (id) => {
    try {
      setBody(id);
      await dispatch(getApprovalHistory(id))?.unwrap();
      setOpenModalApproval(true);
    } catch (error) {
      setOpenModalApproval(false);

    }
  };

  // handle delete receipt
  const handleDeleteReceipt = (record) => {
    setOpenModalDelete(true);
    setRecordSelected(record);
  };

  const handleConfirmModalDelete = () => {
    const { id, appHierId, ...keys } = recordSelected;
    dispatch(deleteReceipt({ id: id, appHierId: appHierId }));
    const searchRequest = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getPaginateReceipt({ search: searchRequest, sort, page, pageSize })
    );
    setOpenModalDelete(false);
    setRecordSelected({});
  };

  // handle close modal
  const handleCloseModalError = () => {
    setOpenModalDelete(false);
    // setBodyError({});
  };

  const handleDownload = () => {
    dispatch(
      getDownloadReceipt({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Release",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconSend" color={"#ffffff"} width={24} />}
          type="submit"
          onClick={handleRelease}
          disabled={false}
        >
          Release
        </ButtonComponent>
      ),
    },
    {
      action: "Hold",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconHold" color={"#ffffff"} width={24} />}
          type="submit"
          onClick={handleHold}
        >
          Hold
        </ButtonComponent>
      ),
    },
    {
      action: "Refund",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRefund" color={"#ffffff"} width={22} />}
          type="submit"
          onClick={handleRefund}
          disabled={false}
        >
          Refund
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_RECEIPT}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (r, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
              state={{ id: r?.id }}
            >
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
              {/* <ButtonComponent
                className="gap-5"
                icon={<SVGIcon name="IconDetail" width={24} />}
                border={false}
              > */}
              {/* <span className={"text-black gap-2 text-xl text-center"}>
                  Detail
                </span> */}
              {/* </ButtonComponent> */}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (r, data_length) => {
        return (
          <Tooltip title={"Update"}>
            <Link
            // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
            // state={{ id: id }}
            >
              <ButtonComponent
                className="gap-5"
                icon={<SVGIcon name="IconEdit" color={"#808080"} width={24} />}
                border={false}
                disabled={true}
              >
                <span className={"text-black gap-2 text-xl text-center"}>
                  Update
                </span>
              </ButtonComponent>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Transfer",
      type: "table",
      render: (r, data_length) => {
        return (
          <Tooltip title={"Transfer"}>
            <ButtonComponent
              className="gap-5"
              icon={
                <SVGIcon name="IconTransfer" color={"#808080"} width={24} />
              }
              border={false}
              disabled={true}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Transfer
              </span>
            </ButtonComponent>
          </Tooltip>
        );
      },
    },
    {
      action: "Reverse",
      type: "table",
      render: (r, data_length) => {

        return (
          <Tooltip title={"Reverse"}>
            <ButtonComponent
              className="gap-5"
              icon={<SVGIcon name="IconRevers" color={"#808080"} width={24} />}
              border={false}
              disabled={true}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Reverse
              </span>
            </ButtonComponent>
          </Tooltip>
        );
      },
    },
    {
      action: "Refund",
      type: "table",
      render: (r, data_length) => {

        return (
          <Tooltip title={"Refund"}>
            <ButtonComponent
              className="gap-5"
              icon={<SVGIcon name="IconRefund" color={"#808080"} width={24} />}
              border={false}
              disabled={true}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Refund
              </span>
            </ButtonComponent>
          </Tooltip>
        );
      },
    },
    {
      action: "Hold",
      type: "table",
      render: (r, data_length) => {

        return (
          <Tooltip title={"Hold"}>
            <ButtonComponent
              className="gap-5"
              icon={<SVGIcon name="IconHold" color={"#808080"} width={24} />}
              border={false}
              disabled={false}
              onClick={() => handleHold(r)}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Hold
              </span>
            </ButtonComponent>
          </Tooltip>
        );
      },
    },
    {
      action: "Release",
      type: "table",
      render: (r, data_length) => {
        return (
          <Tooltip title={"Release"}>
            <Link
            // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT}
            // state={{ id: id }}
            >
              <ButtonComponent
                className="gap-5"
                icon={<SVGIcon name="IconSend" color={"#808080"} width={24} />}
                border={false}
                disabled={true}
              >
                <span className={"text-black gap-2 text-xl text-center"}>
                  Release
                </span>
              </ButtonComponent>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => {
        return (
          <ButtonComponent
            className="gap-5"
            icon={
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            }
            border={false}
            onClick={() => handleModalApprovalHistory(record?.id)}
          >
            <span className={"text-black gap-2 text-xl text-center"}>
              Approval History
            </span>
          </ButtonComponent>
        );
      },
    },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "APPROVAL_HISTORY_RECEIPT") {
        dispatch(getApprovalHistory(body));
      }
      // else if (bodyError?.action === "GET_APPROVAL_BANK") {
      //   dispatch(getApprovalHistory(body));
      // }
      // else if (bodyError?.action === "DOWNLOAD_MASTER_BANK") {
      //   handleDownload();
      // }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"receipt list"}>
          <div className="w-full">
            <TablePagination
              dataSource={dataSource}
              columns={[
                ...columnsReceipt(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  handleModalApprovalHistory,
                  handleDeleteReceipt
                ),
                ...useColumnActionPermission(
                  [
                    "view",
                    "history",
                    "update",
                    "transfer",
                    "hold",
                    "release",
                    "refund",
                    "reverse",
                  ],
                  itemActions
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              totalData={data?.page?.totalElements}
              onSort={onSort}
              tableScrolled={{
                x: 12500,
                y: 2000,
              }}
            />
          </div>
        </BaseContainer>

        {/* Hold Receipt Modal */}
        <ModalHoldReceipt
          isOpen={openModalHold}
          handleCancel={() => setOpenModalHold(false)}
          selectedData={selectedData}
          dataSource={dataSource}
          onSubmit={handleSubmitHold}
        />

        {/* Refund Receipt Modal */}
        <ModalRefundReceipt
          isOpen={openModalRefund}
          handleCancel={() => setOpenModalRefund(false)}
          selectedData={selectedData}
          onSubmit={handleSubmitRefund}
        />
        <ModalReleaseReceipt
          isOpen={openModalRelease}
          handleCancel={() => setOpenModalRelease(false)}
          selectedData={selectedData}
          dataSource={dataSource}
          onSubmit={handleSubmitRelease}
        />

        {/* approval modal */}
        <ModalHistory
          isOpen={openModalApproval}
          handleClose={() => setOpenModalApproval(false)}
          header={"Approval History"}
          width={850}
          dataApprover={data_detail?.dataApprover?.MANUAL_RECEIPT}
          dataHistory={data_detail?.dataHistory?.MANUAL_RECEIPT}
        />
      </Spin>

      {/* modal delete */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={handleCloseModalError}
        handleOk={handleConfirmModalDelete}
        width={600}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            Are you sure want to delete draft ?
          </p>
        </div>
        <Alert
          message="Warning! your data will deleted permanently"
          type={"error"}
        />
      </ModalConfirm>
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewReceipt;
