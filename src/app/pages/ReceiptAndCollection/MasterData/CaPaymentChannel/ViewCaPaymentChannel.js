import {
    Spin,
    Tooltip,
    Checkbox,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
    EyeOutlined,
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
    getApprovalHistoryCaPaymentChannel,
    getPaginateCaPaymentChannel,
    activeInactiveCaPaymentChannel,
    getDownloadCaPaymentChannel,
    getAllApprovalListCaPaymentChannel,
    getListApprovalByIdCaPaymentChannel,
} from "../../../../../redux/slices/receipt_collection/caPaymentChannel";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewCaPaymentChannel = () => {
    // Selector
    const { loading, data, dataApprovalHistory } = useSelector(
        (state) => state.caPaymentChannel
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
    const [openModalInactivate, setOpenModalInactivate] = useState(false);
    const [status, setStatus] = useState("");
    const [id, setId] = useState("");
    const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");

    const handleFetch = useCallback(() => {
        dispatch(
            getPaginateCaPaymentChannel({
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
        breadcrumbName: "System Setup",
      },
      {
        path: "",
        breadcrumbName: "Master Data",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_CA_PAYMENT_CHANNEL,
        breadcrumbName: "Payment Channel Mapping",
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
                    create: dataApprovalHistory?.dataApprover?.CA_PAYMENT_CHANNEL || [],
                    inactivate: dataApprovalHistory?.dataApprover?.INACTIVE_CA_PAYMENT_CHANNEL || [],
                },
                dataHistory: {
                    create: dataApprovalHistory?.dataHistory?.CA_PAYMENT_CHANNEL || [],
                    inactivate: dataApprovalHistory?.dataHistory?.INACTIVE_CA_PAYMENT_CHANNEL || [],
                },
            };
            setDataApprovalHistoryFix(temp);
        } else {
        }
    }, [dataApprovalHistory]);

    const handleInactive = (record) => {
        setOpenModalInactivate(true);
        setId(record?.id);
        setNameModalActiveOrInactivate(record?.caCode);
        setStatus(record?.status);
    };

    const handleCancelModalInactivate = () => {
        setOpenModalInactivate(false);
    };

    const handleSubmitActiveInactive = (res, handleClear) => {
        const body = {
            id: id,
            appHierId: res.approvalHierarchy,
            status: status === "Inactive" ? "Active" : "Inactive",
            remark: res.remark,
        };
        dispatch(activeInactiveCaPaymentChannel({ body: body }))
            .unwrap()
            .then((res) => {
                handleClear();
                handleCancelModalInactivate();
                handleFetch();
            });
    };

    const handleApprovalHistory = async (data) => {
        try {
            setBody(data);
            await dispatch(getApprovalHistoryCaPaymentChannel(data))?.unwrap();
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
            isClassification: true,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "COLLECTION AGENT CODE",
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
            title: "PAYMENT CHANNEL CODE",
            dataIndex: "ciCode",
            key: "ciCode",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "ciCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "ciCode",
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
            title: "PARTNER CODE",
            dataIndex: "partnerCode",
            sorter: true,
            ...getColumnSearchPropsPaging(
                "partnerCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                renderColumn(
                    "partnerCode",
                    searchedColumn,
                    searchText,
                    text,
                    true,
                    "input",
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
            title: "START DATE",
            sorter: true,
            align: "center",
            dataIndex: "effStartDate",
            ...getColumnSearchPropsPaging(
                "effStartDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"
            ),
            render: (v) =>
                renderDateColumn(
                    "effStartDate",
                    searchedColumn,
                    searchText,
                    v,
                    "date",
                    search
                ),
        },
        {
            title: "END DATE",
            sorter: true,
            align: "center",
            dataIndex: "effEndDate",
            ...getColumnSearchPropsPaging(
                "effEndDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"
            ),
            render: (v) =>
                renderDateColumn(
                    "effEndDate",
                    searchedColumn,
                    searchText,
                    v,
                    "date",
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
            width: 200,
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
            getDownloadCaPaymentChannel({
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
                <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_CA_PAYMENT_CHANNEL}>
                    <ButtonComponent
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                        type="submit"
                    >
                        Create
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
                            to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_CA_PAYMENT_CHANNEL}
                            state={{ id: record?.id }}
                        >
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
                const isEditable = record.statusApproval === "Rejected";

                return (
                    data_length > 3 ? (
                        <Link
                            to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_CA_PAYMENT_CHANNEL}
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
                                        to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_CA_PAYMENT_CHANNEL}
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
                // const statusLowerCase = record?.status?.toLowerCase()

                return (
                    data_length > 3 ?
                        <div className="w-full">
                            <ButtonComponent
                                border={false}
                                className={'gap-5 w-full'}
                                onClick={() => handleInactive(record)}
                            // disabled={
                            //   disabledActionByStatus('activate', record?.status, record?.statusApproval)
                            // }
                            >
                                <Checkbox
                                    onClick={() => handleInactive(record)}
                                    checked={record?.status !== "Active"}
                                // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                                />
                                <span
                                    className={"text-black ml-6 gap-2 text-xl text-center w-full"}
                                >
                                    {record?.status === "Active" ? "Inactivate" : "Activate"}
                                </span>
                            </ButtonComponent>
                        </div>
                        :
                        <Tooltip title={record?.status === "Active" ? "Inactivate" : "Activate"}>
                            <div >
                                <Checkbox
                                    border={false}
                                    onClick={() => handleInactive(record)}
                                    checked={record?.status !== "Active"}
                                // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                                />
                            </div>
                        </Tooltip>
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
            if (bodyError?.action === "GET_APPROVAL_HISTORY_CA_PAYMENT_CHANNEL") {
                dispatch(getApprovalHistoryCaPaymentChannel(body));
            } else if (bodyError?.action === "DOWNLOAD_CA_PAYMENT_CHANNEL") {
                handleDownload();
            }
            handleFetch();
        } catch (error) {
            handleFetch();
        }
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <CardContainer header={
                    <div className="flex -my-4 justify-between items-center">
                        <p className="mt-[15px] font-bold">PAYMENT CHANNEL MAPPING LIST</p>
                        <div className="flex gap-2">
                            <Toolbar items={itemActions} />
                        </div>
                    </div>
                }>
                    <TableRBI
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
                        showExport={false}
                        handleDownload={handleDownload}
                        fixedColumns={fixedColumns}
                        setFixedColumns={setFixedColumns}
                    />
                </CardContainer>

                <ModalHistory
                    isOpen={openModalHistory && dataApprovalHistoryFix}
                    handleClose={() => setOpenModalHistory(false)}
                    header={"Approval History"}
                    width={850}
                    tabOptions={handleOptions()}
                    dataApprover={dataApprovalHistoryFix?.dataApprover}
                    dataHistory={dataApprovalHistoryFix?.dataHistory}
                />
                <ModalActiveInactive
                    dispatch={dispatch}
                    getAPIOption={getAllApprovalListCaPaymentChannel}
                    getAPIDetail={getListApprovalByIdCaPaymentChannel}
                    selector={"caPaymentChannel"}
                    alertMessage={`Are you sure you want to inactivate this Payment Channel Mapping with Ca Code ${nameModalActiveOrInactivate}?`}
                    openModalInactivate={openModalInactivate}
                    handleCloseModalInactivate={handleCancelModalInactivate}
                    onFinish={handleSubmitActiveInactive}
                />
            </Spin>
            {/* modal try again */}
            {renderModal()}
        </>
    );
};

export default ViewCaPaymentChannel;
