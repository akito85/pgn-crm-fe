import moment from "moment";

export const getAdjustmentColumns = ({
    page = 1,
    pageSize = 10,
}) => {
    return [
        {
            title: "NO",
            key: "no",
            width: 60,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "PERIOD TAGIHAN",
            dataIndex: "periodTagihan",
            key: "periodTagihan",
            width: 150,
        },
        {
            title: "INVOICE NO",
            dataIndex: "invoiceNo",
            key: "invoiceNo",
            width: 200,
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 150,
        },
        {
            title: "TYPE QUANTITY",
            dataIndex: "typeQuantity",
            key: "typeQuantity",
            width: 150,
        },
        {
            title: "QUANTITY",
            dataIndex: "quantity",
            key: "quantity",
            width: 100,
            align: "right",
        },
        {
            title: "VALUE",
            dataIndex: "value",
            key: "value",
            width: 100,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID"),
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 180,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        {
            title: "REMARK",
            dataIndex: "remark",
            key: "remark",
            width: 180,
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 150,
        },
    ];
};

export const getHistoryColumns = ({
    page = 1,
    pageSize = 10,
}) => {
    return [
        {
            title: "NO",
            key: "no",
            width: 60,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "DATE",
            dataIndex: "date",
            key: "date",
            width: 180,
            render: (v) => v ? moment(v).format("DD MMM YYYY HH:mm:ss") : "-",
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 180,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 150,
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 180,
        },
    ];
};
