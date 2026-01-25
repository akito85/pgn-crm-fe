import { Tooltip } from "antd";
import SVGIcon from "../../../../../assets/Icon/index";

export const getHistoryPaymentWarrantyColumns = ({
    page = 1,
    pageSize = 10,
}) => {
    const columns = [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            width: 50,
            isClassification: true,
            render: (text, record, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "PAYMENT WARRANTY CODE",
            dataIndex: "paymentWarrantyCode",
            key: "paymentWarrantyCode",
            width: 200,
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
            title: "CUSTOMER NUMBER",
            dataIndex: "customerNumber",
            key: "customerNumber",
            width: 150,
        },
        {
            title: "RECEIPT DATE",
            dataIndex: "receiptDate",
            key: "receiptDate",
            width: 120,
        },
        {
            title: "CURRENCY",
            dataIndex: "currency",
            key: "currency",
            width: 80,
        },
        {
            title: "AMOUNT",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            align: "right",
            render: (value) => (value ? value.toLocaleString("id-ID") : 0),
        },
        {
            title: "TYPE",
            dataIndex: "type",
            key: "type",
            width: 100,
        },
        {
            title: "METHOD",
            dataIndex: "method",
            key: "method",
            width: 100,
        },
        {
            title: "RECEIPT NUMBER",
            dataIndex: "receiptNumber",
            key: "receiptNumber",
            width: 150,
        },
        {
            title: "RECEIPT CHANNEL",
            dataIndex: "receiptChannel",
            key: "receiptChannel",
            width: 150,
        },
        {
            title: "BANK",
            dataIndex: "bank",
            key: "bank",
            width: 100,
        },
        {
            title: "COLLECTION AGENT",
            dataIndex: "collectionAgent",
            key: "collectionAgent",
            width: 150,
        },
        {
            title: "DELIVERY CHANNEL",
            dataIndex: "deliveryChannel",
            key: "deliveryChannel",
            width: 150,
        },
        {
            title: "SPI FLAG",
            dataIndex: "spiFlag",
            key: "spiFlag",
            width: 100,
        },
        {
            title: "RECONCILER",
            dataIndex: "reconciler",
            key: "reconciler",
            width: 150,
        },
    ];

    return columns;
};

export const getInvoiceInformationColumns = () => {
    return [
        {
            title: "NO",
            dataIndex: "no",
            key: "no",
            isClassification: true,
            width: 50,
        },
        {
            title: "RELATIONSHIP ID",
            dataIndex: "relationshipId",
            key: "relationshipId",
            width: 150,
        },
        {
            title: "RELATIONSHIP NAME",
            dataIndex: "relationshipName",
            key: "relationshipName",
            width: 200,
        },
        {
            title: "RELATIONSHIP TYPE",
            dataIndex: "relationshipType",
            key: "relationshipType",
            width: 150,
        },
    ]
}
