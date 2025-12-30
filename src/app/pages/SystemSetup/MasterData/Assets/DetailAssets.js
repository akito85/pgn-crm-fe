import React, { useEffect, useRef, useState } from 'react';
import LayoutMenu from '../../../../../components/SidebarMenu/LayoutMenu';
import BreadCrumb from '../../../../../components/BreadCrumb';
import { SYSTEM_SETUP_ROUTES } from '../../../../../routes/system_setup/setup_routes';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import BaseContainer from '../../../../../components/BaseContainer';
import DetailText from '../../../../../components/DetailText';
import { getDetailAssets } from '../../../../../redux/slices/account_management/MasterData/assets_slice';
import { dateFormatting, hasValue, renderColumn, renderDateColumn, toTitleCase } from '../../../../../utils';
import moment from 'moment';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import TablePaginationNew from '../../../../../components/TablePaginationNew';
import { getColumnSearchPropsUseFilteredValueFE } from '../../../../../utils/getColumnSearchProps';

const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        // case "value":
        //   return separatorCurrency(obj[fieldSort])?.replace(/,/g, "")
        //   // return format.toLowerCase();

        case "uninstallDate":
        case "installDate":
          return obj[fieldSort]
            ? moment(obj[fieldSort])
            : "";
          // return date.toLowerCase();

        default:
          return obj[fieldSort]?.toLowerCase();
      }
    };
    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    const handleCompare = (a, b) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          if (a && b) {
            if (a.isBefore(b)) return -1;
            if (a.isAfter(b)) return 1;
            return 0;
          }
          return 0; // Handle null cases if necessary
        // case "value":
        //   return Math.sign(parseFloat(a) - parseFloat(b))
        default:
          return a.localeCompare(b);
      }
    }
      return handleCompare(fa, fb);
  };
  
const DetailAssets = () => {
    const { loading, data_detail } = useSelector(state => state.assets);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchInput = useRef(null);

    // use state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");


    // use effect
    useEffect(() => {
        if (location?.state?.id) {
            dispatch(getDetailAssets(location?.state?.id))
        }
    }, [dispatch, location]);

    // console.log(data_detail, ' data detail');
    // breadcrumb routes
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
            path: SYSTEM_SETUP_ROUTES.VIEW_MASTER_ASSETS,
            breadcrumbName: "Assets",
        },
        {
            path: "",
            breadcrumbName: "Detail Asset",
        },
    ];

    // column history assignment
    const columnHistoryAssignment = (
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch = () => { },
    ) => {
        return [
            {
                title: "NO",
                width: 50,
                align: "center",
                dataIndex: 'no',
                render: (text, object, index) => (page - 1) * pageSize + index + 1,
            },
            {
                title: "CUSTOMER NUMBER",
                // width: 50,
                dataIndex: 'customerNumber',
                align: "left",
                // sorter: true,
                filteredValue: search?.["customerNumber"] ? [search?.["customerNumber"]] : null,
                sorter: (a, b) => sorter("customerNumber", a, b),
                // ...getColumnSearchPropsPaging(
                //     "customerNumber",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "customerNumber",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "customerNumber",
                      hasValue(search["customerNumber"]),
                      searchText,
                      text,
                      false,
                      "input",
                      search
                    ),
            },
            {
                title: "CUSTOMER NAME",
                // width: 50,
                dataIndex: 'customerName',
                align: "left",
                filteredValue: search?.["customerName"] ? [search?.["customerName"]] : null,
                sorter: (a, b) => sorter("customerName", a, b),

                // ...getColumnSearchPropsPaging(
                //     "customerName",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "customerName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "customerName",
                      hasValue(search["customerName"]),
                      searchText,
                      text,
                      false,
                      "input",
                      search
                    ),
            },
            {
                title: "ACCOUNT NUMBER",
                // width: 50,
                dataIndex: 'accountNumber',
                align: "right",
                filteredValue: search?.["accountNumber"] ? [search?.["accountNumber"]] : null,
                sorter: (a, b) => sorter("accountNumber", a, b),

                // ...getColumnSearchPropsPaging(
                //     "accountNumber",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "accountNumber",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "accountNumber",
                      hasValue(search["accountNumber"]),
                      searchText,
                      text,
                      false,
                      "input",
                      search
                    ),
            },
            {
                title: "ACCOUNT NAME",
                // width: 50,
                dataIndex: 'accountName',
                align: "left",
                filteredValue: search?.["accountName"] ? [search?.["accountName"]] : null,
                sorter: (a, b) => sorter("accountName", a, b),

                // ...getColumnSearchPropsPaging(
                //     "accountName",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "accountName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "accountName",
                      hasValue(search["accountName"]),
                      searchText,
                      text,
                      false,
                      "input",
                      search
                    ),
            },
            {
                title: "PREMISE",
                width: 300,
                dataIndex: 'premise',
                align: "left",
                // sorter: true,
                filteredValue: search?.["premise"] ? [search?.["premise"]] : null,
                sorter: (a, b) => sorter("premise", a, b),

                // ...getColumnSearchPropsPaging(
                //     "premise",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ellipsis: {
                    showTitle: false,
                },
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "premise",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "premise",
                      hasValue(search["premise"]),
                      searchText,
                      text,
                      true,
                      "input",
                      search
                    ),
                // render: (text) => (
                //     <Tooltip placement="topLeft" title={text}>
                //         {text ? text : ""}
                //     </Tooltip>
                // )
            },
            {
                title: "SERVICE POINT",
                // width: 50,
                dataIndex: 'servicePointName',
                align: "left",
                // sorter: true,
                filteredValue: search?.["servicePointName"] ? [search?.["servicePointName"]] : null,
                sorter: (a, b) => sorter("servicePointName", a, b),

                // ...getColumnSearchPropsPaging(
                //     "servicePoint",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "servicePointName",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "servicePointName",
                      hasValue(search["servicePointName"]),
                      searchText,
                      text,
                      false,
                      "input",
                      search
                    ),
            },
            {
                title: "REMARK",
                // width: 50,
                dataIndex: 'remark',
                align: "left",
                filteredValue: search?.["remark"] ? [search?.["remark"]] : null,
                sorter: (a, b) => sorter("remark", a, b),
                ellipsis: {
                    showTitle: false,
                },
                // ...getColumnSearchPropsPaging(
                //     "remark",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "remark",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "input"
                  ),
                  render: (text) =>
                    renderColumn(
                      "remark",
                      hasValue(search["remark"]),
                      searchText,
                      text,
                      true,
                      "input",
                      search
                    ),
            },
            {
                title: "INSTALL DATE",
                // width: 50,
                dataIndex: 'installDate',
                align: "center",
                filteredValue: search?.["installDate"]
                ? [search?.["installDate"]]
                : null,
                sorter: (a, b) => sorter("installDate", a, b),

                // ...getColumnSearchPropsPaging(
                //     "installDate",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                // render: (installDate) => hasValue(installDate) && moment(installDate).format(dateFormatting.datePeriod),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "installDate",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "date"
                  ),
                  render: (text) =>
                    renderDateColumn(
                      "installDate",
                      hasValue(search["installDate"]),
                      searchText,
                      text,
                      "date",
                      search
                    ),
            },
            {
                title: "UNINSTALL DATE",
                // width: 50,
                dataIndex: 'uninstallDate',
                align: "center",
                filteredValue: search?.["uninstallDate"]
                ? [search?.["uninstallDate"]]
                : null,
                sorter: (a, b) => sorter("uninstallDate", a, b),

                // ...getColumnSearchPropsPaging(
                //     "uninstallDate",
                //     searchInput,
                //     searchedColumn,
                //     searchText,
                //     handleSearch,
                // ),
                // render: (uninstallDate) => hasValue(uninstallDate) && moment(uninstallDate).format(dateFormatting.datePeriod),
                ...getColumnSearchPropsUseFilteredValueFE(
                    search,
                    "uninstallDate",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    "date"
                  ),
                  render: (text) =>
                    renderDateColumn(
                      "uninstallDate",
                      hasValue(search["uninstallDate"]),
                      searchText,
                      text,
                      "date",
                      search
                    ),
            },
        ]
    };



    // handle searh
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

    // handle sort
    const onSort = (_, __, sort) => {
        const dataSort = sort.order
            ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
            : "";
        setSort(dataSort);
    };


    return (
        <LayoutMenu>
            <Spin spinning={loading}>
                <BreadCrumb routes={routes} />
                <BaseContainer header={'asset information'}>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Product Name'}>{data_detail?.informationDto?.productInformation?.name}</DetailText>
                        <DetailText label={'Service Type'}>{data_detail?.informationDto?.serviceType}</DetailText>
                        <DetailText label={'Asset Name'}>{data_detail?.informationDto?.assetName}</DetailText>
                        <DetailText label={'Asset Type'}>{data_detail?.informationDto?.assetType}</DetailText>
                        <DetailText label={'Serial Number'}>{data_detail?.informationDto?.serialNumber}</DetailText>
                        <DetailText label={'Brand'}>{data_detail?.informationDto?.brand}</DetailText>
                        <DetailText label={'Year'}>{data_detail?.informationDto?.year}</DetailText>
                        <DetailText label={'Custody Transfer'}>{data_detail?.informationDto?.custodyTransfer === true ? 'Yes' : 'No'}</DetailText>
                    </div>
                    <div className="py-4">
                        <div className="text-primary text-xs font-bold uppercase">
                            ASSET ATTRIBUTE
                        </div>
                    </div>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Inlet Diameter'}>{data_detail?.attribute?.inletDiameter}</DetailText>
                        <DetailText label={'Outlet Diameter'}>{data_detail?.attribute?.outletDiameter
                        }</DetailText>
                        <DetailText label={'Minimum Inlet Pressure'}>{data_detail?.attribute?.minInletPressure}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Maximum Inlet Pressure'}>{data_detail?.attribute?.maxInletPressure}</DetailText>
                        <DetailText label={'Minimum Outlet Pressure'}>{data_detail?.attribute?.minimumOutletPressure}</DetailText>
                        <DetailText label={'Maximum Outlet Pressure'}>{data_detail?.attribute?.maxOutletPressure}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Max Flow Capacity Per Stream'}>{data_detail?.attribute?.maxFlowCapacityPerStream}</DetailText>
                        <DetailText label={'Stream Amount'}>{data_detail?.attribute?.streamAmount}</DetailText>
                        <DetailText label={'G Size'}>{data_detail?.attribute?.gsize}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Setting Pressure'}>{data_detail?.attribute?.settingPressure}</DetailText>
                        <DetailText label={'Length'}>{data_detail?.attribute?.length}</DetailText>
                        <DetailText label={'Bolt Hole Amount'}>{data_detail?.attribute?.boltHoleAmount}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-3'>
                        <DetailText label={'Minimum Capacity'}>{data_detail?.attribute?.minCapacity}</DetailText>
                        <DetailText label={'Maximum Capacity'}>{data_detail?.attribute?.maxCapacity}</DetailText>
                        <DetailText label={'Class/ANSI'}>{data_detail?.attribute?.ansi}</DetailText>
                        {/* <DetailText label={'Class/ANSI'}>{data_detail?.assetStatusDto?.assetLocation ? data_detail?.assetStatusDto?.assetLocation : ''}</DetailText> */}
                    </div>
                    <div className='w-full grid grid-cols-1'>
                        <DetailText label={'Description'}>{data_detail?.attribute?.description}</DetailText>
                    </div>
                    <div className="py-4">
                        <div className="text-primary text-xs font-bold uppercase">
                            ASSET STATUS
                        </div>
                    </div>
                    <div className='w-full grid '>
                        <DetailText label={'Status'}>{toTitleCase(data_detail?.assetStatusDto?.status)}</DetailText>
                    </div>
                    <div className='w-full grid '>
                        <DetailText label={'Asset Location'}>{data_detail?.assetStatusDto?.assetLocation}</DetailText>
                    </div>
                </BaseContainer>
                <BaseContainer header={'history log information'}>
                    <div className='w-full grid grid-cols-5'>
                        <DetailText label={'Record ID'}>{data_detail?.assetId}</DetailText>
                        <DetailText label={'Created Date'}>{hasValue(data_detail?.history?.createdDate) && moment(data_detail?.history?.createdDate).format(dateFormatting?.dateTime)}</DetailText>
                        <DetailText label={'Created By'}>{data_detail?.history?.createdBy}</DetailText>
                        <DetailText label={'Updated Date'}>{hasValue(data_detail?.history?.updatedDate) && moment(data_detail?.history?.updatedDate).format(dateFormatting?.dateTime)}</DetailText>
                        <DetailText label={'Updated By'}>{data_detail?.history?.updatedBy}</DetailText>
                    </div>
                </BaseContainer>
                <BaseContainer header={'history assignment'}>
                    <TablePaginationNew
                        dataSource={data_detail?.historyAssegment}
                        totalData={data_detail?.historyAssegment?.length}
                        current={page}
                        pageSize={pageSize}
                        tableScrolled={{ y: 525, x: 2300 }}
                        // onChange={handleChangeSize}
                        onSort={onSort}
                        columns={columnHistoryAssignment(
                            search,
                            page,
                            pageSize,
                            searchInput,
                            searchedColumn,
                            searchText,
                            handleSearch,
                        )}
                    />
                </BaseContainer>
            </Spin>
            <div className="flex mt-[30px] mb-5">
                <ButtonComponent
                    type={"submit"}
                    onClick={() => navigate(-1)}
                    icon={
                        <LeftOutlined
                            style={{
                                color: "#fff",
                                fontSize: 24,
                                justifyItems: "center",
                            }}
                        />
                    }
                >
                    Back
                </ButtonComponent>
            </div>
        </LayoutMenu>
    );
}

export default DetailAssets;
