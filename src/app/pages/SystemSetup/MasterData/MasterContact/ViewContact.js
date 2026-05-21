import React from 'react';
import { Alert, Form, Spin, Tooltip } from 'antd';
import BreadCrumb from '../../../../../components/BreadCrumb';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { DownloadOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import BaseContainer from '../../../../../components/BaseContainer';
import TablePagination from '../../../../../components/TablePagination';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { activationContact, downloadContact, getContactPaginate, getDetailContact } from '../../../../../redux/slices/account_management/MasterData/contact_slice';
import { getColumnSearchPropsPaging, getColumnSearchPropsUseFilteredValueFE } from '../../../../../utils/getColumnSearchProps';
import SVGIcon from "../../../../../assets/Icon/index";
import IconViewList from "../../../../../assets/Icon/Nx/IconViewList";
import IconEditNx from "../../../../../assets/Icon/Nx/IconEdit";
import IconActive from "../../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../../assets/icons/nx/IconInactive";
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import { dateFormatting, formMessageRequired, hasValue, renderColumn } from '../../../../../utils';
import InputComponent from '../../../../../components/InputComponent';
import CardComponent from '../../../../../components/Card/CardComponent';
import DetailText from '../../../../../components/DetailText';
import { clearBodyMessage } from '../../../../../redux/slices/general_slice';
import { ModalError } from '../../../../../components/Modal/ModalPopUp';
import moment from 'moment';
import Toolbar from '../../../../../components/Toolbar';
import { useColumnActionPermission } from '../../../../../components/ColumnActionPermission';
import TablePaginationNew from '../../../../../components/TablePaginationNew';

const expandedRowRender = (record) => {
    const dataExpand = record?.contactDetail;

    const columns = [
        {
            title: "NO",
            align: "center",
            width: 60,
            render: (text, object, index) => index + 1,
        },
        {
            title: "TYPE",
            dataIndex: "type",
            width: 180
        },
        {
            title: "VALUE",
            dataIndex: "contactValue",
        },
    ];
    return (
        <>
            <p className="text-primary text-xs font-bold uppercase">CONTACT DETAIL</p>
            <TablePaginationNew
                type='FE'
                usePagination={false}
                useSelect={false}
                dataSource={dataExpand}
                tableScrolled={{ y: 625 }}
                // onChange={handleChangeDetail}
                columns={columns}
            />
            {/* <TablePagination
                useSelect={false}
                usePagination={false}
                // className="table-expand-custom"
                dataSource={dataExpand}
                columns={columns}
                tableScrolled={{
                    x: 1000,
                }}
            /> */}
        </>
    );
};

const ViewContact = () => {
    const { data, loading, data_detail } = useSelector(state => state.contact);
    const { bodyError } = useSelector(state => state?.general);
    const dispatch = useDispatch();
    // Use State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const searchInput = useRef(null);
    // search detail
    const [pageDetail, setPageDetail] = useState(1);
    const [pageSizeDetail, setPageSizeDetail] = useState(10);
    const [searchedColumnDetail, setSearchedColumnDetail] = useState("");
    const [searchTextDetail, setSearchTextDetail] = useState("");
    const [sortDetail, setSortDetail] = useState("");
    const [searchDetail, setSearchDetail] = useState({});
    const searchInputDetail = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModalActivation, setOpenModalActivation] = useState(false);
    const [typeStatus, setTypeStatus] = useState('');
    const [contactId, setContactId] = useState(null);
    const [contactName, setContactName] = useState('');
    const [modalError, setModalError] = useState(false);
    const [form] = Form.useForm();
    const { remark } = form.getFieldsValue();

    const [dataTable, setDataTable] = useState([]);

    // use effect
    useEffect(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(getContactPaginate({ search: reqSearch, sort, page, pageSize }))
    }, [dispatch, page, pageSize, search, sort]);

    useEffect(() => {
        if (data?.result && data?.result.length > 0) {
            const dataModif = data?.result.map((a, index) => ({
                ...a,
                key: index + 1,
                contactDetail: a.contactDetail?.map((b, index) => ({
                    ...b,
                    key: index + 1,
                })),
            }));
            setDataTable(dataModif);
        } else {
            setDataTable([])
        }
    }, [data]);

    // trigger modal try again
    useEffect(() => {
        if (bodyError?.response?.data?.code === 500) {
            setModalError(true)
        }
    }, [bodyError])

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

    const handleSearchDetail = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchTextDetail(selectedKeys[0]);
        setSearchedColumnDetail(dataIndex);
        setSearchDetail((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPageDetail(1);
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
        setContactId(record?.contactId);
        setContactName(record?.contactName);
    };

    // handle detail
    const handleDetail = async (record) => {
        try {
            await dispatch(getDetailContact(record?.contactId))?.unwrap()
            setOpenModal(true);

        } catch (error) {
            setOpenModal(false);
        }
    };

    // handle cancel 
    const handleCancel = () => {
        setOpenModal(false)
        setOpenModalActivation(false);
        form.resetFields();
    }

    // handle save activation
    const handleSaveActivation = async (formValue) => {
        try {
            const body = {
                ...formValue,
                id: contactId
            };
            await dispatch(activationContact(body))?.unwrap()
            setOpenModalActivation(false)
            const reqSearch = encodeURIComponent(JSON.stringify(search));
            await dispatch(getContactPaginate({ page, pageSize, sort, search: reqSearch })).unwrap();
            form.resetFields();
        } catch (error) {
            setOpenModalActivation(false)
            form.resetFields();
        }
    }
    // columns
    const columns = (
        page = 1,
        pageSize = 10,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch = () => { },
        handleActiveOrInactive = () => { },
        handleDetail = () => { }
    ) => {
        return [
            {
                title: "NO",
                width: 60,
                align: "center",
                render: (text, object, index) => (page - 1) * pageSize + index + 1,
            },
            {
                title: "CONTACT NAME",
                dataIndex: "contactName",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "contactName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('contactName', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "JOB",
                dataIndex: "jobName",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "jobName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('jobName', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "POSITION",
                dataIndex: "positionName",
                sorter: true,
                ...getColumnSearchPropsPaging(
                    "positionName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch
                ),
                render: (text) => renderColumn('positionName', searchedColumn, searchText, text, false, 'input', search)
            },
            {
                title: "STATUS",
                dataIndex: "status",
                sorter: true,
                width: 140,
                fixed: 'right',
                ...getColumnSearchPropsPaging(
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
            breadcrumbName: "Contact",
        },
    ];

    // handle change
    const handleChange = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // change detail
    const handleChangeDetail = (pageChange, pageSizeChange) => {
        const tempPage = pageSizeDetail !== pageSizeChange ? 1 : pageChange;
        setPageDetail(tempPage);
        setPageSizeDetail(pageSizeChange);
    };
    // onsort
    const onSort = (_, __, sort) => {
        const dataSort =
            sort.order !== undefined
                ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle confirm retry
    const handleConfirm = async () => {
        if (bodyError?.action === 'GET_DETAIL_CONTACT') {
            const getPathRequest = bodyError?.request?.responseURL?.split('/');
            const getParamsId = getPathRequest[getPathRequest?.length - 1];
            dispatch(getDetailContact(getParamsId));
        } else if (bodyError?.action === "GET_CONTACT_PAGINATE") {
            const reqSearch = encodeURIComponent(JSON.stringify(search));
            await dispatch(getContactPaginate({ page, pageSize, sort, search: reqSearch })).unwrap();
        } else if (bodyError?.action === "DOWNLOAD_CONTACT") {
            await handleDownload().unwrap();
        } else {
            await handleSaveActivation().unwrap();
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
        // setBodyError({});
    };

    // column detail
    const columnDetail = [
        {
            title: "NO",
            align: "center",
            width: 80,
            render: (text, object, index) => (pageDetail - 1) * pageSizeDetail + index + 1,
        },
        {
            sorter: true,
            title: "TYPE",
            dataIndex: "type",
            align: "left",
            width: 250,
            ...getColumnSearchPropsUseFilteredValueFE(
                searchDetail,
                "type",
                searchInputDetail,
                searchedColumnDetail,
                searchTextDetail,
                handleSearchDetail,
                true
            ),
            render: (text) => {
                return renderColumn('type', searchedColumnDetail, searchText, text?.label, false, 'input', searchDetail)

            }
        },
        {
            sorter: true,
            title: "VALUE",
            dataIndex: "contactValue",
            align: "left",
            ...getColumnSearchPropsUseFilteredValueFE(
                searchDetail,
                "contactValue",
                searchInputDetail,
                searchedColumnDetail,
                searchTextDetail,
                handleSearchDetail,
                true
            ),
            ellipsis: {
                showTitle: false,
            },
            render: (val, record) => {
                return renderColumn('contactValue', searchedColumnDetail, searchTextDetail, record?.contactValue, true, 'input', searchDetail)
            }
        },
    ];

    // handle download 
    const handleDownload = () => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(downloadContact({ search: reqSearch, page, pageSize, sort }));
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
            action: 'Create',
            render: (
                <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_CONTACT}>
                    <ButtonComponent
                        icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                        type="submit"
                    >
                        Create Contact
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
                        <span className="inline-flex items-center text-[#1976D2] hover:text-[#1976D2] transition-colors duration-200 cursor-pointer" onClick={() => handleDetail(record)}>
                            <IconViewList width={20} />
                        </span>
                    </Tooltip>
                )
            }
        },

        {
            action: "Update",
            type: "table",
            render: (record, data) => {
                const disabled = record?.status === "INACTIVE";
                return (
                    <Tooltip title="Update">
                        <div className={`inline-flex items-center ${disabled ? "cursor-not-allowed text-gray-300" : ""}`}>
                            <Link
                                to={!disabled ? ACCOUNT_MANAGEMENT_ROUTES?.UPDATE_CONTACT : undefined}
                                state={!disabled ? { id: record?.contactId } : undefined}
                                className={`inline-flex items-center transition-colors duration-200 ${disabled ? "text-gray-300 pointer-events-none" : "text-[#1976D2] hover:text-[#1976D2]"}`}
                            >
                                <IconEditNx width={20} />
                            </Link>
                        </div>
                    </Tooltip>
                )
            }
        },

        {
            action: "Activate",
            type: "table",
            render: (record, data) => {
                const isActive = record?.status?.toUpperCase() === "ACTIVE";
                const handleToggle = () => { handleActiveOrInactive(record); };
                return (
                    <Tooltip title={isActive ? "Inactivate" : "Activate"}>
                        {isActive
                            ? <span className="inline-flex items-center text-[#D32F2F] hover:text-[#D32F2F] transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                                <IconInactive width={20} />
                              </span>
                            : <span className="inline-flex items-center text-green-600 hover:text-green-600 transition-colors duration-200 cursor-pointer" onClick={handleToggle}>
                                <IconActive width={20} />
                              </span>
                        }
                    </Tooltip>
                )
            }
        }
    ]
    return (
        <>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />

                <Toolbar items={itemActions} />

                <BaseContainer header={"Contact List"}>
                    <div className="w-full">
                        <TablePagination
                            dataSource={
                                dataTable
                            }
                            expandable={{ expandedRowRender }}
                            columns={[
                                ...columns(
                                    page,
                                    pageSize,
                                    searchInput,
                                    searchedColumn,
                                    searchText,
                                    handleSearch,
                                    handleActiveOrInactive,
                                    handleDetail
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
                                x: 1500,
                                y: 500,
                            }}
                        />
                    </div>
                </BaseContainer>
                <ModalCustom
                    isOpen={openModal}
                    handleCancel={handleCancel}
                    type={'detail'}
                    width={1000}
                    header={'contact detail'}
                    footer={[
                        <ButtonComponent
                            key="back"
                            onClick={handleCancel}
                        >
                            Back
                        </ButtonComponent>
                    ]}
                >
                    <CardComponent header={'contact information'}>
                        <div className='w-full grid grid-cols-3'>
                            <DetailText label={'First Name'}>{data_detail?.firstName}</DetailText>
                            <DetailText label={'Middle Name'}>{data_detail?.middleName}</DetailText>
                            <DetailText label={'Last Name'}>{data_detail?.lastName}</DetailText>
                            <DetailText label={'Job'}>{data_detail?.jobName}</DetailText>
                            <DetailText label={'Position'}>{data_detail?.positionName}</DetailText>
                        </div>
                        <div className='w-full'>
                            <span className="text-primary text-xs font-semibold uppercase my-5">
                                Contact Detail Information
                            </span>
                            <div className='my-5'>
                                <TablePaginationNew
                                    type='FE'
                                    useSelect
                                    pageSize={pageSizeDetail}
                                    current={pageDetail}
                                    dataSource={data_detail?.contactDetail}
                                    tableScrolled={{ y: 625 }}
                                    onChange={handleChangeDetail}
                                    columns={columnDetail}
                                />
                            </div>
                        </div>
                    </CardComponent>
                    <CardComponent cols={5} header={'history log information'}>
                        <DetailText label={'Record ID'}>{data_detail?.id}</DetailText>
                        <DetailText label={'Created Date'}>{
                            hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate).format(dateFormatting?.dateTime)
                        }</DetailText>
                        <DetailText label={'Created By'}>{data_detail?.createdBy}</DetailText>
                        <DetailText label={'Updated Date'}>
                            {
                                hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format(dateFormatting?.dateTime)
                            }
                        </DetailText>
                        <DetailText label={'Updated By'}>{data_detail?.updatedBy}</DetailText>
                    </CardComponent>
                </ModalCustom>
                <ModalCustom
                    isOpen={openModalActivation}
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
                                    } contact named ${contactName}?`}
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
            </Spin>
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
        </>
    );
}

export default ViewContact;
