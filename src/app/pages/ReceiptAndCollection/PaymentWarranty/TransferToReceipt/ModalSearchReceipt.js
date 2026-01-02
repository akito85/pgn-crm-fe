import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import moment from "moment";
import { getListReceipt } from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { getReceiptListColumns } from "./ReceiptListColumns";

const ModalSearchReceipt = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { listReceipt } = useSelector((state) => state.transferToReceipt);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getListReceipt());
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (listReceipt) {
            setDataSource(listReceipt);
        }
    }, [listReceipt]);

    const columns = getReceiptListColumns({
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
        onClose();
        setSelectedRowKeys([]);
        setSelectedRows([]);
    }

    return (
        <ModalCustom
            isOpen={isOpen}
            handleCancel={handleCancel}
            header="Search Receipt"
            width={1000}
            type="confirmation"
            footer={
                <div className="flex justify-end gap-3 pt-4">
                    <ButtonComponent type="default" onClick={handleCancel}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent type="primary" onClick={handleConfirm}>
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
                    pagination={false}
                    tableScrolled={{ x: 1500, y: 400 }}
                    usePagination={false}
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchReceipt;
