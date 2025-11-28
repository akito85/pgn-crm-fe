import React, { useEffect, useRef, useState, useMemo } from 'react';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import { Alert, Checkbox, Form, Spin, Tooltip } from 'antd';
import BreadCrumb from '../../../../../components/BreadCrumb';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { InfoCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import { useDispatch, useSelector } from 'react-redux';
import { activationAccountingRules, downloadAccountingRules, getAccountingRulesPaginate, getDetailAccountingRules } from '../../../../../redux/slices/account_management/MasterData/accounting_rules';
import { getColumnSearchPropsUseFilteredValue } from '../../../../../utils/getColumnSearchProps';
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import CardComponent from '../../../../../components/Card/CardComponent';
import DetailText from '../../../../../components/DetailText';
import { dateFormatting, formMessageRequired, hasValue, renderColumn, toTitleCase } from '../../../../../utils';
import InputComponent from '../../../../../components/InputComponent';
import moment from 'moment';
import { ModalError } from '../../../../../components/Modal/ModalPopUp';
import { clearBodyMessage } from '../../../../../redux/slices/general_slice';
import { useColumnActionPermission } from '../../../../../components/ColumnActionPermission';
import Toolbar from '../../../../../components/Toolbar';
import TableRBI from '../../../../../components/TableRBI';
import { applyFixedColumns } from '../../../../../utils/applyFixedColumns';
import CardContainer from '../../../../../components/CardContainer';

const ViewAccountingRules = () => {
    const { data, data_detail, loading } = useSelector(state => state.accounting_rules);
    const { bodyError } = useSelector((state) => state?.general);
    const dispatch = useDispatch();

    // Use State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalActivation, setOpenModalActivation] = useState(false);
    const [typeStatus, setTypeStatus] = useState('');
    const [accountingRuleId, setAccountingRuleId] = useState(null);
    const [accountingName, setAccountingName] = useState('');
    const [modalError, setModalError] = useState(false);
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "action"],
    }));
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    const { remark } = form.getFieldsValue();

    // use effect
    useEffect(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(getAccountingRulesPaginate({ search: reqSearch, sort, page, pageSize }))
    }, [dispatch, page, pageSize, search, sort]);

    // trigger modal try again
    useEffect(() => {
        if (bodyError?.response?.data?.code === 500) {
            setModalError(true)
        }
    }, [bodyError]);

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

    // handle activation
    const handleActiveOrInactive = (record) => {
        setOpenModalActivation(true);
        setTypeStatus(record?.status);
        setAccountingRuleId(record?.masterAccountingRuleId);
        setAccountingName(record?.classificationTypeName)
    };

    // handle detail
    const handleDetail = async (id) => {
        setOpenModal(true);
        await dispatch(getDetailAccountingRules(id)).unwrap();
    };

    // handle cancel modal
    const handleCancel = () => {
        setOpenModal(false);
        setOpenModalActivation(false);
        form.resetFields();
    };

    // handle save activation
    const handleSaveActivation = async (formValue) => {
        const body = {
            ...formValue,
            masterAccountingRuleId: accountingRuleId
        };
        await dispatch(activationAccountingRules(body)).unwrap();
        setOpenModalActivation(false)
        const reqSearch = encodeURIComponent(JSON.stringify(search))
        await dispatch(getAccountingRulesPaginate({ page, pageSize, sort, search: reqSearch })).unwrap();
        form.resetFields();
    };

    // base columns with useMemo
    const baseColumns = useMemo(() => [
        {
            key: "no",
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            key: "classificationTypeName",
            title: "CLASSIFICATION TYPE",
            dataIndex: "classificationTypeName",
            sorter: true,
            width: 400,
            filteredValue: [search?.classificationTypeName] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "classificationTypeName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'classificationTypeName', 
                hasValue(search["classificationTypeName"]), 
                searchText, 
                text, 
                false, 
                'input', 
                search
            )
        },
        {
            key: "code",
            title: "CODE",
            dataIndex: "code",
            sorter: true,
            width: 200,
            filteredValue: [search?.code] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "code",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'code', 
                hasValue(search["code"]), 
                searchText, 
                text, 
                false, 
                'input', 
                search
            )
        },
        {
            key: "receivableAccount",
            title: "RECEIVABLE ACCOUNT",
            dataIndex: "receivableAccount",
            sorter: true,
            width: 300,
            filteredValue: [search?.receivableAccount] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "receivableAccount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'receivableAccount', 
                hasValue(search["receivableAccount"]), 
                searchText, 
                text, 
                false, 
                'input', 
                search
            )
        },
        {
            key: "revenueAccount",
            title: "REVENUE ACCOUNT",
            dataIndex: "revenueAccount",
            sorter: true,
            width: 300,
            filteredValue: [search?.revenueAccount] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "revenueAccount",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'revenueAccount', 
                hasValue(search["revenueAccount"]), 
                searchText, 
                text, 
                false, 
                'input', 
                search
            )
        },
        {
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
            sorter: true,
            width: 450,
            ellipsis: {
                showTitle: false,
            },
            filteredValue: [search?.description] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "description",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'description', 
                hasValue(search["description"]), 
                searchText, 
                text, 
                true, 
                'input', 
                search
            )
        },
        {
            key: "status",
            title: "STATUS",
            dataIndex: "status",
            sorter: true,
            width: 120,
            filteredValue: [search?.status] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "status",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'status', 
                hasValue(search["status"]), 
                searchText, 
                text, 
                false, 
                'status', 
                search
            )
        },
    ], [page, pageSize, search, searchText, searchedColumn]);

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
            breadcrumbName: "Accounting Rules",
        },
    ];

    const handleChangePage = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // onsort
    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle download
    const handleDownload = () => {
        const reqSearch = encodeURIComponent(JSON.stringify(search))
        dispatch(downloadAccountingRules({ search: reqSearch, sort, page, pageSize }))
    };

    // handle confirm retry
    const handleConfirm = () => {
        if (bodyError?.action === "GET_ACCOUNTING_RULES_PAGINATE") {
            const reqSearch = encodeURIComponent(JSON.stringify(search))
            dispatch(downloadAccountingRules({ search: reqSearch, sort, page, pageSize }))
        } else if (bodyError?.action === "DOWNLOAD_ACCOUNTING_RULES") {
            handleDownload()
        } else if (bodyError?.action === "GET_DETAIL_ACCOUNTING_RULES") {
            const getPathRequest = bodyError?.request?.responseURL?.split('/');
            const getParamsId = getPathRequest[getPathRequest?.length - 1];
            dispatch(getDetailAccountingRules(getParamsId));
        } else {
            handleSaveActivation();
        }
        dispatch(clearBodyMessage());
    }

    // handle retry
    const handleRetry = () => {
        handleConfirm();
        setModalError(false);
        dispatch(clearBodyMessage());
    };

    // handle close modal
    const handleCloseModalError = () => {
        setModalError(false);
        dispatch(clearBodyMessage());
    };

    const itemActions = [
        //action toolbar
        {
            action: 'Upload',
            render: (
                <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_ACCOUNTING_RULES}>
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
                <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNTING_RULES}>
                    <ButtonComponent
                        icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                        type="submit"
                    >
                        Create Accounting Rules
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
                        <div onClick={() => { handleDetail(record?.masterAccountingRuleId); }}>
                            <SVGIcon name="IconDetail" width={24} />
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
                        {record?.status === "INACTIVE" ?
                            <div className={"cursor-not-allowed"}>
                                <SVGIcon name="IconEdit" width={24} color={"#C0BEC6"} className={"cursor-not-allowed"} />
                            </div>
                            :
                            <Link
                                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_ACCOUNTING_RULES}
                                state={{ id: record?.masterAccountingRuleId }}
                            >
                                <div>
                                    <SVGIcon name="IconEdit" width={24} />
                                </div>
                            </Link>
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
                    <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
                        <div>
                            <Checkbox
                                onClick={() => { handleActiveOrInactive(record) }}
                                checked={record?.status === "ACTIVE" ? false : true}
                            />
                        </div>
                    </Tooltip>
                )
            }
        }
    ];

    const actionCols = useColumnActionPermission(
        ["Activate", "View", "Update"],
        itemActions
    );

    const allColumns = useMemo(() => {
        const columnsWithKeys = [...baseColumns, ...actionCols].map(
            (col) => ({
                ...col,
                key: col.key || col.dataIndex || col.title,
            })
        );
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
        <Spin spinning={loading}>
            <LayoutMenu>
                <BreadCrumb routes={routes} />

                <CardContainer
                    header={
                        <div className="flex -my-4 justify-between items-center">
                            <p className="mt-[15px] font-bold">ACCOUNTING RULES LIST</p>
                            <div className="mt-[15px] flex gap-[20px]">
                                <Toolbar items={itemActions} />
                            </div>
                        </div>
                    }
                >
                    <div className="my-5">
                        <TableRBI
                            dataSource={data?.result}
                            columns={processedColumns}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onSizeChanger={handleChangePage}
                            totalData={data?.page?.totalElements || 0}
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

                <ModalCustom
                    isOpen={openModal}
                    type={'detail'}
                    header={'accounting rules detail'}
                    width={850}
                    handleCancel={handleCancel}
                    footer={
                        <ButtonComponent onClick={handleCancel}>
                            Cancel
                        </ButtonComponent>
                    }>
                    <CardComponent header={'Accounting rules information'}>
                        <div className='w-full grid grid-cols-4'>
                            <DetailText label={'Classification Type'}>{data_detail?.classificationTypeName}</DetailText>
                            <DetailText label={'Code'}>{data_detail?.code}</DetailText>
                            <DetailText label={'Receivable Account'}>{data_detail?.receivableAccount}</DetailText>
                            <DetailText label={'Revenue Account'}>{data_detail?.revenueAccount}</DetailText>
                        </div>
                        <DetailText label={'Status'}>{toTitleCase(data_detail?.status)}</DetailText>
                        <div className='w-full'>
                            <DetailText label={'Description'}>{data_detail?.description}</DetailText>
                        </div>
                    </CardComponent>
                    <CardComponent header={'history log information'} cols={5}>
                        <DetailText label={'Record ID'}>{data_detail?.masterAccountingRuleId}</DetailText>
                        <DetailText label={'Created Date'}>{hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate)?.format(dateFormatting?.dateTime)}</DetailText>
                        <DetailText label={'Created By'}>{data_detail?.createdBy}</DetailText>
                        <DetailText label={'Updated Date'}>{hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format(dateFormatting?.dateTime)}</DetailText>
                        <DetailText label={'Updated By'}>{data_detail?.updatedBy}</DetailText>
                    </CardComponent>
                </ModalCustom>

                <ModalCustom
                    isOpen={openModalActivation}
                    header={`${typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"} INFORMATION`}
                    width={700}
                    type={"confirmation"}
                    handleCancel={handleCancel}
                    footer={
                        <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                            <ButtonComponent onClick={handleCancel} type="default">
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
                                message={`Are you sure want to ${typeStatus === "ACTIVE" ? "inactivate" : "activate"} accounting rule named ${accountingName}?`}
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
                        <p className="pl-[70px]">{bodyError?.response?.data?.message?.toString()}</p>
                        <p className="pl-[70px]">Please try again.</p>
                    </div>
                </ModalError>
            </LayoutMenu>
        </Spin>
    );
}

export default ViewAccountingRules;