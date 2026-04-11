import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import moment from "moment";
import { getListReceipt } from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { getReceiptListColumns } from "./ReceiptListColumns";

const ModalSearchReceipt = ({ isOpen, onClose, onConfirm, category, customerNumber }) => {
    const dispatch = useDispatch();
    const { listReceipt } = useSelector((state) => state.transferToReceipt);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(getListReceipt(customerNumber));
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (listReceipt) {
            setDataSource(listReceipt.map((item, idx) => ({
                ...item,
                key: item.id || idx,
                receiptId: item.id,
                receiptNo: item.receiptNumber,
                areaCode: item.costCenter,
                customerNumber: item.customer?.split(' - ')?.[0]?.trim(),
                customerName: item.customer?.split(' - ')?.[1]?.trim(),
                source: item.source,
                type: item.paymentType,
                method: item.paymentMethod,
                referenceNumber: item.refNumber,
                amount: item.unAppliedAmountReal || parseFloat(String(item.unAppliedAmount || '0').replace(/,/g, '')),
                currency: item.currency,
                status: item.statusApproval,
                receiptDate: item.receiptDate,
                receiptChannel: item.receiptChannel,
                bankName: item.bank,
                collectingAgent: item.collectingAgent,
                deliveryChannel: item.deliveryChannel,
                rateType: item.rateType,
                rate: item.rateAmountReal,
                convertedCurrency: item.convertedCurrency,
                eqvAmount: item.equivalentAmountReal,
                appliedAmount: item.appliedAmountReal,
                unappliedAmount: item.unAppliedAmountReal,
                remark: item.remark,
            })));
        }
    }, [listReceipt]);

    const handleAmountChange = (record, value) => {
        setDataSource(prev => prev.map(item => 
            item.id === record.id ? { ...item, amount: value } : item
        ));
        // Also update selectedRows if the edited record is currently selected
        setSelectedRows(prev => prev.map(item => 
            item.id === record.id ? { ...item, amount: value } : item
        ));
    };

    const columns = getReceiptListColumns({
        isModal: true,
        category: category,
        onAmountChange: handleAmountChange,
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
                    showSearchBar={true}
                    showAdvanceSearch={true}
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchReceipt;
