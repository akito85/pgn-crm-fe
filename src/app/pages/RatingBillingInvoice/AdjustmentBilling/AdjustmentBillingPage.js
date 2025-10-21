import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Spin, Alert, Tooltip } from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  deleteAdjustmentBilling,
  downloadAdjustmentBilling,
  getAdjustmentBillingPaginate,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/adjustmentBilling";
import { columnsAdjustmentBilling } from "./Table/TableAdjustmentBilling";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import { WarningOutlined } from "@ant-design/icons";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import moment from "moment";

const AdjustmentBillingPage = () => {
  // Selector
  const { data, loading, data_approval_history, message } = useSelector(
    (state) => state.adjustmentBilling,
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalDelete, setModalDelete] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [idDelete, setIdDelete] = useState();

  // Use Effect
  useEffect(() => {
    dispatch(
      getAdjustmentBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover:
          data_approval_history?.dataApprover?.ADJUSTMENT_BILLING || [],
        dataHistory:
          data_approval_history?.dataHistory?.ADJUSTMENT_BILLING || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  // Function Change Pagination
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.ADJUSTMENT_BILLING_VIEW,
      breadcrumbName: "Adjustment Billing",
    },
  ];

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadAdjustmentBilling({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  };

  // Handle Delete
  const handleDelete = (id) => {
    setModalDelete(true);
    setIdDelete(id);
  };

  // Handle Cancel Modal Confirmation Delete
  const handleCancel = () => {
    setIdDelete();
    setModalDelete(false);
  };

  // Handle Delete OK
  const handleDeleteOk = (res, handleClear) => {
    setModalDelete(false);
    dispatch(deleteAdjustmentBilling(idDelete))
      .unwrap()
      .then(() => {
        dispatch(
          getAdjustmentBillingPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          }),
        );
        handleCancel();
        handleClear();
      })
      .catch((error) => {
        if (Math.floor((error.response.status || 0) / 100) === 5) {
          setBodyError({ body: { ...res }, handleClear });
          setModalError(true);
        }
      });
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    // console.log(id);
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={24} />}
          type={"submit"}
          border={false}
          disabled={true}
        >
          Upload
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.ADJUSTMENT_BILLING_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Adjustment BIlling
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const content =
          data > 3 ? (
            <Link
              to={RBI_ROUTES.ADJUSTMENT_BILLING_DETAIL}
              state={{ id: record.id }}
            >
              <ButtonComponent
                icon={<SVGIcon name="IconDetail" width={24} />}
                border={false}
              >
                <span className={"text-black ml-3"}> Detail</span>
              </ButtonComponent>
            </Link>
          ) : (
            <Link
              to={RBI_ROUTES.ADJUSTMENT_BILLING_DETAIL}
              state={{ id: record.id }}
            >
              <Tooltip title="Detail">
                <div className="pt-1">
                  <SVGIcon name="IconDetail" width={24} />
                </div>
              </Tooltip>
            </Link>
          );

        return content;
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const content =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={"#0075bf"} width={24} />}
              border={false}
              disabled={!isEditable}
            >
              <span className={"text-black ml-3"}> Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.ADJUSTMENT_BILLING_UPDATE}
            state={{
              id: record.id,
              adjustmentNumber: record.adjustmentNumber,
            }}
          >
            {content}
          </Link>
        ) : (
          <div>{content}</div>
        );
      },
    },
    {
      action: "Delete",
      type: "table",
      render: (record) => {
        const isDelete =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        return (
          <Tooltip title="Delete">
            <div className="pt-1">
              <SVGIcon
                name="IconDelete"
                width={24}
                color={isDelete ? "#D90000" : "#8D91A0"}
                className={isDelete ? undefined : "disabled cursor-not-allowed"}
                onClick={isDelete ? () => handleDelete(record.id) : undefined}
              />
            </div>
          </Tooltip>
        );
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
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record.id)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => handleApprovalHistory(record.id)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="w-full flex justify-end gap-[20px]">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"Adjustment Billing List"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={[
                ...columnsAdjustmentBilling(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search,
                  // handleApprovalHistory,
                  // handleDelete
                ),
                ...useColumnActionPermission(
                  ["view", "update", "delete", "history"],
                  itemGrantAccess,
                  "Delete",
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 10100 }}
            />
          </div>
        </BaseContainer>

        {/* Modal Delete */}
        <ModalConfirm
          isOpen={modalDelete}
          handleCancel={() => setModalDelete(false)}
          handleOk={handleDeleteOk}
          width={500}
          useOk={true}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              {`Are you sure want to delete it?`}
            </p>
          </div>
          <Alert
            message="Warning! if you delete this data, it will be permanently."
            type={"error"}
          />
        </ModalConfirm>

        {/* Modal Error Delete */}
        <ModalError
          isOpen={modalError}
          handleOk={() => {
            handleDeleteOk(bodyError.body, bodyError.handleClear);
            setModalError(false);
            setBodyError({});
          }}
          handleCancel={() => setModalError(false)}
        >
          <div className="px-8 py-8 justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconDelete" width={48} />
              <p className="text-[18px] font-bold">Failed</p>
            </div>
            <p className="pl-[70px]">
              {`Your data was not deleted, ${message?.data?.message}. Please try again.`}
            </p>
          </div>
        </ModalError>

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default AdjustmentBillingPage;
