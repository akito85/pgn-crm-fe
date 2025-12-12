import {
    Spin,
    Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import {
    DownloadOutlined,
} from "@ant-design/icons";
import {
    renderColumn,
    renderDateColumn,
} from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
    getApprovalHistoryCollectingAgent,
    getDownloadCollectingAgent,
    getPaginateCollectingAgent,
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
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.COLLECTING_AGENT || [],
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

    const columns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "id",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "id",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            title: "CA CODE",
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
            title: "NAME",
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
            title: "EFFECTIVE START DATE",
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
            title: "EFFECTIVE END DATE",
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
            title: "APP HIER ID",
            dataIndex: "apphierId",
            key: "apphierId",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "apphierId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "apphierId",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
                    search
                ),
        },
        {
            title: "STATUS APPROVAL",
            dataIndex: "statusApproval",
            key: "statusApproval",
            sorter: true,
            width: 200,
            fixed: "right",
            ...getColumnSearchPropsPaging(
                "statusApproval",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
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
                            <SVGIcon name="IconDetail" width={24} />
                        </Link>
                    </Tooltip>
                );
            },
        },
        {
            action: "Update",
            type: "table",
            render: (record, data_length) => {
                const isEditable = record.statusApproval === "Rejected";

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
            if (bodyError?.action === "GET_APPROVAL_HISTORY_COLLECTING_AGENT") {
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
                <Toolbar items={itemActions} />
                <BaseContainer header={"Collecting Agent List"}>
                    <TablePagination
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
                            x: 2500,
                            y: 525,
                        }}
                    />
                </BaseContainer>

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
