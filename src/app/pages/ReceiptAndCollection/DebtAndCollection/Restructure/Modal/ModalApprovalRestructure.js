import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Form,
    Button,
    message,
} from "antd";
import { FormStepper } from "../../../../../../components/FormStepNavigation";
import { ModalConfirm } from "../../../../../../components/Modal/ModalPopUp";
import { debounce } from "lodash";
import {
    approveOrRejectRestructure,
    getListApprovalRestructure,
    getDetailRestructure,
    getApprovalHistory,
    deleteRestructure,
} from "../../../../../../redux/slices/receipt_collection/restructure";
import { tableApprovalRestructure } from "./TableApprovalRestructure";
import { formMessageRequired } from "../../../../../../utils";
import TableRBI from "../../../../../../components/TableRBI";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { useNavigate } from "react-router-dom";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../../routes/DebtAndCollection/rc_routes";
import useGrantAccessHooks from "../../../../../../components/useGrantAccessHooks";

const ModalApprovalRestructure = ({
    isOpen,
    handleCancel,
    handleListRefresh = () => { },
}) => {
    // Selector
    const { data_approval_list, loading_approval_list } = useSelector((state) => state.restructure);

    // Declaration
    const containerRef = useRef(null);
    const searchInput = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const dataApproval = data_approval_list?.result || [];

    // Use State
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});
    const [sort, setSort] = useState("");

    const [current, setCurrent] = useState(0);
    const [remark, setRemark] = useState("");
    const [action, setAction] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataTableSelect, setDataTableSelect] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("payment_plan");

    const { actions: accessList } = useGrantAccessHooks("page");

    // Initial fetch
    useEffect(() => {
        if (isOpen) {
            dispatch(
                getListApprovalRestructure({
                    page: 0,
                    pageSize: 100,
                    search: encodeURIComponent(JSON.stringify(search)),
                    isLoadMore: false,
                })
            );
            setPage(1);
        }
    }, [dispatch, isOpen, search]);

    // Load more handler
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        const totalPages = data_approval_list?.page?.totalPages || 0;

        if (nextPage <= totalPages) {
            await dispatch(
                getListApprovalRestructure({
                    page: nextPage - 1,
                    pageSize: pageSize,
                    isLoadMore: true,
                })
            );
            setPage(nextPage);
        }
    };

    const hasMore =
        dataApproval.length < (data_approval_list?.page?.totalElements || 0);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(selectedKeys[0] ? dataIndex : "");
        const shouldResetPage = search[dataIndex] !== selectedKeys[0];
        setSearch((prevState) => {
            const nextState = { ...prevState };
            nextState[dataIndex] = selectedKeys[0];
            return nextState;
        });
        if (shouldResetPage) {
            setPage(1);
        }
    };

    const handleGlobalSearch = useCallback(
        debounce((value) => {
            setSearchText(value);
            setSearchedColumn(value ? "all" : "");
            setSearch((prevState) => {
                const nextState = { ...prevState };
                if (value) {
                    nextState.all = value;
                } else {
                    delete nextState.all;
                }
                return nextState;
            });
            setPage(1);
        }, 500),
        []
    );

    useEffect(() => {
        return () => {
            handleGlobalSearch.cancel();
        };
    }, [handleGlobalSearch]);

    const handleAdvanceSearch = (searchData) => {
        setSearch((prevState) => {
            setPage(1);
            return {
                ...prevState,
                advanceSearch: searchData
            };
        });
    };

    const onSort = (_, __, sorter) => {
        const dataSort =
            sorter && sorter.order !== undefined
                ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
                : "";
        setSort(dataSort);
    };

    const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
        setDataTableSelect(newSelectedRow);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        fixed: true,
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => {
            // In Restructure, we check if it's waiting for approval
            const isWaitingApproval = record.statusApproval === "Pending" || record.statusApproval === "WAITING APPROVAL";
            return {
                disabled: !isWaitingApproval,
                name: record.restructureNumber,
            };
        },
    };

    const handleDetail = (record) => {
        navigate(DEBT_AND_COLLECTION_ROUTES.DETAIL_RESTRUCTURE, { state: { id: record.id, approvalType: record.approvalType, isApprover: true } });
    };

    const handleRefresh = () => {
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
            getListApprovalRestructure({
                page: 0,
                pageSize: 100,
                search: reqSearch,
                isLoadMore: false,
            })
        );
    };

    const processedColumns = tableApprovalRestructure(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
    );

    const steps = [
        {
            title: activeTab === "payment_plan" ? "Payment Plan Information" : "Early Repayment Information",
            disabled: dataTableSelect.length === 0,
        },
        {
            title: "Confirmation",
        },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const handleCancelForm = () => {
        handleGlobalSearch.cancel();
        handleCancel();
        setSelectedRowKeys([]);
        setDataTableSelect([]);
        setRemark("");
        setCurrent(0);
        form.resetFields();
    };

    const handleSave = async (formValue) => {
        if (isSubmitting) return;

        if (current < steps.length - 1) {
            next();
        } else {
            setIsSubmitting(true);
            try {
                // Submit approval for each selected record
                // Backend unified endpoint handles both INSTALLMENT and EARLY_REPAYMENT based on category param
                const category = activeTab === "payment_plan" ? "RESTRUCTURE" : "EARLY_REPAYMENT_RESTRUCTURE";
                
                // Assuming the backend expects multiple IDs or we loop
                // The Redux action approveOrRejectRestructure takes { body }
                // Based on backend RestructureApprovalController, it takes a single CommonApprovalRequest
                
                const promises = dataTableSelect.map((item) => {
                    const payload = {
                        id: item.id,
                        action: action,
                        remark: formValue.remark,
                        approvalId: item.approvalId || item.tApprovalId, // Ensure we have the right ID
                        category: category
                    };
                    return dispatch(approveOrRejectRestructure({ body: payload })).unwrap();
                });

                await Promise.all(promises);
                
                message.success(`${action === "APPROVE" ? "Approved" : "Rejected"} successfully`);
                handleCancelForm();
                handleListRefresh();
            } catch (error) {
                message.error('Failed to submit approval. Please try again.');
                console.error("Error", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div>
            <ModalCustom
                isOpen={isOpen}
                type="confirmation"
                header="Approval Payment Plan"
                message={
                    current === steps.length - 1
                        ? `Are you sure you want to ${action === "APPROVE" ? "approve" : "reject"} these items?`
                        : "Please choose items to approve or reject"
                }
                handleCancel={handleCancelForm}
                width={1000}
                footer={
                    <div className="flex w-full justify-between items-center bg-white rounded-lg border border-[#D6E1F0] p-4 mt-2">
                        <ButtonComponent
                            type="default"
                            onClick={handleCancelForm}
                            className="!border-[#0075BF] !text-[#0075BF]"
                        >
                            Cancel
                        </ButtonComponent>
                        <div className="flex items-center gap-3">
                            {current > 0 && (
                                <Button
                                    onClick={prev}
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#DADDE5",
                                        color: "#4B465C",
                                        borderRadius: "6px",
                                        height: "32px",
                                        fontSize: "12px",
                                        border: "1px solid #DADDE5",
                                    }}
                                >
                                    Previous
                                </Button>
                            )}

                            {current < steps.length - 1 ? (
                                <Button
                                    key="btn-next"
                                    htmlType="submit"
                                    form="formApproveRestructure"
                                    type="primary"
                                    disabled={steps[current].disabled}
                                    style={{
                                        backgroundColor: "#0075BF",
                                        borderColor: "#0075BF",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        height: "32px",
                                        fontSize: "12px",
                                    }}
                                >
                                    Next
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        key="btn-reject"
                                        htmlType="submit"
                                        disabled={isSubmitting}
                                        onClick={() => setAction("REJECT")}
                                        style={{
                                            backgroundColor: "#BE3036",
                                            borderColor: "#BE3036",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            height: "32px",
                                            fontSize: "12px",
                                            opacity: isSubmitting ? 0.6 : 1,
                                        }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        key="btn-approve"
                                        htmlType="submit"
                                        form="formApproveRestructure"
                                        disabled={isSubmitting}
                                        onClick={() => setAction("APPROVE")}
                                        style={{
                                            backgroundColor: "#388E3C",
                                            borderColor: "#388E3C",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            height: "32px",
                                            fontSize: "12px",
                                            opacity: isSubmitting ? 0.6 : 1,
                                        }}
                                    >
                                        Approve
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                }
            >
                <FormStepper
                    steps={steps}
                    current={current}
                    onPrev={() => current > 0 && prev()}
                    onNext={() => current < steps.length - 1 && !steps[current].disabled && next()}
                />

                <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
                    <div className="flex gap-2 mb-4">
                        <ButtonComponent
                            type={activeTab === "payment_plan" ? "primary" : "default"}
                            onClick={() => setActiveTab("payment_plan")}
                            className="!h-[32px] !text-[12px]"
                        >
                            Payment Plan
                        </ButtonComponent>
                        <ButtonComponent
                            type={activeTab === "early_repayment" ? "primary" : "default"}
                            onClick={() => setActiveTab("early_repayment")}
                            className="!h-[32px] !text-[12px]"
                        >
                            Early Repayment
                        </ButtonComponent>
                    </div>

                    <Form
                        layout="vertical"
                        form={form}
                        id={"formApproveRestructure"}
                        onFinish={handleSave}
                    >
                        <div className="w-full grid grid-cols-1 gap-x-4 pt-[10px]">
                            <div className="flex gap-2 justify-between mb-2">
                                <p className="text-primary uppercase font-bold">
                                    {activeTab === "payment_plan" ? "Payment Plan Information" : "Early Repayment Information"}
                                </p>
                                {selectedRowKeys.length > 0 && (
                                    <p className="text-sm font-semibold text-blue-600">
                                        {selectedRowKeys.length} selected
                                    </p>
                                )}
                            </div>
                            <TableRBI
                                idTable="approval-restructure-table"
                                dataSource={dataApproval?.map((a, index) => ({
                                    ...a,
                                    key: a.id || index + 1,
                                }))}
                                columns={processedColumns}
                                totalData={data_approval_list?.page?.totalElements || 0}
                                tableScrolled={{ x: 1200, y: 300 }}
                                onSort={onSort}
                                showExport={false}
                                showSearchBar={true}
                                showAdvanceSearch={true}
                                onSearch={(e) => handleGlobalSearch(e.target.value)}
                                onAdvanceSearch={handleAdvanceSearch}
                                columnDefinitions={processedColumns.map(c => ({ key: c.key, title: c.title }))}
                                rowSelection={rowSelection}
                                loading={loading_approval_list}
                                usePagination={false}
                                useInfiniteScroll={true}
                                onLoadMore={handleLoadMore}
                                hasMore={hasMore}
                                loadMoreThreshold={20}
                            />

                            <div className="pt-[30px]">
                                <Form.Item
                                    label={"Remark"}
                                    name={"remark"}
                                    rules={formMessageRequired("Remark")}
                                >
                                    <InputComponent
                                        rows={3}
                                        type="textarea"
                                        placeholder={"Type your remark"}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className={`steps-content my-[10px] ${current !== 1 ? "hidden" : ""}`}>
                    <div className="w-full grid grid-cols-1 gap-x-4 pt-[10px]">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-primary uppercase font-bold">Summary List</p>
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
                                <span className="text-blue-600 font-semibold">
                                    {dataTableSelect.length} records selected
                                </span>
                            </div>
                        </div>

                        <TableRBI
                            dataSource={dataTableSelect}
                            columns={processedColumns}
                            totalData={dataTableSelect.length || 0}
                            tableScrolled={{ x: 1200, y: 300 }}
                            onSort={onSort}
                            showExport={false}
                            columnDefinitions={processedColumns.map(c => ({ key: c.key, title: c.title }))}
                            loading={false}
                            usePagination={false}
                        />
                        <div className="pt-[10px]">
                            <DetailText label={"Remark"}>
                                {form.getFieldValue().remark}
                            </DetailText>
                        </div>
                    </div>
                </div>
            </ModalCustom>
        </div>
    );
};

export default ModalApprovalRestructure;
