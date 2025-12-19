import { Form, Select } from 'antd';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { formMessageRequired, hasValue } from '../../../../utils';
import SelectComponent from '../../../../components/SelectComponent';
import TableRBI from '../../../../components/TableRBI';
import { applyFixedColumns } from '../../../../utils/applyFixedColumns';
import BaseContainer from '../../../../components/BaseContainer';
import { getApprovalHierarchy, getListApprovalById } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import { useDispatch, useSelector } from 'react-redux';
import DetailText from '../../../../components/DetailText';

const ApprovalLayout = ({ type, onApprovalChange = () => { }, selectedAppHierId, status, form }) => {
    const dispatch = useDispatch();
    const searchInput = useRef(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState("");
    const [approvalOptions, setApprovalOptions] = useState([]);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [savedApproval, setSavedApproval] = useState(null);

    const [fixedColumns, setFixedColumns] = useState(() => ({
        left: ['no'],
        right: [],
    }));

    const { list_approval_by_id } = useSelector((state) => state.monitoring_usage);
    
    const dataHierarchy = list_approval_by_id?.map((item, index) => ({
        ...item,
        key: index
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(getApprovalHierarchy({ page, pageSize }));
                setApprovalOptions(response.payload);
            } catch (error) {
            }
        };
        if (selectedAppHierId) {
            dispatch(getListApprovalById(selectedAppHierId));
        }
        fetchData();
    }, [dispatch, page, pageSize, selectedAppHierId]);

    const handleApprovalChange = (e) => {
        dispatch(getListApprovalById(e));
        onApprovalChange(e);
        setSelectedApproval(e);
        setSavedApproval(e);
    };

    console.log(selectedApproval, ' selected');

    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter && sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    const handleChangePage = (pageChange, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    const baseColumns = useMemo(() => [
        {
            key: "no",
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => index + 1,
        },
        {
            key: "approvalLevel",
            title: "HIERARCHY",
            dataIndex: "approvalLevel",
            sorter: true,
        },
        {
            key: "position",
            title: "POSITION",
            dataIndex: "position",
            sorter: true,
        },
    ], []);

    const processedColumns = useMemo(() => {
        return applyFixedColumns(baseColumns, fixedColumns);
    }, [baseColumns, fixedColumns]);

    const columnDefinitions = useMemo(() => {
        return baseColumns.map((col) => ({
            key: col.key || col.dataIndex || col.title,
            title: col.title,
        }));
    }, [baseColumns]);

    const columnExpand = useMemo(() => [
        {
            key: "no",
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => index + 1,
        },
        {
            key: "employeeName",
            title: "EMPLOYEE",
            dataIndex: "employeeName",
        },
    ], []);

    const expandedRowRender = (record) => {
        const dataExpands = record?.employeeDetail || [];
        
        return (
            <div className="flex flex-col py-4 pr-4 pl-[48px]">
                <p className="text-primary text-xs font-bold uppercase">
                    {"EMPLOYEE INFORMATION"}
                </p>
                <TableRBI
                    dataSource={dataExpands}
                    columns={columnExpand}
                    current={1}
                    pageSize={dataExpands.length}
                    onChange={() => {}}
                    onSizeChanger={() => {}}
                    totalData={dataExpands.length}
                    showExport={false}
                    showPagination={false}
                    loading={false}
                />
            </div>
        );
    };

    // render layout
    const renderLayout = (type) => {
        if (type === 'detail-approval') {
            return (
                <BaseContainer header={'approval information'}>
                    <Form.Item
                        label='Approval Hierarchy'
                        name='approval'
                        className="w-1/3"
                        getValueFromEvent={handleApprovalChange}
                    >
                        <SelectComponent onChange={onApprovalChange} disabled={status === "COMPLETE"}>
                            {approvalOptions?.map((data) => (
                                <Select.Option value={data.approvalId} key={data.apphierId}>
                                    {data.approvalName}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>

                    {hasValue(selectedAppHierId) ? (
                        <TableRBI
                            dataSource={dataHierarchy}
                            columns={processedColumns}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onSizeChanger={handleChangePage}
                            totalData={dataHierarchy?.length || 0}
                            onSort={onSort}
                            showExport={false}
                            showPagination={false}
                            columnDefinitions={columnDefinitions}
                            fixedColumns={fixedColumns}
                            setFixedColumns={setFixedColumns}
                            expandable={{ expandedRowRender }}
                            loading={false}
                        />
                    ) : null}
                </BaseContainer>
            );
        } else if (type === 'approval-confirmation') {
            return (
                <>
                    <div className="text-primary text-xs font-bold uppercase my-5">
                        Approval Information
                    </div>
                    <div className={'w-full grid grid-cols-4 mb-5'}>
                        <DetailText label={'Approval Hierarchy'}>
                            {approvalOptions?.find(item => item.approvalId === selectedAppHierId)?.approvalName || '-'}
                        </DetailText>
                    </div>
                    <div>
                        {hasValue(selectedAppHierId) ? (
                            <TableRBI
                                dataSource={dataHierarchy}
                                columns={processedColumns}
                                current={page}
                                pageSize={pageSize}
                                onChange={handleChangePage}
                                onSizeChanger={handleChangePage}
                                totalData={dataHierarchy?.length || 0}
                                onSort={onSort}
                                showExport={false}
                                showPagination={false}
                                columnDefinitions={columnDefinitions}
                                fixedColumns={fixedColumns}
                                setFixedColumns={setFixedColumns}
                                expandable={{ expandedRowRender }}
                                loading={false}
                            />
                        ) : null}
                    </div>
                </>
            );
        } else {
            return (
                <div className='flex-row'>
                    <Form.Item
                        label='Approval Hierarchy'
                        name='approval'
                        rules={formMessageRequired('Approval Hierarchy')}
                    >
                        <SelectComponent onChange={handleApprovalChange} defaultValue={selectedAppHierId}>
                            {approvalOptions?.map((data) => (
                                <Select.Option value={data.approvalId} key={data.apphierId}>
                                    {data.approvalName}
                                </Select.Option>
                            ))}
                        </SelectComponent>
                    </Form.Item>
                    {hasValue(selectedAppHierId) ? (
                        <TableRBI
                            dataSource={dataHierarchy}
                            columns={processedColumns}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onSizeChanger={handleChangePage}
                            totalData={dataHierarchy?.length || 0}
                            onSort={onSort}
                            showExport={false}
                            showPagination={false}
                            columnDefinitions={columnDefinitions}
                            fixedColumns={fixedColumns}
                            setFixedColumns={setFixedColumns}
                            expandable={{ expandedRowRender }}
                            loading={false}
                        />
                    ) : null}
                </div>
            );
        }
    };

    return (
        <>
            {renderLayout(type)}
        </>
    );
};

export default ApprovalLayout;