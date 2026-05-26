import { Button, Form, Input, Select, Tooltip } from "antd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer";
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb";
import NxCardContainer from "../../../../../components/Nx/NxCardContainer";
import NxDetailText from "../../../../../components/Nx/NxDetailText";
import NxTable from "../../../../../components/Nx/NxTable";
import Toolbar from "../../../../../components/Toolbar";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import {
    createActivityTemplate,
    updateActivityTemplate,
    getDetailActivityTemplate,
    getWOCategory,
    getWOType,
    getSRSubCategory,
} from "../../../../../redux/slices/system_setup/activityTemplate";

const CreateUpdateActivityTemplate = ({ type = "create" }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state: locationState } = useLocation();
    const recordId = locationState?.id ?? null;
    const isUpdate = type === "update";

    const {
        wo_category_list = [],
        wo_type_list = [],
        sr_sub_category_list = [],
        loading_create_update_at = false,
        detail_at = {},
    } = useSelector((state) => state.activityTemplate);

    const [form] = Form.useForm();

    // activityItems: { tempId: string, name: string, isEditing: boolean, originalName: string }
    const [activityItems, setActivityItems] = useState([]);

    useEffect(() => {
        dispatch(getWOCategory());
        dispatch(getWOType());
        dispatch(getSRSubCategory());
        if (isUpdate && recordId) {
            dispatch(getDetailActivityTemplate(recordId));
        }
    }, [dispatch, isUpdate, recordId]);

    // Populate form in update mode once detail is loaded
    useEffect(() => {
        if (!isUpdate || !detail_at?.id) return;

        form.setFieldsValue({
            name: detail_at.name,
            workOrderCategory: detail_at.workOrderCategoryId,
            workOrderType: detail_at.workOrderTypeId,
            srSubCategory: detail_at.srSubCategoryId,
        });

        setActivityItems(
            (detail_at.activityList || []).map((item) => ({
                tempId: item.id,
                name: item.name,
                isEditing: false,
                originalName: item.name,
            }))
        );
    }, [detail_at, isUpdate, form]);

    const routes = useMemo(() => [
        { path: "", breadcrumbName: "System Setup" },
        { path: SYSTEM_SETUP_ROUTES.VIEW_ACTIVITY_TEMPLATE, breadcrumbName: "Activity Template" },
        {
            path: isUpdate
                ? SYSTEM_SETUP_ROUTES.UPDATE_ACTIVITY_TEMPLATE
                : SYSTEM_SETUP_ROUTES.CREATE_ACTIVITY_TEMPLATE,
            breadcrumbName: isUpdate ? "Update Activity Template" : "Create Activity Template",
        },
    ], [isUpdate]);

    // --- Activity Items handlers ---

    const handleAddItem = useCallback(() => {
        setActivityItems((prev) => [
            ...prev,
            { tempId: Date.now().toString(), name: "", isEditing: true, originalName: "" },
        ]);
    }, []);

    const handleSaveItem = useCallback((tempId) => {
        setActivityItems((prev) => {
            const item = prev.find((i) => i.tempId === tempId);
            if (!item || !item.name.trim()) return prev; // validation: name required
            return prev.map((i) =>
                i.tempId === tempId ? { ...i, isEditing: false, originalName: i.name } : i
            );
        });
    }, []);

    const handleCancelItem = useCallback((tempId) => {
        setActivityItems((prev) => {
            const item = prev.find((i) => i.tempId === tempId);
            if (!item) return prev;
            if (item.originalName === "") {
                // new row — remove
                return prev.filter((i) => i.tempId !== tempId);
            }
            // existing row — revert
            return prev.map((i) =>
                i.tempId === tempId ? { ...i, name: i.originalName, isEditing: false } : i
            );
        });
    }, []);

    const handleEditItem = useCallback((tempId) => {
        setActivityItems((prev) =>
            prev.map((i) =>
                i.tempId === tempId ? { ...i, originalName: i.name, isEditing: true } : i
            )
        );
    }, []);

    const handleDeleteItem = useCallback((tempId) => {
        setActivityItems((prev) => prev.filter((i) => i.tempId !== tempId));
    }, []);

    const handleNameChange = useCallback((tempId, value) => {
        setActivityItems((prev) =>
            prev.map((i) => (i.tempId === tempId ? { ...i, name: value } : i))
        );
    }, []);

    const activityItemColumns = useMemo(() => [
        {
            key: "no",
            title: "NO",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            key: "name",
            title: "NAME",
            dataIndex: "name",
            render: (_, record) =>
                record.isEditing ? (
                    <Input
                        value={record.name}
                        onChange={(e) => handleNameChange(record.tempId, e.target.value)}
                        status={record.name.trim() === "" ? "error" : undefined}
                        placeholder="Enter name"
                    />
                ) : (
                    record.name
                ),
        },
        {
            key: "action",
            title: "ACTION",
            dataIndex: "action",
            width: 120,
            fixed: "right",
            align: "center",
            render: (_, record) =>
                record.isEditing ? (
                    <div className="flex justify-center gap-2 my-1">
                        <Tooltip title="Cancel">
                            <Button type="table-action" onClick={() => handleCancelItem(record.tempId)}>
                                Cancel
                            </Button>
                        </Tooltip>
                        <Tooltip title="Save">
                            <Button
                                type="table-action"
                                onClick={() => handleSaveItem(record.tempId)}
                                disabled={!record.name.trim()}
                            >
                                Save
                            </Button>
                        </Tooltip>
                    </div>
                ) : (
                    <div className="flex justify-center gap-2 my-1">
                        <Tooltip title="Edit">
                            <Button type="table-action" onClick={() => handleEditItem(record.tempId)}>
                                <SVGIcon name="IconEdit" width={20} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button type="table-action" onClick={() => handleDeleteItem(record.tempId)}>
                                <SVGIcon name="IconDelete" width={20} />
                            </Button>
                        </Tooltip>
                    </div>
                ),
        },
    ], [handleNameChange, handleCancelItem, handleSaveItem, handleEditItem, handleDeleteItem]);

    const itemActionsActivity = useMemo(() => [
        {
            action: "Create",
            render: (
                <Button
                    icon={<SVGIcon name="IconButtonCreate" width={14} />}
                    type="submit"
                    onClick={handleAddItem}
                >
                    Create
                </Button>
            ),
        },
    ], [handleAddItem]);

    // --- Main form handlers ---

    const handleSubmit = useCallback(() => {
        const hasUnsaved = activityItems.some((i) => i.isEditing);
        if (hasUnsaved || activityItems.length === 0) return; // blocked if any row is still editing

        const values = form.getFieldsValue(true);
        const payload = {
            name: values.name,
            workOrderCategoryId: values.workOrderCategory,
            workOrderTypeId: values.workOrderType,
            srSubCategoryId: values.srSubCategory,
            activityList: activityItems.map(({ name }) => ({ name })),
        };

        if (type === "create") {
            dispatch(createActivityTemplate(payload));
        } else if (isUpdate && recordId) {
            dispatch(updateActivityTemplate({ id: recordId, body: payload }));
        }
    }, [form, activityItems, type, isUpdate, recordId, dispatch]);

    const handleClearForm = useCallback(() => {
        form.resetFields();
        setActivityItems([]);
    }, [form]);

    return (
        <Form
            id="activity-template-form"
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            scrollToFirstError={true}
            className="flex flex-col gap-y-4"
        >
            <NxBreadCrumb routes={routes} />

            {/* SECTION 1: Activity Template Information */}
            <NxCardContainer header={"ACTIVITY TEMPLATE INFORMATION"}>
                <NxBaseContainer border>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label="Name"
                            required
                            rules={[{ required: true, message: "Name is required" }]}
                            className="no-margin-form"
                        >
                            <InputComponent />
                        </Form.Item>
                        <Form.Item
                            name="workOrderCategory"
                            label="Work Order Category"
                            required
                            rules={[{ required: true, message: "Work Order Category is required" }]}
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(wo_category_list || []).map((data, index) => (
                                    <Select.Option key={index} value={data.id}>{data.name}</Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                        <Form.Item
                            name="workOrderType"
                            label="Work Order Type"
                            required
                            rules={[{ required: true, message: "Work Order Type is required" }]}
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(wo_type_list || []).map((data, index) => (
                                    <Select.Option key={index} value={data.id}>{data.name}</Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                        <Form.Item
                            name="srSubCategory"
                            label="Service Request Sub-Category"
                            required
                            rules={[{ required: true, message: "Service Request Sub-Category is required" }]}
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(sr_sub_category_list || []).map((data, index) => (
                                    <Select.Option key={index} value={data.id}>{data.name}</Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                    </div>
                </NxBaseContainer>
            </NxCardContainer>

            {/* SECTION 2: Activity Template List */}
            <NxCardContainer header={"ACTIVITY TEMPLATE LIST"}>
                <NxBaseContainer border>
                    <div className="flex flex-col gap-4">
                        <Toolbar items={itemActionsActivity} type="page" />
                        <NxTable
                            idTable="activity-items-table"
                            dataSource={activityItems}
                            totalData={activityItems.length}
                            columns={activityItemColumns}
                            tableScrolled={{ x: "max-content" }}
                            usePagination={false}
                            useInfiniteScroll={false}
                            rowKey="tempId"
                        />
                    </div>
                </NxBaseContainer>
            </NxCardContainer>

            {/* SECTION 3: History Log (update mode only) */}
            {isUpdate && detail_at?.id && (
                <NxCardContainer header={"HISTORY LOG INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-5 gap-4">
                            <NxDetailText label="Record ID">{detail_at?.id}</NxDetailText>
                            <NxDetailText label="Created Date">{detail_at?.createdDate}</NxDetailText>
                            <NxDetailText label="Created By">{detail_at?.createdBy}</NxDetailText>
                            <NxDetailText label="Updated Date">{detail_at?.updatedDate}</NxDetailText>
                            <NxDetailText label="Updated By">{detail_at?.updatedBy}</NxDetailText>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>
            )}

            {/* Footer */}
            <NxBaseContainer border>
                <div className="flex justify-between">
                    <Button
                        type="menu"
                        onClick={() => navigate(SYSTEM_SETUP_ROUTES.VIEW_ACTIVITY_TEMPLATE)}
                        disabled={loading_create_update_at}
                    >
                        Cancel
                    </Button>
                    <div className="flex w-full justify-end gap-x-2">
                        <Button
                            type="reject"
                            icon={<SVGIcon name="IconButtonClear" width={14} />}
                            onClick={handleClearForm}
                            disabled={loading_create_update_at}
                        >
                            Clear Data
                        </Button>
                        <Button
                            type="approve"
                            onClick={() => form.submit()}
                            loading={loading_create_update_at}
                            disabled={loading_create_update_at || activityItems.length === 0 || activityItems.some((i) => i.isEditing)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </NxBaseContainer>
        </Form>
    );
};

export default CreateUpdateActivityTemplate;
