import { DownOutlined, MoreOutlined, UpOutlined } from "@ant-design/icons";
import { Checkbox, Popover, Space, Spin, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import StatusComponent from "../../../../../components/StatusComponent";
import TablePagination from "../../../../../components/TablePagination";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../utils";
import {
  approveOrRejectBankAccount,
  approveOrRejectInactiveBankAccount,
  getAccountInformationPaging,
  getApprovalHistoryBankAccount,
  getDetailAccountInformation,
  getListApprovalById,
  getAllApprovalList,
  inactiveBankAccount,
  getAccountCriteriaView,
  getListCriteria,
  getParentAccountOptions,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import FunctionalTableCriteriaPayment from "./Table/FunctionalTableCriteriaPayment";
import FunctionalTableCategoryInformation from "./Table/FunctionalTableCategoryInformation";
import FunctionalTableVAAccount from "./Table/FunctionalTableVAAccount";
import FunctionalTableVATransaction from "./Table/FunctionalTableVATransaction";
import FunctionalTableOPAccount from "./Table/FunctionalTableOPAccount";
import FunctionalTableOPTransaction from "./Table/FunctionalTableOPTransaction";
import FunctionalTableOPCustom from "./Table/FunctionalTableOPCustom";
import CriteriaViewTable from "./Table/CriteriaViewTable";
import RadioTabs from "../../../../../components/RadioTabs";
import { intToNPWP } from "../../../../../utils/npwp";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../utils/getColumnSearchProps";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";

const DetailBank = ({
  data_detail,
  id,
  data_job,
  data_position,
  filterData,
  dataSource,
  totalData,
  data_req,
  detailId,
  setSelectedLocationType,
  selectedLocationType,
  navigateToCreatePage = () => {},
}) => {
  const {
    data_modal,
    dataAccountInfoPaging,
    loading,
    dataApprovalHistoryBankAccount,
    data_va_category,
    data_nomenklatur1,
    data_nomenklatur2,
    data_display,
    data_billing_item,
    dataCriteriaView,
    data_select_criteria,
    data_parent_options,
  } = useSelector((state) => state.bank);
  
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageContact, setPageContact] = useState(1);
  const [pageSizeContact, setPageSizeContact] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [pageBank, setPageBank] = useState(1);
  const [pageSizeBank, setPageSizeBank] = useState(10);
  const [idVA, setIdVA] = useState();

  const [searchedColumnBank, setSearchedColumnBank] = useState("");
  const [searchTextBank, setSearchTextBank] = useState("");
  const [sortBank, setSortBank] = useState("");
  const [searchBank, setSearchBank] = useState("");
  const searchInputBank = useRef(null);

  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [remark, setRemark] = useState("");

  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [bankAccountName, setBankAccountName] = useState();
  const [idBankAccount, setIdBankAccount] = useState();
  const [statusBank, setStatusBank] = useState();

  const [listDataCategoryInfoModal, setListDataCategoryInfoModal] = useState([]);
  const [modalAccountInfoCollapsed, setModalAccountInfoCollapsed] = useState(false);
  const [modalCategoryCollapsed, setModalCategoryCollapsed] = useState(false);
  const [categoryInfoTab, setCategoryInfoTab] = useState("Nomenklatur");
  const [modalCriteriaCollapsed, setModalCriteriaCollapsed] = useState(false);

  useEffect(() => {
    if (id && data_modal?.accountBankDto?.id) {
      const criteriaSelect = data_modal?.accountBankDto?.criteriaDtoList?.map(
        (item) => {
          return {
            id: item?.criteria,
            accountInformationId: item?.accountInformationId,
          };
        }
      );

      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (
        data_modal?.accountBankDto?.criteriaDataDtoList || []
      ).map((item, index) => {
        return {
          id: item.id,
          startDate: item?.startDate,
          endDate: item?.endDate,
          referenceId: item.referenceId,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          customer: item.customer,
          key: index + 1,
        };
      });
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);

      const vaCatOpts = (data_va_category || []).map((c) => ({ value: c.id ?? c.Id, label: c.name ?? c.text ?? "" }));

      const billingOpts = (data_billing_item || []).map((b) => ({ value: b.id ?? b.Id, label: b.name ?? b.text ?? "" }));

      const dataCategoryList = (
        data_modal?.accountBankDto?.categoryDataDtoList || []
      ).map((item, index) => {
        const catLabel = vaCatOpts.find((o) => String(o.value) === String(item.categoryId))?.label ?? null;

        return {
          id: item.id,
          key: index + 1,
          category: item.categoryId ? { value: item.categoryId, label: catLabel } : null,
          totalDigit: item.totalDigit ? String(item.totalDigit) : "",
          staticCode: item.staticCode || "",
          nomenklatur1: item.nomenklatur1 ? { value: item.nomenklatur1, label: item.nomenklatur1 } : null,
          nomenklatur2: item.nomenklatur2 ? { value: item.nomenklatur2, label: item.nomenklatur2 } : null,
          display: item.display ? { value: item.display, label: item.display } : null,
          details: (item.billingItemIds || []).map((bid, bidIndex) => {
            const billingLabel = billingOpts.find((o) => String(o.value) === String(bid))?.label ?? String(bid);
            return { key: bidIndex + 1, billingItem: { value: bid, label: billingLabel } };
          }),
        };
      });
      setListDataCategoryInfoModal(dataCategoryList);

      // Set initial category info tab based on account category
      const accountCat = data_modal?.accountBankDto?.category;
      if (accountCat === "Online Payment") {
        setCategoryInfoTab("OP Account");
      } else if (accountCat) {
        setCategoryInfoTab("VA Account");
      } else {
        setCategoryInfoTab("Nomenklatur");
      }
    }
  }, [id, data_modal, data_va_category, data_nomenklatur1, data_nomenklatur2, data_display, data_billing_item]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
    );
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleChangeSizeBank = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeBank !== pageSizeChange ? 1 : pageChange;
    setPageBank(tempPage);
    setPageSizeBank(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  const paginationTable = (typeData = "data") => {
    let result = [...dataSource];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "jobId") {
          const data = item[searchedColumn] || 0;
          const jobName = data_job
            .filter((a) => a.id === data)
            ?.find((b) => b.name)?.name;
          return (jobName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "positionId") {
          const data = item[searchedColumn] || 0;
          const posName = data_position?.filter((a) => a?.id === data)?.[0]
            ?.name;
          return (posName || "").toLowerCase().includes(fixSearchText);
        }
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }

    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  const onSortDetail = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  useEffect(() => {
    if (
      dataApprovalHistoryBankAccount &&
      dataApprovalHistoryBankAccount?.dataApprover
    ) {
      const temp = {
        dataApprover: {
          create:
            dataApprovalHistoryBankAccount?.dataApprover?.BANK_ACCOUNT || [],
          inactive:
            dataApprovalHistoryBankAccount?.dataApprover
              ?.INACTIVE_BANK_ACCOUNT || [],
        },
        dataHistory: {
          create:
            dataApprovalHistoryBankAccount?.dataHistory?.BANK_ACCOUNT || [],
          inactive:
            dataApprovalHistoryBankAccount?.dataHistory
              ?.INACTIVE_BANK_ACCOUNT || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistoryBankAccount]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistoryBankAccount(data.id));
    setOpenModalHistory(true);
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    dispatch(getDetailAccountInformation(r));
  };
  const handleCancelInactive = () => {
    setOpenModalInactivate(false);
  };

  const handleDetailAccount = (record) => {
    setOpenModal(true);
    setIdVA(record);
    setModalAccountInfoCollapsed(false);
    setModalCategoryCollapsed(false);
    setModalCriteriaCollapsed(false);
    // initial tab is set after data loads via useEffect watching data_modal
    dispatch(getDetailAccountInformation(record));
    dispatch(getAccountCriteriaView(record));
    // getListCriteria & getParentAccountOptions dipanggil di useEffect mount,
    // tidak perlu dipanggil ulang setiap buka modal
  };

  const columnContact = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {}
  ) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      sorter: (a, b) => a.contactName?.localeCompare(b.contactName),
      ...getColumnSearchProps(
        "contactName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "JOB TITLE",
      dataIndex: "jobName",
      sorter: (a, b) => (a?.jobId || 0) - (b?.jobId || 0),
      align: "center",
      ...getColumnSearchProps(
        "jobName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "POSITION",
      dataIndex: "positionName",
      sorter: (a, b) => (a?.positionId || 0) - (b?.positionId || 0),
      align: "center",
      ...getColumnSearchProps(
        "positionName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const dataExpanded = record?.contactDetails;
    const column = [
      {
        title: "NO",
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        title: "TYPE",
        dataIndex: "typeName",
      },
      {
        title: "INPUT TYPE",
        dataIndex: "inputTypeName",
      },
      {
        title: "VALUE",
        dataIndex: "fullValue",
      },
    ];

    return (
      <div>
        <TablePagination
          useSelect={false}
          usePagination={false}
          onSort={onSort}
          dataSource={dataExpanded}
          columns={column}
        />
      </div>
    );
  };

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in searchBank) {
      if (Object.hasOwnProperty.call(searchBank, dataIndex)) {
        const tempSearchText = searchBank[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getAccountInformationPaging({
        id,
        page: pageBank,
        pageSize: pageSizeBank,
        sort: sortBank,
        search: tempSearch,
      })
    );
  }, [id, pageBank, pageSizeBank, sortBank, searchBank, dispatch]);

  // Fetch data yang hanya perlu diambil sekali saat komponen mount atau id berubah
  useEffect(() => {
    if (id) {
      dispatch(getListCriteria());
      dispatch(getParentAccountOptions(id));
    }
  }, [dispatch, id]);

  const handleSearchBank = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextBank(selectedKeys[0]);
    setSearchedColumnBank(selectedKeys[0] ? dataIndex : "");
    setSearchBank((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageBank(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const onSortBank = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSortBank(dataSort);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      id: idVA,
      appHierId: res.approvalHierarchy, 
      remark: res.remark, 
    };
    dispatch(inactiveBankAccount({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        setOpenModalInactivate(false);
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
          getAccountInformationPaging({
            id,
            page: pageBank,
            pageSize: pageSizeBank,
            sort: sortBank,
            search: tempSearch,
          })
        );
      });
  };

  const columnsBankAccount = (
    pageBank,
    pageSizeBank,
    searchInput,
    searchedColumn,
    searchText,
    handleSearchBank = () => {},
    handleDetailAccount = () => {},
    handleInactive = () => {},
    handleApprovalHistory = () => {}
  ) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) =>
        (pageBank - 1) * pageSizeBank + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      align: "left",
      width: 160,
      ...getColumnSearchPropsPaging(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "accountNumber" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: true,
      align: "left",
      width: 160,
      ...getColumnSearchPropsPaging(
        "accountName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "accountName" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      sorter: true,
      align: "center",
      width: 110,
      ...getColumnSearchPropsPaging(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "currency" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ENTITY",
      dataIndex: "entityName",
      sorter: true,
      align: "center",
      width: 100,
      ...getColumnSearchPropsPaging(
        "entityName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "entityName" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      align: "center",
      width: 120,
      ...getColumnSearchPropsPaging(
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "type" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      align: "left",
      width: 140,
      ...getColumnSearchPropsPaging(
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "category" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      width: 130,
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "startDate" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[
              searchText ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY") : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          moment(text).format(dateFormatting.dateCapital)
        ) : (
          ""
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      width: 130,
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "endDate" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[
              searchText ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY") : "",
            ]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          moment(text).format(dateFormatting.dateCapital)
        ) : (
          ""
        ),
    },
    {
      title: "PARENT",
      dataIndex: "parent",
      sorter: true,
      align: "left",
      width: 260,
      ...getColumnSearchPropsPaging(
        "parent",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "parent" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CRITERIA",
      dataIndex: "criteria",
      sorter: true,
      align: "left",
      width: 160,
      ...getColumnSearchPropsPaging(
        "criteria",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "criteria" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      align: "left",
      width: 180,
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      ellipsis: { showTitle: false },
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      sorter: true,
      align: "center",
      width: 150,
      render: (text) => text ? <StatusComponent colour={text}>{text}</StatusComponent> : "",
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "id",
      fixed: "right",
      width: 130,
      render: (id, r) => {
        return (
          <Space>
            <Popover
              content={
                <Space direction="vertical">
                  {r?.statusApproval !== "Waiting Approval" &&
                  r?.status !== "Inactive" ? (
                    <Link
                      className="w-full"
                      to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_ACCOUNT_INFORMATION}
                      state={{ id: r?.id }}
                    >
                      <ButtonComponent
                        className="gap-5 w-full"
                        icon={<SVGIcon name="IconEdit" width={14} color={"#0075BF"} />}
                        border={false}
                      >
                        <span className={"text-black gap-2 text-xs text-center w-full"}>
                          Update
                        </span>
                      </ButtonComponent>
                    </Link>
                  ) : (
                    <ButtonComponent
                      className="gap-5 w-full"
                      icon={<SVGIcon name="IconEdit" width={14} color={"#d3d3d3"} />}
                      border={false}
                      disabled={true}
                    >
                      <span className={"text-black gap-2 text-xs text-center w-full"}>
                        Update
                      </span>
                    </ButtonComponent>
                  )}
                  {
                    r?.statusApproval !== "Waiting Approval" &&
                    r?.status !== "Inactive" ? (
                      <ButtonComponent
                        border={false}
                        onClick={() => {
                          handleInactive(r?.id);
                          setBankAccountName(r?.accountName);
                          setIdVA(r?.id);
                          setStatusBank(r?.status);
                        }}
                      >
                        <div className="flex items-center gap-5">
                          <span style={{ display: "inline-flex", width: "14px", height: "14px", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Checkbox checked={r?.status === "Active" ? true : false} style={{ transform: "scale(0.75)", transformOrigin: "center" }} />
                          </span>
                          <span className={"text-black text-xs text-center"}>
                            {r?.status === "ACTIVE" ? "Inactivate" : "Activate"}
                          </span>
                        </div>
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent border={false} disabled={true}>
                        <div className="flex items-center gap-2">
                          <span style={{ display: "inline-flex", width: "14px", height: "14px", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Checkbox
                              checked={
                                r?.status === "Active" ? true : false || r?.status === "Draft" ? true : null
                              }
                              style={{ transform: "scale(0.75)", transformOrigin: "center" }}
                            />
                          </span>
                          <span className={"text-black text-xs text-center"}>
                            {r?.status === "Active" ? "Inactivate" : "Activate"}
                          </span>
                        </div>
                      </ButtonComponent>
                    )
                  }
                  <ButtonComponent
                    className="gap-5"
                    icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={14} />}
                    border={false}
                    onClick={() => handleApprovalHistory(r)}
                  >
                    <span className={"text-black text-xs text-center"}>
                      Approval History
                    </span>
                  </ButtonComponent>
                </Space>
              }
              trigger={"click"}
              placement="bottomRight"
            >
              <div className="pt-1">
                <MoreOutlined style={{ fontSize: "22px", color: "#0075BF" }} />
              </div>
            </Popover>
            <Tooltip title="Detail">
              <div
                onClick={() => {
                  handleDetailAccount(r?.id);
                  setIdVA(r?.id);
                  setOpenModal(true);
                }}
              >
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const criteriaSelect =
    data_modal?.accountBankDto?.criteriaDtoList?.map((item) => {
      return {
        id: item?.criteria,
        accountInformationId: item?.accountInformationId,
        criteriaName: item?.criteriaName,
      };
    }) || [];

  const mappingCriteria = criteriaSelect.map((a) => a.criteriaName || ""); 
  const criteria = mappingCriteria.reduce(
    (current, next) => current + (next ? `, ${next}` : ""),
    ""
  );

  const showButtonApproval = data_modal?.tApprovalDto?.isApprover;

  const handleConfirmApprove = async (res, handleClear) => {
    if (data_modal?.tApprovalDto?.approvalType === "INACTIVE_BANK_ACCOUNT") {
      const data = {
        id: data_modal?.accountBankDto?.id,
        remark: res.remark,
        approvalId: data_modal?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      try {
        await dispatch(approveOrRejectInactiveBankAccount({ body: data }));
        let tempSearch = "";
        for (const dataIndex in searchBank) {
          if (Object.hasOwnProperty.call(searchBank, dataIndex)) {
            const tempSearchText = searchBank[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        await dispatch(
          getAccountInformationPaging({
            id,
            page: pageBank,
            pageSize: pageSizeBank,
            sort: sortBank,
            search: tempSearch,
          })
        );
        handleClear();
        setModalConfirm(false);
      } catch (error) {}
    } else {
      const data = {
        id: data_modal?.accountBankDto?.id,
        remark: res.remark,
        approvalId: data_modal?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      try {
        await dispatch(approveOrRejectBankAccount({ body: data }));
        let tempSearch = "";
        for (const dataIndex in searchBank) {
          if (Object.hasOwnProperty.call(searchBank, dataIndex)) {
            const tempSearchText = searchBank[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        await dispatch(
          getAccountInformationPaging({
            id,
            page: pageBank,
            pageSize: pageSizeBank,
            sort: sortBank,
            search: tempSearch,
          })
        );
        handleClear();
        setModalConfirm(false);
      } catch (error) {}
    }
  };

  const handleCancelApprove = () => {
    setRemark("");
    setModalConfirm(false);
    setOpenModal(true);
  };

  // Hitung categoryTabs di luar JSX agar tidak perlu IIFE anti-pattern di render
  const accountCategory = data_modal?.accountBankDto?.category;
  const categoryTabs = !accountCategory
    ? [{ value: "Nomenklatur" }]
    : accountCategory === "Online Payment"
      ? [{ value: "OP Account" }, { value: "OP Transaction" }, { value: "OP Custom" }, { value: "Nomenklatur" }]
      : [{ value: "VA Account" }, { value: "VA Transaction" }, { value: "Nomenklatur" }];

  return (
    <div className="w-full gap-5">
      <Spin spinning={loading}>
        {data_req?.isApprover &&
        data_req?.approvalType &&
        data_req?.approvalType === "INACTIVE_BANK" ? (
          <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
            <div className="grid grid-cols-4 w-full">
              <DetailText label={"Requested Date"}>
                {data_req?.requestedDate
                  ? moment(data_req?.requestedDate).format(
                      "DD MMM YYYY HH:mm:ss"
                    )
                  : ""}
              </DetailText>
              <DetailText label={"Requested By"}>
                {data_req?.requestedBy}
              </DetailText>
              <DetailText label={"Remark"}>{data_req?.remarks}</DetailText>
            </div>
          </BaseContainer>
        ) : null}
        <BaseContainer header={"BANK DATA INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-3">
            <DetailText label="Branch Name">
              {data_detail?.branchName}
            </DetailText>
            <DetailText label="Bank Code">{data_detail?.bankCode}</DetailText>
            <DetailText label="Bank Name">{data_detail?.bankName}</DetailText>
            <DetailText label="Bank Short Name">
              {data_detail?.bankShortName}
            </DetailText>
            <DetailText label="Is Branch">
              {data_detail?.isBranch
                ? data_detail?.isBranch.charAt(0).toUpperCase() +
                  data_detail?.isBranch.slice(1).toLowerCase()
                : data_detail?.isBranch}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-5 gap-3">
            <DetailText label="Tax Identification Number (NPWP)">
              {intToNPWP(data_detail?.npwp)}
            </DetailText>
            <DetailText label="Phone Number">
              {data_detail?.phoneNumber}
            </DetailText>
            <DetailText label="E-mail">{data_detail?.email}</DetailText>
            <DetailText label="Status">{data_detail?.status}</DetailText>
            <DetailText label="Status Approval">
              {data_detail?.statusApproval}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-1">
            <DetailText label="Address">{data_detail?.address}</DetailText>
          </div>
        </BaseContainer>

        <BaseContainer header={"BANK ACCOUNT INFORMATION"}>
            <div className="w-full flex justify-end gap-5">
              <NavLink
                to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNT_INFORMATION}
                state={{ id: id }}
              >
                <ButtonComponent
                  icon={<SVGIcon name="IconButtonCreate" width={24} />}
                  type="submit"
                >
                  Create
                </ButtonComponent>
              </NavLink>
            </div>
            <div className="my-5 gap-5 rc-bank-small">
              <TablePagination
                dataSource={dataAccountInfoPaging?.result}
                pageSize={pageSizeBank}
                columns={columnsBankAccount(
                  pageBank,
                  pageSizeBank,
                  searchInputBank,
                  searchedColumnBank,
                  searchTextBank,
                  handleSearchBank,
                  handleDetailAccount,
                  handleInactive,
                  handleApprovalHistory
                )}
                current={pageBank}
                onChange={handleChangeSizeBank}
                totalData={dataAccountInfoPaging?.page?.totalElements}
                onSort={onSortBank}
                tableScrolled={{
                  x: "max-content",
                  y: 525,
                }}
              />
            </div>
          </BaseContainer>

        <BaseContainer header={"CONTACT LIST"}>
          <TablePagination
            dataSource={paginationTable("data")}
            totalData={paginationTable("lenght")}
            current={pageContact}
            pageSize={pageSizeContact}
            onChange={handleChangePage}
            columns={columnContact(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch
            )}
            onSort={onSortDetail}
            tableScrolled={{ y: 525, x: 2000 }}
            expandable={{
              expandedRowRender,
            }}
          />
        </BaseContainer>

        <ModalCustom
          isOpen={openModal}
          handleCancel={() => {
            setOpenModal(false);
          }}
          header={"BANK ACCOUNT DETAIL"}
          width={1000}
          type={"detail"}
          footer={
            showButtonApproval ? (
              <div className="w-full flex justify-end gap-5 p-4">
                <ButtonComponent
                  type="reject"
                  onClick={() => {
                    setModalConfirm(true);
                    setOpenModal(false);
                    setApproveOrReject("Reject");
                  }}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  onClick={() => {
                    setModalConfirm(true);
                    setOpenModal(false);
                    setApproveOrReject("approved");
                  }}
                >
                  Approve
                </ButtonComponent>
              </div>
            ) : (
              <div className="w-full flex justify-end p-2">
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
              </div>
            )
          }
        >
          {/* Account Information — collapsible */}
          <div className="bg-detail p-4 mb-3 rounded-md">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setModalAccountInfoCollapsed(!modalAccountInfoCollapsed)}
            >
              <div className="text-primary text-xs font-semibold uppercase">ACCOUNT INFORMATION</div>
              <div className="text-primary">
                {modalAccountInfoCollapsed ? <DownOutlined /> : <UpOutlined />}
              </div>
            </div>
            {!modalAccountInfoCollapsed && (
              <Spin spinning={loading}>
                <div className="mt-3">
                  {/* Row 1: Account Number, Account Name, Currency, Entity, Type */}
                  <div className="w-full grid grid-cols-5 gap-y-2.5 gap-x-2 py-1">
                    <DetailText label={"Account Number"}>
                      {data_modal?.accountBankDto?.accountNumber}
                    </DetailText>
                    <DetailText label={"Account Name"}>
                      {data_modal?.accountBankDto?.accountName}
                    </DetailText>
                    <DetailText label={"Currency"}>
                      {data_modal?.accountBankDto?.currency?.name}
                    </DetailText>
                    <DetailText label={"Entity"}>
                      {data_modal?.accountBankDto?.entity?.name}
                    </DetailText>
                    <DetailText label={"Type"}>
                      {data_modal?.accountBankDto?.type?.name}
                    </DetailText>
                  </div>
                  {/* Row 2: Category, Start Date, End Date, Parent, Criteria */}
                  <div className="w-full grid grid-cols-5 gap-y-2.5 gap-x-2 py-1">
                    <DetailText label={"Category"}>
                      {data_modal?.accountBankDto?.category}
                    </DetailText>
                    <DetailText label={"Start Date"}>
                      {data_modal?.accountBankDto?.startDate
                        ? moment(data_modal?.accountBankDto?.startDate).format(dateFormatting.dateCapital)
                        : ""}
                    </DetailText>
                    <DetailText label={"End Date"}>
                      {data_modal?.accountBankDto?.endDate
                        ? moment(data_modal?.accountBankDto?.endDate).format(dateFormatting.dateCapital)
                        : ""}
                    </DetailText>
                    <DetailText label={"Parent"}>
                      {(data_parent_options || []).find(
                        (p) => String(p.id) === String(data_modal?.accountBankDto?.parentId)
                      )?.label || ""}
                    </DetailText>
                    <DetailText label={"Criteria"}>
                      {(data_select_criteria || [])
                        .filter((c) =>
                          (data_modal?.accountBankDto?.criteriaDtoList || [])
                            .map((item) => String(item?.criteria))
                            .includes(String(c?.id))
                        )
                        .map((c) => c.text)
                        .join(", ")}
                    </DetailText>
                  </div>
                </div>
              </Spin>
            )}
          </div>

          <div className="w-full gap-5">
            {/* Category Information */}
            <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setModalCategoryCollapsed(!modalCategoryCollapsed)}
              >
                <div className="text-primary text-xs font-bold uppercase">CATEGORY INFORMATION</div>
                <div className="text-primary">
                  {modalCategoryCollapsed ? <DownOutlined /> : <UpOutlined />}
                </div>
              </div>
              {!modalCategoryCollapsed && (
                <div className="mt-4 rc-bank-small">
                  <RadioTabs
                    data={categoryTabs}
                    onChange={(e) => setCategoryInfoTab(e.target.value)}
                    currentPosition={categoryInfoTab}
                  />
                  <div className="mt-3">
                    {categoryInfoTab === "VA Account" && (
                      <FunctionalTableVAAccount id={idVA} />
                    )}
                    {categoryInfoTab === "VA Transaction" && (
                      <FunctionalTableVATransaction id={idVA} />
                    )}
                    {categoryInfoTab === "OP Account" && (
                      <FunctionalTableOPAccount id={idVA} />
                    )}
                    {categoryInfoTab === "OP Transaction" && (
                      <FunctionalTableOPTransaction id={idVA} />
                    )}
                    {categoryInfoTab === "OP Custom" && (
                      <FunctionalTableOPCustom id={idVA} />
                    )}
                    {categoryInfoTab === "Nomenklatur" && (
                      <FunctionalTableCategoryInformation
                        type="detail"
                        data={listDataCategoryInfoModal}
                        updateData={() => {}}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Criteria Information */}
            <div className="drop-shadow-md bg-white rounded-lg w-full mt-[30px] p-[20px]">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setModalCriteriaCollapsed(!modalCriteriaCollapsed)}
              >
                <div className="text-primary text-xs font-bold uppercase">CRITERIA INFORMATION</div>
                <div className="text-primary">
                  {modalCriteriaCollapsed ? <DownOutlined /> : <UpOutlined />}
                </div>
              </div>
              {!modalCriteriaCollapsed && (
                <div className="mt-4 rc-bank-small">
                  <CriteriaViewTable data={dataCriteriaView} loading={loading} />
                </div>
              )}
            </div>
          </div>
        </ModalCustom>

        <BaseContainer header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5">
            <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
            <DetailText label={"Created Date"}>
              {moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {data_detail?.updatedDate === null
                ? ""
                : moment(data_detail?.updatedDate).format(
                    "DD MMM YYYY HH:mm:ss"
                  )}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </div>
        </BaseContainer>
      </Spin>

      {/* Modal Approve/Reject bank Account*/}
      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancelApprove}
        onFinish={handleConfirmApprove}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Bank Account"}
        named={data_modal?.accountBankDto?.accountName}
      />

      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getAllApprovalList}
        getAPIDetail={getListApprovalById}
        selector={"bank"}
        alertMessage={`Are you sure you want to inactivate this Bank with the name ${
          bankAccountName || ""
        }?`}
        openModalInactivate={openModalInactivate}
        handleCloseModalInactivate={handleCancelInactive}
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
    </div>
  );
};

export default DetailBank;