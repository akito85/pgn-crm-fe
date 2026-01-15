import moment from "moment";

export const getAdjustmentColumns = ({
    page = 1,
    pageSize = 10,
}) => {
    return [
        {
            title: "NO",
            width: 60,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "PERIOD TAGIHAN",
            dataIndex: "periodTagihan",
            width: 150,
        },
        {
            title: "INVOICE NO",
            dataIndex: "invoiceNo",
            width: 200,
        },
        {
            title: "TYPE",
            dataIndex: "type",
            width: 150,
        },
        {
            title: "TYPE QUANTITY",
            dataIndex: "typeQuantity",
            width: 150,
        },
        {
            title: "QUANTITY",
            dataIndex: "quantity",
            width: 100,
            align: "right",
        },
        {
            title: "VALUE",
            dataIndex: "value",
            width: 100,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID"),
        },
        {
            title: "TOTAL AMOUNT",
            dataIndex: "totalAmount",
            width: 180,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        {
            title: "REMARK",
            dataIndex: "remark",
            width: 180,
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
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
            width: 60,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "DATE",
            dataIndex: "date",
            width: 180,
            render: (v) => v ? moment(v).format("DD MMM YYYY HH:mm:ss") : "-",
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            width: 180,
            align: "right",
            render: (v) => v?.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            width: 150,
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            width: 180,
        },
    ];
};
