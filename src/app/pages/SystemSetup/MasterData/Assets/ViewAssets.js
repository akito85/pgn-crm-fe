import React, { useCallback } from 'react';
import { Alert, Checkbox, Form, Spin, Tooltip } from 'antd';
import BreadCrumb from '../../../../../components/BreadCrumb';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { DownloadOutlined, InfoCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import BaseContainer from '../../../../../components/BaseContainer';
import TablePagination from '../../../../../components/TablePagination';
import { SYSTEM_SETUP_ROUTES } from '../../../../../routes/system_setup/setup_routes';
import { useDispatch, useSelector } from 'react-redux';
import { getColumnSearchPropsUseFilteredValue } from '../../../../../utils/getColumnSearchProps';
import SVGIcon from "../../../../../assets/Icon/index";
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { activationAssets, downloadAssets, getAssetsPaginate } from '../../../../../redux/slices/account_management/MasterData/assets_slice';
import { formMessageRequired, hasValue, renderColumn, renderDateColumn } from '../../../../../utils';
import InputComponent from '../../../../../components/InputComponent';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import { useColumnActionPermission } from '../../../../../components/ColumnActionPermission';
import Toolbar from '../../../../../components/Toolbar';
import { useTryAgainHooks } from '../../../../../utils/useTryAgainHooks';

const ViewAssets = () => {
    const { loading, data } = useSelector(state => state.assets);
    const { bodyError } = useSelector((state) => state?.general);

    const dispatch = useDispatch();
    // Use State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const searchInput = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [typeStatus, setTypeStatus] = useState('');
    const [assetId, setAssetId] = useState(null);
    const [serialNumber, setSerialNumber] = useState(null);
    const [form] = Form.useForm();
    const { remark } = form.getFieldsValue();


    const handleFetch = useCallback(() => {
        dispatch(getAssetsPaginate({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }))
    }, [dispatch, page, pageSize, search, sort]);


    // use effect
    useEffect(() => {
        handleFetch()
    }, [handleFetch]);


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
    const handleActiveOrInactive = (record) => {
        setOpenModal(true);
        setTypeStatus(record?.status);
        setAssetId(record?.id);
        setSerialNumber(record?.serialNumber?.toUpperCase())
    };

    const handleCancel = () => {
        form.resetFields();
        setOpenModal(false);
    }
    const handleSaveActivation = async (formValue) => {
        setOpenModal(false);
        const body = {
            ...formValue,
            id: assetId
        }
        await dispatch(activationAssets(body))?.unwrap();
        const searchRequest = encodeURIComponent(JSON.stringify(search));
        await dispatch(getAssetsPaginate({ page, pageSize, sort, search: searchRequest })).unwrap();
        form.resetFields();
    };

    const handleChange = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // columns
    const columns = (
        page = 1,
        pageSize = 10,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch = () => { },
        handleActiveOrInactive = () => { }
    ) => {
        return [
            {
                title: "NO",
                width: 60,
                align: "center",
                render: (text, object, index) => (page - 1) * pageSize + index + 1,
            },
            {
                title: "PRODUCT NAME",
                dataIndex: "productName",
                sorter: true,
                width: 280,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "productName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('productName', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "SERVICE TYPE",
                dataIndex: "serviceType",
                sorter: true,
                width: 200,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "serviceType",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('serviceType', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "ASSET NAME",
                dataIndex: "assetName",
                sorter: true,
                width: 200,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "assetName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('assetName', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "ASSET TYPE",
                dataIndex: "type",
                sorter: true,
                width: 200,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "type",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('type', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "SERIAL NUMBER",
                dataIndex: "serialNumber",
                sorter: true,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "serialNumber",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('serialNumber', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "BRAND",
                dataIndex: "brand",
                sorter: true,
                width: 220,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "brand",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('brand', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "YEAR",
                dataIndex: "year",
                sorter: true,
                width: 150,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "year",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    'year_only'
                ),
                render: (text) => renderDateColumn('year', hasValue(search['year']), searchText, text?.toString(), 'year', search)
            },
            {
                title: "CUSTODY TRANSFER",
                dataIndex: "custodyTransfer",
                sorter: true,
                width: 220,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "custodyTransfer",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('custodyTransfer', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "INLET DIAMETER",
                dataIndex: "inletDiameter",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "inletDiameter",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('inletDiameter', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "OUTLET DIAMETER",
                dataIndex: "outletDiameter",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "outletDiameter",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('outletDiameter', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MINIMUM INLET PRESSURE",
                dataIndex: "minimumInletPressure",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "minimumInletPressure",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('minimumInletPressure', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MAXIMUM INLET PRESSURE",
                dataIndex: "maximumInletPressure",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "maximumInletPressure",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('maximumInletPressure', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MINIMUM OUTLET PRESSURE",
                dataIndex: "minimumOutletPressure",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "minimumOutletPressure",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('minimumOutletPressure', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MAXIMUM OUTLET PRESSURE",
                dataIndex: "maximumOutletPressure",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "maximumOutletPressure",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('maximumOutletPressure', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MAX FLOW CAPACITY PER STREAM",
                dataIndex: "maxFlowCapacityPerStream",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "maxFlowCapacityPerStream",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('maxFlowCapacityPerStream', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "STREAM AMOUNT",
                dataIndex: "streamAmount",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "streamAmount",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('streamAmount', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "G SIZE",
                dataIndex: "gsize",
                sorter: true,
                width: 160,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "gsize",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('gsize', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "SETTING PRESSURE",
                dataIndex: "settingPressure",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "settingPressure",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('settingPressure', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "LENGTH",
                dataIndex: "length",
                sorter: true,
                align: 'right',
                width: 160,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "length",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('length', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "BOLT HOLE AMOUNT",
                dataIndex: "boltHoleAmount",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "boltHoleAmount",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('boltHoleAmount', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MINIMUM CAPACITY",
                dataIndex: "minimumCapacity",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "minimumCapacity",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('minimumCapacity', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "MAXIMUM CAPACITY",
                dataIndex: "maximumCapacity",
                sorter: true,
                align: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "maximumCapacity",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('maximumCapacity', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "CLASS/ANSI",
                dataIndex: "ansi",
                sorter: true,
                align: 'left',
                width: 180,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "ansi",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('ansi', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "LOCATION",
                dataIndex: "location",
                sorter: true,
                ellipsis: {
                    showTitle: false,
                },
                width: 340,
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "location",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('location', searchedColumn, searchText, text, true, 'input', search)
            },
            {
                title: "DESCRIPTION",
                dataIndex: "description",
                sorter: true,
                width: 320,
                ellipsis: {
                    showTitle: false,
                },
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "description",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
            },
            {
                title: "STATUS",
                dataIndex: "status",
                sorter: true,
                width: 120,
                fixed: 'right',
                ...getColumnSearchPropsUseFilteredValue(
                    search,
                    "status",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
            },
        ]
    }
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
            path: "",
            breadcrumbName: "Assets",
        },
    ];


    // on sort
    const onSort = (_, __, sort) => {
        const dataSort =
            sort.order !== undefined
                ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle confirm retry
    const handleConfirm = () => {
        if (bodyError?.action === "GET_ASSETS_PAGINATE") {
            const searchRequest = encodeURIComponent(JSON.stringify(search));
            dispatch(getAssetsPaginate({ search: searchRequest, sort, page, pageSize }))
        } else if (bodyError?.action === "DOWNLOAD_ASSETS") {
            handleDownload()
        } else {
            handleSaveActivation();
        }

    }
    // handle retry
    const handleRetry = () => {
        handleCancelTryAgain()
        handleConfirm();
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)
    // handledownload 
    const handleDownload = () => {
        const searchRequest = encodeURIComponent(JSON.stringify(search));
        dispatch(downloadAssets({ search: searchRequest, sort, page, pageSize }))
    }

    const itemActions = [
        //action toolbar
        {
            action: 'Download',
            render: (
                <ButtonComponent
                    icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
                    type="submit"
                    onClick={handleDownload}
                >
                    Download List
                </ButtonComponent>

            )
        },
        {
            action: 'Upload',
            render: (
                <NavLink to={SYSTEM_SETUP_ROUTES.UPLOAD_MASTER_ASSETS}>
                    <ButtonComponent
                        icon={<UploadOutlined style={{ fontSize: "24px" }} />}
                        type="submit"
                    >
                        Upload
                    </ButtonComponent>
                </NavLink>

            )
        },
        {
            action: 'Create',
            render: (
                <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_MASTER_ASSETS}>
                    <ButtonComponent
                        icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                        type="submit"
                    >
                        Create Asset
                    </ButtonComponent>
                </NavLink>
            )
        },

        // Column Action Table
        {
            action: "View",
            type: "table",
            render: (record, data) => {
                return (
                    <Tooltip title="Detail">
                        <div className="pt-1">
                            <Link
                                to={SYSTEM_SETUP_ROUTES.DETAIL_MASTER_ASSETS}
                                state={{ id: record.id }}
                            >
                                <SVGIcon name="IconDetail" width={24} />
                            </Link>
                        </div>
                    </Tooltip>
                )
            }
        },

        {
            action: "Update",
            type: "table",
            render: (record, data) => {
                return (
                    <Tooltip title="Update">
                        {record?.status === "ASSIGNED" ?
                            <Link>
                                <div
                                    className={"cursor-not-allowed"}>
                                    <SVGIcon name="IconEdit" width={24} color={"#C0BEC6"} className={"cursor-not-allowed"} />
                                </div>
                            </Link>
                            :
                            <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
                                <Link
                                    to={record?.status?.toLowerCase() !== "inactive" && SYSTEM_SETUP_ROUTES.UPDATE_MASTER_ASSETS}
                                    state={record?.status?.toLowerCase() !== "inactive" && { id: record?.id }}
                                >
                                    <div>
                                        <SVGIcon
                                            name="IconEdit"
                                            width={24}
                                            className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                                            color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} />
                                    </div>
                                </Link>
                            </div>
                        }
                    </Tooltip>
                )
            }
        },

        {
            action: "Activate",
            type: "table",
            render: (record, data) => {
                return (
                    <Tooltip
                        title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
                    >
                        {
                            record?.status === "ASSIGNED" ?
                                <div>
                                    <Checkbox
                                        // onClick={() => { handleActiveOrInactive(record) }}
                                        checked={record?.status !== "INACTIVE" ? true : false}
                                        disabled
                                    />
                                </div>
                                :
                                <Link>
                                    <div>
                                        <Checkbox
                                            onClick={() => { handleActiveOrInactive(record) }}
                                            checked={record?.status === "ACTIVE" ? false : true}
                                        />
                                    </div>
                                </Link>

                        }
                    </Tooltip>
                )
            }
        }

    ]

    return (
        <div>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />

                <Toolbar items={itemActions} />

                <BaseContainer header={"assets list"}>
                    <div className="w-full">
                        <TablePagination
                            dataSource={
                                data?.result
                            }
                            columns={[
                                ...columns(
                                    page,
                                    pageSize,
                                    searchInput,
                                    searchedColumn,
                                    searchText,
                                    handleSearch,
                                    handleActiveOrInactive
                                ),
                                ...useColumnActionPermission(
                                    ["Activate", "View", "Update"],
                                    itemActions
                                ),
                            ]}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChange}
                            onSizeChanger={handleChange}
                            onSort={onSort}
                            totalData={data?.page?.totalElements}
                            tableScrolled={{
                                x: 7000,
                                y: 500,
                            }}
                        />
                    </div>
                </BaseContainer>
            </Spin>
            <ModalCustom
                isOpen={openModal}
                header={`${typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"
                    } INFORMATION`}
                width={700}
                type={"confirmation"}
                handleCancel={handleCancel}
                footer={
                    <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                        <ButtonComponent
                            onClick={handleCancel}
                            type="default"
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            form="inactivateForm"
                            type="submit"
                            htmlType="submit"
                        >
                            Confirm
                        </ButtonComponent>
                    </div>
                }
            >
                <Form
                    id="inactivateForm"
                    form={form}
                    onFinish={handleSaveActivation}
                    layout='vertical'
                >
                    <div className="flex flex-col gap-6">
                        <Alert
                            message={`Are you sure want to ${typeStatus === "ACTIVE" ? "inactivate" : "activate"
                                } asset with serial number ${serialNumber}?`}
                            icon={<InfoCircleOutlined />}
                            type={"warning"}
                            showIcon
                            className="inactivate-alert"
                        />
                        <Form.Item
                            name={"remark"}
                            label={'Remark'}
                            rules={formMessageRequired("remark")}
                            className="w-full"
                        >
                            <InputComponent
                                group
                                rows={1}
                                type="textarea"
                                placeholder={"Type your remark"}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </ModalCustom>

            {/* modal retry */}
            {renderModal()}
        </div>
    );
}

export default ViewAssets;
