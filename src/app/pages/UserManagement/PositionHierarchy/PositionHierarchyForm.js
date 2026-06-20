import { Form, Select, Spin, Tooltip } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseContainer from '../../../../components/BaseContainer';
import BreadCrumb from '../../../../components/BreadCrumb';
import DetailText from '../../../../components/DetailText';
import { ArrowLeftOutlined, UnorderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import ButtonComponent from '../../../../components/ButtonComponent';
import ModalCustom from '../../../../components/Modal/ModalCustom';
import SelectComponent from '../../../../components/SelectComponent';
import { USER_ROUTES } from '../../../../routes/user_management/user_routes';
import SVGIcon from '../../../../assets/Icon/index';
import PositionHierarchyDiagram from './PositionHierarchyDiagram';
import InputComponent from '../../../../components/InputComponent';
import { getColumnSearchProps } from '../../../../utils/getColumnSearchProps';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatting, formMessageRequired, hasValue, renderColumn, toTitleCase } from '../../../../utils';
import { ModalAttention } from '../../../../components/Modal/ModalPopUp';
import ModalBack from '../../../../components/Modal/ModalBack';
import DetailPosition from './DetailPosition';
import ConfirmationHierarchy from './ConfirmationHierarchy';
import { createPositionHierarchy, getDetailHierarchy, getDetailPosition, getPosition, updatePositionHierarchy } from '../../../../redux/slices/user_management/position_hirarchy';
import { clearBodyMessage } from '../../../../redux/slices/general_slice';
import moment from 'moment';
import { sorterFunction } from '../../../../utils/sorterFunction';
import { useTryAgainHooks } from '../../../../utils/useTryAgainHooks';
import TablePaginationNew from '../../../../components/TablePaginationNew';


const PositionHierarchyForm = (props) => {
    const { type } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, data_position, data_detail, data_employee } = useSelector(state => state?.position_hierarchy)
    const { bodyError } = useSelector(state => state?.general)
    const [form] = Form.useForm();
    const location = useLocation();
    const id = location?.state?.id;


    // use state
    const [body, setBody] = useState({});
    const [dataTable, setDataTable] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const [listPosition, setListPosition] = useState([]);
    const [listParentPosition, setListParentPosition] = useState([]);
    const [selectedPositionData, setSelectedPositionData] = useState([])
    const [disabledButtonInsert, setDisabledButtonInsert] = useState(false);
    const [updateByDiagramClicked, setUpdateByDiagramClicked] = useState(false);
    const [disabledChangeParent, setDisabledChangeParent] = useState(false);
    const [modalCustom, setModalCustom] = useState(false);
    const [modalType, setModalType] = useState(false);
    const [modalEmptyList, setModalEmptyList] = useState(false);
    const [openBackModal, setOpenBackModal] = useState(false);
    const [typeColumn, setTypeColumn] = useState('string');
    const [detailDiagram, setDetailDiagram] = useState([])

    // assert data (use callback)
    const assert = useCallback((data, data_position) => {
        const idMap = data_position?.reduce((acc, item) => {
            acc[item.id] = item?.name;
            return acc;
        }, {});
        if (data) {
            const transformDataTable = data?.rPhierarchys?.map((item, index) => (
                {
                    key: hasValue(item?.parentId) === false || item?.parentId === "" ? 1 : index + 2,
                    id: item?.id,
                    rHierId: item?.idHier,
                    positionParent: hasValue(item?.parentId) ? idMap[item.parentId] : null,
                    positionName: hasValue(item?.positionId) ? idMap[item.positionId] : null,
                    status: data?.status,
                    remark: item?.description
                }
            ))
            setListPosition(data_position?.filter(itemPosition => !data?.rPhierarchys?.some(itemHierarchy => itemHierarchy?.positionId === itemPosition?.id)))
            setListParentPosition(data_position?.filter(itemPosition => data?.rPhierarchys?.some(itemHierarchy => itemHierarchy?.positionId === itemPosition?.id)))
            setDataTable(transformDataTable)
        }
    }, []);

    

    // assert row clicked
    const assertByRowClicked = useCallback(data => {
        if (data) {
            form.setFieldsValue({
                id: data?.id !== "" ? data?.id : "",
                key: data.key,
                positionName: data.positionName,
                positionParent: data.positionParent === null || data.positionParent === undefined ? null : data.positionParent,
                remark: data.remark,
            });
        }
    }, [form]);

    // use effect
    useEffect(() => {
        dispatch(getPosition());
        if (id) {
            dispatch(getDetailHierarchy(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (data_position) {
            setListPosition(data_position)
        }
    }, [data_position]);

    useEffect(() => {
        if (hasValue(data_detail) && id && data_position) {
            assert(data_detail, data_position)
        }
    }, [id, assert, data_detail, data_position])


    useEffect(() => {
        if (updateByDiagramClicked) {
            assertByRowClicked(selectedPositionData[0])
        }
    }, [assertByRowClicked, selectedPositionData, updateByDiagramClicked]);

    // check selected position data to setDetailDiagram
    useEffect(() => {
        if (data_employee && hasValue(selectedPositionData[0]?.id)) {
            setDetailDiagram(data_employee);
        } else {
            setDetailDiagram(selectedPositionData);
        }
    }, [data_employee, selectedPositionData]);


    // handle cancel modals
    const handleCancel = () => {
        setOpenModal(false);
        setModalCustom(false);
        setModalEmptyList(false);
        setModalType('');
        dispatch(clearBodyMessage());
        setSelectedPositionData([]);
    }

    // handle delete diagram
    const handleDelete = useCallback((record, dataParent) => {
        const findIndex = dataTable?.findIndex(item => item?.key === record?.key);
        console.log(record?.key);
        
        console.log(findIndex);
        
        if (record?.key === 1) {
            setListPosition([...listParentPosition, ...listPosition]);
            setListParentPosition([]);
            setDataTable([]);
        } else {
            const filteredPosition = dataParent?.filter((item) => item?.name === record?.positionName);
            const newData = [...dataTable];
            const updateParentPosition = { positionParent: record?.positionParent };
            newData.forEach((item, index) => {
                if (index !== findIndex && item.positionParent === record?.positionName) {
                    newData[index] = { ...item, ...updateParentPosition };
                }
            });
            setDataTable(newData?.filter(item => item?.key !== record?.key));
            setListParentPosition(listParentPosition?.filter(item => item?.name !== record?.positionName));
            setListPosition([...listPosition, ...filteredPosition]);
        }
        form.resetFields();
    }, [dataTable, form, listParentPosition, listPosition]);


    // handle clear input
    const handleClearInput = () => {
        setListParentPosition(data_position?.filter(itemPosition => dataTable?.some(itemTable => itemTable?.positionName === itemPosition?.name))
        )
        form.resetFields();
        setUpdateByDiagramClicked(false)
        // setDisabledButtonInsert(true);
        setSelectedPositionData([]);
        setDisabledChangeParent(false);
    }

    // handle clear hierarchy
    const handleResetHierarchy = () => {
        if (id && data_detail && type === 'update') {
            assert(data_detail, data_position);
        } else {
            setDataTable([]);
            setListParentPosition([]);
            setListPosition(data_position);
        }
        // setDisabledButtonInsert(true);
    }


    // handle retry modal error
    const handleRetry = () => {
        handleCancelTryAgain()
        if (bodyError?.action === "CREATE_POSITION_HIERARCHY") {
            dispatch(createPositionHierarchy(body));
        } else if (bodyError?.action === "UPDATE_POSITION_HIERARCHY") {
            dispatch(updatePositionHierarchy(body));
        } else if (bodyError?.action === "GET_DETAIL_POSITION") {
            dispatch(getDetailPosition(selectedPositionData[0]?.id))
        } else if (bodyError?.action === "GET_DETAIL_HIERARCHY") {
            dispatch(getDetailHierarchy(id))
        } else {
            dispatch(getPosition());
        }
        dispatch(clearBodyMessage());
    };

    // handle submit
    const handleSubmit = () => {
        if (dataTable?.length === 0) {
            setModalEmptyList(true)
        } else {
            setModalType('confirmation');
            setModalCustom(true)
        }
    };

    // handle save hierarchy
    const handleSaveHierarchy = (payload) => {
        const idMap = data_position.reduce((acc, item) => {
            acc[item.name.trim()] = item.id;
            return acc;
        }, {});

        const transformHierarchy = payload?.hierarchys?.map(item => (
            {
                ...item,
                parentId: hasValue(item?.parentId) ? idMap[item?.parentId] : null,
                positionId: hasValue(item?.positionId) ? idMap[item?.positionId] : null,
                description: hasValue(item?.description) ? item?.description : null
            }
        ));
        const body = {
            ...payload,
            hierarchys: transformHierarchy
        };
        setBody(body);
        type === 'update' && id && data_detail ? dispatch(updatePositionHierarchy(body)) : dispatch(createPositionHierarchy(body));
        handleCancel();
    }

    // handle detail position
    const handleDetail = useCallback(async (record) => {
        try {
            setSelectedPositionData([record]);
            if (hasValue(record?.id)) {
                await dispatch(getDetailPosition(record?.id))?.unwrap()
                setModalCustom(true);
            } else {
                setModalCustom(true);
            }
            setModalType('detail')
        } catch (error) {
            setModalCustom(false)
        }
    }, [dispatch]);

    // handle change list Position
    const handleChangeListPosition = (value) => {
        const selectedPosition = listPosition?.filter(item => item?.name === value);
        setSelectedPositionData(selectedPosition);
        // if (hasValue(value)) {
        //     setDisabledButtonInsert(false)
        // } else {
        //     setDisabledButtonInsert(true)
        // }
    }

    // handle update row
    const handleUpdateRow = useCallback((key) => {
        
        
        // setDisabledButtonInsert(false);
        // const findIndex = dataTable?.findIndex(item => item?.key === key);
        const selectedArrayFilter = dataTable?.filter(item => item?.key === key);
        setSelectedPositionData(selectedArrayFilter);
        const hasChildren = dataTable?.filter(item => item?.positionParent === selectedArrayFilter[0]?.positionName);
        if (hasChildren?.length > 0 || key === 1) {
            setDisabledChangeParent(true);

        } else {
            setDisabledChangeParent(false);

        }
        setUpdateByDiagramClicked(true);
        setListParentPosition(data_position?.filter(itemListParent => selectedArrayFilter?.some(item => item?.positionName !== itemListParent?.name))?.filter(itemTable => dataTable?.some(item => item?.positionName === itemTable?.name)));
    },[dataTable, data_position])
 
    // on finish input
    const onFinish = (formValue) => {
        let values;
        if (updateByDiagramClicked) {
            const key = Object.assign({}, ...selectedPositionData);
            const rowData = { key: key?.key, ...formValue };
            const findIndex = dataTable.findIndex((item) => rowData.key === item.key);
            const newData = [...dataTable];
            const item = newData[findIndex];
            const updatedRow = { ...item, ...formValue };
            newData.splice(findIndex, 1, updatedRow)
            setDataTable(newData)
        } else {
            const maxId = dataTable.reduce(
                (max, item) => (item.key > max ? item.key : max),
                0
            );
            if (id && data_detail && type === 'update') {
                values = {
                    key: maxId + 1,
                    positionParent: formValue?.positionParent === undefined ? null : formValue?.positionParent,
                    status: data_detail?.status,
                    rHierId: id,
                    ...formValue
                }
            } else {
                values = {
                    key: maxId + 1,
                    positionParent: formValue?.positionParent === undefined ? null : formValue?.positionParent,
                    ...formValue
                }
            }
            setDataTable([...dataTable, values]);
        }
        setListPosition(listPosition?.filter(itemPosition => itemPosition?.name !== formValue?.positionName));
        setListParentPosition(prevState => (
            [...prevState, ...data_position?.filter(itemPosition => itemPosition?.name === formValue?.positionName)]
        )
        )
        form.resetFields();
        setUpdateByDiagramClicked(false)
        setSelectedPositionData([])
        // setDisabledButtonInsert(true);
        setDisabledChangeParent(false);
    };

    // handle search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
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

    }

    // handle change pagination
    const handleChange = (pageChange, pageSizeChange) => {
        setPage(pageSize !== pageSizeChange ? 1 : pageChange);
        setPageSize(pageSizeChange);
    };
    // transform hieararchy
    const transformDataToTree = useCallback((data) => {
        const nodes = {};
        const rootNodeIds = new Set();
        if (data?.length === 0) {
            return [{ name: 'No Data', children: [] }];
        } else {
            data?.forEach((node) => {
                const { positionName, positionParent } = node;
                nodes[positionName] = { ...node, children: [] };
                if (positionParent === null || positionParent === '' || positionParent === undefined) {
                    rootNodeIds?.add(positionName);
                }
            });
            data?.forEach((node) => {
                const { positionName, positionParent } = node;
                if (positionParent !== null || positionParent === '' || positionParent === undefined) {
                    nodes[positionParent]?.children?.push(nodes[positionName]);
                }
            });
        }
        return Array.from(rootNodeIds).map((rootId) => nodes[rootId]);
    }, []);

    const hasChildren = useCallback((data, filterId) => {
        const findMatchingObject = (items) => {
            for (let item of items) {
                // Check if the current item's id matches the filterId
                if (item.key === filterId) {
                    return item.children && item.children.length > 0; // Return true if it has children, false otherwise
                }

                // If it has children, search recursively
                if (item.children && item.children.length > 0) {
                    const result = findMatchingObject(item.children);
                    if (result !== null) {
                        return result;
                    }
                }
            }
            return null;
        }
        return findMatchingObject(data) !== null ? findMatchingObject(data) : false;
    }, []);

    // columns
    const columns = useCallback((transformData) => [
        {
            title: "NO",
            // dataIndex: "name",
            // key: "name",
            align: 'center',
            width: 60,
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "POSITION",
            dataIndex: "positionName",
            key: "positionName",
            sorter: (a, b) => sorterFunction('positionName', a, b),
            ...getColumnSearchProps(
                "positionName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            ellipsis: {
                showTitle: false,
            },
            render: (text) => renderColumn('positionName', searchedColumn, searchText, text, true, 'input', search)
        },
        {
            title: "ON ASSIGNMENT",
            dataIndex: "on_assignment",
            key: "on_assignment",
            align: 'center',
            sorter: (a, b) => sorterFunction('on_assignment', a, b),
            ...getColumnSearchProps(
                "on_assignment",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false
            ),
            render: (text) => renderColumn('on_assignment', searchedColumn, searchText, text, false, 'input', search)

        },
        {
            title: "PARENT",
            dataIndex: "positionParent",
            key: "positionParent",
            sorter: (a, b) => sorterFunction('positionParent', a, b),
            ...getColumnSearchProps(
                "positionParent",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false
            ),
            ellipsis: {
                showTitle: false,
            },
            render: (text) => renderColumn('positionParent', searchedColumn, searchText, text, true, 'input', search)

        },
        {
            title: "DESCRIPTION",
            dataIndex: "remark",
            key: "remark",
            align: 'left',
            sorter: (a, b) => sorterFunction('remark', a, b),
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchProps(
                "remark",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
            ),
            render: (text) => renderColumn('remark', searchedColumn, searchText, text, true, 'input', search)
        },

        {
            title: "ACTION",
            dataIndex: "action",
            key: "action",
            align: 'center',
            width: '10%',
            fixed: 'right',
            render: (_, record, data) => {
                const isDisabled = hasChildren(transformData, record?.key);

                return (
                    <div className="w-full flex justify-center gap-4 mt-1 items-start">
                        <Tooltip title={"Detail"}>
                            <div
                                border={false}
                                className={updateByDiagramClicked ? 'cursor-not-allowed' : 'cursor-pointer'}
                                onClick={() => {
                                    updateByDiagramClicked === false  && handleDetail(record);
                                }}
                            >
                                <UnorderedListOutlined
                                    style={{ fontSize: "24px", color: "#0075bf" }}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip title={"Update"}>
                            <div
                                onClick={() => handleUpdateRow(record.key)}>
                                <SVGIcon name="IconEdit" width={24} />
                            </div>
                        </Tooltip>
                        <Tooltip title={"Delete"}>
                            <div
                                className={updateByDiagramClicked ||  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                                onClick={() => {
                                    (updateByDiagramClicked === false && isDisabled === false) && handleDelete(record, listParentPosition);
                                }}
                            >
                                <DeleteOutlined style={{ color: updateByDiagramClicked || isDisabled ? "#8D91A0" : "#BE3036", fontSize: 24, cursor: isDisabled || updateByDiagramClicked ? 'not-allowed' : 'pointer' }} />
                            </div>
                        </Tooltip>
                    </div>
                );
            },
        },
    ], [handleDelete, handleDetail, handleUpdateRow, hasChildren, listParentPosition, page, pageSize, search, searchText, searchedColumn, updateByDiagramClicked])

    
    // breadcrumb routes
    const breadCrumbRoutes = [
        {
            path: '',
            breadcrumbName: 'User Management'
        },
        {
            path: USER_ROUTES.VIEW_POSITION,
            breadcrumbName: 'Position Hierarchy List'
        },
        {
            path: type === "update" ? USER_ROUTES.UPDATE_POSITION : USER_ROUTES.CREATE_POSITION,
            breadcrumbName: type === "update" ? "Update Position" : "Create Position"
        },
    ];

    // render required input parent
    const isRequired = () => {
        let rules;
        if (selectedPositionData?.filter(item => item?.key === 1)?.length === 1 && updateByDiagramClicked === true) {
            rules = false;
        } else if (dataTable?.length > 0 && updateByDiagramClicked === false) {
            rules = true;
        } else if (dataTable?.length > 0) {
            return true;
        }
        return rules;
    };


    // render content on modal custom
    const renderContent = (type) => {
        if (type === 'detail') {
            return <DetailPosition handleCancelModal={handleCancel} data_detail={detailDiagram} data_position={data_position} />
        } else {
            return <ConfirmationHierarchy handleCancel={handleCancel} dataHierarchy={dataTable} handleSave={handleSaveHierarchy} id={id} data_detail={data_detail} />
        }
    }



    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
    return (
        <>
            <BreadCrumb routes={breadCrumbRoutes} />
            <Spin spinning={loading}>
                {type === "update" &&
                    <BaseContainer header={'POSITION HIERARCHY INFORMATION'}>
                        <div className={'h-[60px] w-full grid grid-cols-4 flex-wrap'}>
                            <DetailText label={"Hierarchy Name"}>{data_detail?.name}</DetailText>
                            <DetailText label={"Status"}>{toTitleCase(data_detail?.status)}</DetailText>
                            <DetailText label={"Start Date"}>{hasValue(data_detail?.startDate) && moment(data_detail?.startDate).format(dateFormatting.date)}</DetailText>
                            <DetailText label={"End Date"}>{hasValue(data_detail?.endDate) && moment(data_detail?.endDate).format(dateFormatting.date)}</DetailText>
                        </div>
                        <div className={'h-[60px] w-full'}>
                            <DetailText label={"Description"}>{data_detail?.description}</DetailText>
                        </div>
                    </BaseContainer>
                }
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <BaseContainer header={'POSITION HIERARCHY'}>
                        <div className="grid grid-cols-2 gap-7">
                            {!dataTable || dataTable?.length === 0 ? (
                                <div
                                    className={
                                        "w-full bg-gray-200 flex justify-center items-center"
                                    }
                                >
                                    <span> Area Bagan Hierarchy</span>
                                </div>
                            ) : (
                                <>
                                    <PositionHierarchyDiagram data={transformDataToTree(dataTable)} onClick={handleUpdateRow} />
                                </>
                            )}
                            <div>
                                <Form.Item
                                    label={'Position'}
                                    name={'positionName'}
                                    rules={formMessageRequired('Position Name')}
                                >
                                    <SelectComponent
                                        value={form?.getFieldsValue('positionName')}
                                        onChange={(e) => handleChangeListPosition(e)}
                                        disabled={updateByDiagramClicked === true ? true : false}
                                    >
                                        {listPosition?.map((item, key) => {
                                            return (
                                                <Select.Option value={item?.name} key={key}>
                                                    {item?.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </SelectComponent>
                                </Form.Item>
                                <Form.Item
                                    label={'Parent'}
                                    name={'positionParent'}
                                    rules={
                                        isRequired() ? formMessageRequired('Position Parent') : null}

                                >
                                    <SelectComponent
                                        disabled={disabledChangeParent}
                                    >
                                        {listParentPosition?.map((item, key) => {
                                            return (
                                                <Select.Option value={item?.name} key={key}>
                                                    {item?.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </SelectComponent>
                                </Form.Item>
                                <Form.Item label={'Description'} name={'remark'}>
                                    <InputComponent type="textarea" />
                                </Form.Item>

                            </div>
                        </div>
                    </BaseContainer>
                    <Form.Item>
                        <div className={"w-full flex justify-end gap-2 mt-5"}>
                            <ButtonComponent
                                icon={<SVGIcon name={`IconButtonClear`} width={20} />}
                                border={false}
                                type={'submit'}
                                onClick={handleClearInput}
                            >
                                Clear
                            </ButtonComponent>
                            <ButtonComponent
                                type={'submit'}
                                htmlType={'submit'}
                                disabled={disabledButtonInsert}
                            >Save
                            </ButtonComponent>
                        </div>
                    </Form.Item>
                </Form>
                <BaseContainer header={'POSITION LIST'}>
                    <div className={'w-full'}>
                        <TablePaginationNew
                            type='FE'
                            columns={columns(transformDataToTree(dataTable))}
                            dataSource={dataTable}
                            pageSize={pageSize}
                            current={page}
                            // totalData={updatePagination(dataTable, 'length', searchedColumn, searchText, page, pageSize, 'string')}
                            onChange={handleChange}
                            onSizeChanger={handleChange}
                            tableScrolled={{ x: 1500, y: 500 }}
                        />
                    </div>
                </BaseContainer>

                <div className='w-full flex'>
                    <div>
                        <ButtonComponent
                            type={"submit"}
                            onClick={() => setOpenBackModal(true)}
                            className={'my-5'}
                            disabled={updateByDiagramClicked}
                        >
                            Back
                        </ButtonComponent>

                    </div>
                    <div className='w-full flex justify-end gap-5'>
                        <ButtonComponent
                            type={"submit"}
                            icon={<SVGIcon name={type === "update"
                                ? `IconButtonReset`
                                : `IconButtonClear`} width={20} />}
                            onClick={handleResetHierarchy}
                            className={'my-5'}
                            disabled={updateByDiagramClicked}
                        >
                            {type === "create" ? "Clear" : "Reset"}
                        </ButtonComponent>
                        <ButtonComponent
                            type={"submit"}
                            // icon={<ArrowLeftOutlined style={{ fontSize: "24px" }} />}
                            onClick={handleSubmit}
                            className={'my-5'}
                            disabled={updateByDiagramClicked}
                        >
                            Submit
                        </ButtonComponent>
                    </div>
                </div>
            </Spin>

            {/* modal inactive */}
            <ModalCustom header={"INACTIVATE HIERARCHY"} isOpen={openModal} handleCancel={handleCancel}>
                <div className={"flex flex-col px-8 py-4"}>
                    <div className="w-full justify-center flex my-6">
                        <span className={"text-xl text-[#3C6DB2]"}>
                            {" "}
                            Are you sure want to delete position?
                        </span>
                    </div>
                    <div className={"w-full justify-center flex"}>
                        <ButtonComponent
                            type={"default"}
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent type={"submit"}>
                            Delete
                        </ButtonComponent>
                    </div>
                </div>
            </ModalCustom>

            {/* modal confirmation or detail */}
            <ModalCustom
                isOpen={modalCustom}
                type={modalType}
                header={modalType === 'detail' ? 'DETAIL POSITION' : 'SAVE HIERARCHY'}
                width={900}
                handleCancel={handleCancel}
                footer={
                    modalType === 'detail' &&
                    <div className={"w-full flex justify-end gap-5"}>
                        <ButtonComponent
                            type={"submit"}
                            onClick={handleCancel}
                        >
                            Back
                        </ButtonComponent>
                    </div>

                }
            >
                {renderContent(modalType)}
            </ModalCustom>

            {/* modal attention */}
            <ModalAttention
                isOpen={modalEmptyList}
                handleCancel={handleCancel}
                handleOk={handleCancel}
                textList={'position list hierarchy'}
            />

            {/* modal back confirmation */}
            <ModalBack
                isOpen={openBackModal}
                handleCancel={() => setOpenBackModal(false)}
                handleOk={() => navigate(-1)}
            />

            {/* modal try again */}
            {renderModal()}
        </>
    );
}

export default PositionHierarchyForm;
