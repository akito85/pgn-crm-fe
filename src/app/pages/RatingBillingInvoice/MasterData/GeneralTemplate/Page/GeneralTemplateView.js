import React, { useRef, useState, useEffect, useMemo } from "react";
import { Checkbox, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../../../assets/Icon/index";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import GeneralTemplateTableView from "../Table/GeneralTemplateTableView";
import { Link, NavLink } from "react-router-dom";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import {
  activationGeneralTemplate,
  getAllGeneralTemplatePaginate,
  getApprovalHistoryGeneralTemplate,
  getApprovalList,
  getApprovalListDetail,
  getDownloadGeneralTemplateList,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import TableRBI from "../../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../../components/CardContainer";
import { clearBodyMessage } from "../../../../../../redux/slices/general_slice";

const GeneralTemplateView = () => {
  // Selector
  const { data_list, data_approval_history, loading } = useSelector(
    (state) => state.general_template
  );
  const { bodyError: bodyErrorGeneral } = useSelector(
    (state) => state?.general
  );

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["statusApproval", "action"],
  }));

  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [dataInactivate, setDataInactivate] = useState({});

  //modal
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [modalInactivate, setModalInactivate] = useState(false);

  //try again
  const [bodyError, setBodyError] = useState({});
  const [modalError, setModalError] = useState(false);

  //useEffect
  useEffect(() => {
    dispatch(
      getAllGeneralTemplatePaginate({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, sort, search]);

  // trigger modal try again from general slice
  useEffect(() => {
    if (bodyErrorGeneral?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyErrorGeneral]);

  //approval history
  useEffect(() => {
    if (data_approval_history && data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_approval_history?.dataApprover?.GENERAL_TEMPLATE || [],
          inactive:
            data_approval_history?.dataApprover?.INACTIVE_GENERAL_TEMPLATE ||
            [],
        },
        dataHistory: {
          create: data_approval_history?.dataHistory?.GENERAL_TEMPLATE || [],
          inactive:
            data_approval_history?.dataHistory?.INACTIVE_GENERAL_TEMPLATE || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  const handleDownload = () => {
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
      getDownloadGeneralTemplateList({
        search: tempSearch,
        page,
        pageSize,
        sort,
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleRetry = () => {
    if (bodyError?.value) {
      onFinishInactive(bodyError.value);
    }
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
    dispatch(clearBodyMessage());
  };

  //handle approval history section
  const handleApprovalHistory = (r) => {
    dispatch(getApprovalHistoryGeneralTemplate({ id: r?.templateId }));
    setOpenModalHistory(true);
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOpenModalInactivate = (value) => {
    setDataInactivate(value);
    setModalInactivate(true);
  };

  const handleCloseModalInactivate = () => {
    setDataInactivate({});
    setModalInactivate(false);
  };

  const onFinishInactive = (e) => {
    const body = {
      templateId: dataInactivate?.templateId,
      description: e.remark,
      apphierId: e.tappId ? e.tappId : e.approvalHierarchy,
    };

    dispatch(activationGeneralTemplate(body))
      .unwrap()
      .then(async (data) => {
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
          getAllGeneralTemplatePaginate({
            page,
            pageSize,
            sort,
            search: tempSearch,
          })
        );
        setModalInactivate(false);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  // routes
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
      path: "",
      breadcrumbName: "General Template",
    },
  ];

  // Grant Access Item
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
        <NavLink to={RBI_ROUTES.GENEREAL_TEMPLATE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create General Template
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
            to={RBI_ROUTES.GENEREAL_TEMPLATE_DETAIL}
            state={{
              id: record.templateId,
            }}
          >
            <Tooltip title="Detail">
              <div>
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
              <div>
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
            to={RBI_ROUTES.GENEREAL_TEMPLATE_UPDATE}
            state={{
              id: record.templateId,
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
                  onClick={() => handleOpenModalInactivate(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleOpenModalInactivate(record)}
            >
              <span className="text-black ml-5">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div>
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleOpenModalInactivate(record)}
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
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div>
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

  // Get base columns from GeneralTemplateTableView
  const baseColumns = useMemo(() => {
    return GeneralTemplateTableView(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );
  }, [search, page, pageSize, searchedColumn, searchText]);

  const actionCols = useColumnActionPermission(
    ["view", "activate", "update", "history"],
    itemGrantAccess
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">GENERAL TEMPLATE LIST</p>
              <div className="flex gap-[20px]">
                <Toolbar items={itemGrantAccess} />
              </div>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              dataSource={data_list?.result || []}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data_list?.page?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        {ModalHistory ? (
          <ModalHistory
            isOpen={openModalHistory && dataApprovalHistory}
            handleClose={() => setOpenModalHistory(false)}
            header={"Approval History"}
            width={1000}
            tabOptions={handleOptions()}
            dataApprover={dataApprovalHistory?.dataApprover}
            dataHistory={dataApprovalHistory?.dataHistory}
          />
        ) : null}

        {/** Modal Retry */}
        {modalError ? (
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
              <p className="pl-[70px]">
                {bodyError?.message ||
                  bodyErrorGeneral?.response?.data?.message?.toString()}
              </p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}

        {modalInactivate ? (
          <ModalInactivateWithHierarchy
            dispatch={dispatch}
            getAPIOption={getApprovalList}
            getAPIDetail={getApprovalListDetail}
            alertMessage={`Are you sure you want to inactivate General Template with name ${
              dataInactivate?.templateName || ""
            }?`}
            openModalInactivate={modalInactivate}
            handleCloseModalInactivate={handleCloseModalInactivate}
            onFinish={onFinishInactive}
            selector="general_template"
          />
        ) : null}
      </Spin>
    </LayoutMenu>
  );
};

export default GeneralTemplateView;
