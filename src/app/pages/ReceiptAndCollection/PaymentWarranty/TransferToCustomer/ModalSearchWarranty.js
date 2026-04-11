import { Modal, Button } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListWarranty } from "../../../../../redux/slices/receipt_collection/transferToCustomer";
import SVGIcon from "../../../../../assets/Icon/index";
import TableRBI from "../../../../../components/TableRBI";

const ModalSearchWarranty = ({ isOpen, onClose, onConfirm, customerId }) => {
    const dispatch = useDispatch();
    const { listWarranty } = useSelector((state) => state.transferToCustomer);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (isOpen) {
            dispatch(getListWarranty(customerId));
            setSelectedRowKeys([]);
            setSelectedRecord(null);
        }
    }, [isOpen, dispatch, customerId]);


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
            width: 60,
            align: "left",
            fixed: "left",
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "PAYMENT GUARANTEE CODE",
            dataIndex: "warrantyCode",
            key: "warrantyCode",
            width: 200,
            align: "center",
            fixed: "left",
        },
        {
            title: "COST CENTER",
            dataIndex: "costCenter",
            key: "costCenter",
            width: 250,
            align: "left",
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
            width: 150,
            align: "center",
        },
        {
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            key: "accountName",
            width: 200,
            align: "left",
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerId",
            key: "customerId",
            width: 150,
            align: "center",
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
            width: 200,
            align: "left",
        },
        {
            title: "CUSTOMER SEGMENT",
            dataIndex: "customerSegment",
            key: "customerSegment",
            width: 150,
            align: "center",
        },
        {
            title: "CUSTOMER GROUP",
            dataIndex: "customerGroup",
            key: "customerGroup",
            width: 150,
            align: "center",
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 120,
            align: "center",
        },
        {
            title: "DOCUMENT NUMBER",
            dataIndex: "documentNumber",
            key: "documentNumber",
            width: 180,
            align: "center",
        },
        {
            title: "DOCUMENT DATE",
            dataIndex: "effectiveDate",
            key: "effectiveDate",
            width: 150,
            align: "left",
            render: (val) => val ? moment(val).format("DD-MM-YYYY") : "-"
        },
        {
            title: "ISSUER",
            dataIndex: "issuerBank",
            key: "issuerBank",
            width: 150,
            align: "center",
        },
        {
            title: "ISSUER BRANCH",
            dataIndex: "issuerBranch",
            key: "issuerBranch",
            width: 150,
            align: "left",
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 100,
            align: "center",
        },
        {
            title: "BALANCE AMOUNT",
            dataIndex: "balance",
            key: "balance",
            width: 180,
            align: "right",
            render: (val) => val?.toLocaleString(),
        },
        {
            title: "RATE TYPE",
            dataIndex: "rateType",
            key: "rateType",
            width: 120,
            align: "center",
        },
        {
            title: "RATE DATE",
            dataIndex: "rateDate",
            key: "rateDate",
            width: 150,
            align: "left",
        },
        {
            title: "RATE",
            dataIndex: "rate",
            key: "rate",
            width: 120,
            align: "center",
        },
        {
            title: "EQV BALANCE AMOUNT",
            dataIndex: "currencyBalance",
            key: "currencyBalance",
            width: 180,
            align: "center",
            render: (val) => val?.toLocaleString(),
        },
        {
            title: "REFF. START DATE",
            dataIndex: "effectiveDate",
            key: "effectiveDate",
            width: 150,
            align: "center",
        },
        {
            title: "REFF. END DATE",
            dataIndex: "expiringDate",
            key: "expiringDate",
            width: 150,
            align: "center",
        },
        {
            title: "CLAIM PERIOD",
            dataIndex: "endDateClaim",
            key: "endDateClaim",
            width: 150,
            align: "center",
        },
        {
            title: "ACCOUNT TYPE",
            dataIndex: "accountType",
            key: "accountType",
            width: 150,
            align: "center",
        },
        {
            title: "CLASSIFICATION TYPE",
            dataIndex: "classificationType",
            key: "classificationType",
            width: 180,
            align: "center",
        },
        {
            title: "DESCRIPTION",
            dataIndex: "description",
            key: "description",
            width: 250,
            align: "left",
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
                    <SVGIcon name="IconAddTable" width={22} />
                </div>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedRecord(selectedRows[0]);
        },
        type: 'checkbox',
        fixed: true,
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            title="GUARANTEE LIST"
            width={1200}
            centered
            footer={
                <div className="flex justify-between w-full p-4">
                    <Button 
                        key="cancel" 
                        onClick={onClose} 
                        style={{ borderRadius: '8px' }}
                    >
                        cancel
                    </Button>
                    <Button 
                        key="confirm" 
                        type="primary" 
                        onClick={handleConfirm} 
                        disabled={!selectedRecord}
                        style={{ borderRadius: '8px' }}
                    >
                        Confirm
                    </Button>
                </div>
            }
        >
            <div 
                style={{
                    border: "1px solid #C8CDD4",
                    borderRadius: "8px",
                    padding: "16px",
                }}
                className="mx-1 mb-1"
            >
                <TableRBI
                    idTable="warrantySearchTable"
                    columns={columns}
                    dataSource={listWarranty?.map(item => ({ ...item, key: item.id }))}
                    rowSelection={rowSelection}
                    pagination={true}
                    current={page}
                    pageSize={pageSize}
                    totalData={listWarranty?.length || 0}
                    tableScrolled={{ x: 4500, y: 400 }}
                    onChange={(p) => setPage(p)}
                    onSizeChanger={(current, size) => {
                        setPage(1);
                        setPageSize(size);
                    }}
                    showSearchBar={true}
                    showAdvanceSearch={true}
                    useSelect={true}
                />
            </div>
        </Modal >
    );
};

export default ModalSearchWarranty;
