import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { searchCustomerOffset } from "../../../../../redux/slices/receipt_collection/offset";
import { getCustomerListColumns } from "./CustomerColumns";

const ModalSearchCustomer = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { customerData, loading } = useSelector((state) => state.offset);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (isOpen) {
            dispatch(searchCustomerOffset({ page, pageSize }));
        }
    }, [dispatch, isOpen, page, pageSize]);

    useEffect(() => {
        if (customerData && customerData.data) {
            setDataSource(customerData.data);
        } else {
            setDataSource([]);
        }
    }, [customerData]);

    const columns = getCustomerListColumns({
        page,
        pageSize,
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
                    current={page}
                    pageSize={pageSize}
                    totalData={customerData?.page?.totalElements || 0}
                    onChange={onPageChange}
                    tableScrolled={{ x: 1200, y: 400 }}
                    rowKey="id"
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchCustomer;
