import { Alert, Checkbox, DatePicker, Form, Spin, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BaseContainer from '../../../../components/BaseContainer';
import BreadCrumb from '../../../../components/BreadCrumb';
import ButtonComponent from '../../../../components/ButtonComponent';
import { DownloadOutlined, CopyOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { dateFormatting,  hasValue,  renderColumn, renderDateColumn } from '../../../../utils';
import { NavLink } from 'react-router-dom';
import ModalCustom from '../../../../components/Modal/ModalCustom';
import { USER_ROUTES } from '../../../../routes/user_management/user_routes';
import TablePagination from '../../../../components/TablePagination';
import { useDispatch, useSelector } from 'react-redux';
import SVGIcon from "../../../../assets/Icon/index";
import {  getColumnSearchPropsUseFilteredValue } from '../../../../utils/getColumnSearchProps';
import moment from 'moment';
import InputComponent from '../../../../components/InputComponent';
import { activationPositionHierarchy, downloadPositionHierarchy, duplicatePositionHierarchy, getPositionHierarchyPaginate } from '../../../../redux/slices/user_management/position_hirarchy';
import Toolbar from '../../../../components/Toolbar';
import { useColumnActionPermission } from '../../../../components/ColumnActionPermission';
import { useTryAgainHooks } from '../../../../utils/useTryAgainHooks';


const PositionHierarchyPage = () => {
    const { loading, data } = useSelector(state => state?.position_hierarchy);
    const { bodyError } = useSelector(state => state?.general);
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    // use state
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const [modalType, setModalType] = useState('');
    const [recordSelected, setRecordSelected] = useState({});
    const [body, setBody] = useState({});

    const handleFetch = useCallback(() => {
        dispatch(getPositionHierarchyPaginate({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }))
    }, [dispatch, page, pageSize, search, sort]);


    // use effect
    useEffect(() => {
        handleFetch()
    }, [handleFetch]);


    // handle search pagination
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


    //  handle sort pagination
    const onSort = (_, __, sort) => {
        const dataSort =
            sort.order !== undefined
                ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    // handle cancel modals
    const handleCancel = () => {
        setOpenModal(false);
        setModalType('');
        setRecordSelected({});
        form.resetFields();
    }

    // handle open modals
    const handleOpenModal = (record, type) => {
        setModalType(type);
        setRecordSelected(record);
        if (type === 'activation') {
            form.setFieldsValue({
                startDate:
                    record?.startDate === null
                        ? moment()
                        : moment(record?.startDate).clone(dateFormatting?.dateTime),
                endDate:
                    record?.endDate === null
                        ? null
                        : moment(record?.endDate).clone(dateFormatting?.dateTime),
            });
        } else {
            form.setFieldsValue({ name: record.name + " Copy" });
        }
        setOpenModal(true);
    };


    // handle activation
    const handleActivation = async (formValue) => {
        try {
            const payload = {
                ...formValue,
                hierId: recordSelected?.hierId,
                saveAs: "ACTIVE"
            }
            setBody(payload);
            handleCancel();
            await dispatch(activationPositionHierarchy(payload))?.unwrap();
            await handleFetch()?.unwrap();
        } catch (error) {
            await handleFetch()?.unwrap();
        }
    }

    // handle duplicate
    const handleDuplicate = async (formValue) => {
        try {
            const payload = {
                ...formValue,
                hierId: recordSelected?.hierId
            };
            setBody(payload);
            handleCancel();
            await dispatch(duplicatePositionHierarchy(payload))?.unwrap();
            await handleFetch()?.unwrap();
        } catch (error) {
            await handleFetch()?.unwrap();

        }
    };

    // handle download
    const handleDownload = async () => {
        try {
            await dispatch(downloadPositionHierarchy({ search: encodeURIComponent(JSON.stringify(search)), page, pageSize, sort }))?.unwrap();
        } catch (error) {
            await handleFetch()?.unwrap()
        }
    };


    // handle change pagination
    const handleChange = (pageChange, pageSizeChange) => {
        setPage(pageSize !== pageSizeChange ? 1 : pageChange);
        setPageSize(pageSizeChange);
    };

    // handle retry modal error
    const handleRetry = () => {
        try {
            handleCancelTryAgain();
            if (bodyError?.action === "ACTIVATION_POSITION_HIERARCHY") {
                dispatch(activationPositionHierarchy(body));
            } else if (bodyError?.action === "DUPLICATE_POSITION_HIERARCHY") {
                dispatch(duplicatePositionHierarchy(body));
            } else if (bodyError?.action === 'DOWNLOAD_POSITION_HIERARCHY') {
                handleDownload();
            }
            handleFetch();
        } catch (error) {
            handleFetch();
        }
    };

    // use hooks handle retry
    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);


    //    render content modal
    const renderContentModal = (type) => {
        if (type === 'activation') {
            return (
                <>
                    <div className="w-full modalTerminate">
                        <Alert
                            icon={
                                <ExclamationCircleOutlined
                                    style={{ fontSize: "24px", color: "#65481C" }}
                                />
                            }
                            message={
                                "Are you sure you want to activate Position Hierarchy?"
                            }
                            description={
                                "Warning! If you activate this hierarchy, the current active hierarchy will be inactivated."
                            }
                            type={"warning"}
                            showIcon
                        />
                    </div>
                    <Form form={form} layout='vertical' onFinish={handleActivation}>
                        <Form.Item name={"startDate"} label={"Start Date"}>
                            <DatePicker
                                className="w-full"
                                format={dateFormatting?.dateTime}
                                disabled
                            />
                        </Form.Item>
                        <Form.Item name={"endDate"} label={"End Date"}>
                            <DatePicker
                                className="w-full"
                                format={dateFormatting?.dateTime}
                                disabledDate={(current) => {
                                    return (
                                        current &&
                                        current < moment(form.getFieldValue("startDate"))
                                    );
                                }}
                            />
                        </Form.Item>
                        <div className={"w-full flex justify-end gap-2"}>
                            <Form.Item>
                                <ButtonComponent
                                    type={"default"}
                                    onClick={() => setOpenModal(false)}
                                    border={true}
                                >
                                    Cancel
                                </ButtonComponent>
                            </Form.Item>
                            <Form.Item>
                                <ButtonComponent
                                    type={"submit"}
                                    htmlType={"submit"}
                                    border={false}
                                >
                                    Confirm
                                </ButtonComponent>
                            </Form.Item>
                        </div>
                    </Form>
                </>
            );
        } else {
            return (
                <>
                    <Form
                        form={form}
                        layout="vertical"
                        className="mt-3"
                        onFinish={handleDuplicate}
                    >
                        <Form.Item name={"name"} label={"Hierarchy Name"}>
                            <InputComponent placeholder="Type your remark" />
                        </Form.Item>
                        <div className={"w-full flex justify-end gap-3"}>
                            <Form.Item>
                                <ButtonComponent
                                    type={"default"}
                                    onClick={handleCancel}
                                    border={true}
                                >
                                    Back
                                </ButtonComponent>
                            </Form.Item>
                            <Form.Item>
                                <ButtonComponent
                                    type={"submit"}
                                    htmlType={"submit"}
                                    border={false}
                                >
                                    Save
                                </ButtonComponent>
                            </Form.Item>
                        </div>
                    </Form>
                </>
            );

        }
    }

    // columns
    const columns = [
        // tableNumbering,
        {
            title: "NO",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "NAME",
            dataIndex: "name",
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "name",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
            ),
            render: (text) => renderColumn('name', searchedColumn, searchText, text, true, 'input', search)
        },
        {
            title: "START DATE",
            dataIndex: "startDate",
            sorter: true,
            align: "center",
            width: 140,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "startDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"),
            render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
        },
        {
            title: "END DATE",
            dataIndex: "endDate",
            sorter: true,
            align: "center",
            width: 140,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "endDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                "date"),
            render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
        },
        {
            title: "DESCRIPTION",
            dataIndex: "description",
            sorter: true,
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "description",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
            ),
            render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
        },
        {
            title: "STATUS",
            dataIndex: "status",
            sorter: true,
            align: "center",
            width: 120,
            fixed: 'right',
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "status",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
            ),
            render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status')
        },
    ];

    // breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "User Management",
        },
        {
            path: "",
            breadcrumbName: "Position Hierarchy List",
        },
    ];

    const itemActions = [
        // toolbar items
        {
            action: 'Download',
            render: (
                <ButtonComponent
                    onClick={handleDownload}
                    type={"submit"}
                    border={false}
                    icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
                >
                    Download List
                </ButtonComponent>
            )
        },
        {
            action: 'Create',
            render: (
                <NavLink to={USER_ROUTES.CREATE_POSITION}>
                    <ButtonComponent
                        type={"submit"}
                        border={false}
                        icon={<PlusOutlined style={{ fontSize: "24px" }} />}
                    > Create New Position Hierarchy
                    </ButtonComponent>
                </NavLink>
            )
        },

        // column action
        {
            action: 'View',
            type: 'table',
            render: (record, data_length) => {
                return (
                    <Tooltip title={'Detail'}>
                        <NavLink to={USER_ROUTES.DETAIL_POSITION} state={{ id: record?.hierId }}>
                            <div>
                                <SVGIcon name="IconDetail" width={24} />
                            </div>
                        </NavLink>
                    </Tooltip>
                )
            }
        },
        {
            action: 'Activate',
            type: 'table',
            render: (record, data_length) => {
                return (
                    <>
                        {data_length > 3 ?
                            <ButtonComponent
                                onClick={() => handleOpenModal(record, 'activation')}
                                border={false}
                                disabled={record?.status === "ACTIVE" || record?.status === "INACTIVE"}
                            >
                                <Checkbox
                                    checked={record?.status === "INACTIVE"}
                                />

                                <span className={"text-black"}> {record?.status === "ACTIVE" ? "Inactivate Draft" : "Activate Draft"}</span>
                            </ButtonComponent>
                            :
                            <Tooltip title={record?.status === 'ACTIVE' ? 'Inactivate' : 'Activate'}>
                                <div className={record?.status !== "ACTIVE" ? 'cursor-not-allowed' : 'cursor-pointer'}
                                    onClick={() => record?.status === "DRAFT" && handleOpenModal(record, 'activation')}>
                                    <Checkbox checked={record.status === "INACTIVE"} className={record?.status !== "DRAFT" ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={record?.status === "ACTIVE" || record?.status === "INACTIVE"} />
                                </div>
                            </Tooltip>
                        }

                    </>
                )
            }
        },
        {
            action: 'Update',
            type: 'table',
            render: (record, data_length) => {
                return (
                    <Tooltip title="Update">
                        <NavLink
                            to={record?.status !== "INACTIVE" && USER_ROUTES.UPDATE_POSITION}
                            state={record?.status !== "INACTIVE" && { id: record?.hierId }}
                            className={record?.status === "INACTIVE" ? "cursor-not-allowed" :'cursor-pointer'}>
                            {data_length > 3 ?
                                <ButtonComponent
                                    icon={<SVGIcon name="IconEdit" color={record?.status === "INACTIVE" ? "#8D91A0" : "#0075bf"} width={24} className={record?.status === "INACTIVE" && "cursor-not-allowed"} />}
                                    border={false}
                                    disabled={record?.status === "INACTIVE"}>
                                    <span className={record?.status?.toLowerCase() === 'inactive' ? "text-[#8D91A0]" :"text-black"}> Update</span>
                                </ButtonComponent>
                                :
                                <SVGIcon name="IconEdit" color={record?.status === "INACTIVE" ? "#C0BEC6" : "#ACC424"} width={24} className={record?.status === "INACTIVE" && "cursor-not-allowed"} />
                            }
                        </NavLink>
                    </Tooltip>
                )
            }
        },
        {
            action: 'duplicate',
            type: 'table',
            render: (record, data_length) => {
                return (
                    <>
                        {data_length > 3 ?
                            <ButtonComponent
                                icon={<CopyOutlined style={{ fontSize: "24px" }} />}
                                border={false}
                                onClick={() => handleOpenModal(record, 'duplicate')}>
                                {data_length > 3 &&
                                    <span className={'text-black'}> Duplicate</span>

                                }
                            </ButtonComponent>
                            :
                            <Tooltip title="Duplicate">
                                <div className={`cursor-pointer`}
                                    onClick={() => handleOpenModal(record, 'duplicate')}>
                                    <CopyOutlined style={{ fontSize: "24px", color: "var(--primary)" }} />
                                </div>
                            </Tooltip>
                        }
                    </>
                )
            }
        },
    ];

    return (
        <>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading}>
                <Toolbar items={itemActions} />
                <BaseContainer header={'Position Hierarchy List'}>
                    <div className={'w-full'}>
                        <TablePagination
                            dataSource={data?.result}
                            columns={[...columns, ...useColumnActionPermission(['view', 'duplicate', 'update', 'activate'], itemActions)]}
                            totalData={data?.page?.totalElements}
                            current={page}
                            pageSize={pageSize}
                            tableScrolled={{ y: 500, x: 1200 }}
                            onChange={handleChange}
                            onSizeChanger={handleChange}
                            onSort={onSort}
                        />
                    </div>
                </BaseContainer>

                {/* modal activation or duplicate */}
                <ModalCustom
                    header={modalType === 'activation' ? 'Activation Confirmation' : 'Duplicate Position Hierarchy'}
                    isOpen={openModal}
                    handleCancel={handleCancel}
                    type={'confirmation'}
                    width={750}
                >
                    {renderContentModal(modalType)}
                </ModalCustom>

                {/* modal try again hooks */}
                {renderModal()}
            </Spin>
        </>
    );
}

export default PositionHierarchyPage;
