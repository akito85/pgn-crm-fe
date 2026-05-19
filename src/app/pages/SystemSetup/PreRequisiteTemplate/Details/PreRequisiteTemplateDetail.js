import { Spin } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { getDetailPreRequisiteTemplate } from "../../../../../redux/slices/system_setup/preRequisiteTemplate";
import NxTable from "../../../../../components/Nx/NxTable";
import { sorterFunction } from "../../../../../utils/sorterFunction";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { renderColumn } from "../../../../../utils";
import { nxApplyFixedColumns } from "../../../../../utils/Nx/nxApplyFixedColumns";
import NxDate from "../../../../../components/Nx/NxDatePicker";

const columnCriteria = (
    searchCriteria,
    searchInputCriteria,
    searchedColumnCriteria,
    searchTextCriteria,
    handleSearchCriteria
) => {
    return [
        {
            key: "no",
            title: "NO",
            width: 20,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            key: "accountTypeName",
            title: "Account Type",
            dataIndex: "accountTypeName",
            width: 150,
            sorter: (a, b) => sorterFunction("accountTypeName", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchCriteria,
                "accountTypeName",
                searchInputCriteria,
                searchedColumnCriteria,
                searchTextCriteria,
                handleSearchCriteria,
                true
            )
        },
        {
            key: "accountSegmentName",
            title: "Account Segment",
            dataIndex: "accountSegmentName",
            width: 150,
            sorter: (a, b) => sorterFunction("accountSegmentName", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchCriteria,
                "accountSegmentName",
                searchInputCriteria,
                searchedColumnCriteria,
                searchTextCriteria,
                handleSearchCriteria,
                true
            )
        },
        {
            key: "startDate",
            title: "Start Date",
            dataIndex: "startDate",
            width: 150,
            sorter: (a, b) => sorterFunction("startDate", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchCriteria,
                "startDate",
                searchInputCriteria,
                searchedColumnCriteria,
                searchTextCriteria,
                handleSearchCriteria,
                true
            ),
            render: (text) => {
                return NxDate.formatDate(text, "DD MMM YYYY")
            }
        },
        {
            key: "endDate",
            title: "End Date",
            dataIndex: "endDate",
            width: 150,
            sorter: (a, b) => sorterFunction("endDate", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchCriteria,
                "endDate",
                searchInputCriteria,
                searchedColumnCriteria,
                searchTextCriteria,
                handleSearchCriteria,
                true
            ),
            render: (text) => {
                return NxDate.formatDate(text, "DD MMM YYYY")
            }
        }
    ]
}

const columnDetail = (
    searchDetail,
    searchInputDetail,
    searchedColumnDetail,
    searchTextDetail,
    handleSearchDetail
) => {
    return [
        {
            key: "no",
            title: "NO",
            width: 20,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            key: "typeName",
            title: "TYPE",
            dataIndex: "typeName",
            width: 150,
            sorter: (a, b) => sorterFunction("typeName", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchDetail,
                "typeName",
                searchInputDetail,
                searchedColumnDetail,
                searchTextDetail,
                handleSearchDetail,
                true
            )
        },
        {
            key: "name",
            title: "NAME",
            dataIndex: "name",
            width: 150,
            sorter: (a, b) => sorterFunction("name", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchDetail,
                "name",
                searchInputDetail,
                searchedColumnDetail,
                searchTextDetail,
                handleSearchDetail,
                true
            )
        },
        {
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
            width: 150,
            sorter: (a, b) => sorterFunction("description", a, b),
            ...getColumnSearchPropsUseFilteredValueFE(
                searchDetail,
                "description",
                searchInputDetail,
                searchedColumnDetail,
                searchTextDetail,
                handleSearchDetail,
                true
            )
        },
    ]
}

const PreRequisiteTemplateDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location?.state?.id;

    const [searchCriteria, setSearchCriteria] = useState({});
    const searchInputCriteria = useRef(null);
    const [searchedColumnCriteria, setSearchedColumnCriteria] = useState("");
    const [searchTextCriteria, setSearchTextCriteria] = useState("");
    
    const [searchDetail, setSearchDetail] = useState({});
    const searchInputDetail = useRef(null);
    const [searchedColumnDetail, setSearchedColumnDetail] = useState("");
    const [searchTextDetail, setSearchTextDetail] = useState("");

    const routes = [
        {
            path: "",
            breadcrumbName: "System Setup",
        },
        {
            path: SYSTEM_SETUP_ROUTES.VIEW_PRE_REQUISITE_TEMPLATE,
            breadcrumbName: "Pre-Requisite Template"
        },
        {
            path: "",
            breadcrumbName: "Detail Pre-Requisite Template"
        }
    ]

    const { loading_detail_prt: isLoading, detail_prt: detail } = useSelector((state) => state.preRequisiteTemplate);

    const handleSearchCriteria = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchTextCriteria(selectedKeys[0]);
        setSearchedColumnCriteria(dataIndex);
        setSearchCriteria((prevState) => {
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0]
            };
        });
    }

    const handleSearchDetail = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchTextDetail(selectedKeys[0]);
        setSearchedColumnDetail(dataIndex);
        setSearchDetail((prevState) => {
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0]
            };
        });
    }

    const baseColumnCriteria = useMemo(() =>
        columnCriteria(
            searchCriteria,
            searchInputCriteria,
            searchedColumnCriteria,
            searchTextCriteria,
            handleSearchCriteria
         ), [searchCriteria, searchInputCriteria, searchedColumnCriteria, searchTextCriteria]
    );

    const baseColumnDetail = useMemo(() =>
        columnDetail(
            searchDetail,
            searchInputDetail,
            searchedColumnDetail,
            searchTextDetail,
            handleSearchDetail
         ), [searchDetail, searchInputDetail, searchedColumnDetail, searchTextDetail]
    );

    const allColumnCriteria = useMemo(() => {
        const collumnWithKeys = baseColumnCriteria.map((col) => ({
            ...col,
            key: col.dataIndex || col.key || col.id
        }));
        return collumnWithKeys;
    }, [baseColumnCriteria]);

    const processedColumnCriteria = useMemo(() => {
        return nxApplyFixedColumns(allColumnCriteria);
    }, [allColumnCriteria]);

    const processedColumnDetail = useMemo(() => {
        return nxApplyFixedColumns(baseColumnDetail);
    }, [baseColumnDetail]);

    useEffect(() => {
        if (id) {
            dispatch(getDetailPreRequisiteTemplate(id));
        }
    }, [id]);

    useEffect(() => console.log("detail", detail), [detail])
    return (
        <>
        <Spin spinning={isLoading} className={"w-full top-20"}>
            <div className="flex flex-col gap-y-4">
                <NxBreadCrumb routes={routes}/>
                <NxCardContainer header={"PRE-REQUISITE TEMPLATE INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <NxDetailText label="Name">{detail?.name}</NxDetailText>
                            <NxDetailText label="Source Type">{detail?.sourceTypeName}</NxDetailText>
                            <NxDetailText label="Criteria">{detail?.criterias}</NxDetailText>
                        </div>
                        <div className="w-full">
                            <NxDetailText label="Description">{detail?.description}</NxDetailText>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>
                <NxCardContainer header={"PRE-REQUISITE TEMPLATE CRITERIA"}>
                    <NxBaseContainer border>
                        <NxTable
                            idTable={"table-criteria-prt"}
                            dataSource={detail?.criteriaDatas || []}
                            totalData={detail?.criteriaDatas?.length || 0}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={false}
                            useInfiniteScroll={false}
                            columns={processedColumnCriteria}
                        />
                    </NxBaseContainer>
                </NxCardContainer>
                <NxCardContainer header={"PRE-REQUISITE TEMPLATE LIST"}>
                    <NxBaseContainer border>
                        <NxTable
                            idTable={"table-list-prt"}
                            dataSource={detail?.details || []}
                            totalData={detail?.details?.length || 0}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={false}
                            useInfiniteScroll={false}
                            columns={processedColumnDetail}
                        />
                    </NxBaseContainer>
                </NxCardContainer>
                <NxCardContainer header={"HISTORY LOG INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-5 gap-4">
                            <NxDetailText label="Record ID">{detail?.id}</NxDetailText>
                            <NxDetailText label="Created Date">{detail?.createdDate}</NxDetailText>
                            <NxDetailText label="Created By">{detail?.createdBy}</NxDetailText>
                            <NxDetailText label="Updated Date">{detail?.updatedDate}</NxDetailText>
                            <NxDetailText label="Updated By">{detail?.updatedBy}</NxDetailText>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>
            </div>
        </Spin>
        </>
    )
}

export default PreRequisiteTemplateDetail