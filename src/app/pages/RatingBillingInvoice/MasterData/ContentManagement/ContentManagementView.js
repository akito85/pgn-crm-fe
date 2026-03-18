import React, { useEffect, useState, useRef, useMemo } from "react";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { Checkbox, Spin, Tooltip, Dropdown, Menu } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { columnsContentManagement } from "./Table/TableContentManagement";
import {
  getAllContentManagementPaginate,
  getApprovalHistory,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  inactiveContentManagement,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/contentManagement";
import TableRBI from "../../../../../components/TableRBI";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

const ContentManagementView = () => {
  // Selector
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.contentManagement
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
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [modalInactive, setModalInactive] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [chooseId, setChooseId] = useState();

  // ✅ State untuk fix column dengan format baru { left: [], right: [] }
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("contentManagementFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["NO"],
          right: ["action"],
        };
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    localStorage.setItem(
      "contentManagementFixedColumns",
      JSON.stringify(fixedColumns)
    );
  }, [fixedColumns]);

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllContentManagementPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, sort, page, pageSize, dispatch]);

  useEffect(() => {
    if (data_approval_history) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.CONTENT_TEMPLATE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_CONTENT_TEMPLATE ||
            [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.CONTENT_TEMPLATE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_CONTENT_TEMPLATE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.CONTENT_MANAGEMENT,
      breadcrumbName: "Content Management",
    },
  ];

  // Handle Search Table
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

  // Handle Change Page Table
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  // Handle Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      id: chooseId.id,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveContentManagement(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAllContentManagementPaginate({
            search: tempSearch,
            page,
            pageSize,
            sort,
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response?.data?.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  // Handle Approval History
  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  // Handle Modal Confirmation Inactive
  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  // Handle Cancel Modal Confirmation Inactive
  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  // Handle Download
  const handleDownload = () => {
    // Backend belum menyediakan endpoint download
    console.log("Download feature not yet available");
  };

  // Grant Access Item - moved outside useMemo
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
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.CONTENT_MANAGEMENT_CREATE}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Content Management
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.CONTENT_MANAGEMENT_DETAIL}
            state={{ id: record.id }}
          >
            <Tooltip title="Detail">
              <SVGIcon name="IconDetail" width={20} />
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED" ||
          (record.status === "ACTIVE" && record.statusApproval === "APPROVE");

        const linkContent = (
          <div className="flex items-center gap-2">
            <SVGIcon
              name="IconEdit"
              color={isEditable ? "#0075bf" : "#8D91A0"}
              width={20}
            />
            <span className={isEditable ? "text-black" : "text-[#8D91A0]"}>
              Update
            </span>
          </div>
        );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.CONTENT_MANAGEMENT_UPDATE}
            state={{
              id: record.id,
              status: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div className={!isEditable ? "cursor-not-allowed" : ""}>
            {linkContent}
          </div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVE" && record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE");

        return (
          <div
            className={`flex items-center gap-2 ${
              !isActivateOrInactivate ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={
              isActivateOrInactivate ? () => handleInactive(record) : undefined
            }
          >
            <Checkbox
              className="inactive-check"
              disabled={!isActivateOrInactivate}
              checked={record.status !== "ACTIVE"}
            />
            <span
              className={
                isActivateOrInactivate ? "text-black" : "text-[#8D91A0]"
              }
            >
              {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
            </span>
          </div>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleApprovalHistory(record.id)}
          >
            <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
            <span className="text-black">Approval History</span>
          </div>
        );
      },
    },
  ];

  const baseColumns = useMemo(() => {
    const contentManagementCols = [
      ...columnsContentManagement(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      // ✅ Definisikan manual action column dengan Dropdown Menu
      {
        title: "ACTION",
        key: "action",
        dataIndex: "action",
        fixed: "right",
        width: 80,
        align: "center",
        render: (_, record) => {
          // Filter hanya action dengan type "table"
          const tableActions = itemGrantAccess.filter(
            (item) => item.type === "table"
          );

          // Buat menu items untuk dropdown
          const menuItems = tableActions.map((item, idx) => ({
            key: idx,
            label: item.render(record, 5),
          }));

          const menu = <Menu items={menuItems} />;

          return (
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <MoreOutlined
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#0075bf",
                }}
              />
            </Dropdown>
          );
        },
      },
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = contentManagementCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, page, pageSize, searchedColumn, searchText]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const columns = useMemo(() => {
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

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="w-full mt-[15px] font-bold text-primary">
                CONTENT MANAGEMENT LIST
              </p>

              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className={"w-full"}>
            <TableRBI
              dataSource={dataSource}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1000 }}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
            />
          </div>
        </CardContainer>

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/* Modal Inactive */}
        <ModalInactivateWithHierarchy
          selector={"contentManagement"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchy}
          getAPIDetail={getListApprovalHierarchyDetail}
          alertMessage={`Are you sure you want to inactivate this Content Management with name ${
            chooseId?.templateName || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        {/* Modal Modal Error Inactive */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </div>
  );
};

export default ContentManagementView;
