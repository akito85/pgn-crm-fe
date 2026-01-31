import {
    Spin,
    Tooltip,
    Checkbox,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
    DownloadOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import {
    renderColumn,
    renderDateColumn,
    disabledActionByStatus,
} from "../../../../../utils";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
    getApprovalHistoryCollectingAgent,
    getDownloadCollectingAgent,
    getPaginateCollectingAgent,
    getAllApprovalListCollectingAgent,
    getListApprovalByIdCollectingAgent,
    inactiveCollectingAgent,
} from "../../../../../redux/slices/receipt_collection/collectingAgent";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewCollectingAgent = () => {
    // Selector
    const { loading, data, dataApprovalHistory } = useSelector(
        (state) => state.collectingAgent
    );
    const { bodyError } = useSelector((state) => state?.general);

    // Declaration
    const dispatch = useDispatch();
    const searchInput = useRef(null);

    // State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState("");
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
    const [body, setBody] = useState({});
    const [status, setStatus] = useState("");
    const [id, setId] = useState("");
    const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");
    const [openModalInactivate, setOpenModalInactivate] = useState(false);

    const handleFetch = useCallback(() => {
        dispatch(
            getPaginateCollectingAgent({
                page,
                pageSize,
                sort,
                search: encodeURIComponent(JSON.stringify(search)),
            })
        );
    }, [dispatch, page, pageSize, search, sort]);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_COLLECTING_AGENT,
            breadcrumbName: "Collecting Agent",
        },
    ];

    const handleOptions = () => {
        const data = dataApprovalHistoryFix?.dataApprover || {};
        const keyData = Object.keys(data);
        return keyData.map((item) => ({
            value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
        }));
    };

    // Function Search Column
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
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

    useEffect(() => {
        if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
            const temp = {
                dataApprover: {
                    create: dataApprovalHistory?.dataApprover?.COLLECTING_AGENT || [],
                    inactive: dataApprovalHistory?.dataApprover?.INACTIVE_COLLECTING_AGENT || [],
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.COLLECTING_AGENT || [],
                    inactive: dataApprovalHistory?.dataHistory?.INACTIVE_COLLECTING_AGENT || [],
                },
            };
            setDataApprovalHistoryFix(temp);
        } else {
            setDataApprovalHistoryFix({});
        }
    }, [dataApprovalHistory]);

    const handleApprovalHistory = async (data) => {
        try {
            setBody(data);
            await dispatch(getApprovalHistoryCollectingAgent(data))?.unwrap();
            setOpenModalHistory(true);
        } catch (error) {
            setOpenModalHistory(false);
        }
    };

    const handleInactive = (r) => {
        setOpenModalInactivate(true);
        setId(r?.id);
        setNameModalActiveOrInactivate(
            r?.caCode + " - " + r?.name
        );
        setStatus(r?.status);
    };

    const handleCancelModalInactivate = () => {
        setOpenModalInactivate(false);
    };

    const handleSubmitModalInactivate = (res, handleClear) => {
        const body = {
            id: id,
            appHierId: res.approvalHierarchy,
            status: status === "Inactive" ? "Active" : "Inactive",
            remark: res.remark,
        };
        setBody({ body });
        dispatch(inactiveCollectingAgent({ body }))
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
                dispatch(getPaginateCollectingAgent({ search: tempSearch, page, pageSize, sort }));
            });
    };

    const columns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            isClassification: true,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "CA Code",
            dataIndex: "caCode",
            key: "caCode",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "caCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "caCode",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            title: "CA NAME",
            dataIndex: "name",
            key: "name",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "name",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "name",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            title: "START DATE",
            dataIndex: "effStartDate",
            key: "effStartDate",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "effStartDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"
            ),
            render: (text) =>
                renderDateColumn(
                    "effStartDate",
                    searchedColumn,
                    searchText,
                    text,
                    "date",
                    search
                ),
        },
        {
            title: "END DATE",
            dataIndex: "effEndDate",
            key: "effEndDate",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "effEndDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"
            ),
            render: (text) =>
                renderDateColumn(
                    "effEndDate",
                    searchedColumn,
                    searchText,
                    text,
                    "date",
                    search
                ),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "type",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "type",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            sorter: true,
            width: 100,
            fixed: "right",
            ...getColumnSearchPropsPaging(
                "status",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false
            ),
            render: (text) =>
                renderColumn(
                    "status",
                    searchedColumn,
                    searchText,
                    text,
                    false,
                    "status"
                ),
        },
        {
            title: "STATUS APPROVAL",
            dataIndex: "statusApproval",
            key: "statusApproval",
            sorter: true,
            width: 150,
            fixed: "right",
            ...getColumnSearchPropsPaging(
                "statusApproval",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false
            ),
            render: (text) =>
                renderColumn(
                    "status",
                    searchedColumn,
                    searchText,
                    text,
                    false,
                    "status"
                ),
        },
    ];

    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "statusApproval", "action"],
    }));

    const onSort = (_, __, sort) => {
        const dataSort =
            sort.order !== undefined
                ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle download
    const handleDownload = () => {
        dispatch(
            getDownloadCollectingAgent({
                search: encodeURIComponent(JSON.stringify(search)),
                page,
                pageSize,
                sort,
            })
        );
    };

    const itemActions = [
        // toolbar items
        {
            action: "Download",
            render: (
                <ButtonComponent
                    onClick={handleDownload}
                    type={"submit"}
                    border={false}
                    icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
                >
                    Download List
                </ButtonComponent>
            ),
        },
        {
            action: "Create",
            render: (
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_COLLECTING_AGENT}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="submit"
                    >
                        Create Collecting Agent
                    </ButtonComponent>
                </NavLink>
            ),
        },

        // column action
        {
            action: "View",
            type: "table",
            render: (record, data_length) => {
                return (
                    <Tooltip title={"Detail"}>
                        <Link
                            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_COLLECTING_AGENT}
                            state={{ id: record?.id }}
                        >
                            {/* <SVGIcon name="IconDetail" width={24} /> */}
                            <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
                        </Link>
                    </Tooltip>
                );
            },
        },
        {
            action: "Update",
            type: "table",
            render: (record, data_length) => {
                const isEditable = record.statusApproval === "Draft" || record.statusApproval === "Rejected";

                return (
                    data_length > 3 ? (
                        <Link
                            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_COLLECTING_AGENT}
                            state={{ id: record?.id }}
                        >
                            <ButtonComponent
                                className="gap-5 w-full"
                                icon={
                                    <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                                }
                                border={false}
                                disabled={!isEditable}
                            >
                                <span
                                    className={"text-black gap-2 text-xl text-center w-full"}
                                >
                                    Update
                                </span>
                            </ButtonComponent>
                        </Link>
                    ) : (
                        <Tooltip title="Update">
                            <div
                                onClick={(e) => {
                                    if (!isEditable) e.preventDefault();
                                }}
                                className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                            >
                                {isEditable ? (
                                    <Link
                                        to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_COLLECTING_AGENT}
                                        state={{ id: record?.id }}
                                    >
                                        <SVGIcon name="IconEdit" color="#ACC424" width={24} />
                                    </Link>
                                ) : (
                                    <SVGIcon name="IconEdit" color="#8D91A0" width={24} className={"cursor-not-allowed"} />
                                )}
                            </div>
                        </Tooltip>
                    )
                );
            },
        },
        {
            action: "Activate",
            type: "table",
            render: (record, data_length) => {
                const statusLowerCase = record?.status?.toLowerCase()

                return (
                    data_length > 3 ?
                        <div className="w-full">
                            <ButtonComponent
                                border={false}
                                className={'gap-5 w-full'}
                                onClick={() => handleInactive(record)}
                                disabled={
                                    disabledActionByStatus('activate', record?.status, record?.statusApproval)
                                }
                            >
                                <Checkbox
                                    onClick={() => handleInactive(record)}
                                    checked={record?.status !== "Active"}
                                    disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                                />
                                <span
                                    className={"text-black ml-6 gap-2 text-xl text-center w-full"}
                                >
                                    {record?.status === "Active" ? "Inactivate" : "Activate"}
                                </span>
                            </ButtonComponent>
                        </div>
                        :
                        <Tooltip title={statusLowerCase === "active" || statusLowerCase === 'draft' ? "Inactivate" : "Activate"}>
                            <div >
                                <Checkbox
                                    border={false}
                                    onClick={() => handleInactive(record)}
                                    checked={record?.status !== "Active"}
                                    disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                                />
                            </div>
                        </Tooltip>
                );
            }
        },
        {
            action: "history",
            type: "table",
            render: (record, data_length) => {
                return (
                    data_length > 3 ?
                        <ButtonComponent
                            className="gap-5"
                            icon={
                                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                            }
                            border={false}
                            onClick={() => handleApprovalHistory(record?.id)}
                        >
                            <span className={"text-black gap-2 text-xl text-center"}>
                                Approval History
                            </span>
                        </ButtonComponent>
                        :
                        <Tooltip title={'Approval History'}>
                            <div border={false}
                                onClick={() => handleApprovalHistory(record?.id)}
                            >
                                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
                            </div>
                        </Tooltip>
                );
            },
        },
    ];

    // handle retry modal error
    const handleRetry = () => {
        try {
            handleCancelTryAgain();
            if (bodyError?.action === "INACTIVE_COLLECTING_AGENT") {
                dispatch(inactiveCollectingAgent(body));
            } else if (bodyError?.action === "GET_APPROVAL_HISTORY_COLLECTING_AGENT") {
                dispatch(getApprovalHistoryCollectingAgent(body));
            } else if (bodyError?.action === "DOWNLOAD_COLLECTING_AGENT") {
                handleDownload();
            }
            handleFetch();
        } catch (error) {
            handleFetch();
        }
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                {/* <Toolbar items={itemActions} /> */}
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] font-bold">COLLECTING AGENT LIST</p>
                        <div className="flex gap-2">
                            <Toolbar items={itemActions} />
                        </div>
                    </div>
                }>
                    <TableRBI
                        showExport={true}
                        handleDownload={handleDownload}
                        dataSource={data?.result}
                        pageSize={pageSize}
                        columns={[
                            ...columns,
                            ...useColumnActionPermission(
                                ["view", "history", "update", 'activate'],
                                itemActions
                            ),
                        ]}
                        current={page}
                        onChange={handleChange}
                        onSizeChanger={handleChange}
                        totalData={data?.page?.totalElements}
                        onSort={onSort}
                        tableScrolled={{
                            x: "max-content",
                            y: 525,
                        }}
                        fixedColumns={fixedColumns}
                        setFixedColumns={setFixedColumns}
                    />

                </CardContainer>

                <ModalActiveInactive
                    dispatch={dispatch}
                    getAPIOption={getAllApprovalListCollectingAgent}
                    getAPIDetail={getListApprovalByIdCollectingAgent}
                    selector={"collectingAgent"}
                    alertMessage={`Are you sure you want to inactivate this Collecting Agent with CA Code ${nameModalActiveOrInactivate}?`}
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
            {/* modal try again */}
            {renderModal()}
        </LayoutMenu>
    );
};

export default ViewCollectingAgent;
