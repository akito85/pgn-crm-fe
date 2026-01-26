import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert, Spin, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import ApprovalPointOfSales from "./Modal/ApprovalPointOfSales";
import PosDetail from "./PosDetail";
import PosTableView from "./Table/PosTableView";
import ModalCustomerType from "./Modal/ModalCustomerType";
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
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";

const PosPage = () => {
  // Selector
  const { data_view, data_approvalHistory, loading } = useSelector(
    (state) => state.pointOfSales,
  );

  const navigate = useNavigate();
  const [modalCustomerType, setModalCustomerType] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState(null);

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const dataSource = data_view?.result;

  // Use State - PERUBAHAN: State untuk infinite scroll
  const [page, setPage] = useState(0); // Start from 0
  const [loadMoreSize] = useState(20); // Load 20 data each time
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

  const handleOpenCustomerTypeModal = () => {
    setSelectedCustomerType(null);
    setModalCustomerType(true);
  };

  const handleConfirmCustomerType = (type) => {
    setModalCustomerType(false);
    // Navigate dengan state customer type
    navigate(RBI_ROUTES.POS_CREATE, {
      state: { customerType: type },
    });
  };

  const handleCancelCustomerType = () => {
    setModalCustomerType(false);
    setSelectedCustomerType(null);
  };

  // PERUBAHAN: Initial fetch dengan 100 data
  useEffect(() => {
    dispatch(
      getListPointOfSales({
        page: 0,
        pageSize: 100, // Initial load 100 data
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        isLoadMore: false, // Flag untuk initial load
      }),
    );
    setPage(0);
  }, [dispatch, sort, search]);

  const handleDownload = () => {
    dispatch(
      downloadPOS({
        page,
        pageSize: loadMoreSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      }),
    );
  };

  // TAMBAHAN: Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data_view?.page?.totalPages || 0;

    // Check if there's more data to load
    if (nextPage < totalPages) {
      await dispatch(
        getListPointOfSales({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize, // Load 20 more
          sort,
          isLoadMore: true, // Flag untuk load more
        }),
      );
      setPage(nextPage);
    }
  };

  // TAMBAHAN: Calculate if there's more data
  const hasMore =
    (data_view?.result?.length || 0) < (data_view?.page?.totalElements || 0);

  // PERUBAHAN: Reset page ke 0 saat search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(0); // Reset to 0
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
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
        dispatch(
          getListPointOfSales({
            page: 0,
            pageSize: 100,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
            isLoadMore: false,
          }),
        );
        setPage(0);
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
    dispatch(
      getListPointOfSales({
        page: 0,
        pageSize: 100,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        isLoadMore: false,
      }),
    );
    setPage(0);
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={20} />}
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
          icon={<SVGIcon name="IconUpload" color={"#FFFFFF"} width={20} />}
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
            <SVGIcon name="IconRequestApproval" color={"#FFFFFF"} width={20} />
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
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={20} />}
          type={"submit"}
          border={false}
          onClick={handleOpenCustomerTypeModal}
        >
          Create Point Of Sales
        </ButtonComponent>
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
              icon={<SVGIcon name="IconDetail" width={20} />}
              border={false}
              onClick={() => handleOpenDetail(record)}
            >
              <span className={"text-black ml-3"}> Detail</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <div className="">
                <SVGIcon
                  name="IconDetail"
                  width={20}
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
              icon={<SVGIcon name="IconEye" color={"#0075bf"} width={20} />}
              border={false}
              disabled={!isAvailable}
            >
              <span className={"text-black ml-3"}>Preview Invoice</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Detail">
              <div className="">
                <SVGIcon name="IconEye" width={20} />
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
              icon={<SVGIcon name="IconEdit" color={"#0075bf"} width={20} />}
              border={false}
              disabled={!isEditable}
            >
              <span className={"text-black ml-3"}> Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="">
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
              <div className="">
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

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px]">point of sales list</p>
              <div className={"w-full flex justify-end gap-2"}>
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
        >
          <div className="-pt-3">
            <TableRBI
              idTable="pos-table"
              dataSource={dataSource}
              showExport={false}
              columns={[
                ...PosTableView(
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search,
                ),
                ...useColumnActionPermission(
                  ["view", "update", "delete", "preview", "history"],
                  itemGrantAccess,
                  "Delete",
                ),
              ]}
              totalData={data_view?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 8000 }}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loadMoreThreshold={20}
            />
          </div>
        </CardContainer>

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

        {/* Modal Customer Type */}
        <ModalCustomerType
          isOpen={modalCustomerType}
          onCancel={handleCancelCustomerType}
          onConfirm={handleConfirmCustomerType}
          selectedType={selectedCustomerType}
          setSelectedType={setSelectedCustomerType}
        />

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
