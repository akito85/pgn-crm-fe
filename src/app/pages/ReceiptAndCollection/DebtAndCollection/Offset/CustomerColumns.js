export const getCustomerListColumns = ({
    page = 1,
    pageSize = 10,
}) => {
    return [
        {
            title: "NO",
            width: 60,
            align: "center",
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "ACCOUNT NUMBER",
            dataIndex: "accountNumber",
            key: "accountNumber",
        },
        {
            title: "ACCOUNT NAME",
            dataIndex: "accountName",
            key: "accountName",
        },
        {
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
        },
        {
            title: "CUSTOMER NAME",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "SEGMENT",
            dataIndex: "segment",
            key: "segment",
        },
    ];
};
