import { Checkbox, Spin, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { useDispatch, useSelector } from "react-redux";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import {
  downloadTOPS,
  getAllApprovalList,
  getApprovalHistoryTOP,
  getListApprovalById,
  getTopPaginate,
  inactiveTOP,
} from "../../../../../redux/slices/rating_billing_invoice/MasterData/termsofPayment";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { Link, NavLink } from "react-router-dom";

export const columnTOP = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('name', hasValue(search['name']), searchText, text, false, 'input', search),
    },
    {
      title: "TYPE",
      dataIndex: "topType",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "topType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('topType', hasValue(search['topType']), searchText, text, false, 'input', search),
    },
    {
      title: "TERMS",
      dataIndex: "topTerms",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "topTerms",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('topTerms', hasValue(search['topTerms']), searchText, text, false, 'input', search),
    },
    {
      title: "CALENDAR",
      dataIndex: "includeCalendar",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "includeCalendar",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('includeCalendar', hasValue(search['includeCalendar']), searchText, text, false, 'input', search),
    },
    {
      title: "SATURDAY",
      dataIndex: "includeSaturday",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "includeSaturday",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('includeSaturday', hasValue(search['includeSaturday']), searchText, text, false, 'input', search),
    },
    {
      title: "SUNDAY",
      dataIndex: "includeSunday",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "includeSunday",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('includeSunday', hasValue(search['includeSunday']), searchText, text, false, 'input', search),
    },
    {
      title: "CRITERIA",
      dataIndex: "criterias",
      sorter: true,
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "criterias",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('criterias', hasValue(search['criterias']), searchText, text, true, 'input', search),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital"
      ),
      render: (text) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, text, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital"
      ),
      render: (text) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, text, 'date', search),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      fixed: "right",
      width: 200,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (index) => {
        let text;
        switch (index) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return renderColumn('statusApproval', hasValue(search['statusApproval']), searchText, text, false, 'status', search)
      },
    },
  ];

const TopView = () => {
  const dispatch = useDispatch();
  const { data_list, dataApprovalHistory, loading } = useSelector((state) => state.top);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [status, setStatus] = useState("");
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [temsName, setTemsName] = useState("");
  const [topId, setTopId] = useState();

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
      path: RBI_ROUTES.TERMS_OF_PAYMENT_VIEW,
      breadcrumbName: "Terms of Payment",
    },
  ];

  // Use Effect
  useEffect(() => {
    dispatch(
      getTopPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.TERMS_OF_PAYMENT || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_TERMS_OF_PAYMENT || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.TERMS_OF_PAYMENT || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_TERMS_OF_PAYMENT || [],
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

  //handle inactive
  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setStatus(r?.status);
    setTemsName(r?.name);
    setTopId(r?.id);
  };
  //handle Approval his
  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistoryTOP(data));
    setOpenModalHistory(true);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      topId: topId,
      appHierId: res.approvalHierarchy, // Anda dapat menghapus ini jika tidak perlu
      remark: res.remark, // Anda dapat menghapus ini jika tidak perlu
      // status: status === "Inactive" ? "Active" : "Inactive",
    };
    dispatch(inactiveTOP({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
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
        dispatch(getTopPaginate({ search: tempSearch, page, pageSize, sort }));
      });
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
            dispatch(
              downloadTOPS({
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize,
                sort,
              })
            );
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.TERMS_OF_PAYMENT_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Terms of Payment
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
          <Link to={RBI_ROUTES.TERMS_OF_PAYMENT_DETAIL} state={{ id: record.id }}>
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
          record.statusApproval === "Draft" ||
          record.statusApproval === "Rejected" ||
          (record.status === "ACTIVE" && record.statusApproval === "Approved");

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={isEditable ? "#0075bf" : "#8D91A0"} width={24} />}
              border={false}
              disabled={!isEditable}
            >
              <span className={`ml-3 ${isEditable ? "text-black " : "text-[#8D91A0]"}`}> Update</span>
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
            to={RBI_ROUTES.TERMS_OF_PAYMENT_UPDATE}
            state={{
              id: record.id,
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
          (record.statusApproval === "Approved" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "Draft" && record.status === "ACTIVE") ||

          (record.statusApproval === "Rejected" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "Waiting Approval" &&
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

        <BaseContainer header={"TERMS OF PAYMENT LIST"}>
          <TablePaginationNew
            dataSource={data_list?.result}
            pageSize={pageSize}
            columns={[
              ...columnTOP(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleInactive,
                handleApprovalHistory
              ),
              ...useColumnActionPermission(
                ["view", "activate", "update", "history"],
                itemGrantAccess
              ),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_list?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{
              x: 3000,
              y: 525,
            }}
          />
        </BaseContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"top"}
          alertMessage={`Are you sure you want to inactivate this Terms of Payment with the name ${temsName || ""
            }?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default TopView;
