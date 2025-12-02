import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Spin, Tooltip } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import ApprovalPointOfSales from "./Modal/ApprovalPointOfSales";
import PosDetail from "./PosDetail";
import PosTableView from "./Table/PosTableView";
import {
  deletePOS,
  downloadPOS,
  getApprovalHistory,
  getListPointOfSales,
} from "../../../../redux/slices/rating_billing_invoice/PointOfSales";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const PosPage = () => {
  // Selector
  const { data_view, data_approvalHistory, loading } = useSelector(
    (state) => state.pointOfSales
  );

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const dataSource = data_view?.result;

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [openApproval, setOpenAproval] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  const [openDetail, setOpenDetail] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);

  const [dataDelete, setDataDelete] = useState();
  const [modalDelete, setModalDelete] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalError, setModalError] = useState(false);

  //useEffect
  useEffect(() => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";

    dispatch(
      getListPointOfSales({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, sort, search]);

  const handleDownload = () => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadPOS({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  };

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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleOpenDetail = (value) => {
    setDataDetail(value);
    setOpenDetail(true);
  };

  const handleDelete = (value) => {
    setDataDelete(value);
    setModalDelete(true);
  };

  const deletePos = (value) => {
    dispatch(deletePOS(value?.id))
      .unwrap()
      .then(() => {
        setModalDelete(false);
        // let tempSearch = "";
        // for (const dataIndex in search) {
        //   if (Object.hasOwnProperty.call(search, dataIndex)) {
        //     const tempSearchText = search[dataIndex];
        //     if (tempSearchText) {
        //       tempSearch += `${dataIndex}~${tempSearchText},`;
        //     }
        //   }
        // }
        // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";

        dispatch(
          getListPointOfSales({
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setBodyError({ message, value: value });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => {
    deletePos(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleApprovalHistory = (r) => {
    //code
    dispatch(getApprovalHistory(r?.id));
    setOpenModalHistory(true);
  };

  useEffect(() => {
    if (
      data_approvalHistory &&
      data_approvalHistory.dataApprover &&
      data_approvalHistory.dataHistory
    ) {
      const temp = {
        dataApprover: data_approvalHistory?.dataApprover?.POS || [],
        dataHistory: data_approvalHistory?.dataHistory?.POS || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approvalHistory]);

  const handleCancel = () => {
    setOpenAproval(false);
  };

  // routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: "",
      breadcrumbName: "Point of Sales",
    },
  ];

  const handleApproveReject = () => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";

    dispatch(
      getListPointOfSales({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  };

  const itemGrantAccess = [
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
      action: "Upload",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={24} />}
          type={"submit"}
          border={false}
          disabled={false}
        >
          Upload
        </ButtonComponent>
      ),
    },
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={
            <SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={24} />
          }
          type={"submit"}
          border={false}
          onClick={() => setOpenAproval(true)}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <Link to={RBI_ROUTES.POS_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create Point Of Sales
          </ButtonComponent>
        </Link>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        const content =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconDetail" width={24} />}
              border={false}
              onClick={() => handleOpenDetail(record)}
            >
              <span className={"text-black ml-3"}> Detail</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleOpenDetail(record)}
                />
              </div>
            </Tooltip>
          );

        return content;
      },
    },
    {
      action: "Preview",
      type: "table",
      render: (record, data) => {
        const isAvailable = record.statusApproval === "APPROVED";
        const content =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEye" color={"#0075bf"} width={24} />}
              border={false}
              disabled={!isAvailable}
            >
              <span className={"text-black ml-3"}>Preview Invoice</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconEye" width={24} />
              </div>
            </Tooltip>
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
            to={RBI_ROUTES.POS_UPDATE}
            state={{
              id: record.id,
              idPos: record.posNumber,
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
            <SVGIcon
                name="IconDelete"
                width={24}
                color={isDelete ? "#D90000" : "#8D91A0"}
                className={isDelete ? undefined : "disabled cursor-not-allowed"}
                onClick={isDelete ? () => handleDelete(record) : undefined}
              />
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
              onClick={() => handleApprovalHistory(record)}
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

        <div className={"w-full flex justify-end gap-2"}>
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"point of sales list"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={[
                ...PosTableView(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search,
                  // handleApprovalHistory,
                  // handleOpenDetail,
                  // handleDelete
                ),
                ...useColumnActionPermission(
                  ["view", "update", "delete", "preview", "history"],
                  itemGrantAccess,
                  "Delete"
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data_view?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 18000 }}
            />
          </div>
        </BaseContainer>

        {openDetail === true ? (
          <div className="mb-5">
            <PosDetail id={dataDetail} dispatch={dispatch} />
          </div>
        ) : null}

        <ApprovalPointOfSales
          isOpen={openApproval}
          handleCancel={() => {
            handleCancel();
          }}
          handleApproveReject={handleApproveReject}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistory}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/* Modal Delete */}
        <ModalConfirm
          isOpen={modalDelete}
          handleCancel={() => setModalDelete(false)}
          handleOk={() => deletePos(dataDelete)}
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

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not deleted. ${bodyError?.message}`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default PosPage;
