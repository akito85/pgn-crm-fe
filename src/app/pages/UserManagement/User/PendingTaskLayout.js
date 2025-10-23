import { WarningOutlined } from '@ant-design/icons';
import { Alert, Form, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TablePaginationNew from '../../../../components/TablePaginationNew';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../utils/getColumnSearchProps';
import { formMessageRequired, hasValue, renderColumn, renderDateColumn } from '../../../../utils';
import SelectComponent from '../../../../components/SelectComponent';
import InputComponent from '../../../../components/InputComponent';

const PendingTaskLayout = (props) => {
    const { data, typeLayout = 'pending', idForm, handleSave = () => { }, isOpen } = props;
    const searchInput = useRef(null);
    const [form] = Form.useForm();
    // state
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState({})
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState("")

    const handleCancel = useCallback((type) => {
        if (type === false) {
            form.resetFields()
            setSearch({})
            setPage(1)
            setPageSize(10)
            setSearchText('')
            setSearchedColumn('')
        }
    }, [form])

    useEffect(() => {
       handleCancel(isOpen)
    }, [isOpen, handleCancel])


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

    const handleChnage = useCallback((pageChange, pageSizeChange) => {
        setPage(pageSize !== pageSizeChange ? 1 : pageChange);
        setPageSize(pageSizeChange);
    }, [pageSize]);

    const column = useMemo(() => [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, object, index) => index + 1,
        },
        {
            title: "TRANSACTION ID",
            dataIndex: "idTrans",
            align: "left",
            // width: 175,
            filteredValue: [search?.idTrans] || null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                'idTrans',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) => renderColumn('idTrans', searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "APPROVAL TYPE",
            dataIndex: "approvalType",
            // width: 115,
            align: "left",
            filteredValue: [search?.approvalType] || null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                'approvalType',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
            render: (text) => renderColumn('approvalType', searchedColumn, searchText, text, false, 'input', search)
        },
        {
            title: "TASK DATE",
            dataIndex: "createdDate",
            width: 180,
            align: "center",
            filteredValue: [search?.createdDate] || null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                'createdDate',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'datetime'
            ),
            render: (taskDate) => renderDateColumn('createdDate', hasValue(search['createdDate']), searchText, taskDate, 'datetime', search)
        },
        {
            title: "STATUS",
            dataIndex: "status",
            width: 190,
            align: "center",
            fixed: 'right',
            filteredValue: [search?.status] || null,
            ...getColumnSearchPropsUseFilteredValueFE(
                search,
                'status',
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'status'
            ),
            render: (taskDate) => renderColumn('status', searchedColumn, searchText, taskDate, false, 'status', search)
        },
    ], [search, searchText, searchedColumn])

    const RenderComponents = useCallback((type) => {
        if (type === "pending") {
            return (
                <div>
                    <Alert
                        message={
                            <div>
                                <p>Oops, can’t inactive user when there are pending approval...</p>
                                <p>Forward task or Remind the person in charge to immediately finish the approval process and try again</p>
                            </div>
                        }
                        icon={<WarningOutlined style={{ fontSize: "43px" }} />}
                        type={"warning"}
                        showIcon
                    />
                    <span className={'text-primary text-xs font-bold uppercase'}>
                        Pending Task
                    </span>
                    <TablePaginationNew
                        columns={column}
                        dataSource={data?.dataTable?.map(item => ({ ...item, status: item?.status === "WAITING_FOR_APPROVAL" ? 'Waiting Approval' : item?.status }))}
                        type='FE'
                        useSelect
                        current={page}
                        pageSize={pageSize}
                        onChange={handleChnage}
                        tableScrolled={{ x: 1200, y: 550 }}

                    />
                </div>
            )
        } else {
            return (
                <div className='gap-5'>
                    <span className={'text-primary text-xs font-bold uppercase'}>
                        Pending Task
                    </span>
                    <TablePaginationNew
                        columns={column}
                        dataSource={data?.dataTable?.map(item => ({ ...item, status: item?.status === "WAITING_FOR_APPROVAL" ? 'Waiting Approval' : item?.status }))}
                        type='FE'
                        useSelect
                        current={page}
                        pageSize={pageSize}
                        onChange={handleChnage}
                        tableScrolled={{ x: 1200, y: 550 }}

                    />
                    <Form id={idForm} layout='vertical' form={form} onFinish={handleSave}>
                        <div className="w-auto grid grid-cols-1 mt-10">
                            <span className={'text-primary text-xs font-bold uppercase pb-5'}>
                                Forward Task
                            </span>
                            <Form.Item label={"To"} rules={formMessageRequired("To")} name={'to'}>
                                <SelectComponent>
                                    {data?.dataForm?.toPosition?.map((data, index) => (
                                        <Select.Option value={data.employeeCodeForward} key={index}>
                                            {data.name}-{data.empName}
                                        </Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item
                                label={"Remark"}
                                rules={formMessageRequired("Remark")}
                                name={"remark"}
                            >
                                <InputComponent type="textarea" />
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            )
        }
    }, [column, data?.dataTable, data?.dataForm, page, pageSize, handleChnage, idForm, form, handleSave]);


    return (
        <div className={'w-full flex flex-col gap-5'}>
            {
                RenderComponents(typeLayout)
            }
        </div>
    );
}

export default PendingTaskLayout;
