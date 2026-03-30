import { Checkbox, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import TableRBI from "../../../../../components/TableRBI";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  downloadTaxCode,
  getApprovalHistory,
  getTaxCodePaginate,
  getListApprovalHierarchy,
  getListApprovalHierarchyDetail,
  inactiveTaxCode,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/taxCode";
import { useDispatch, useSelector } from "react-redux";
import { columnsTaxCodeList } from "./Table/TableTaxCodeList";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import CardContainer from "../../../../../components/CardContainer";

const TaxCodeView = () => {
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.tax_code
  );
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [chooseId, setChooseId] = useState();
  const [bodyError, setBodyError] = useState({});
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  const [modalError, setModalError] = useState(false);
  const [modalInactive, setModalInactive] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);

  // ✅ State untuk fix column dengan format baru { left: [], right: [] }
  const [fixedColumns, setFixedColumns] = useState(() => {
    const saved = localStorage.getItem("taxCodeFixedColumns");
    return saved
      ? JSON.parse(saved)
      : {
          left: ["no"],
          right: ["action"],
        };
  });

  // ✅ Save to localStorage when fixedColumns change
  useEffect(() => {
    localStorage.setItem("taxCodeFixedColumns", JSON.stringify(fixedColumns));
  }, [fixedColumns]);

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
      path: RBI_ROUTES.TAX_CODE_VIEW,
      breadcrumbName: "Tax Code",
    },
  ];

  useEffect(() => {
    dispatch(
      getTaxCodePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (data_approval_history) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.TAX_CODE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_TAX_CODE || [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.TAX_CODE || [],
          inactive: data_approval_history?.dataHistory?.INACTIVE_TAX_CODE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Function Change Pagination
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Function Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

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

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  const handleApprovalHistory = (e) => {
    dispatch(getApprovalHistory(e));
    setModalApprovalHistory(true);
  };

  const handleDownload = () => {
    dispatch(
      downloadTaxCode({
        search: encodeURIComponent(JSON.stringify(search)),
        page: 1,
        pageSize,
        sort,
      })
    );
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

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      taxCodeId: chooseId.taxCodeId,
      apphierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveTaxCode(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        dispatch(
          getTaxCodePaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
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
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.TAX_CODE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Tax Code
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
            to={RBI_ROUTES.TAX_CODE_DETAIL}
            state={{
              id: record?.taxCodeId,
            }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
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
          (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isEditable ? "#0075bf" : "#8D91A0"}
                  width={24}
                />
              }
              border={false}
              disabled={!isEditable}
            >
              <span
                className={`ml-3 ${
                  isEditable ? "text-black " : "text-[#8D91A0]"
                }`}
              >
                {" "}
                Update
              </span>
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
            to={RBI_ROUTES.TAX_CODE_UPDATE}
            state={{
              id: record.taxCodeId,
              status: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE");

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-5">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
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
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record.taxCodeId)}
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
                  onClick={() => handleApprovalHistory(record.taxCodeId)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  // ✅ Call useColumnActionPermission hook at component level
  const actionColumns = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess
  );

  // ✅ Get base columns with key property
  const baseColumns = useMemo(() => {
    const taxCodeCols = [
      ...columnsTaxCodeList(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ...actionColumns,
    ];

    // Add 'key' property to columns that don't have it
    const columnsWithKeys = taxCodeCols.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));

    return columnsWithKeys;
  }, [search, page, pageSize, searchedColumn, searchText, actionColumns]);

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
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold w-full">TAX CODE LIST</p>
              <Toolbar items={itemGrantAccess} />
            </div>
          }
        >
          <div className="w-full">
            <TableRBI
              dataSource={data?.result}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 2400 }}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
            />
          </div>
        </CardContainer>

        <ModalInactivateWithHierarchy
          selector={"tax_code"}
          dispatch={dispatch}
          getAPIOption={getListApprovalHierarchy}
          getAPIDetail={getListApprovalHierarchyDetail}
          alertMessage={`Are you sure you want to inactivate this Tax Code with name ${
            chooseId?.taxCodeName || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

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
            <p className="pl-[70px]">{`Your data was not inactivate. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default TaxCodeView;
