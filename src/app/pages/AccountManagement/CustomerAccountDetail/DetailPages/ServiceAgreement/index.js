import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Input,
  Popover,
  Checkbox,
  Tooltip,
  Space,
  DatePicker,
  Spin,
  Form,
} from "antd";
import Highlighter from "react-highlight-words";
import moment from "moment";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  DeleteOutlined,
  FilterOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import StatusComponent from "../../../../../../components/StatusComponent";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import {
  getListServiceAgreement,
  getApprovalList,
  getDetailApprovalInactive,
  inactiveSa,
  deleteDraftSa,
} from "../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import {
//   dateFormatting,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../utils";
// import ModalActivate from "./Modal/ModalActivate";
import ModalDeleteDraft from "./Modal/ModalDeleteDraft";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getApprovalHistory } from "../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import {
//   getColumnSearchPropsPaging,
  getColumnSearchPropsUseFilteredValue,
} from "../../../../../../utils/getColumnSearchProps";
// import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
// import Toolbar from "../../../../../../components/Toolbar";
// import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../ComponentAccount/ColumnActionPermissionAccount";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  RenderAction = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "SA NUMBER",
    dataIndex: "saNumber",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "saNumber",
        hasValue(search["saNumber"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA REFERENCE NUMBER",
    dataIndex: "saReference",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saReference",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "saReference",
        hasValue(search["saReference"]),
        searchText,
        text,
        false,
        "input",
        search
      ),
  },
  {
    title: "SERVICE TYPE",
    dataIndex: "saServiceType",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saServiceType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "saServiceType",
        hasValue(search["saServiceType"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "TYPE",
    dataIndex: "saType",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "saType",
        hasValue(search["saType"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "PJBG TYPE",
    dataIndex: "pjbgType",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "pjbgType",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "pjbgType",
        hasValue(search["pjbgType"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "SA DATE",
    dataIndex: "saDate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "saDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "saDate",
        hasValue(search["saDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "START DATE",
    dataIndex: "startDate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "startDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "startDate",
        hasValue(search["startDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "END DATE",
    dataIndex: "endDate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "endDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "endDate",
        hasValue(search["endDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "COMMITMENT DATE",
    dataIndex: "commitmentDate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "commitmentDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "commitmentDate",
        hasValue(search["commitmentDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "BILLING CYCLE",
    dataIndex: "billingCycle",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "billingCycle",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "billingCycle",
        hasValue(search["billingCycle"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "TERM OF PAYMENT",
    dataIndex: "termsOfPaymentName",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "termsOfPaymentName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "termsOfPaymentName",
        hasValue(search["termsOfPaymentName"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "INVOICE TEMPLATE",
    dataIndex: "invoiceTemplate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "invoiceTemplate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) =>
      renderColumn(
        "invoiceTemplate",
        hasValue(search["invoiceTemplate"]),
        searchText,
        text?.value,
        false,
        "input",
        search
      ),
  },
  {
    title: "GAS IN PLAN DATE",
    dataIndex: "gasInPlanDate",
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "gasInPlanDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "date"
    ),
    render: (text) =>
      renderDateColumn(
        "gasInPlanDate",
        hasValue(search["gasInPlanDate"]),
        searchText,
        text,
        "date",
        search
      ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    width: 130,
    fixed: "right",
    key: "status",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (index) => {
      const text = index
        ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
        : index;
      return renderColumn(
        "status",
        hasValue(search["status"]),
        searchText,
        text,
        false,
        "status",
        search
      );
    },
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "approvalStatus",
    sorter: true,
    width: 220,
    fixed: "right",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "approvalStatus",
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
      return renderColumn(
        "approvalStatus",
        hasValue(search["approvalStatus"]),
        searchText,
        text,
        false,
        "status",
        search
      );
    },
  },
  // {
  // 	title: "ACTION",
  // 	align: "center",
  // 	width: 100,
  // 	fixed: "right",
  // 	render: (v, r, i) => {
  // 		return <RenderAction status={r.status} record={r} />;
  // 	},
  // },
];

const ServiceAgreement = ({ idAccount, idCustomer, type }) => {
  const id = idAccount;
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    data,
    // data_approval_list,
    // data_approval_detail = [],
    dataApprovalHistory = {},
    loading,
  } = useSelector((state) => state.accountServiceAgreement);

  const { access_account } = useSelector((state) => state.accountManagement);

  const filteredArray = useMemo(() => {
    return {
      actionList: access_account?.actionList?.filter(
        (action) =>
          action.path.includes(
            "/account-management/account-standard/service-agreement/"
          ) &&
          !action.path.includes(
            "/account-management/account-standard/service-agreement/tos/"
          )
      ),
    };
  }, [access_account?.actionList]);

//   const navigate = useNavigate;
  // const [id, setId] = useState("");
  // State Table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Modal Inactivate
  const [formInactivate] = Form.useForm();
  const [modalActivate, setModalActivate] = useState(false);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [saId, setSaId] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");

  // Modal Delete Draft
  const [modalDeleteDraft, setModalDeleteDraft] = useState(false);

  // Modal Approval History
  // const [modalAppHistory, setModalAppHistory] = useState(false)
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  const [named, setNamed] = useState("");

  useEffect(() => {
    dispatch(
      getGrantedAccessAccount(
        "/account-management/account-standard/service-agreement"
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getApprovalList());
  }, [dispatch]);

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListServiceAgreement({ id, search: reqSearch, sort, page, pageSize })
    );
  }, [dispatch, id, page, pageSize, search, sort]);

  // Use Effect Approval History

  const handleApprovalHistory = (id) => {
    dispatch(getApprovalHistory(id));
    setOpenModalHistory(true);
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.SERVICE_AGREEMENT || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_SERVICE_AGREEMENT || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.SERVICE_AGREEMENT || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_SERVICE_AGREEMENT || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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

  // HANDLE INACTIVE
  const handleDetailApproval = (e) => {
    // dispatch(getDetailApproval(e));
  };
  const handleSaveActivate = (e, handleClear) => {
    const body = {
      appHierId: e.approvalHierarchy,
      remark: e.remark,
      saId,
    };
    dispatch(inactiveSa({ body: body, activeOrInactive: activeOrInactive }))
      .unwrap()
      .then(() => {
        // formInactivate.resetFields();
        handleClear();
        setAppHierDataDetail([]);
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListServiceAgreement({
            id,
            search: reqSearch,
            sort,
            page,
            pageSize,
          })
        );
        setModalActivate(false);
      })
      .catch(() => {
        // formInactivate.resetFields();
        handleClear();
        setAppHierDataDetail([]);
        setModalActivate(false);
      });
  };
  const handleClearInactive = () => {
    formInactivate.resetFields();
    setAppHierDataDetail([]);
    setModalActivate(false);
  };

  // Handle Delete Draft
  const handleOpenDeleteDraft = (id) => {
    setSaId(id);
    setModalDeleteDraft(true);
  };
  const handleSubmitDeleteDraft = () => {
    dispatch(deleteDraftSa(saId))
      .unwrap()
      .then(() => {
        setModalDeleteDraft(false);
        setSaId("");
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListServiceAgreement({
            id,
            search: reqSearch,
            sort,
            page,
            pageSize,
          })
        );
      })
      .catch((err) => {
        setModalDeleteDraft(false);
        console.log(err);
      });
  };
  const handleClearDeleteDraft = () => {
    setModalDeleteDraft(false);
    setSaId("");
  };

  // Render Action SA
  // const RenderAction = ({ status, record }) => {
  // 	return (
  // 		<div className={"w-full flex justify-center gap-6"}>
  // 			<Popover
  // 				content={
  // 					<Space direction="vertical">
  // 						{/* Detail */}
  // 						<Link
  // 							to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT}
  // 							state={{
  // 								idSA: record?.id,
  // 								idAccount: id,
  // 								idCustomer: idCustomer,
  // 								type: type,
  // 							}}
  // 						>
  // 							<ButtonComponent
  // 								icon={
  // 									<UnorderedListOutlined
  // 										style={{ fontSize: "24px", color: "#0075BF" }}
  // 									/>
  // 								}
  // 								border={false}
  // 							>
  // 								<span className={"text-black"}> Detail</span>
  // 							</ButtonComponent>
  // 						</Link>

  // 						{/* UPDATE */}
  // 						{record?.approvalStatus !== "WAITING APPROVAL" &&
  // 						record?.status !== "INACTIVE" ? (
  // 							<Link
  // 								to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT}
  // 								state={{
  // 									idSa: record.id,
  // 									idAccount: record.accountId,
  // 									approvalStatus: record.approvalStatus,
  // 									status: record.status,
  // 									saType: record.saType.value,
  // 									isMain: record.isMain,
  // 									saReferenceNumber: record.saReference,
  // 									idCustomer: idCustomer,
  // 									type: type,
  // 								}}
  // 							>
  // 								<ButtonComponent
  // 									icon={
  // 										<SVGIcon name="IconEdit" width={24} color={"#0075bf"} />
  // 									}
  // 									border={false}
  // 								>
  // 									<span className={"text-black"}> Update</span>
  // 								</ButtonComponent>
  // 							</Link>
  // 						) : (
  // 							<ButtonComponent
  // 								icon={
  // 									<SVGIcon name="IconEdit" width={24} color={"#8D91A0"} />
  // 								}
  // 								border={false}
  // 								disabled={true}
  // 							>
  // 								<span className={"text-black"}> Update</span>
  // 							</ButtonComponent>
  // 						)}

  // 						{/* ACTIVATE */}
  // 						{record?.status === "ACTIVE" &&
  // 						(record?.approvalStatus === "APPROVED" ||
  // 							record?.approvalStatus === "REJECTED" ||
  // 							record?.approvalStatus === "DRAFT") ? (
  // 							<ButtonComponent border={false}>
  // 								<Checkbox
  // 									onClick={() => {
  // 										setModalActivate(true);
  // 										setSaId(record?.id);
  // 										setActiveOrInactive(
  // 											record?.status === "ACTIVE" ? "Inactivate" : "Activate"
  // 										);
  // 										setNamed(record.saNumber)
  // 									}}
  // 									checked={record?.status === "ACTIVE" ? false : true}
  // 								>
  // 									<span className={"text-black text-[18px]"}>
  // 										{status == "INACTIVE" ? "Activate" : "Inactivate"}
  // 									</span>
  // 								</Checkbox>
  // 							</ButtonComponent>
  // 						) : (
  // 							<ButtonComponent border={false} disabled={true}>
  // 								<Checkbox
  // 									checked={record?.status === "ACTIVE" ? true : false}
  // 								>
  // 									<span className={"text-black text-[18px]"}>
  // 										{" "}
  // 										{status == "INACTIVE" ? "Activate" : "Inactivate"}
  // 									</span>
  // 								</Checkbox>
  // 							</ButtonComponent>
  // 						)}

  // 						{/* SA MAIN */}
  // 						{record?.isMain === "Y" &&
  // 						record?.status === "ACTIVE" &&
  // 						(record?.approvalStatus === "APPROVED" ||
  // 							record?.approvalStatus === "REJECTED") ? (
  // 							<>
  // 								{/* CREATE SA ADDON */}
  // 								<Link
  // 									to={
  // 										ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON
  // 									}
  // 									state={{
  // 										saReferenceNumber: record.saNumber,
  // 										serviceType: record.serviceType.id,
  // 										saType: record.saType.id,
  // 										pjbgType: record.pjbgType.id,
  // 										saDate: record.saDate,
  // 										billingCycle: record.billingCycle.id,
  // 										startDate: record.startDate,
  // 										endDate: record.endDate,
  // 										termOfPayment: record.termOfPayment.id,
  // 										invoiceTemplate: record.invoiceTemplate.id,
  // 										typeSa: "addon",
  // 										idAccount: id,
  // 										idCustomer: idCustomer,
  // 										type: type,
  // 										isMain: false,
  // 										productTypeId: 287,
  // 										idSa: record.id,
  // 									}}
  // 								>
  // 									<ButtonComponent
  // 										icon={
  // 											<PlusCircleOutlined
  // 												style={{ fontSize: "24px", color: "#0075BF" }}
  // 											/>
  // 										}
  // 										border={false}
  // 									>
  // 										<span className={"text-black"}> Create Add-on</span>
  // 									</ButtonComponent>
  // 								</Link>

  // 								{/* CREATE AMANDEMEN */}
  // 								<Link
  // 									to={
  // 										ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN
  // 									}
  // 									state={{
  // 										saReferenceNumber: record.saNumber,
  // 										serviceType: record.serviceType.id,
  // 										saType: record.saType.id,
  // 										pjbgType: record.pjbgType.id,
  // 										saDate: record.saDate,
  // 										billingCycle: record.billingCycle.id,
  // 										startDate: record.startDate,
  // 										endDate: record.endDate,
  // 										termOfPayment: record.termOfPayment.id,
  // 										invoiceTemplate: record.invoiceTemplate.id,
  // 										typeSa: "amandemen",
  // 										idAccount: id,
  // 										idCustomer: idCustomer,
  // 										type: type,
  // 										isMain: false,
  // 										idSa: record.id,
  // 									}}
  // 								>
  // 									<ButtonComponent
  // 										icon={
  // 											<PlusCircleOutlined
  // 												style={{ fontSize: "24px", color: "#0075BF" }}
  // 											/>
  // 										}
  // 										border={false}
  // 									>
  // 										<span className={"text-black"}> Create Amandement</span>
  // 									</ButtonComponent>
  // 								</Link>
  // 							</>
  // 						) : (
  // 							<>
  // 								<ButtonComponent
  // 									icon={
  // 										<PlusCircleOutlined
  // 											style={{ fontSize: "24px", color: "#8D91A0" }}
  // 										/>
  // 									}
  // 									border={false}
  // 									disabled={true}
  // 								>
  // 									<span className={"text-black"}> Create Addon</span>
  // 								</ButtonComponent>
  // 								<ButtonComponent
  // 									icon={
  // 										<PlusCircleOutlined
  // 											style={{ fontSize: "24px", color: "#8D91A0" }}
  // 										/>
  // 									}
  // 									border={false}
  // 									disabled={true}
  // 								>
  // 									<span className={"text-black"}> Create Amandemen</span>
  // 								</ButtonComponent>
  // 							</>
  // 						)}

  // 						{/* APPROVAL HISTORY */}
  // 						{/* {(record?.status !== "ACITVE" || record?.status !== "DRAFT") &&
  // 						record?.approvalStatus !== "DRAFT" ? ( */}
  // 							<ButtonComponent
  // 								onClick={() => handleApprovalHistory(record.id)}
  // 								icon={
  // 									<SVGIcon
  // 										name="IconLogHistory"
  // 										color={"#0075bf"}
  // 										width={24}
  // 									/>
  // 								}
  // 								border={false}
  // 							>
  // 								<span className={"text-black"}> Approval History</span>
  // 							</ButtonComponent>
  // 						{/* ) : (
  // 							<ButtonComponent
  // 								icon={
  // 									<SVGIcon
  // 										name="IconLogHistory"
  // 										color={"#8D91A0"}
  // 										width={24}
  // 									/>
  // 								}
  // 								border={false}
  // 								disabled={true}
  // 							>
  // 								<span className={"text-black"}> Approval History</span>
  // 							</ButtonComponent>
  // 						)} */}
  // 					</Space>
  // 				}
  // 				trigger={"click"}
  // 				placement="bottomRight"
  // 			>
  // 				{/* Button Three Dot */}
  // 				<div className="pt-1">
  // 					<MoreOutlined style={{ fontSize: "24px", color: "#0075BF" }} />
  // 				</div>
  // 			</Popover>

  // 			{/* DELETE */}
  // 			<Tooltip
  // 				title={
  // 					record?.status === "DRAFT" &&
  // 					(record?.approvalStatus === "DRAFT" ||
  // 						record?.approvalStatus === "REJECTED")
  // 						? "Delete"
  // 						: ""
  // 				}
  // 			>
  // 				<div className="pt-1">
  // 					<div
  // 						className={
  // 							record?.status === "DRAFT" &&
  // 							(record?.approvalStatus === "DRAFT" ||
  // 								record?.approvalStatus === "REJECTED")
  // 								? undefined
  // 								: "cursor-not-allowed"
  // 						}
  // 					>
  // 						<SVGIcon
  // 							name="IconDelete"
  // 							width={24}
  // 							color={
  // 								record?.status === "DRAFT" &&
  // 								(record?.approvalStatus === "DRAFT" ||
  // 									record?.approvalStatus === "REJECTED")
  // 									? "#be3036"
  // 									: "#c2cad2"
  // 							}
  // 							className={
  // 								record?.status === "DRAFT" &&
  // 								(record?.approvalStatus === "DRAFT" ||
  // 									record?.approvalStatus === "REJECTED")
  // 									? undefined
  // 									: "disabled"
  // 							}
  // 							onClick={
  // 								record?.status === "DRAFT" &&
  // 								(record?.approvalStatus === "DRAFT" ||
  // 									record?.approvalStatus === "REJECTED")
  // 									? () => handleOpenDeleteDraft(record?.id)
  // 									: undefined
  // 							}
  // 						/>
  // 					</div>
  // 				</div>
  // 			</Tooltip>
  // 		</div>
  // 	);
  // };

  function capitalizeWords(str) {
    // Memisahkan kata-kata dalam string
    let words = str.toLowerCase().split(" ");

    // Mengonversi setiap kata menjadi kapitalized (huruf pertama besar)
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    // Menggabungkan kembali kata-kata dan mengembalikan hasilnya
    return words.join(" ");
  }

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleCancelModalInactivate = () => {
    setModalActivate(false);
  };

  const itemActions = useMemo(
    () => [
      //action toolbar
      {
        action: "Create",
        render: (
          <NavLink
            to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_MAIN}
            state={{
              idAccount: id,
              idCustomer: idCustomer,
              type: type,
              isMain: true,
              typeSa: "main",
              productTypeId: 245,
            }}
          >
            <ButtonComponent
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
              type="submit"
            >
              Create Service Agreement
            </ButtonComponent>
          </NavLink>
        ),
      },

      //action table
      {
        action: "Delete",
        type: "table",
        render: (record) => {
          return (
            <Tooltip
              title={
                record?.status === "DRAFT" &&
                (record?.approvalStatus === "DRAFT" ||
                  record?.approvalStatus === "REJECTED")
                  ? "Delete"
                  : ""
              }
            >
              <div className="pt-1">
                <div
                  className={
                    record?.status === "DRAFT" &&
                    (record?.approvalStatus === "DRAFT" ||
                      record?.approvalStatus === "REJECTED")
                      ? undefined
                      : "cursor-not-allowed"
                  }
                >
                  <SVGIcon
                    name="IconDelete"
                    width={24}
                    color={
                      record?.status === "DRAFT" &&
                      (record?.approvalStatus === "DRAFT" ||
                        record?.approvalStatus === "REJECTED")
                        ? "#be3036"
                        : "#c2cad2"
                    }
                    className={
                      record?.status === "DRAFT" &&
                      (record?.approvalStatus === "DRAFT" ||
                        record?.approvalStatus === "REJECTED")
                        ? undefined
                        : "disabled"
                    }
                    onClick={
                      record?.status === "DRAFT" &&
                      (record?.approvalStatus === "DRAFT" ||
                        record?.approvalStatus === "REJECTED")
                        ? () => handleOpenDeleteDraft(record?.id)
                        : undefined
                    }
                  />
                </div>
              </div>
            </Tooltip>
          );
        },
      },
      {
        action: "View",
        type: "table",
        render: (record, data) => {
          const renderAction =
            data > 3 ? (
              <ButtonComponent
                icon={
                  <UnorderedListOutlined
                    style={{ fontSize: "24px", color: "#0075BF" }}
                  />
                }
                border={false}
              >
                <span className={"text-black"}> Detail</span>
              </ButtonComponent>
            ) : (
              <Tooltip title="Detail">
                <div className="">
                  <SVGIcon name="IconDetail" width={24} />
                </div>
              </Tooltip>
            );
          return (
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT}
              state={{
                idSA: record?.id,
                idAccount: id,
                idCustomer: idCustomer,
                type: type,
              }}
            >
              {renderAction}
            </Link>
          );
        },
      },
      {
        action: "Create",
        type: "table",
        render: (record, data) => {
          const isCreate =
            record?.isMain === "Y" &&
            record?.status === "ACTIVE" &&
            (record?.approvalStatus === "APPROVED" ||
              record?.approvalStatus === "REJECTED");
          const renderAction =
            data > 3 ? (
              isCreate ? (
                <>
                  {/* CREATE SA ADDON */}
                  <Link
                    to={
                      ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON
                    }
                    state={{
                      saReferenceNumber: record.saNumber,
                      serviceType: record.serviceType.id,
                      saType: record.saType.id,
                      pjbgType: record.pjbgType.id,
                      saDate: record.saDate,
                      billingCycle: record.billingCycle.id,
                      startDate: record.startDate,
                      endDate: record.endDate,
                      termOfPayment: record.termOfPayment.id,
                      invoiceTemplate: record.invoiceTemplate.id,
                      typeSa: "addon",
                      idAccount: id,
                      idCustomer: idCustomer,
                      type: type,
                      isMain: false,
                      productTypeId: 287,
                      idSa: record.id,
                    }}
                  >
                    <ButtonComponent
                      icon={
                        <PlusCircleOutlined
                          style={{ fontSize: "24px", color: "#0075BF" }}
                        />
                      }
                      border={false}
                    >
                      <span className={"text-black"}> Create Add-on</span>
                    </ButtonComponent>
                  </Link>

                  {/* CREATE AMANDEMEN */}
                  <Link
                    to={
                      ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN
                    }
                    state={{
                      saReferenceNumber: record.saNumber,
                      serviceType: record.serviceType.id,
                      saType: record.saType.id,
                      pjbgType: record.pjbgType.id,
                      saDate: record.saDate,
                      billingCycle: record.billingCycle.id,
                      startDate: record.startDate,
                      endDate: record.endDate,
                      termOfPayment: record.termOfPayment.id,
                      invoiceTemplate: record.invoiceTemplate.id,
                      typeSa: "Amendment",
                      idAccount: id,
                      idCustomer: idCustomer,
                      type: type,
                      isMain: false,
                      idSa: record.id,
                    }}
                  >
                    <ButtonComponent
                      icon={
                        <PlusCircleOutlined
                          style={{ fontSize: "24px", color: "#0075BF" }}
                        />
                      }
                      border={false}
                    >
                      <span className={"text-black"}> Create Amendment</span>
                    </ButtonComponent>
                  </Link>
                </>
              ) : (
                <>
                  <ButtonComponent
                    icon={
                      <PlusCircleOutlined
                        style={{ fontSize: "24px", color: "#8D91A0" }}
                      />
                    }
                    border={false}
                    disabled={true}
                  >
                    <span className={"text-black"}> Create Addon</span>
                  </ButtonComponent>
                  <ButtonComponent
                    icon={
                      <PlusCircleOutlined
                        style={{ fontSize: "24px", color: "#8D91A0" }}
                      />
                    }
                    border={false}
                    disabled={true}
                  >
                    <span className={"text-black"}> Create Amendment</span>
                  </ButtonComponent>
                </>
              )
            ) : isCreate ? (
              <>
                <Tooltip title="Create Add-On">
                  <Link
                    to={
                      ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON
                    }
                    state={{
                      saReferenceNumber: record.saNumber,
                      serviceType: record.serviceType.id,
                      saType: record.saType.id,
                      pjbgType: record.pjbgType.id,
                      saDate: record.saDate,
                      billingCycle: record.billingCycle.id,
                      startDate: record.startDate,
                      endDate: record.endDate,
                      termOfPayment: record.termOfPayment.id,
                      invoiceTemplate: record.invoiceTemplate.id,
                      typeSa: "addon",
                      idAccount: id,
                      idCustomer: idCustomer,
                      type: type,
                      isMain: false,
                      productTypeId: 287,
                      idSa: record.id,
                    }}
                  >
                    <ButtonComponent
                      icon={
                        <PlusCircleOutlined
                          style={{ fontSize: "24px", color: "#bbce4b" }}
                        />
                      }
                      border={false}
                      className="!p-0"
                    ></ButtonComponent>
                  </Link>
                </Tooltip>
                <Tooltip title="Create Amendment">
                  <Link
                    to={
                      ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN
                    }
                    state={{
                      saReferenceNumber: record.saNumber,
                      serviceType: record.serviceType.id,
                      saType: record.saType.id,
                      pjbgType: record.pjbgType.id,
                      saDate: record.saDate,
                      billingCycle: record.billingCycle.id,
                      startDate: record.startDate,
                      endDate: record.endDate,
                      termOfPayment: record.termOfPayment.id,
                      invoiceTemplate: record.invoiceTemplate.id,
                      typeSa: "Amendment",
                      idAccount: id,
                      idCustomer: idCustomer,
                      type: type,
                      isMain: false,
                      idSa: record.id,
                    }}
                  >
                    <ButtonComponent
                      icon={<PlusCircleOutlined style={{ fontSize: "24px" }} />}
                      border={false}
                      className="!p-0"
                    ></ButtonComponent>
                  </Link>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Create Add-On">
                  <ButtonComponent
                    icon={
                      <PlusCircleOutlined
                        style={{ fontSize: "24px", color: "#c2cad2" }}
                      />
                    }
                    border={false}
                    className="!p-0"
                    disabled
                  ></ButtonComponent>
                </Tooltip>
                <Tooltip title="Create Amendment">
                  <ButtonComponent
                    icon={
                      <PlusCircleOutlined
                        style={{ fontSize: "24px", color: "#c2cad2" }}
                      />
                    }
                    border={false}
                    className="!p-0"
                    disabled
                  ></ButtonComponent>
                </Tooltip>
              </>
            );
          return renderAction;
        },
      },
      {
        action: "Update",
        type: "table",
        render: (record, data) => {
          const isUpdate =
            record?.approvalStatus !== "WAITING APPROVAL" &&
            record?.status !== "INACTIVE";
          const renderAction =
            data > 3 ? (
              isUpdate ? (
                <Link
                  to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT}
                  state={{
                    idSa: record.id,
                    idAccount: record.accountId,
                    approvalStatus: record.approvalStatus,
                    status: record.status,
                    saType: record.saType.value,
                    isMain: record.isMain,
                    saReferenceNumber: record.saReference,
                    idCustomer: idCustomer,
                    type: type,
                  }}
                >
                  <ButtonComponent
                    icon={
                      <SVGIcon name="IconEdit" width={24} color={"#0075bf"} />
                    }
                    border={false}
                  >
                    <span className={"text-black"}> Update</span>
                  </ButtonComponent>
                </Link>
              ) : (
                <ButtonComponent
                  icon={
                    <SVGIcon name="IconEdit" width={24} color={"#8D91A0"} />
                  }
                  border={false}
                  disabled={true}
                >
                  <span className={"text-black"}> Update</span>
                </ButtonComponent>
              )
            ) : isUpdate ? (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT}
                state={{
                  idSa: record.id,
                  idAccount: record.accountId,
                  approvalStatus: record.approvalStatus,
                  status: record.status,
                  saType: record.saType.value,
                  isMain: record.isMain,
                  saReferenceNumber: record.saReference,
                  idCustomer: idCustomer,
                  type: type,
                }}
              >
                <Tooltip title="Update">
                  <div className="pt-1">
                    <SVGIcon name="IconEdit" width={24} />
                  </div>
                </Tooltip>
              </Link>
            ) : (
              <Tooltip title="Update">
                <div className="pt-1 cursor-not-allowed">
                  <SVGIcon
                    name="IconEdit"
                    className={"disabled cursor-not-allowed"}
                    width={24}
                  />
                </div>
              </Tooltip>
            );
          return renderAction;
        },
      },
      {
        action: "Activate",
        type: "table",
        render: (record, data) => {
          const isEdit =
            record?.status === "ACTIVE" &&
            (record?.approvalStatus === "APPROVED" ||
              record?.approvalStatus === "REJECTED" ||
              record?.approvalStatus === "DRAFT");
          const renderAction =
            data > 3 ? (
              isEdit ? (
                <ButtonComponent border={false}>
                  <Checkbox
                    onClick={() => {
                      setModalActivate(true);
                      setSaId(record?.id);
                      setActiveOrInactive(
                        record?.status === "ACTIVE" ? "Inactivate" : "Activate"
                      );
                      setNamed(record.saNumber);
                    }}
                    checked={record?.status === "ACTIVE" ? false : true}
                  >
                    <span className={"text-black text-[18px]"}>
                      {record?.status == "INACTIVE" ? "Activate" : "Inactivate"}
                    </span>
                  </Checkbox>
                </ButtonComponent>
              ) : (
                <ButtonComponent border={false} disabled={true}>
                  <Checkbox
                    checked={record?.status === "ACTIVE" ? true : false}
                  >
                    <span className={"text-black text-[18px]"}>
                      {record?.status == "INACTIVE" ? "Activate" : "Inactivate"}
                    </span>
                  </Checkbox>
                </ButtonComponent>
              )
            ) : isEdit ? (
              <Tooltip
                title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
              >
                <Checkbox
                  onClick={() => {
                    setModalActivate(true);
                    setSaId(record?.id);
                    setActiveOrInactive(
                      record?.status === "ACTIVE" ? "Inactivate" : "Activate"
                    );
                    setNamed(record.saNumber);
                  }}
                  checked={record?.status === "ACTIVE" ? false : true}
                ></Checkbox>
              </Tooltip>
            ) : (
              <Tooltip
                title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
              >
                <Checkbox
                  checked={record?.status === "INACTIVE" ? true : false}
                ></Checkbox>
              </Tooltip>
            );
          return renderAction;
        },
      },
      {
        action: "History",
        type: "table",
        render: (record, data) => {
          const renderAction =
            data > 3 ? (
              <ButtonComponent
                onClick={() => handleApprovalHistory(record.id)}
                icon={
                  <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                }
                border={false}
              >
                <span className={"text-black"}> Approval History</span>
              </ButtonComponent>
            ) : (
              <Tooltip title="Approval History">
                <span onClick={() => handleApprovalHistory(record.id)}>
                  <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                </span>
              </Tooltip>
            );
          return renderAction;
        },
      },
    ],
    [handleApprovalHistory, id, idCustomer, type]
  );

  return (
    <>
      <Spin spinning={loading}>
        <BaseContainer header={"SERVICE AGREEMENT LIST"}>
          <div className="flex w-full justify-end gap-3 mb-5">
            <ToolbarAccount
              items={itemActions}
              advancedAccess={filteredArray}
            />
          </div>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data?.result?.map((item) => ({
                ...item,
                saServiceType: item?.serviceType,
                termsOfPaymentName: item?.termOfPayment,
              }))}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChangeSize}
              tableScrolled={{ y: 525, x: 5000 }}
              onSort={onSort}
              columns={[
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                ),
                ...useColumnActionPermissionAccount(
                  ["Delete", "View", "Create", "Update", "Activate", "History"],
                  itemActions,
                  filteredArray,
                  "Delete"
                ),
              ]}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* Modal Delete Draft */}
      <ModalDeleteDraft
        setModalDeleteDraft={setModalDeleteDraft}
        modalDeleteDraft={modalDeleteDraft}
        handleClearDeleteDraft={handleClearDeleteDraft}
        handleOk={handleSubmitDeleteDraft}
      />

      {/* Modal Inactivate */}

      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getApprovalList}
        getAPIDetail={getDetailApprovalInactive}
        selector="accountServiceAgreement"
        alertMessage={`Are you sure you want to inactivate Service Agreement with named ${named}?`}
        openModalInactivate={modalActivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSaveActivate}
      />
      {/* <ModalActivate
				modalActivate={modalActivate}
				setModalActivate={setModalActivate}
				handleSaveActivate={handleSaveActivate}
				formInactivate={formInactivate}
				dataApprovalList={data_approval_list}
				dataDetailApproval={data_approval_detail}
				handleDetailApproval={handleDetailApproval}
				handleClearInactive={handleClearInactive}
				appHierDataDetail={appHierDataDetail}
				setAppHierDataDetail={setAppHierDataDetail}
				activeOrInactive={activeOrInactive}
				loading={loading}
			/> */}

      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />
    </>
  );
};

export default ServiceAgreement;
