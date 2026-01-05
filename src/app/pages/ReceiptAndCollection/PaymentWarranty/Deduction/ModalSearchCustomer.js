import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { searchCustomerDeduction } from "../../../../../redux/slices/receipt_collection/deduction";
import { getCustomerListColumns } from "./CustomerColumns";

const ModalSearchCustomer = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { customerData } = useSelector((state) => state.deduction);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (isOpen) {
            dispatch(searchCustomerDeduction({ page: 1, pageSize: 10 }));

            console.log("customerData", customerData);
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (customerData) {
            console.log("customerData::", customerData);
            setDataSource(customerData);
        }
    }, [customerData]);

    const columns = getCustomerListColumns({
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
                    rowKey="id"
                    columns={columns}
                    dataSource={customerData?.result || []}
                    rowSelection={rowSelection}
                    pagination={false}
                    tableScrolled={{ x: 1500, y: 400 }}
                    usePagination={false}
                />
            </div>
        </ModalCustom>
    );
};

export default ModalSearchCustomer;
