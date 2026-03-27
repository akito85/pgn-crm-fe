import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Collapse, Spin } from "antd";
import { DownOutlined, LeftOutlined } from "@ant-design/icons";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import TableRBI from "../../../../components/TableRBI";
import RadioTabs from "../../../../components/RadioTabs";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import moment from "moment";
import { dateFormatting, toTitleCase } from "../../../../utils";
import {
    getReceiptDetail,
    getAllocation,
    approveOrRejectHoldReceipt,
    approveOrRejectReleaseReceipt,
    approveOrRejectReceipt,
    getListApprovalByIdReceipt,
} from "../../../../redux/slices/receipt_collection/receipt";
import { columnsAllocation } from "./DetailReceipt";
import ApprovalSectionForm from "../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import DetailAttachment from "./DetailAttachment";
import { configApp } from "../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";

const { Panel } = Collapse;

const DetailReceiptApproval = ({ type: propType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // Get ID and type from params or location.state
    const id = params.id || location?.state?.id;
    const urlType = params.type || location?.state?.type;

    // Redux State
    const { loading, data_detail, data_allocation, dataListAppHierDetail } = useSelector(
        (state) => state.receipt
    );

    // Determine type: from prop, URL param, location state, or from receipt data
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        if (data_detail?.approvalDto?.approvalType) {
            // Auto-detect from receipt data
            const category = data_detail.approvalDto.approvalType.toLowerCase();
            if (category.includes('hold')) setActiveTab('hold');
            else if (category.includes('release')) setActiveTab('release');
            else if (category.includes('refund')) setActiveTab('refund');
            else if (category.includes('reverse')) setActiveTab('reverse');
            else setActiveTab(propType || urlType || 'approval');
        } else {
            setActiveTab(propType || urlType || '');
        }
    }, [data_detail, propType, urlType]);
    
    const [modalConfirm, setModalConfirm] = useState(false);
    const [approveOrReject, setApproveOrReject] = useState("");
    const [listDataAttachment, setListDataAttachment] = useState([]);
    const [appHierDataDetail, setAppHierDataDetail] = useState([]);

    // Pagination for allocation
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const searchInput = React.useRef(null);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    // Fetch data on mount
    useEffect(() => {
        if (id) {
            dispatch(getReceiptDetail(id));
            dispatch(
                getAllocation({
                    id,
                    page,
                    pageSize,
                    sort: "createdDate~desc",
                    search: "",
                })
            );
        }
    }, [dispatch, id, page, pageSize]);

    // Load approval hierarchy if exists
    useEffect(() => {
        if (data_detail?.appHierId) {
            dispatch(
                getListApprovalByIdReceipt({ id: data_detail.appHierId })
            );
        }
    }, [data_detail, dispatch]);

    // Setup approval hierarchy data
    useEffect(() => {
        if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
            const data = dataListAppHierDetail.map((a, index) => ({
                ...a,
                key: index + 1,
                employeeDetail: a.employeeDetail?.map((b, idx) => ({
                    ...b,
                    key: idx + 1,
                })) || [],
            }));
            setAppHierDataDetail(data);
        }
    }, [dataListAppHierDetail]);

    // Load attachments
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
                dataType: "exist",
            }));
            setListDataAttachment(dataAttachment);
        }
    }, [data_detail]);

    // Handle Approve/Reject
    const handleConfirm = (res, handleClear) => {
        const data = {
            id: id,
            remark: res.remark,
            approvalId: data_detail?.approvalDto?.tAppId,
            action: approveOrReject.toUpperCase(),
        };

        const category = data_detail?.approvalDto?.approvalType;

        if (category === "RECEIPT_HOLD") {
            dispatch(approveOrRejectHoldReceipt({ body: data }));
        } else if (category === "RECEIPT_RELEASE") {
            dispatch(approveOrRejectReleaseReceipt({ body: data }));
        } else if (category === "RECEIPT_REVERSE") {
            // Pastikan approveOrRejectReverseReceipt sudah di-import di atas!
            // dispatch(approveOrRejectReverseReceipt({ body: data }));
        } else {
            dispatch(approveOrRejectReceipt({ body: data }));
        }

        setModalConfirm(false);
        handleClear();
    };

    const handleCancel = () => {
        setModalConfirm(false);
    };

    const handleTabChange = (e) => {
        setActiveTab(e.target.value);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    };

    const handleChangePage = (newPage, newPageSize) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    const showButtonApproval = data_detail?.approvalDto?.isApprover === true;
    
    // Determine actual type from receipt data for display
    const actualType = data_detail?.approvalDto?.approvalType ?
        (data_detail.approvalDto.approvalType.toLowerCase().includes('hold') ? 'hold' :
            data_detail.approvalDto.approvalType.toLowerCase().includes('release') ? 'release' :
                data_detail.approvalDto.approvalType.toLowerCase().includes('refund') ? 'refund' :
                    data_detail.approvalDto.approvalType.toLowerCase().includes('reverse') ? 'reverse' : '')
        : (propType?.toLowerCase() || urlType?.toLowerCase() || '');
        
    const typeLabel = actualType ? toTitleCase(actualType) : "";

    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "Receipt & Collection",
        },
        {
            path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
            breadcrumbName: "Receipt",
        },
        {
            path: "",
            breadcrumbName: "Detail Receipt & Allocation",
        },
    ];

    // Prepare hold/release table data
    const holdReleaseData = data_detail?.id
        ? [
            {
                key: 1,
                receiptCode: data_detail?.receiptCode,
                customerNumber: data_detail?.customerNumber,
                customerName: data_detail?.customer,
                accountNumber: data_detail?.accountNumber,
                receiptDate: data_detail?.receiptDate
                    ? moment(data_detail.receiptDate).format(dateFormatting.date)
                    : "",
                balance: data_detail?.balance || data_detail?.unAppliedAmountReal,
                holdAmount: data_detail?.holdAmount || data_detail?.unAppliedAmountReal,
                account: data_detail?.account,
            },
        ]
        : [];

    const holdReleaseColumns = [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "RECEIPT CODE",
            dataIndex: "receiptCode",
            key: "receiptCode",
        },
        {
            title: "ACCOUNT",
            dataIndex: "account",
            key: "account",
        },
        {
            title: "BALANCE",
            dataIndex: "balance",
            key: "balance",
            align: "right",
            render: (text) =>
                text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0",
        },
        {
            title: `${typeLabel.toUpperCase()} AMOUNT`,
            dataIndex: "holdAmount",
            key: "holdAmount",
            align: "right",
            render: (text) =>
                text ? text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "0",
        },
    ];

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />

            <div className="text-xl font-bold text-primary mb-5">
                Detail Receipt & Allocation
            </div>

            <Spin spinning={loading}>
                {/* RECEIPT DETAIL - Collapsible */}
                <Collapse
                    defaultActiveKey={["receipt"]}
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                    )}
                    style={{ marginBottom: '24px' }}
                >
                    <Panel header="RECEIPT DETAIL" key="receipt">
                        <div className="w-full grid grid-cols-5 gap-3 mb-5">
                            <DetailText label="Receipt Number">
                                {data_detail?.receiptNumber}
                            </DetailText>
                            <DetailText label="Receipt Code">
                                {data_detail?.receiptCode}
                            </DetailText>
                            <DetailText label="Receipt Date">
                                {data_detail?.receiptDate
                                    ? moment(data_detail.receiptDate).format(
                                        dateFormatting.dateTime
                                    )
                                    : ""}
                            </DetailText>
                            <DetailText label="Receipt Method">
                                {data_detail?.paymentMethod}
                            </DetailText>
                            <DetailText label="Currency">
                                {data_detail?.currency}
                            </DetailText>
                            <DetailText label="Amount">
                                {data_detail?.amount
                                    ? data_detail.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    : "0"}
                            </DetailText>
                            <DetailText label="Customer">
                                {data_detail?.customer}
                            </DetailText>
                            <DetailText label="Account">
                                {data_detail?.account}
                            </DetailText>
                            <DetailText label="Status">
                                {toTitleCase(data_detail?.status || "")}
                            </DetailText>
                        </div>
                    </Panel>
                </Collapse>

                {/* ALLOCATION DETAIL - Collapsible */}
                <Collapse
                    defaultActiveKey={["allocation"]}
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                    )}
                    style={{ marginBottom: '24px' }}
                >
                    <Panel header="ALLOCATION DETAIL" key="allocation">
                        <TableRBI
                            dataSource={data_allocation?.result || []}
                            columns={columnsAllocation(
                                page,
                                pageSize,
                                searchInput,
                                searchedColumn,
                                searchText,
                                handleSearch
                            )}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            onSizeChanger={handleChangePage}
                            totalData={data_allocation?.totalElements || 0}
                            tableScrolled={{ x: 2000, y: 400 }}
                        />
                    </Panel>
                </Collapse>

                {/* HOLD/RELEASE DETAIL - Hanya muncul jika 'actualType' punya nilai */}
                {actualType && (
                <Collapse
                    defaultActiveKey={[activeTab || actualType || "approval"]}
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                    )}
                    style={{ marginBottom: '24px' }}
                >
                    <Panel header={`${actualType ? actualType.toUpperCase() + ' DETAIL & ' : ''}APPROVAL`} key="approval_panel">
                        
                        {/* Atur RadioTabs: Tab pertama (Hold/Release) HANYA dirender jika actualType ada */}
                        <RadioTabs
                            data={[
                                ...(actualType ? [{ value: actualType, label: typeLabel }] : []),
                                { value: "approval", label: "Approval" },
                                { value: "attachment", label: "Attachment" },
                            ]}
                            currentPosition={activeTab || "approval"}
                            onChange={handleTabChange}
                        />

                        <div className="mt-4">
                            {/* Tab: Hold/Release */}
                            {actualType && activeTab === actualType && (
                                <TableRBI
                                    dataSource={holdReleaseData}
                                    columns={holdReleaseColumns}
                                    pagination={false}
                                    usePagination={false}
                                    tableScrolled={{ x: 1500 }}
                                />
                            )}

                            {/* Tab: Approval */}
                            {activeTab === "approval" && (
                                <ApprovalSectionForm
                                    showSelect={false}
                                    disableSelect={true}
                                    approvalName={data_detail?.approvalDto?.approvalName}
                                    dataTable={appHierDataDetail}
                                    selectedHierarchy={data_detail?.appHierId}
                                />
                            )}

                            {/* Tab: Attachment */}
                            {activeTab === "attachment" && (
                                <DetailAttachment
                                    type="detail"
                                    data={listDataAttachment}
                                    updateData={setListDataAttachment}
                                    typeSelector="receipt"
                                    service={receiptCollectionHttpService}
                                    configApplication={configApp.PAYMENT_SERVICE}
                                />
                            )}
                        </div>
                    </Panel>
                </Collapse>
                )}

                {/* HISTORY LOG INFORMATION - Collapsible */}
                <Collapse
                    defaultActiveKey={["history"]}
                    expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                    )}
                    style={{ marginBottom: '24px' }}
                >
                    <Panel header="HISTORY LOG INFORMATION" key="history">
                        <div className="w-full grid grid-cols-5 gap-3">
                            <DetailText label="Created Date">
                                {data_detail?.createdDate
                                    ? moment(data_detail.createdDate).format(
                                        "DD MMM YYYY HH:mm:ss"
                                    )
                                    : ""}
                            </DetailText>
                            <DetailText label="Created By">
                                {data_detail?.createdBy}
                            </DetailText>
                            <DetailText label="Updated Date">
                                {data_detail?.updatedDate
                                    ? moment(data_detail.updatedDate).format(
                                        "DD MMM YYYY HH:mm:ss"
                                    )
                                    : ""}
                            </DetailText>
                            <DetailText label="Updated By">
                                {data_detail?.updatedBy}
                            </DetailText>
                        </div>
                    </Panel>
                </Collapse>
            </Spin>

            {/* Custom Footer untuk Detail & Approval */}
            <div className="bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6 shadow-sm">
                <div className="flex w-full justify-between items-center">
                    {/* Tombol Back */}
                    <ButtonComponent
                        type="submit"
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

                    {/* Teks Info & Tombol Reject/Approve (Hanya muncul jika isApprover true) */}
                    {showButtonApproval && (
                        <div className="flex items-center gap-4">
                            {/* Teks Dinamis Keterangan Approval */}
                            <span className="font-bold text-primary mr-2">
                                Approval for {actualType ? typeLabel : "Receipt & Allocation"}
                            </span>

                            <ButtonComponent
                                type="reject"
                                onClick={() => {
                                    setModalConfirm(true);
                                    setApproveOrReject("reject");
                                }}
                            >
                                Reject
                            </ButtonComponent>

                            <ButtonComponent
                                type="approve"
                                onClick={() => {
                                    setModalConfirm(true);
                                    setApproveOrReject("approved");
                                }}
                            >
                                Approve
                            </ButtonComponent>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Approve/Reject */}
            <ModalApproveOrReject
                isOpen={modalConfirm}
                handleCloseModal={handleCancel}
                onFinish={handleConfirm}
                header={approveOrReject}
                approveOrReject={approveOrReject}
                menu={typeLabel ? `${typeLabel} Receipt` : "Receipt & Allocation"}
                named={data_detail?.receiptNumber}
            />
        </LayoutMenu>
    );
};

export default DetailReceiptApproval;