import React from 'react';
import { Tooltip } from 'antd';
import SVGIcon from '../../../../../../../../../assets/Icon/index';

export const getTosColumns = ({
    isProduct,
    openModalFormTos,
    setdataUpdate,
    deleteRow,
}) => {
    return [
        {
            title: "NO",
            key: "no",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (text, object, index) => index + 1,
        },
        {
            title: "TERM OF SERVICE",
            key: "tosName",
            dataIndex: "tosName",
            sorter: true,
            width: 300,
        },
        {
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            sorter: true,
            width: 400,
        },
        {
            title: "ACTION",
            key: "action",
            align: "center",
            width: 100,
            fixed: "right",
            render: (_, record) => {
                return (
                    <div className="flex justify-center align-middle gap-2">
                        <Tooltip title="Edit">
                            <span className="flex justify-center">
                                <SVGIcon
                                    name="IconEdit"
                                    width={24}
                                    onClick={() => {
                                        setdataUpdate(record);
                                        openModalFormTos(record);
                                    }}
                                />
                            </span>
                        </Tooltip>
                        {isProduct === 2 && (
                            <Tooltip title="Delete">
                                <SVGIcon
                                    name="IconDelete"
                                    color={"#be3036"}
                                    width={24}
                                    onClick={() => {
                                        deleteRow(record);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
    ];
};

// Nested table columns for TOS Detail
export const getTosDetailColumns = () => {
    return [
        {
            title: "NO",
            key: "no",
            align: "center",
            width: 60,
            render: (text, object, index) => index + 1,
        },
        {
            title: 'ATTRIBUTE',
            key: 'attributeName',
            dataIndex: 'attributeName',
            width: 200,
        },
        {
            title: 'VALUE',
            key: 'value',
            dataIndex: 'value',
            width: 300,
        }
    ];
};
