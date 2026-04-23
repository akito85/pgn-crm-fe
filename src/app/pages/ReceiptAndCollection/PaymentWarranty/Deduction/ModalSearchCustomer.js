import React, { useState, useEffect, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { searchCustomerDeduction } from "../../../../../redux/slices/receipt_collection/deduction";
import { getCustomerListColumns } from "./CustomerColumns";

const ModalSearchCustomer = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { customerData, loadingSearchCustomer: loading } = useSelector((state) => state.deduction);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});

    useEffect(() => {
        if (isOpen) {
            dispatch(searchCustomerDeduction({ 
                page, 
                pageSize,
                search: encodeURIComponent(JSON.stringify(search))
            }));
        }
    }, [dispatch, isOpen, page, pageSize, search]);

    useEffect(() => {
        if (customerData && customerData.result) {
            const withKeys = customerData.result.map((item, index) => ({
                ...item,
                key: item.id || item.receiptId || index,
            }));
            setDataSource(withKeys);
        } else {
            setDataSource([]);
        }
    }, [customerData]);

    const columns = getCustomerListColumns({
        page,
        pageSize,
        actionType: "none",
    });

    const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setSelectedRows(newSelectedRows);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleConfirm = () => {
        onConfirm(selectedRows);
        onClose();
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const handleCancel = () => {
        handleGlobalSearch.cancel();
        onClose();
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setPage(1);
    }

    const onPageChange = (newPage, newPageSize) => {
        setPage(newPage);
        if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
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

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="Search Customer"
            width={1200}
            type="confirmation"
            footer={
                <div className="flex justify-end gap-3 pt-4">
                    <ButtonComponent type="default" onClick={handleCancel}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent type="primary" onClick={handleConfirm} disabled={selectedRows.length === 0}>
                        Confirm
                    </ButtonComponent>
                </div>
            }
        >
            <div className="mt-4">
                <TableRBI
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    loading={loading}
                    usePagination={true}
                    showSearchBar={true}
                    showAdvanceSearch={true}
                    onSearch={(e) => handleGlobalSearch(e.target.value)}
                    onAdvanceSearch={handleAdvanceSearch}
                    current={page}
                    pageSize={pageSize}
                    totalData={customerData?.page?.totalElements || 0}
                    onChange={onPageChange}
                    tableScrolled={{ x: 1800, y: 400 }}
                    rowKey="key"
                    size="small"
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchCustomer;
