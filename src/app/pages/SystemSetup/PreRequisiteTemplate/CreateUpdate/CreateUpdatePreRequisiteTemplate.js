import { Button, Empty, Form, Select, Tooltip } from "antd"
import { useState, useEffect, useMemo, useCallback } from "react"
import dayjs from "dayjs"
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer"
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb"
import NxCardContainer from "../../../../../components/Nx/NxCardContainer"
import NxDetailText from "../../../../../components/Nx/NxDetailText"
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes"
import InputComponent from "../../../../../components/InputComponent"
import SelectComponent from "../../../../../components/SelectComponent"
import { useDispatch, useSelector } from "react-redux"
import { getAccountGroupType, getAccountSegment, getCriteria, getPreRequisiteType, getSourceType, getSrCategory, getSrSubCategory } from "../../../../../redux/slices/system_setup/preRequisiteTemplate"
import Toolbar from "../../../../../components/Toolbar"
import NxModal from "../../../../../components/Nx/NxModal"
import NxTable from "../../../../../components/Nx/NxTable"
import NxDate from "../../../../../components/Nx/NxDatePicker"
import SVGIcon from "../../../../../assets/Icon/index"
import { useNavigate } from "react-router-dom"

const CreateUpdatePreRequisiteTemplate = ({ formType = "create" }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        list_source_type = [],
        loading_source_type = false,
        list_sr_category = [],
        loading_sr_category = false,
        list_sr_sub_category = [],
        loading_sr_sub_category = false,
        list_criteria = [],
        loading_criteria = false,
        list_account_group_type = [],
        loading_account_group_type = false,
        list_account_segment = [],
        loading_account_segment = false,
        list_pre_requisite_type = [],
        loading_pre_requisite_type = false,
    } = useSelector((state) => state.preRequisiteTemplate);

    const [criteriaValues, setCriteriaValues] = useState([]);
    const [criteriaDataRows, setCriteriaDataRows] = useState([]);
    const [detailRows, setDetailRows] = useState([]);
    const [modalCriteriaOpen, setModalCriteriaOpen] = useState(false);
    const [editingCriteriaRecord, setEditingCriteriaRecord] = useState(null);
    const [editingDetailRecord, setEditingDetailRecord] = useState(null);
    const [isDetailMode, setIsDetailMode] = useState(false);

    useEffect(() => {
        dispatch(getSourceType());
        dispatch(getSrCategory());
        dispatch(getSrSubCategory());
        dispatch(getCriteria());
        dispatch(getAccountGroupType());
        dispatch(getAccountSegment());
        dispatch(getPreRequisiteType());
    }, [dispatch]);

    const [form] = Form.useForm();
    const [modalForm] = Form.useForm();
    const [detailForm] = Form.useForm();

    const routes = useMemo(() => {
        const base = [
            { path: "", breadcrumbName: "System Setup" },
            { path: SYSTEM_SETUP_ROUTES.VIEW_PRE_REQUISITE_TEMPLATE, breadcrumbName: "Pre-Requisite Template" },
            { path: SYSTEM_SETUP_ROUTES.CREATE_PRE_REQUISITE_TEMPLATE, breadcrumbName: "Create Pre-Requisite Template" },
        ];
        if (isDetailMode) {
            base.push({ path: "", breadcrumbName: "Create Detail" });
        }
        return base;
    }, [isDetailMode]);

    const getNameByValue = useCallback((list, value) =>
        list?.find((item) => item.value === value)?.name || value || "-"
    , []);

    // --- Criteria modal handlers ---

    const handleOpenCriteriaModal = useCallback((record) => {
        setEditingCriteriaRecord(record);
        if (record) {
            const formValues = { ...record };
            if (formValues.startDate) formValues.startDate = dayjs(formValues.startDate);
            if (formValues.endDate) formValues.endDate = dayjs(formValues.endDate);
            modalForm.setFieldsValue(formValues);
        } else {
            modalForm.resetFields();
        }
        setModalCriteriaOpen(true);
    }, [modalForm]);

    const handleCloseCriteriaModal = useCallback(() => {
        setModalCriteriaOpen(false);
        setEditingCriteriaRecord(null);
        modalForm.resetFields();
    }, [modalForm]);

    const handleSaveCriteriaModal = useCallback(async () => {
        try {
            const values = await modalForm.validateFields();
            const row = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            };
            if (editingCriteriaRecord) {
                setCriteriaDataRows((prev) =>
                    prev.map((r) => r.key === editingCriteriaRecord.key ? { ...r, ...row } : r)
                );
            } else {
                setCriteriaDataRows((prev) => [...prev, { key: Date.now().toString(), ...row }]);
            }
            handleCloseCriteriaModal();
        } catch {
            // validation failed — stay open
        }
    }, [modalForm, editingCriteriaRecord, handleCloseCriteriaModal]);

    const handleDeleteCriteriaRow = useCallback((key) => {
        setCriteriaDataRows((prev) => prev.filter((r) => r.key !== key));
    }, []);

    // --- Detail mode handlers ---

    const handleOpenDetailMode = useCallback(async (record = null) => {
        if (record) {
            setEditingDetailRecord(record);
            detailForm.setFieldsValue(record);
            setIsDetailMode(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            try {
                await form.validateFields();
                setEditingDetailRecord(null);
                detailForm.resetFields();
                setIsDetailMode(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch {
                // validation failed — stay on form
            }
        }
    }, [form, detailForm]);

    const handleSaveDetail = useCallback(async () => {
        try {
            const values = await detailForm.validateFields();
            if (editingDetailRecord) {
                setDetailRows((prev) =>
                    prev.map((r) => r.key === editingDetailRecord.key ? { ...r, ...values } : r)
                );
            } else {
                setDetailRows((prev) => [...prev, { key: Date.now().toString(), ...values }]);
            }
            setIsDetailMode(false);
            setEditingDetailRecord(null);
            detailForm.resetFields();
        } catch {
            // validation failed — stay open
        }
    }, [detailForm, editingDetailRecord]);

    const handleCancelDetail = useCallback(() => {
        setIsDetailMode(false);
        setEditingDetailRecord(null);
        detailForm.resetFields();
    }, [detailForm]);

    const handleDeleteDetailRow = useCallback((key) => {
        setDetailRows((prev) => prev.filter((r) => r.key !== key));
    }, []);

    // --- Toolbar action items ---

    const itemActionsCriteria = useMemo(() => [
        {
            action: "Create",
            render: (
                <Button
                    icon={<SVGIcon name="IconButtonCreate" width={14} />}
                    type="submit"
                    onClick={() => handleOpenCriteriaModal(null)}
                >
                    Create
                </Button>
            )
        }
    ], [handleOpenCriteriaModal]);

    const itemActionsDetail = useMemo(() => [
        {
            action: "Create",
            render: (
                <Button
                    icon={<SVGIcon name="IconButtonCreate" width={14} />}
                    type="submit"
                    onClick={() => handleOpenDetailMode(null)}
                >
                    Create
                </Button>
            )
        }
    ], [handleOpenDetailMode]);

    // --- Criteria data table columns ---

    const criteriaTableColumns = useMemo(() => {
        const selectedCriteria = list_criteria.filter((c) => criteriaValues.includes(c.value));
        return [
            {
                key: "no",
                title: "NO",
                dataIndex: "no",
                width: 60,
                align: "center",
                render: (_, __, index) => index + 1,
            },
            ...selectedCriteria.map((c) => ({
                key: c.value,
                title: c.name.toUpperCase(),
                dataIndex: c.value,
            })),
            {
                key: "startDate",
                title: "START DATE",
                dataIndex: "startDate",
                width: 140,
                render: (text) => NxDate.formatDate(text, "DD MMM YYYY"),
            },
            {
                key: "endDate",
                title: "END DATE",
                dataIndex: "endDate",
                width: 140,
                render: (text) => NxDate.formatDate(text, "DD MMM YYYY"),
            },
            {
                key: "action",
                title: "ACTION",
                dataIndex: "action",
                width: 100,
                fixed: "right",
                align: "center",
                render: (_, record) => (
                    <div className="flex justify-center gap-2 my-1">
                        <Tooltip title="Update">
                            <Button type="table-action" onClick={() => handleOpenCriteriaModal(record)}>
                                <SVGIcon name="IconEdit" width={20} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button type="table-action" onClick={() => handleDeleteCriteriaRow(record.key)}>
                                <SVGIcon name="IconDelete" width={20} />
                            </Button>
                        </Tooltip>
                    </div>
                ),
            },
        ];
    }, [criteriaValues, list_criteria, handleOpenCriteriaModal, handleDeleteCriteriaRow]);

    // --- Detail list table columns ---

    const detailTableColumns = useMemo(() => [
        {
            key: "no",
            title: "NO",
            dataIndex: "no",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1,
        },
        {
            key: "type",
            title: "TYPE",
            dataIndex: "type",
            render: (value) => getNameByValue(list_pre_requisite_type, value),
        },
        {
            key: "name",
            title: "NAME",
            dataIndex: "name",
        },
        {
            key: "description",
            title: "DESCRIPTION",
            dataIndex: "description",
        },
        {
            key: "action",
            title: "ACTION",
            dataIndex: "action",
            width: 100,
            fixed: "right",
            align: "center",
            render: (_, record) => (
                <div className="flex justify-center gap-2 my-1">
                    <Tooltip title="Update">
                        <Button type="table-action" onClick={() => handleOpenDetailMode(record)}>
                            <SVGIcon name="IconEdit" width={20} />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button type="table-action" onClick={() => handleDeleteDetailRow(record.key)}>
                            <SVGIcon name="IconDelete" width={20} />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ], [handleOpenDetailMode, handleDeleteDetailRow, list_pre_requisite_type, getNameByValue]);

    // --- Selected criteria options for modal form ---

    const selectedCriteriaOptions = useMemo(() => {
        return list_criteria.filter((c) => criteriaValues.includes(c.value));
    }, [criteriaValues, list_criteria]);

    // --- Main form handlers ---

    const handleSubmit = () => {
        const values = form.getFieldsValue(true);
        console.log("submit", { ...values, criteriaDataRows, detailRows });
    }

    const handleClearForm = useCallback(() => {
        form.resetFields();
        setCriteriaValues([]);
        setCriteriaDataRows([]);
        setDetailRows([]);
    }, [form]);

    const handleSelectCriteria = (value) => {
        const updated = [...new Set([...criteriaValues, value])];
        setCriteriaValues(updated);
        form.setFieldsValue({ criteria: updated });
    }

    const handleDeselectCriteria = (value) => {
        const updated = criteriaValues.filter((item) => item !== value);
        setCriteriaValues(updated);
        setCriteriaDataRows([]);
        form.setFieldsValue({ criteria: updated });
    }

    const handleClearCriteria = () => {
        setCriteriaValues([]);
        setCriteriaDataRows([]);
        form.setFieldsValue({ criteria: [] });
    }

    const formSnapshot = isDetailMode ? form.getFieldsValue(true) : {};

    return (
        <>
        <Form
            id="pre-requisite-template-form"
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            scrollToFirstError={true}
            className="flex flex-col gap-y-4"
        >
            <NxBreadCrumb routes={routes} />

            {/* PRE-REQUISITE TEMPLATE INFORMATION */}
            <NxCardContainer header={"PRE-REQUISITE TEMPLATE INFORMATION"}>
                <NxBaseContainer border>
                    {isDetailMode ? (
                        <>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <NxDetailText label={"Name"}>{formSnapshot.name || "-"}</NxDetailText>
                            <NxDetailText label={"Source Type"}>{getNameByValue(list_source_type, formSnapshot.sourceType)}</NxDetailText>
                            <NxDetailText label={"SR Category"}>{getNameByValue(list_sr_category, formSnapshot.srCategory)}</NxDetailText>
                            <NxDetailText label={"SR Sub Category"}>{getNameByValue(list_sr_sub_category, formSnapshot.srSubCategory)}</NxDetailText>
                        </div>
                        <div className="w-full grid gap-4 mt-4">
                            <NxDetailText label={"Criteria"}>
                                {(formSnapshot.criteria || [])
                                    .map((v) => getNameByValue(list_criteria, v))
                                    .join(", ") || "-"}
                            </NxDetailText>
                            <NxDetailText label={"Description"}>{formSnapshot.description || "-"}</NxDetailText>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <Form.Item name="name" label="Name" required className="no-margin-form">
                                <InputComponent />
                            </Form.Item>
                            <Form.Item name="sourceType" label="Source Type" required className="no-margin-form">
                                <SelectComponent>
                                    {(list_source_type || []).map((data, index) => (
                                        <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item name="srCategory" label="SR Category" required className="no-margin-form">
                                <SelectComponent>
                                    {(list_sr_category || []).map((data, index) => (
                                        <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item name="srSubCategory" label="SR Sub Category" required className="no-margin-form">
                                <SelectComponent>
                                    {(list_sr_sub_category || []).map((data, index) => (
                                        <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                        </div>
                        <div className="w-full grid gap-4">
                            <Form.Item name="criteria" label="Criteria" required className="no-margin-form">
                                <SelectComponent
                                    mode="multiple"
                                    onSelect={handleSelectCriteria}
                                    onDeselect={handleDeselectCriteria}
                                    onClear={handleClearCriteria}
                                >
                                    {(list_criteria || []).map((data, index) => (
                                        <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item name="description" label="Description" required className="no-margin-form">
                                <InputComponent type="textarea" rows={4} maxLength={255} />
                            </Form.Item>
                        </div>
                        </>
                    )}
                </NxBaseContainer>
            </NxCardContainer>

            {/* PRE-REQUISITE TEMPLATE CRITERIA — hidden in detail mode */}
            {!isDetailMode && (
                <NxCardContainer header={"PRE-REQUISITE TEMPLATE CRITERIA"}>
                    <NxBaseContainer border>
                        {criteriaValues.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <Toolbar items={itemActionsCriteria} type="page" />
                                <NxTable
                                    idTable={"table-criteria-prt"}
                                    dataSource={criteriaDataRows}
                                    totalData={criteriaDataRows.length}
                                    columns={criteriaTableColumns}
                                    tableScrolled={{ x: "max-content" }}
                                    usePagination={false}
                                    useInfiniteScroll={false}
                                />
                            </div>
                        ) : (
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Select at least one criteria"} />
                        )}
                    </NxBaseContainer>
                </NxCardContainer>
            )}

            {/* PRE-REQUISITE TEMPLATE LIST — hidden in detail mode */}
            {!isDetailMode && (
                <NxCardContainer header={"PRE-REQUISITE TEMPLATE LIST"}>
                    <NxBaseContainer border>
                        <div className="flex flex-col gap-4">
                            <Toolbar items={itemActionsDetail} type="page" />
                            <NxTable
                                idTable={"table-detail-prt"}
                                dataSource={detailRows}
                                totalData={detailRows.length}
                                columns={detailTableColumns}
                                tableScrolled={{ x: "max-content" }}
                                usePagination={false}
                                useInfiniteScroll={false}
                            />
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>
            )}

            <NxBaseContainer border>
                <div className="flex justify-between">
                    <Button
                        type="menu"
                        onClick={() => {
                            navigate(-1);
                        }}
                    >
                        Cancel
                    </Button>
                    <div className="flex w-full justify-end gap-x-2">
                        <Button
                            type="reject"
                            icon={<SVGIcon name="IconButtonDelete" width={14} />}
                            onClick={handleClearForm}
                        >
                            Clear Data
                        </Button>
                        <Button
                            type="approve"
                            onClick={() => form.submit()}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </NxBaseContainer>
        </Form>

        {/* PRE-REQUISITE INFORMATION — shown only in detail mode */}
        {isDetailMode && (
            <Form
                id="pre-requisite-detail-form"
                form={detailForm}
                layout="vertical"
                className="flex flex-col gap-y-4"
            >
                <NxCardContainer header={"PRE-REQUISITE INFORMATION"}>
                    <NxBaseContainer border>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <Form.Item
                                name="type"
                                label="Type"
                                required
                                rules={[{ required: true, message: "Type is required" }]}
                                className="no-margin-form"
                            >
                                <SelectComponent>
                                    {(list_pre_requisite_type || []).map((data, index) => (
                                        <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Name"
                                required
                                rules={[{ required: true, message: "Name is required" }]}
                                className="no-margin-form"
                            >
                                <InputComponent />
                            </Form.Item>
                        </div>
                        <div className="w-full mt-4">
                            <Form.Item
                                name="description"
                                label="Description"
                                className="no-margin-form"
                            >
                                <InputComponent type="textarea" rows={4} maxLength={255} />
                            </Form.Item>
                        </div>
                    </NxBaseContainer>
                </NxCardContainer>
                <div className="flex justify-end gap-2">
                    <Button type="menu" onClick={handleCancelDetail}>Cancel</Button>
                    <Button type="submit" onClick={handleSaveDetail}>Save</Button>
                </div>
            </Form>
        )}

        {/* Modal add/edit criteria data */}
        <NxModal
            isOpen={modalCriteriaOpen}
            title="Add Criteria Data"
            width={1000}
            handleCancel={handleCloseCriteriaModal}
            footer={[
                <div className="flex justify-between" key="footer-1">
                    <Button type="menu" key="cancel" onClick={handleCloseCriteriaModal}>
                        Cancel
                    </Button>
                    <Button type="submit" key="save" onClick={handleSaveCriteriaModal}>
                        Save
                    </Button>
                </div>
            ]}
        >
            <div className="p-4">
                <NxBaseContainer border>
                    <Form
                        form={modalForm}
                        layout="vertical"
                        className="flex flex-col gap-y-4 p-4"
                    >
                        <div className={`grid ${selectedCriteriaOptions.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                            {selectedCriteriaOptions.map((c) => (
                                <Form.Item
                                    key={c.value}
                                    name={c.value}
                                    label={c.name}
                                    required
                                    rules={[{ required: true, message: `${c.name} is required` }]}
                                    className="no-margin-form"
                                >
                                    <SelectComponent>
                                        {c.value === "ACCOUNT_GROUP_TYPE"
                                            ? (list_account_group_type || []).map((data, index) => (
                                                <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                            ))
                                            : (list_account_segment || []).map((data, index) => (
                                                <Select.Option key={index} value={data.value}>{data.name}</Select.Option>
                                            ))
                                        }
                                    </SelectComponent>
                                </Form.Item>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="startDate"
                                label="Start Date"
                                required
                                rules={[{ required: true, message: "Start Date is required" }]}
                                className="no-margin-form"
                            >
                                <NxDate dateDisable={() => false} placeholder="Select start date" />
                            </Form.Item>
                            <Form.Item
                                name="endDate"
                                label="End Date"
                                required
                                rules={[
                                    { required: true, message: "End Date is required" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const startDate = getFieldValue("startDate");
                                            if (!value || !startDate || dayjs(startDate).isBefore(dayjs(value))) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("End Date must be after Start Date"));
                                        },
                                    }),
                                ]}
                                className="no-margin-form"
                            >
                                <NxDate dateDisable={() => false} placeholder="Select end date" />
                            </Form.Item>
                        </div>
                    </Form>
                </NxBaseContainer>
            </div>
        </NxModal>
        </>
    )
}

export default CreateUpdatePreRequisiteTemplate;
