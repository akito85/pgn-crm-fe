import React, { useRef, useState } from 'react';
import DetailText from '../../../../components/DetailText';
import { getColumnSearchProps } from '../../../../utils/getColumnSearchProps';
import StatusComponent from '../../../../components/StatusComponent';
import TablePagination from '../../../../components/TablePagination';
import { hasValue, renderColumn, renderDateColumn } from '../../../../utils';
import { sorterFunction } from '../../../../utils/sorterFunction';
import NxTable from '../../../../components/Nx/NxTable';
import NxCardContainer from '../../../../components/Nx/NxCardContainer';
import NxBaseContainer from '../../../../components/Nx/NxBaseContainer';

const EmployeeConfirmation = ({ data, data_emp }) => {
    const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // handle search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch(
            selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`
        );
    };


    const column = [
        {
            title: "NO",
            dataIndex: "no",
            width: "5%",
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1
        },
        {
            title: "JOB",
            dataIndex: "jobId",
            editable: true,
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchProps(
                "jobId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
            ),
            sorter: (a, b) => sorterFunction('jobId', a?.jobId?.label, b?.jobId?.label, 'select'),
            render: (text) => renderColumn('jobId', searchedColumn, searchText, text?.label, true, 'input', search)
        },
        {
            title: "POSITION",
            dataIndex: "positionId",
            key: "positionId",
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchProps(
                "positionId",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
            ),
            sorter: (a, b) => sorterFunction('positionId', a?.positionId?.label, b?.positionId?.label, 'select'),
            render: (text) => renderColumn('positionId', searchedColumn, searchText, text?.label, true, 'input', search)
        },
        {
            title: "START DATE",
            dataIndex: "startDate",
            align: "center",
            width: 200,
            ...getColumnSearchProps(
                "startDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'date'
            ),
            sorter: (a, b) => sorterFunction('startDate', a, b, 'date'),
            render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
        },
        {
            title: "END DATE",
            dataIndex: "endDate",
            align: "center",
            width: 200,
            ...getColumnSearchProps(
                "endDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'date'
            ),
            sorter: (a, b) => sorterFunction('endDate', a, b, 'date'),
            render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
        },
        {
            title: "PRIMARY",
            dataIndex: "isMain",
            editable: true,
            align: "center",
            ...getColumnSearchProps(
                "isMain",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true,
                'status'
            ),
            sorter: (a, b) => sorterFunction('isMain', a, b),
            width: 150,
            render: (isMain) => {
                const pilsColor = isMain?.toLowerCase() === "primary" ? "primary" : "non-primary";
                return (
                    <StatusComponent colour={pilsColor}>{isMain}</StatusComponent>
                )
            },
        },
    ];
    const dataEmp = (value) => {
        return data_emp.find(
            (item) => item.value === value
        )?.name;
    }

    // change page and page size
    const handleChangeDetail = (pageDetail, pageSizeDetail) => {
        setPage(pageDetail);
        setPageSize(pageSizeDetail);
    };
    return (
        <div>
            <div className={"w-full flex flex-col gap-5"}>
                <NxCardContainer header={'EMPLOYEE ASSIGNMENT'}>
                    <NxBaseContainer border>
                        <div className={"w-full grid grid-cols-3 gap-5"}>
                            <DetailText label={"Employee Number"}>
                                {data?.empNumber}
                            </DetailText>
                            <DetailText label={"First Name"}>{data?.firstName}</DetailText>
                            <DetailText label={"Last Name"}>{data?.lastName}</DetailText>
                        </div>
                        <div className={"w-full grid grid-cols-3 gap-5"}>
                            <DetailText label={"Employee Type"}>{dataEmp(data?.empType)}</DetailText>
                            <DetailText
                                label={"Mobile Phone"}
                            >{data?.phone}</DetailText>
                            <DetailText label={"Email"}>{data?.email}</DetailText>
                        </div>
                        <div className={"w-full grid grid-cols-3 gap-5"}>
                            <DetailText label={"Start Date"}>{data?.startDate}</DetailText>
                            <DetailText label={"End Date"}>{data?.endDate}</DetailText>
                        </div>
                        <DetailText label={"Description"} className={"w-full"}>
                            {data?.description}
                        </DetailText>
                    </NxBaseContainer>
                </NxCardContainer>
                <NxTable
                    showAdvanceSearch={false}
                    showSearchBar={false}
                    usePagination={false}
                    columns={column}
                    current={page}
                    pageSize={pageSize}
                    onChange={handleChangeDetail}
                    onSizeChanger={handleChangeDetail}
                    dataSource={data?.assignment?.map(item => ({ ...item, isMain: item?.isMain === true ? 'Primary' : 'Non Primary' }))}
                    totalData={data?.assignment?.length}
                    tableScrolled={{
                        x: 1000,
                        y: 300,
                    }}
                />
            </div>
        </div>
    );
}

export default EmployeeConfirmation;
