import { Modal, Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListWarranty } from "../../../../../redux/slices/receipt_collection/transferToCustomer";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";

const ModalSearchWarranty = ({ isOpen, onClose, onConfirm }) => {
    const dispatch = useDispatch();
    const { listWarranty } = useSelector((state) => state.transferToCustomer);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (isOpen) {
            dispatch(getListWarranty());
            setSelectedRowKeys([]);
            setSelectedRecord(null);
        }
    }, [isOpen, dispatch]);


    const handleConfirm = () => {
        if (selectedRecord) {
            onConfirm(selectedRecord);
            onClose();
        }
    };

    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            render: (text, record, index) => index + 1,
        },
        {
            title: "PAYMENT WARRANTY CODE",
            dataIndex: "paymentWarrantyCode",
            key: "paymentWarrantyCode",
            width: 150,
        },
        {
            title: "AREA CODE",
            dataIndex: "areaCode",
            key: "areaCode",
            width: 100,
        },
        {
            title: "AREA NAME",
            dataIndex: "areaName",
            key: "areaName",
            width: 150,
        },
        {
            title: "CUSTOMER ID",
            dataIndex: "customerId",
            key: "customerId",
            width: 120,
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 200,
        },
        {
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            key: "customerSegment",
            width: 120,
        },
        {
            title: "ACTION",
            key: "action",
            fixed: "right",
            width: 80,
            align: "center",
            render: (_, record) => (
                <div
                    className="cursor-pointer flex justify-center text-blue-500"
                    onClick={() => {
                        onConfirm(record);
                        onClose();
                    }}
                >
                    <SVGIcon name="IconPlusCircle" width={24} />
                </div>
            ),
        },
    ];

    return (
        <Modal
            open={isOpen} // Changed from visible to open for newer AntD
            onCancel={onClose}
            title="WARRANTY LIST"
            width={1000}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" onClick={handleConfirm} disabled={!selectedRecord}>
                    Confirm
                </Button>
            ]}
        >
            <div className="mb-4">
                {/* Placeholder for filters if needed */}
            </div>
            <TableRBI
                columns={columns}
                dataSource={listWarranty.slice((page - 1) * pageSize, page * pageSize)}
                rowKey="id"
                pagination={false} // TableRBI handles pagination UI via props usually
                current={page}
                pageSize={pageSize}
                totalData={listWarranty?.length || 0}
                tableScrolled={{ y: 300 }}
                onChange={(p) => setPage(p)}
                onSizeChanger={(current, size) => {
                    setPage(1);
                    setPageSize(size);
                }}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedRowKeys([record.id]);
                        setSelectedRecord(record);
                    },
                })}
            />
        </Modal >
    );
};

export default ModalSearchWarranty;
