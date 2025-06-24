import { Checkbox, Popover, Space, Tooltip } from "antd";
import { useCallback, useMemo } from "react";
import ButtonComponent from "../../ButtonComponent";
import SVGIcon from "../../../assets/Icon/index"
import { MoreOutlined } from "@ant-design/icons";

export const useContactHooks = (
    editingKey,
    handleDetail = () => { },
    handleUpdate = () => { },
    handleInactivate = () => { },
    handleDelete = () => { },
    handleCancel = () => { },
    handleSave = () => { },
    actionButtons = []
) => {
    const displayActionButton = useCallback((record, buttons) => {
        const editable = record?.key === editingKey;
        const lowerCaseButton = buttons?.map(item => item?.toLowerCase())

        if (buttons?.length > 3) {
            return (
                <Space className="my-2 gap-2">
                    {editable ?
                        (
                            <>
                                <ButtonComponent
                                    onClick={() => handleCancel(record)}
                                    type="default"
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent onClick={() => handleSave(record)} type="submit">
                                    Save
                                </ButtonComponent>
                            </>
                        )
                        :
                        (
                            <>
                                <Popover
                                    content={
                                        <Space direction="vertical">
                                            <ButtonComponent
                                                icon={<SVGIcon name="IconDetail" width={24} />}
                                                border={false}
                                                onClick={() => handleDetail(record)}
                                                disabled={editable}
                                            >
                                                <span className={"text-black"}> Detail</span>
                                            </ButtonComponent>
                                            <ButtonComponent
                                                onClick={() => handleUpdate(record)}
                                                disabled={editingKey}
                                                icon={<SVGIcon name="IconEdit" width={24} />}
                                                border={false}
                                            >
                                                <span className={"text-black"}> Update</span>
                                            </ButtonComponent>
                                            <Checkbox
                                                onClick={() => handleInactivate(record)}
                                                checked={record.status === "ACTIVE" ? true : false}
                                                disabled={editable}
                                            >
                                                <span className={"text-black normal-case text-[18px]"}>
                                                    {record?.status}
                                                </span>
                                            </Checkbox>
                                        </Space>
                                    }
                                    trigger={"click"}
                                    placement="bottomRight"
                                >
                                    <ButtonComponent
                                        icon={<MoreOutlined style={{ fontSize: "24px" }} />}
                                        border={false}
                                    />
                                </Popover>
                                {
                                    record.status === "ACTIVE" || record.status === "INACTIVE" ?
                                        (
                                            <SVGIcon color={"#D90000"} name="IconDelete" width={24} />
                                        ) :
                                        (
                                            <SVGIcon
                                                color={"#D90000"}
                                                name="IconDelete"
                                                width={24}
                                                onClick={editable === false && (() => handleDelete(record))}
                                            />
                                        )
                                }
                            </>
                        )}
                </Space>
            )
        } else {
            return (
                <Space className="my-2 gap-2">
                    {editable ?
                        (
                            <>
                                <ButtonComponent
                                    onClick={() => handleCancel(record)}
                                    type="default"
                                >
                                    Cancel
                                </ButtonComponent>
                                <ButtonComponent onClick={() => handleSave(record)} type="submit">
                                    Save
                                </ButtonComponent>
                            </>
                        )
                        :
                        (
                            <div className="flex w-full justify-center gap-6">
                                {lowerCaseButton?.includes('detail') && (
                                    <Tooltip title='Detail'>
                                        <div
                                            onClick={editable === false && (() => handleDetail(record))}
                                        >
                                            <SVGIcon
                                                name="IconDetail"
                                                width={24}
                                            />
                                        </div>
                                    </Tooltip>
                                )}
                                {lowerCaseButton?.includes('update') && (
                                    <Tooltip title='Edit'>
                                        <div
                                            className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                                                }`
                                            }
                                            onClick={!editingKey ? () => handleUpdate(record) : undefined}
                                        >
                                            <SVGIcon
                                                name="IconEdit"
                                                color={editingKey ? "#8D91A0" : "#ACC424"}
                                                width={24}
                                                onClick={!editingKey ? () => handleUpdate(record) : undefined}
                                                className={
                                                    editingKey ? "disabled" : undefined
                                                }
                                            />
                                        </div>
                                    </Tooltip>
                                )}
                                {(lowerCaseButton?.includes("inactivate") || lowerCaseButton?.includes('inactive')) && (
                                    <ButtonComponent border={false} disabled={editable}>
                                        <Checkbox
                                            onClick={() => handleInactivate(record)}
                                            checked={record?.status === "ACTIVE"}
                                        />
                                    </ButtonComponent>
                                )}
                                {lowerCaseButton?.includes("delete") && (
                                    <Tooltip title="Delete">
                                        <div
                                            className={`flex justify-center${editingKey ? " cursor-not-allowed" : ""
                                                }`}
                                        >
                                            <SVGIcon
                                                name="IconDelete"
                                                color={editingKey ? "#8D91A0" : "#D90000"}
                                                width={24}
                                                className={
                                                    editingKey ? "disabled" : undefined
                                                }
                                                onClick={
                                                    !editingKey ? () => handleDelete(record) : undefined
                                                }
                                            />
                                        </div>
                                    </Tooltip>
                                )
                                }
                            </div>
                        )
                    }
                </Space>
            )

        }
    }, [editingKey, handleCancel, handleDelete, handleDetail, handleInactivate, handleSave, handleUpdate])

    const renderColumnAction = useMemo(() => {
        let actionProps = [
            {
                title: 'ACTION',
                dataIndex: 'action',
                align: "center",
                fixed: "right",
                width: 200,
            }
        ]
        const renderItem = actionProps?.map(item => ({
            ...item,
            render: (_, record) => displayActionButton(record, actionButtons)
        }));
        return renderItem;


    }, [actionButtons, displayActionButton])

    if (actionButtons?.length > 0) {
        return renderColumnAction;
    } else {
        return []
    }
}