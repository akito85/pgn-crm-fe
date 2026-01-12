import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../components/TableRBI";
import ButtonComponent from "../../../../components/ButtonComponent";
import { searchCustomerLateCharge } from "../../../../redux/slices/receipt_collection/lateCharge";
import { getCustomerListColumns } from "./CustomerColumns";

const ModalSearchCustomer = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.late);
    const [dataSource, setDataSource] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (isOpen) {
            dispatch(searchCustomerLateCharge({ page, pageSize }));
        }
    }, [dispatch, isOpen, page, pageSize]);

    useEffect(() => {
        if (data && data.result) {
            setDataSource(data.result);
        } else {
            setDataSource([]);
        }
    }, [data]);

    const handleConfirm = (record) => {
        onConfirm(record);
        onClose();
    };

    const columns = getCustomerListColumns({
        page,
        pageSize,
        actionType: "select",
        onSelect: handleConfirm,
    });

    const handleCancel = () => {
        onClose();
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
            header="CUSTOMER LIST"
            width={1200}
            type="confirmation"
            footer={
                <div className="flex justify-end gap-3 pt-4">
                    <ButtonComponent type="default" onClick={handleCancel}>
                        Cancel
                    </ButtonComponent>
                </div>
            }
        >
            <div className="mt-4">
                <TableRBI
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={true}
                    current={page}
                    pageSize={pageSize}
                    totalData={data?.page?.totalElements || 0}
                    onChange={onPageChange}
                    tableScrolled={{ x: 1200, y: 400 }}
                    rowKey="id"
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchCustomer;
