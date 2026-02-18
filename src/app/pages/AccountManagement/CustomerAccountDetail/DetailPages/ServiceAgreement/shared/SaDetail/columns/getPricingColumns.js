import React from 'react';
import { Tooltip } from 'antd';
import { NumericFormat } from 'react-number-format';
import SVGIcon from '../../../../../../../../../assets/Icon/index';
import { hasValue, renderColumn } from '../../../../../../../../../utils';
import { CurrencyFormatting, currencyFormatting } from "../../../../../../../../../utils/formatCurrency";

const separatorNumber = (text) => {
    const thousandSeparator = ",";
    return text?.toString()?.length > 0
        ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
        : "";
};

export const getPricingColumns = ({
    search = {},
    handleDelete = () => { },
    handleUpdate = () => { },
    isCustomTiering = false,
}) => {
    const columns = [
        {
            title: "NO",
            key: "no",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (value, row, index) => {
                let obj = {
                    children: row.number + 1,
                    props: {
                        colSpan: 1,
                        rowSpan: row.rowSpan,
                    },
                };
                return obj;
            },
        },
        {
            sorter: true,
            title: "MINIMUM",
            key: "min",
            dataIndex: "min",
            filteredValue: search?.["min"] ? [search?.["min"]] : null,
            align: "right",
            width: 150,
            render: (text, row, index) => {
                let obj = {
                    children: renderColumn(
                        "min",
                        hasValue(search["min"]),
                        search["min"],
                        separatorNumber(text),
                        false,
                        "input",
                        search
                    ),
                    props: {
                        colSpan: 1,
                        rowSpan: row.rowSpan,
                    },
                };
                return obj;
            },
        },
        {
            sorter: true,
            title: "MAXIMUM",
            key: "max",
            dataIndex: "max",
            filteredValue: search?.["max"] ? [search?.["max"]] : null,
            align: "right",
            width: 150,
            render: (text, row, index) => {
                let obj = {
                    children: renderColumn(
                        "max",
                        hasValue(search["max"]),
                        search["max"],
                        separatorNumber(text),
                        false,
                        "input",
                        search
                    ),
                    props: {
                        colSpan: 1,
                        rowSpan: row.rowSpan,
                    },
                };
                return obj;
            },
        },
        {
            sorter: true,
            title: "PRICE CODE",
            key: "priceCodeName",
            dataIndex: "priceCodeName",
            align: "left",
            filteredValue: search?.["priceCodeName"] ? [search?.["priceCodeName"]] : null,
            width: 200,
            render: (text, row, index) => {
                let obj = {
                    children: renderColumn(
                        "priceCodeName",
                        hasValue(search["priceCodeName"]),
                        search["priceCodeName"],
                        text,
                        false,
                        "input",
                        search
                    ),
                    props: {
                        colSpan: 1,
                        rowSpan: row.rowSpan,
                    },
                };
                return obj;
            },
        },
        {
            title: "PRICE DETAIL",
            children: [
                {
                    title: "VALUE",
                    key: "value",
                    dataIndex: "value",
                    align: "right",
                    width: 120,
                    render: (value, record) => (
                        <CurrencyFormatting
                            value={value}
                            currency={record.currency?.toLowerCase()}
                        />
                    ),
                },
                {
                    title: "CURRENCY",
                    key: "currency",
                    dataIndex: "currency",
                    align: "center",
                    width: 100,
                },
                {
                    title: "UOM",
                    key: "uomName",
                    dataIndex: "uomName",
                    align: "center",
                    width: 100,
                },
                {
                    title: "PRICE ADJUSTMENT",
                    key: "adjustment",
                    dataIndex: "adjustment",
                    align: "center",
                    width: 150,
                    render: (data) => <span>{data}</span>,
                },
            ],
        },
        {
            sorter: true,
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            align: "left",
            filteredValue: search?.["description"] ? [search?.["description"]] : null,
            width: 200,
            ellipsis: {
                showTitle: false,
            },
            render: (text, row, index) => {
                let obj = {
                    children: renderColumn(
                        "description",
                        hasValue(search["description"]),
                        search["description"],
                        text,
                        true,
                        "input",
                        search
                    ),
                    props: {
                        colSpan: 1,
                        rowSpan: row.rowSpan,
                    },
                };
                return obj;
            },
        },
    ];

    // Add ACTION column only if custom tiering is enabled
    if (isCustomTiering) {
        columns.push({
            title: "ACTION",
            key: "action",
            fixed: "right",
            align: "center",
            width: 110,
            render: (v, r, i) => {
                const children = (
                    <div className="flex w-full justify-center gap-6">
                        <Tooltip title="Update">
                            <SVGIcon
                                name="IconEdit"
                                width={24}
                                onClick={() => {
                                    handleUpdate(r);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <SVGIcon
                                name="IconDelete"
                                width={24}
                                className={
                                    r.type === "exist" ? "disabled cursor-not-allowed" : undefined
                                }
                                onClick={
                                    r.type !== "exist" ? () => handleDelete(r.priceCode, r.max, r.min) : undefined
                                }
                            />
                        </Tooltip>
                    </div>
                );
                let obj = {
                    children: children,
                    props: {
                        colSpan: 1,
                        rowSpan: r.rowSpan,
                    },
                };
                return obj;
            },
        });
    }

    return columns;
};
