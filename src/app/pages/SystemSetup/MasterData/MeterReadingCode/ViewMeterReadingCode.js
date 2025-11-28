import React from 'react';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import { Alert, Checkbox, Form, Spin, Tooltip } from 'antd';
import BreadCrumb from '../../../../../components/BreadCrumb';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { InfoCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { activationMeterReadingCode, downloadMeterReadingCode, getDetailMeterReadingCode, getMeterReadingCodePaginate } from '../../../../../redux/slices/account_management/MasterData/meter_reading_code_slice';
import { getColumnSearchPropsUseFilteredValue } from '../../../../../utils/getColumnSearchProps';
import SVGIcon from "../../../../../assets/Icon/index";
import { dateFormatting, formMessageRequired, hasValue, renderColumn, toTitleCase } from '../../../../../utils';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import CardComponent from '../../../../../components/Card/CardComponent';
import DetailText from '../../../../../components/DetailText';
import moment from 'moment';
import InputComponent from '../../../../../components/InputComponent';
import { ModalError } from '../../../../../components/Modal/ModalPopUp';
import { clearBodyMessage } from '../../../../../redux/slices/general_slice';
import Toolbar from '../../../../../components/Toolbar';
import { useColumnActionPermission } from '../../../../../components/ColumnActionPermission';
import TableRBI from '../../../../../components/TableRBI';
import { applyFixedColumns } from '../../../../../utils/applyFixedColumns';
import CardContainer from '../../../../../components/CardContainer';

const ViewMeterReadingCode = () => {
    const { data, loading, data_detail } = useSelector(state => state?.meter_reading_code);
    const { bodyError } = useSelector((state) => state?.general);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    // Use State
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const searchInput = useRef(null);
    const [modalDetail, setModalDetail] = useState(false);
    const [modalActivation, setModalActivation] = useState(false);
    const [typeStatus, setTypeStatus] = useState('');
    const [recordId, setRecordId] = useState('');
    const [costCenter, setCostCenter] = useState('');
    const [code, setCode] = useState('');
    const [modalError, setModalError] = useState(false);
    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ["no"],
        right: ["status", "action"],
    }));
    const { remark } = form.getFieldsValue();

    // use effect
    useEffect(() => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(getMeterReadingCodePaginate({ search: reqSearch, sort, page, pageSize }))
    }, [dispatch, page, pageSize, search, sort]);

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

    // handle detail
    const handleDetail = async (id) => {
        try {
            await dispatch(getDetailMeterReadingCode(id))?.unwrap();
            setModalDetail(true);
        } catch (error) {
            setModalDetail(false);
        }
    }

    // handle cancel
    const handleCancel = () => {
        setModalDetail(false);
        setModalActivation(false);
    }

    // handle open activation
    const handleActiveOrInactive = (record) => {
        setModalActivation(true);
        setTypeStatus(record?.status);
        setRecordId(record?.id);
        setCostCenter(record?.costCenter)
        setCode(record?.code)
    }

    // handle activation record
    const handleSaveActivation = async (formValue) => {
        const body = { ...formValue, meterReadingCodeId: recordId }
        await dispatch(activationMeterReadingCode(body, typeStatus)).unwrap();
        handleCancel();
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        await dispatch(getMeterReadingCodePaginate({ page, pageSize, sort, search: reqSearch })).unwrap();
        setRecordId('');
        form.resetFields();
    }

    // handle download
    const handleDownload = () => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(downloadMeterReadingCode({ search: reqSearch, sort, page, pageSize }))
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
            breadcrumbName: "Meter Reading Codes",
        },
    ];

    // handle change pagination
    const handleChangePage = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
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
            key: "costCenter",
            title: "COST CENTER",
            dataIndex: "costCenter",
            sorter: true,
            filteredValue: [search?.costCenter] || null,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "costCenter",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) => renderColumn(
                'costCenter', 
                hasValue(search["costCenter"]), 
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
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
            sorter: true,
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
            filteredValue: [search?.status] || null,
            width: 120,
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

    // on sort
    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle confirm
    const handleConfirm = () => {
        if (bodyError?.action === "GET_METER_READING_CODE_PAGINATE") {
            const reqSearch = encodeURIComponent(JSON.stringify(search));
            dispatch(getMeterReadingCodePaginate({ search: reqSearch, sort, page, pageSize }))
        } else if (bodyError?.action === "DOWNLOAD_METER_READING_CODE") {
            handleDownload();
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
                <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_METER_READING_CODES}>
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
                <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_METER_READING_CODES}>
                    <ButtonComponent
                        icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                        type="submit"
                    >
                        Create Meter Reading Code
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
                        <div onClick={() => { handleDetail(record?.id); }}>
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
                        <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
                            <Link
                                to={record?.status?.toLowerCase() !== "inactive" && ACCOUNT_MANAGEMENT_ROUTES.UPDATE_METER_READING_CODES}
                                state={record?.status?.toLowerCase() !== "inactive" && { id: record.id }}
                            >
                                <SVGIcon 
                                    name="IconEdit" 
                                    className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                                    color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} 
                                    width={24} 
                                /> 
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
                return (
                    <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
                        <div>
                            <Checkbox
                                onClick={() => { handleActiveOrInactive(record); }}
                                checked={record.status === "ACTIVE" ? false : true}
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
                            <p className="mt-[15px] font-bold">METER READING CODES LIST</p>
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
                            tableScrolled={{ x: 1500, y: 525 }}
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
                    isOpen={modalDetail}
                    handleCancel={handleCancel}
                    type={'detail'}
                    header={'detail meter reading code'}
                    width={1000}
                    footer={[
                        <ButtonComponent onClick={handleCancel}>
                            Back
                        </ButtonComponent>
                    ]}
                >
                    <CardComponent header={'meter reading code information'}>
                        <div className={'w-full grid grid-cols-3'}>
                            <DetailText label={'Cost Center'}>{data_detail?.costCenter}</DetailText>
                            <DetailText label={'Code'}>{data_detail?.code}</DetailText>
                            <DetailText label={'Status'}>
                                <div className={'w-1/4'}>{toTitleCase(data_detail?.status)}</div>
                            </DetailText>
                        </div>
                        <DetailText label={'Description'}>
                            <div>{toTitleCase(data_detail?.description)}</div>
                        </DetailText>
                    </CardComponent>
                    <CardComponent header={'history log information'}>
                        <div className={'w-full grid grid-cols-5'}>
                            <DetailText label={'Record ID'}>{data_detail?.id}</DetailText>
                            <DetailText label={'Created Date'}>{data_detail?.createdDate ? moment(data_detail?.createdDate).format(dateFormatting.dateTime) : ''}</DetailText>
                            <DetailText label={'Created By'}>{data_detail?.createdBy}</DetailText>
                            <DetailText label={'Updated Date'}>{data_detail?.updatedDate ? moment(data_detail?.updatedDate).format(dateFormatting.dateTime) : ''}</DetailText>
                            <DetailText label={'Updated By'}>{data_detail?.updatedBy}</DetailText>
                        </div>
                    </CardComponent>
                </ModalCustom>

                <ModalCustom
                    isOpen={modalActivation}
                    header={`${typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"} INFORMATION`}
                    width={800}
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
                                message={`Are you sure want to ${typeStatus === "ACTIVE" ? "inactivate" : "activate"} meter reading code ${costCenter} - code ${code}?`}
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

export default ViewMeterReadingCode;