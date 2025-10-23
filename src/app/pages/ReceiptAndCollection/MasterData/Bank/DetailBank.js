import { FilterOutlined, MoreOutlined } from "@ant-design/icons";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Popover,
  Space,
  Spin,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import DetailText from "../../../../../components/DetailText";
import StatusComponent from "../../../../../components/StatusComponent";
import TablePagination from "../../../../../components/TablePagination";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  dateFormat,
  dateFormatting,
  hasValue,
  requiredMessage,
} from "../../../../../utils";
import {
  approveOrRejectBankAccount,
  approveOrRejectInactiveBank,
  approveOrRejectInactiveBankAccount,
  getAccountInformationPaging,
  getAccountVApagging,
  getAllApprovalList,
  getApprovalHistoryBankAccount,
  getBankDetail,
  getBankDetailDraft,
  getDetailAccountInformation,
  getListApprovalById,
  inactiveBankAccount,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import FunctionalTableCriteriaPayment from "./Table/FunctionalTableCriteriaPayment";
import TableVA from "./TableVA";
import { intToNPWP } from "../../../../../utils/npwp";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../utils/getColumnSearchProps";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import InputComponent from "../../../../../components/InputComponent";
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
  // dataAccountInfoPaging,
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
  } = useSelector((state) => state.bank);
  const dispatch = useDispatch();
  const [page, setPage] = useState([1]);
  const [pageSize, setPageSize] = useState([10]);
  const [pageContact, setPageContact] = useState([1]);
  const [pageSizeContact, setPageSizeContact] = useState([10]);
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

  useEffect(() => {
    if (id && data_modal?.accountBankDto?.id) {
      // Data Criteria Select
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
          // type: "exist",
        };
      });
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
    }
  }, [id, data_modal]);

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

  //modla approver
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
    dispatch(getDetailAccountInformation(record));
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
      // render: (text) =>
      //   searchedColumn === "jobId" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={
      //         text
      //           ? data_job &&
      //             data_job.filter((a) => a.id === text)?.find((b) => b.name)
      //               ?.name
      //           : ""
      //       }
      //     />
      //   ) : text ? (
      //     <span>
      //       {data_job &&
      //         data_job.filter((a) => a.id === text)?.find((b) => b.name)?.name}
      //     </span>
      //   ) : (
      //     ""
      //   ),
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
      // render: (text) =>
      //   searchedColumn === "positionId" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={
      //         text
      //           ? data_position &&
      //             data_position
      //               .filter((a) => a.id === text)
      //               ?.find((b) => b.name)?.name
      //           : ""
      //       }
      //     />
      //   ) : text ? (
      //     <span>
      //       {data_position &&
      //         data_position.filter((a) => a.id === text)?.find((b) => b.name)
      //           ?.name}
      //     </span>
      //   ) : (
      //     ""
      //   ),
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
        //   render: (_, record) => {
        //     if (record.fullValue) {
        //       return <span>{record.fullValue}</span>;
        //     }
        //     if (record.type === 741) {
        //       if (record.inputType === 748) {
        //         return (
        //           <span>{`${getCountryCodeName(
        //             record?.prefix1
        //           )} ${getCountryZoneName(record?.prefix2)} - ${record.value}
        //           ${
        //             record.suffix ? "Ext " + record.suffix : ""
        //             // suffix[`${record.row}~${record.key}`] ? suffix[`${record.row}~${record.key}`] : ""
        //           }
        //           `}</span>
        //         );
        //       } else {
        //         return (
        //           <span>{`${getCountryCodeName(record?.prefix1)} - ${
        //             record.value
        //           }`}</span>
        //         );
        //       }
        //     }
        //     if (record.type === 746) {
        //       return (
        //         <span>{`${getCountryCodeName(record?.prefix1)} - ${
        //           record.value
        //         }`}</span>
        //       );
        //     }
        //     if (record.type === 747) {
        //       return (
        //         <span>{`${getCountryCodeName(record?.prefix1)} - ${
        //           record.value
        //         }`}</span>
        //       );
        //     }
        //     if (record.type === 745) {
        //       return (
        //         <span>
        //           {`${getCountryCodeName(record?.prefix1)} ${getCountryZoneName(
        //             record?.prefix2
        //           )} - ${record.value} ${
        //             record.suffix ? "Ext" + record.suffix : ""
        //           }`}
        //         </span>
        //       );
        //     } else {
        //       return <span>{record.value}</span>;
        //     }
        //   },
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

  //search
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
      appHierId: res.approvalHierarchy, // Anda dapat menghapus ini jika tidak perlu
      remark: res.remark, // Anda dapat menghapus ini jika tidak perlu
      // status: statusBank === "Inactive" ? "Active" : "Inactive",
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
      title: "BANK ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      align: "left",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "BANK ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: true,
      align: "left",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      sorter: true,
      align: "center",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ENTITY",
      dataIndex: "entityName",
      sorter: true,
      align: "center",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      align: "center",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "TOTAL DIGIT",
      dataIndex: "totalDigit",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "totalDigit",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "totalDigit" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
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
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
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
      title: "FIRST STATIC CODE",
      dataIndex: "staticCode",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsPaging(
        "staticCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        searchedColumn === "staticCode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },

    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      align: "left",
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "description" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: true,
      fixed:'right',
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        text ? (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      fixed: 'right',
      ...getColumnSearchPropsPaging(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearchBank,
        true
      ),
      render: (text) =>
        text ? (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          ""
        ),
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
                      to={
                        RECEIPT_AND_COLLECTION_ROUTES.UPDATE_ACCOUNT_INFORMATION
                      }
                      state={{ id: r?.id }}
                    >
                      <ButtonComponent
                        className="gap-5 w-full"
                        icon={
                          <SVGIcon
                            name="IconEdit"
                            width={24}
                            color={"#0075BF"}
                          />
                        }
                        border={false}
                      >
                        <span
                          className={
                            "text-black gap-2 text-xl text-center w-full"
                          }
                        >
                          Update
                        </span>
                      </ButtonComponent>
                    </Link>
                  ) : (
                    <ButtonComponent
                      className="gap-5 w-full"
                      icon={
                        <SVGIcon name="IconEdit" width={24} color={"#d3d3d3"} />
                      }
                      border={false}
                      disabled={true}
                    >
                      <span
                        className={
                          "text-black gap-2 text-xl text-center w-full"
                        }
                      >
                        Update
                      </span>
                    </ButtonComponent>
                  )}
                  {
                    // r?.status === "ACTIVE" &&
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
                        <Checkbox
                          checked={r?.status === "Active" ? true : false}
                          className="gap-7"
                        />
                        <span
                          className={"text-black gap-2 text-xl text-center"}
                        >
                          {r?.status === "ACTIVE" ? "Inactivate" : "Activate"}
                        </span>
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent border={false} disabled={true}>
                        <Checkbox
                          checked={
                            r?.status === "Active"
                              ? true
                              : false || r?.status === "Draft"
                              ? true
                              : null
                          }
                          className="gap-7"
                        />
                        <span
                          className={"text-black gap-2 text-xl text-center"}
                        >
                          {r?.status === "Active" ? "Inactivate" : "Activate"}
                        </span>
                      </ButtonComponent>
                    )
                  }
                  <ButtonComponent
                    className="gap-5"
                    icon={
                      <SVGIcon
                        name="IconLogHistory"
                        color={"#0075bf"}
                        width={24}
                      />
                    }
                    border={false}
                    onClick={() => handleApprovalHistory(r)}
                  >
                    <span className={"text-black text-xl text-center"}>
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

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "VA":
        return (
          <TableVA
            data_detail={data_detail}
            id={idVA}
            dataSource={dataSource}
          />
        );
      case "Criteria":
        return (
          <FunctionalTableCriteriaPayment
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
            updateData={setListDataCriteria}
          />
        );
      default:
        return <></>;
    }
  };

  const [tabData, setTabData] = useState([
    { value: "VA" },
    { value: "Criteria" },
  ]);

  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  const criteriaSelect =
    data_modal?.accountBankDto?.criteriaDtoList?.map((item) => {
      return {
        id: item?.criteria,
        accountInformationId: item?.accountInformationId,
        criteriaName: item?.criteriaName,
      };
    }) || [];

  const mappingCriteria = criteriaSelect.map((a) => a.criteriaName || ""); // Adding a default value for criteriaName
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
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label="Branch Name">
              {data_detail?.branchName}
            </DetailText>
            <DetailText label="Bank Code">{data_detail?.bankCode}</DetailText>
            <DetailText label="Bank Name">{data_detail?.bankName}</DetailText>
            <DetailText label="Bank Short Name">
              {data_detail?.bankShortName}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-4 gap-3">
            <DetailText label="Is Branch">
              {data_detail?.isBranch
                ? data_detail?.isBranch.charAt(0).toUpperCase() +
                  data_detail?.isBranch.slice(1).toLowerCase()
                : data_detail?.isBranch}
            </DetailText>
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

        {data_detail?.statusApproval === "Approved" ? (
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
            <div className="my-5 gap-5">
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
                  x: 3000,
                  y: 525,
                }}
              />
            </div>
          </BaseContainer>
        ) : null}

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
          header={
            segmentedPage === "Criteria"
              ? "ACCOUNT DETAIL"
              : "BANK ACCOUNT DETAIL"
          }
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
          <CardComponent header={"BANK ACCOUNT INFORMATION"}>
            <div className="w-full grid grid-cols-3">
              <DetailText label={"Bank Account Number"}>
                {data_modal?.accountBankDto?.accountNumber}
              </DetailText>
              <DetailText label={"Bank Account Name"}>
                {data_modal?.accountBankDto?.accountName}
              </DetailText>
              <DetailText label={"Branch Name"}>
                {data_modal?.accountBankDto?.branchName}
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
              <DetailText label={"Criteria"}>
                {criteria ? criteria.slice(1) : ""}
              </DetailText>
              <DetailText label={"Start Date"}>
                {moment(data_modal?.accountBankDto?.startDate).format(
                  dateFormatting.dateCapital
                )}
              </DetailText>
              <DetailText label={"End Date"}>
                {data_modal.accountBankDto?.endDate
                  ? moment(data_modal?.accountBankDto?.endDate).format(
                      dateFormatting.dateCapital
                    )
                  : ""}
              </DetailText>
              <div className="col-span-3">
                <DetailText label={"Description"}>
                  {data_modal?.accountBankDto?.description}
                </DetailText>
              </div>
              <DetailText label={"isVA"}>
                {data_modal?.accountBankDto?.isVa === true ? "True" : "False"}
              </DetailText>
              <DetailText label={"Total Digit"}>
                {data_modal?.accountBankDto?.totalDigit}
              </DetailText>
              <DetailText label={"First Static Code"}>
                {data_modal?.accountBankDto?.staticCode}
              </DetailText>
              <DetailText label={"Status"}>
                {data_modal?.accountBankDto?.status}
              </DetailText>
              <DetailText label={"Status Approval"}>
                {data_modal?.accountBankDto?.statusApproval}
              </DetailText>
            </div>
          </CardComponent>
          <CardComponent header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5">
              <DetailText label={"Record ID"}>
                {data_modal?.accountBankDto?.id}
              </DetailText>
              <DetailText label={"Created Date"}>
                {moment(data_modal?.accountBankDto?.createdDate).format(
                  "DD MMM YYYY HH:mm:ss"
                )}
              </DetailText>
              <DetailText label={"Created By"}>
                {data_modal?.accountBankDto?.createdBy}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {data_modal?.accountBankDto?.updatedDate === null
                  ? ""
                  : moment(data_modal?.accountBankDto?.updatedDate).format(
                      "DD MMM YYYY HH:mm:ss"
                    )}
              </DetailText>
              <DetailText label={"Updated By"}>
                {data_modal?.accountBankDto?.updatedBy}
              </DetailText>
            </div>
          </CardComponent>

          <div className="w-full gap-5">
            <RadioTabs data={tabData} onChange={handleSegmentedPage} />
            <div className="my-5">{renderSection(segmentedPage)}</div>
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
