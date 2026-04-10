import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tooltip, Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { MoreOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DocViewer from "react-doc-viewer";
import ReactDOM from "react-dom";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import ApprovalPointOfSales from "./Modal/ApprovalPointOfSales";
import PosDetail from "./PosDetail";
import PosTableView from "./Table/PosTableView";
import ModalCustomerType from "./Modal/ModalCustomerType";
import {
  deletePOS,
  downloadPOS,
  getApprovalHistory,
  getListPointOfSales,
  generateProformaInvoice,
  getCustomerType,
} from "../../../../redux/slices/rating_billing_invoice/PointOfSales";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";

const PosPage = () => {
  // Selector
  const { data_view, data_approvalHistory, loading, data_customer_type } =
    useSelector((state) => state.pointOfSales);

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

  // State loading lokal untuk list POS
  const [tableLoading, setTableLoading] = useState(false);

  const handlePreviewInvoice = async (record) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE +
          `/v1/dbs/api/pos/download-latest/${record.posNumber}`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        },
      );

      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];

      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });

      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = `Invoice Preview - ${record.posNumber}`;
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);

        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer,
        );
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to preview invoice";

      setBodyError({ message });
      setModalError(true);
    }
  };

  const handleProformaInvoice = async (record) => {
    try {
      const response = await axios.get(
        configApp.RATING_BILLING_SERVICE +
          `/v1/dbs/api/pos/download-latest-proforma/${record.posNumber}`,
        {
          headers: tokenHeader(),
          responseType: "arraybuffer",
        },
      );

      const responseBlob = await response.data;
      const blobText =
        responseBlob instanceof Blob ? await responseBlob.text() : responseBlob;
      const contentType = response.headers["content-type"];

      const blob = new Blob([blobText], {
        type: contentType ? "application/pdf" : "application/rtf",
      });

      const blobUrl = URL.createObjectURL(blob);
      const newTab = window.open(blobUrl, "_blank");

      if (newTab) {
        newTab.document.title = `Invoice Preview - ${record.posNumber}`;

        // TAMBAHAN: Gunakan DocViewer seperti di ViewInvoice.js
        const viewerContainer = document.createElement("div");
        newTab.document.body.appendChild(viewerContainer);

        ReactDOM.render(
          <DocViewer documents={[{ uri: blobUrl, type: contentType }]} />,
          viewerContainer,
        );
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to preview invoice";

      setBodyError({ message });
      setModalError(true);
    }
  };

  const handleGenerateProforma = async (record) => {
    try {
      await dispatch(generateProformaInvoice(record.posNumber)).unwrap();
      // Refresh data setelah generate
      setTableLoading(true);
      dispatch(
        getListPointOfSales({
          page: 0,
          pageSize: 100,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
          isLoadMore: false,
        }),
      ).finally(() => {
        setTableLoading(false);
      });
      setPage(0);
    } catch (error) {
      console.error("Error generating proforma invoice:", error);
    }
  };

  useEffect(() => {
    dispatch(getCustomerType());
  }, [dispatch]);

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
    setTableLoading(true);
    dispatch(
      getListPointOfSales({
        page: 0,
        pageSize: 100, // Initial load 100 data
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        isLoadMore: false, // Flag untuk initial load
      }),
    ).finally(() => {
      setTableLoading(false);
    });
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
        setDataDelete(undefined);
        setTableLoading(true);
        dispatch(
          getListPointOfSales({
            page: 0,
            pageSize: 100,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
            isLoadMore: false,
          }),
        ).finally(() => {
          setTableLoading(false);
        });
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

  const handleCloseDeleteModal = () => {
    setModalDelete(false);
    setDataDelete(undefined);
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
    setTableLoading(true);
    dispatch(
      getListPointOfSales({
        page: 0,
        pageSize: 100,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
        isLoadMore: false,
      }),
    ).finally(() => {
      setTableLoading(false);
    });
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
      action: "Update",
      type: "table",
      width: 40,
      render: (record) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const isApproved = record.statusApproval === "APPROVED";

        const isDelete =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED";

        const customerTypeForNav =
          record.customerType === 2 ? "prospective" : "customer";

        const menuItems = [
          {
            key: "update",
            label: isEditable ? (
              <Link
                to={RBI_ROUTES.POS_UPDATE}
                state={{
                  id: record.id,
                  idPos: record.posNumber,
                  customerType: customerTypeForNav,
                }}
              >
                Update
              </Link>
            ) : (
              <span className="text-[#8D91A0]">Update</span>
            ),
            icon: (
              <SVGIcon
                name="IconEdit"
                color={isEditable ? "#0075BF" : "#8D91A0"}
                width={16}
              />
            ),
            disabled: !isEditable,
          },
          {
            key: "delete",
            label: "Delete",
            icon: (
              <SVGIcon
                name="IconDelete"
                width={16}
                color={isDelete ? "#D90000" : "#8D91A0"}
              />
            ),
            disabled: !isDelete,
            onClick: () => {
              if (isDelete) handleDelete(record);
            },
          },
          {
            key: "download-proforma",
            label: "Download Proforma",
            icon: (
              <SVGIcon
                name="IconDownload"
                width={16}
                color={isApproved ? "#0075BF" : "#8D91A0"}
              />
            ),
            disabled: !isApproved,
            onClick: () => {
              if (isApproved) handleProformaInvoice(record);
            },
          },
          {
            key: "generate-proforma",
            label: "Generate Proforma",
            icon: (
              <SVGIcon
                name="IconReGenerate"
                width={16}
                color={isApproved ? "#0075BF" : "#8D91A0"}
              />
            ),
            disabled: !isApproved,
            onClick: () => {
              if (isApproved) handleGenerateProforma(record);
            },
          },
          {
            key: "approval-history",
            label: "Approval History",
            icon: <SVGIcon name="IconLogHistory" width={16} color="#0075BF" />,
            onClick: () => handleApprovalHistory(record),
          },
        ];

        return (
          <Tooltip title="Aksi Lainnya">
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="cursor-pointer">
                <MoreOutlined style={{ fontSize: 20, color: "#0075BF" }} />
              </div>
            </Dropdown>
          </Tooltip>
        );
      },
    },
    {
      action: "View",
      type: "table",
      width: 40,
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div
              className="pt-0 cursor-pointer"
              onClick={() => handleOpenDetail(record)}
            >
              <SVGIcon name="IconDetail" color="#0075BF" width={20} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
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
            loading={loading || tableLoading}
            columns={[
              ...PosTableView(
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
              ),
              ...useColumnActionPermission(
                ["view", "update"],
                itemGrantAccess,
                "View",
              ),
            ]}
            totalData={data_view?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 2000 }}
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
      <ModalApproveOrReject
        isOpen={modalDelete}
        handleCloseModal={handleCloseDeleteModal}
        onFinish={() => deletePos(dataDelete)}
        header={"Delete Point Of Sales"}
        approveOrReject={"delete"}
        menu={"Point Of Sales"}
        named={dataDelete?.posNumber || "-"}
        customMessage={
          "Warning! if you delete this data, it will be permanently."
        }
        width={700}
      />

      {/* Modal Customer Type */}
      <ModalCustomerType
        isOpen={modalCustomerType}
        onCancel={handleCancelCustomerType}
        onConfirm={handleConfirmCustomerType}
        selectedType={selectedCustomerType}
        setSelectedType={setSelectedCustomerType}
        customerTypes={data_customer_type}
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
    </>
  );
};

export default PosPage;
