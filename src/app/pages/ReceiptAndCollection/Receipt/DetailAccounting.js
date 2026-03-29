import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Spin, Row, Col } from "antd";
import moment from "moment";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import CardContainerNoBorder from "../../../../components/CardContainerNoBorder";
import ButtonComponent from "../../../../components/ButtonComponent";
import FooterDetail from "../../../../components/FooterDetail";
import LogHistoryInfo from "../../../../components/LogHistoryInfo";
import DetailText from "../../../../components/DetailText";
import SectionCard from "../../../../components/SectionCard";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import { getAccountingAllocation } from "../../../../redux/slices/receipt_collection/accounting";
import { getReceiptDetail } from "../../../../redux/slices/receipt_collection/receipt";
import { clearBodyMessage } from "../../../../redux/slices/general_slice";
import TableRBI from "../../../../components/TableRBI";
import { dateFormatting, hasValue } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../utils/getColumnSearchProps";
import DetailAttachment from "./DetailAttachment";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../constants/configApp";

const DetailAccounting = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const searchInput = useRef(null);
    
    // Get ID from location state (PGN standard)
    const receiptId = location?.state?.id;

    const { loading: receiptLoading, data_detail } = useSelector((state) => state.receipt);
    const { loading: accountingLoading, accountingAllocation } = useSelector((state) => state.accounting);

    const [listDataAttachment, setListDataAttachment] = useState([]);

    // Table states
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchFilter, setSearchFilter] = useState({});
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [globalSearch, setGlobalSearch] = useState("");

    useEffect(() => {
        if (receiptId) {
            dispatch(getReceiptDetail(receiptId));
        }

        return () => {
            dispatch(clearBodyMessage());
        };
    }, [dispatch, receiptId]);

    useEffect(() => {
        if (receiptId && data_detail?.receiptDate) {
            const payPeriod = moment(data_detail.receiptDate).format("YYYYMM");
                
            dispatch(getAccountingAllocation({
                receiptId: receiptId,
                payPeriod: payPeriod
            }));
        }
    }, [dispatch, receiptId, data_detail?.receiptDate]);

    // Update attachments when data_detail is loaded
    useEffect(() => {
        if (data_detail?.attachmentDtoList) {
            const dataAttachment = data_detail.attachmentDtoList.map((item) => ({
                id: item.id,
                size: item.size,
                fileName: item.fileName,
                fileSize: item.fileSize,
                fileType: item.type,
                fileCategoryId: item.fileCategoryId,
                fileCategoryName: item.fileCategoryName,
                pathFile: item.pathFile,
                urlFile1: item.urlFile1,
                urlFile2: item.urlFile2,
                createdBy: item.createdBy,
                createdDate: item.createdDate
                    ? moment(item.createdDate).format("DD MMM YYYY")
                    : "",
                dataType: "exist"
            }));
            setListDataAttachment(dataAttachment);
        }
    }, [data_detail]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearchFilter(prev => ({ ...prev, [dataIndex]: selectedKeys[0] }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText("");
        setSearchFilter(prev => {
            const newFilter = { ...prev };
            delete newFilter[dataIndex];
            return newFilter;
        });
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleGlobalSearch = (value) => {
        setGlobalSearch(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleAdvanceSearch = (searchData) => {
        if (searchData) {
            setSearchFilter(prev => ({ ...prev, ...searchData }));
        } else {
            setSearchFilter({});
        }
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const filteredData = useMemo(() => {
        let result = [...(accountingAllocation || [])];

        // 1. Column filters
        Object.keys(searchFilter).forEach(key => {
            if (hasValue(searchFilter[key])) {
                const filterVal = searchFilter[key].toString().toLowerCase();
                result = result.filter(item => 
                    item[key]?.toString().toLowerCase().includes(filterVal)
                );
            }
        });

        // 2. Global search
        if (globalSearch) {
            const searchVal = globalSearch.toLowerCase();
            result = result.filter(item => {
                return Object.values(item).some(val => 
                    val?.toString().toLowerCase().includes(searchVal)
                );
            });
        }

        return result;
    }, [accountingAllocation, searchFilter, globalSearch]);

    const paginatedData = useMemo(() => {
        const { current, pageSize } = pagination;
        return filteredData.slice((current - 1) * pageSize, current * pageSize);
    }, [filteredData, pagination]);

    const getColumnProps = (dataIndex, typeFilter = "input") => {
        return {
            ...getColumnSearchPropsUseFilteredValueFE(
                searchFilter,
                dataIndex,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                false,
                typeFilter
            ),
            sorter: (a, b) => {
                const valA = a[dataIndex] || "";
                const valB = b[dataIndex] || "";
                return valA.toString().localeCompare(valB.toString());
            }
        };
    };

    const journalColumns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            fixed: "left"
        },
        {
            title: "PGN ORGANIZATION CODE IN SAP",
            dataIndex: "bukrs",
            width: 180,
            align: "center",
            ...getColumnProps("bukrs")
        },
        {
            title: "YEAR",
            dataIndex: "ryear",
            width: 100,
            align: "center",
            ...getColumnProps("ryear")
        },
        {
            title: "MONTH",
            dataIndex: "monat",
            width: 100,
            align: "center",
            ...getColumnProps("monat")
        },
        {
            title: "POS BATCH NUMBER",
            dataIndex: "zbatch",
            width: 150,
            ...getColumnProps("zbatch")
        },
        {
            title: "PAYMENT NUMBER",
            dataIndex: "zno_pembayaran",
            width: 150,
            ...getColumnProps("zno_pembayaran")
        },
        {
            title: "LINE NUMBER",
            dataIndex: "buzei",
            width: 150,
            align: "center",
            ...getColumnProps("buzei")
        },
        {
            title: "TRX NUMBER",
            dataIndex: "zno_tran",
            width: 150,
            ...getColumnProps("zno_tran")
        },
        {
            title: "INV NUMBER",
            dataIndex: "zno_tag",
            width: 150,
            ...getColumnProps("zno_tag")
        },
        {
            title: "TRX TYPE",
            dataIndex: "ztipe_tran",
            width: 150,
            ...getColumnProps("ztipe_tran")
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "zkode_cust",
            width: 150,
            ...getColumnProps("zkode_cust")
        },
        {
            title: "ACCOUNT SOR",
            dataIndex: "zsor",
            width: 150,
            ...getColumnProps("zsor")
        },
        {
            title: "ACCOUNT COST CENTER / AREA",
            dataIndex: "zarea",
            width: 180,
            ...getColumnProps("zarea")
        },
        {
            title: "ACCOUNT SEGMENT",
            dataIndex: "zsegmen_pel",
            width: 200,
            ...getColumnProps("zsegmen_pel")
        },
        {
            title: "ACCOUNT GROUP TYPE",
            dataIndex: "zkel_pel",
            width: 200,
            ...getColumnProps("zkel_pel")
        },
        {
            title: "ACCOUNT TYPE",
            dataIndex: "zjenis_rek",
            width: 150,
            ...getColumnProps("zjenis_rek")
        },
        {
            title: "BILLING ITEM CODE",
            dataIndex: "zkomp_bil",
            width: 200,
            ...getColumnProps("zkomp_bil")
        },
        {
            title: "BILL PERIOD",
            dataIndex: "zbilling_per",
            width: 150,
            ...getColumnProps("zbilling_per")
        },
        {
            title: "KODE KURS",
            dataIndex: "zkurs",
            width: 150,
            ...getColumnProps("zkurs")
        },
        {
            title: "DOCUMENT DATE",
            dataIndex: "wwert",
            width: 200,
            ...getColumnProps("wwert", "date"),
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-"
        },
        {
            title: "PAYMENT METHOD",
            dataIndex: "zmetPembayar",
            width: 200,
            ...getColumnProps("zmetPembayar")
        },
        {
            title: "BANK",
            dataIndex: "zbank",
            width: 150,
            ...getColumnProps("zbank")
        },
        {
            title: "PAYMENT TYPE",
            dataIndex: "ztipePembayar",
            width: 150,
            ...getColumnProps("ztipePembayar")
        },
        {
            title: "CUST ID SAP",
            dataIndex: "kunnr",
            width: 200,
            ...getColumnProps("kunnr")
        },
        {
            title: "CATEGORY SAP",
            dataIndex: "blart",
            width: 150,
            ...getColumnProps("blart")
        },
        {
            title: "DOCUMENT DATE",
            dataIndex: "bldat",
            width: 200,
            ...getColumnProps("bldat", "date"),
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-"
        },
        {
            title: "POSTING DATE",
            dataIndex: "budat",
            width: 200,
            ...getColumnProps("budat", "date"),
            render: (text) => text ? moment(text).format("DD MMM YYYY") : "-"
        },
        {
            title: "CURRENCY",
            dataIndex: "waers",
            width: 120,
            align: "center",
            ...getColumnProps("waers")
        },
        {
            title: "KURS",
            dataIndex: "kursf",
            width: 150,
            align: "right",
            ...getColumnProps("kursf", "currency"),
            render: (text) => text ? (text || 0).toLocaleString("id-ID") : 0
        },
        {
            title: "SAP TRANSACTION GROUP",
            dataIndex: "koart",
            width: 200,
            ...getColumnProps("koart")
        },
        {
            title: "GL ACCOUNT",
            dataIndex: "hkont",
            width: 150,
            ...getColumnProps("hkont")
        },
        {
            title: "AMOUNT",
            dataIndex: "wrbtr",
            width: 180,
            align: "right",
            ...getColumnProps("wrbtr", "currency"),
            render: (text) => text ? (text || 0).toLocaleString("id-ID") : 0
        },
        {
            title: "EQV IDR",
            dataIndex: "dmbtr",
            width: 180,
            align: "right",
            ...getColumnProps("dmbtr", "currency"),
            render: (text) => text ? (text || 0).toLocaleString("id-ID") : 0
        },
        {
            title: "EQV USD",
            dataIndex: "dmbe2",
            width: 180,
            align: "right",
            ...getColumnProps("dmbe2", "currency"),
            render: (text) => text ? (text || 0).toLocaleString("id-ID") : 0
        },
        {
            title: "SPECIAL GL",
            dataIndex: "umskz",
            width: 150,
            align: "center",
            ...getColumnProps("umskz")
        },
        {
            title: "PROFIT CENTER",
            dataIndex: "prctr",
            width: 200,
            ...getColumnProps("prctr")
        },
        {
            title: "TAX CODE",
            dataIndex: "mwskz",
            width: 150,
            align: "center",
            ...getColumnProps("mwskz")
        },
        {
            title: "WITHHOLDING TAX TYPE",
            dataIndex: "witht",
            width: 200,
            ...getColumnProps("witht")
        },
        {
            title: "WITHHOLDING TAX CODE",
            dataIndex: "qsskz",
            width: 200,
            ...getColumnProps("qsskz")
        },
        {
            title: "COST CENTER SAP",
            dataIndex: "kostl",
            width: 200,
            ...getColumnProps("kostl")
        },
        {
            title: "TRANSACTION REFERENCE",
            dataIndex: "zuonr",
            width: 180,
            ...getColumnProps("zuonr")
        },
        {
            title: "TEXT",
            dataIndex: "sgtxt",
            width: 200,
            ellipsis: true,
            ...getColumnProps("sgtxt")
        },
        {
            title: "REFERENSI 1",
            dataIndex: "xref1",
            width: 200,
            ...getColumnProps("xref1")
        },
        {
            title: "REFERENSI 2",
            dataIndex: "xref2",
            width: 200,
            ...getColumnProps("xref2")
        },
        {
            title: "REFERENSI 3",
            dataIndex: "xref3",
            width: 200,
            ...getColumnProps("xref3")
        },
        {
            title: "F",
            dataIndex: "f",
            width: 100,
            align: "center",
            ...getColumnProps("f")
        }
    ];

    const routes = [
        { path: "", breadcrumbName: "Payment & Collection" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT, breadcrumbName: "Receipt" },
        { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT, breadcrumbName: "Receipt List" },
        { path: "", breadcrumbName: "Detail Accounting" },
    ];

    const items = [
        {
            key: "Accounting",
            label: "Accounting",
            children: (
                <div className="flex flex-col gap-1 p-5">
                    <SectionCard title="CUSTOMER INFORMATION">
                        <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
                            <DetailText label="Customer Number">{data_detail?.customerNumber || "-"}</DetailText>
                            <DetailText label="Customer Name">{data_detail?.customer || "-"}</DetailText>
                            <DetailText label="Bill Period">{data_detail?.paymentPeriod || "-"}</DetailText>
                        </div>
                    </SectionCard>

                    <SectionCard title="ACCOUNT INFORMATION">
                        <div className="grid grid-cols-5 w-full gap-y-4 gap-x-4">
                            <DetailText label="Account Number">{data_detail?.accountNumber || "-"}</DetailText>
                            <DetailText label="Account Name">{data_detail?.accountName || "-"}</DetailText>
                            <DetailText label="Account Reference ID">{data_detail?.accountRefId || "-"}</DetailText>
                        </div>
                    </SectionCard>
                </div>
            )
        },
        {
            key: "Attachment",
            label: "Attachment",
            children: (
                <div className="p-5">
                    <DetailAttachment
                        type="detail"
                        data={listDataAttachment}
                        updateData={setListDataAttachment}
                        typeSelector="receipt"
                        service={receiptCollectionHttpService}
                        configApplication={configApp.PAYMENT_SERVICE}
                    />
                </div>
            )
        }
    ];

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            
            <Spin spinning={receiptLoading || accountingLoading}>
                {/* 1. ACCOUNTING INFORMATION */}
                <CardContainerNoBorder header="ACCOUNTING INFORMATION" className="mt-5" noPadding>
                    <div className="full-width-tabs">
                        <Tabs 
                            defaultActiveKey="Accounting" 
                            items={items} 
                            className="custom-tabs-layout" 
                        />
                    </div>
                </CardContainerNoBorder>

                {/* 2. RECEIPT INFORMATION */}
                <CardContainerNoBorder header="RECEIPT INFORMATION" className="mt-4" noPadding>
                    <div className="p-5">
                        <SectionCard>
                            <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
                                <DetailText label="Receipt Code">{data_detail?.receiptCode || "-"}</DetailText>
                                <DetailText label="Receipt Number">{data_detail?.receiptNumber || "-"}</DetailText>
                                <DetailText label="Receipt Channel">{data_detail?.receiptChannel || "-"}</DetailText>
                                <DetailText label="Payment Type">{data_detail?.paymentType || "-"}</DetailText>
                                <DetailText label="Partner">{data_detail?.partner || "-"}</DetailText>
                                <DetailText label="Collecting Agent">{data_detail?.collectingAgent || "-"}</DetailText>
                                <DetailText label="Delivery Channel">{data_detail?.deliveryChannel || "-"}</DetailText>
                                <DetailText label="Receipt Method">{data_detail?.paymentMethod || "-"}</DetailText>
                                <DetailText label="Bank">{data_detail?.bank || "-"}</DetailText>
                                <DetailText label="Receipt Date">
                                    {data_detail?.receiptDate ? moment(data_detail.receiptDate).format(dateFormatting.dateTime) : "-"}
                                </DetailText>
                                <DetailText label="Source">{data_detail?.source || "-"}</DetailText>
                                <DetailText label="Status">{data_detail?.status || "-"}</DetailText>
                                <div className="col-span-5">
                                    <DetailText label="Remark">{data_detail?.remark || "-"}</DetailText>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </CardContainerNoBorder>

                {/* 3. JOURNAL INFORMATION */}
                <CardContainerNoBorder header="JOURNAL INFORMATION" className="mt-4" noPadding>
                    <div className="p-5">
                        <SectionCard>
                            <TableRBI
                                idTable="journal-table"
                                dataSource={paginatedData}
                                columns={journalColumns}
                                useSelect={true}
                                usePagination={true}
                                loading={accountingLoading}
                                tableScrolled={{ x: 5000 }}
                                showSearchBar={true}
                                showAdvanceSearch={true}
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                totalData={filteredData.length}
                                onSizeChanger={(current, size) => setPagination({ current: 1, pageSize: size })}
                                onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
                                onAdvanceSearch={handleAdvanceSearch}
                            />
                            <div className="mt-4 flex items-center gap-2">
                                <input type="checkbox" disabled checked={data_detail?.isPostingSap} />
                                <label className="text-xs font-semibold">Posting to SAP</label>
                            </div>
                        </SectionCard>
                    </div>
                </CardContainerNoBorder>

                <LogHistoryInfo
                    data={{
                        recordId: data_detail?.id || "-",
                        createdDate: data_detail?.createdDate ? moment(data_detail.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
                        createdBy: data_detail?.createdBy || "-",
                        updatedDate: data_detail?.updatedDate ? moment(data_detail.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
                        updatedBy: data_detail?.updatedBy || "-"
                    }}
                />

                <FooterDetail
                    onCancel={() => {
                        dispatch(clearBodyMessage());
                        navigate(RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT);
                    }}
                />
            </Spin>
        </LayoutMenu>
    );
};

export default DetailAccounting;
