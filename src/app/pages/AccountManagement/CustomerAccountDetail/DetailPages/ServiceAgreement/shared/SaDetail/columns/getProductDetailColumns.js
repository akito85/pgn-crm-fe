import React from 'react';
import { Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import SVGIcon from '../../../../../../../../../assets/Icon/index';
import ButtonComponent from '../../../../../../../../../components/ButtonComponent';
import { getColumnSearchProps } from '../../../../../../../../../utils/getColumnSearchProps';
import { getColumnSearchPropsCriteria } from '../../../../../../../ProductAndPromo/Product/columnTableCriteria';

export const getProductDetailColumns = ({
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => { },
    listName = [],
    dataListUnit = [],
    editingKey = "",
    edit = () => { },
    save = () => { },
    cancel = () => { },
    deleteRow = () => { },
    isProduct,
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
            title: "NAME",
            key: "name",
            dataIndex: "name",
            width: 240,
            options: listName,
            inputType: "select",
            required: { required: true, message: "Please input your" },
            ...getColumnSearchPropsCriteria(
                "name",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "VALUE",
            key: "value",
            dataIndex: "value",
            width: 240,
            align: "right",
            inputType: "number",
            dependDataIndex: "name",
            ...getColumnSearchProps(
                "value",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "UNIT",
            key: "unit",
            dataIndex: "unit",
            width: 240,
            align: "center",
            options: dataListUnit,
            inputType: "select",
            dependDataIndex: "name",
            ...getColumnSearchPropsCriteria(
                "unit",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
            ),
        },
        {
            title: "DESCRIPTION",
            key: "description",
            dataIndex: "description",
            width: 240,
            inputType: "description",
            ellipsis: {
                showTitle: false,
            },
            ...getColumnSearchProps(
                "description",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
                searchedColumn === "description" ? (
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: "#ffc069",
                            padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ""}
                    />
                ) : text ? (
                    <Tooltip placement="topLeft" title={text}>
                        {text}
                    </Tooltip>
                ) : (
                    ""
                ),
        },
        {
            title: "ACTION",
            key: "operation",
            dataIndex: "operation",
            width: 100,
            fixed: "right",
            render: (_, record) => {
                const editable = record.key === editingKey;
                return (
                    <div className="flex w-full justify-center gap-2">
                        {editable ? (
                            <>
                                <ButtonComponent onClick={() => cancel(record)} type="default">
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent
                                    onClick={() => save(record.key)}
                                    type="submit"
                                >
                                    Save
                                </ButtonComponent>
                            </>
                        ) : (
                            <>
                                <Tooltip title="Edit">
                                    <span
                                        className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <SVGIcon
                                            name="IconEdit"
                                            color={editingKey ? "#8D91A0" : "#1976D2"}
                                            width={24}
                                            onClick={!editingKey ? () => edit(record) : undefined}
                                        />
                                    </span>
                                </Tooltip>
                                {isProduct === 2 && (
                                    <Tooltip title="Delete">
                                        <span
                                            className={`flex justify-center${record.typeData === "exist"
                                                ? " cursor-not-allowed"
                                                : ""
                                                }`}
                                        >
                                            <SVGIcon
                                                name="IconDelete"
                                                width={24}
                                                className={
                                                    record.typeData === "exist" ? "disabled" : undefined
                                                }
                                                onClick={
                                                    record.typeData !== "exist"
                                                        ? () => deleteRow(record)
                                                        : undefined
                                                }
                                            />
                                        </span>
                                    </Tooltip>
                                )}
                            </>
                        )}
                    </div>
                );
            },
        },
    ];
};
