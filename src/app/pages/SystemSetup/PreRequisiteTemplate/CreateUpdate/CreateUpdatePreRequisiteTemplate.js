import { Form, Select } from "antd"
import { useState, useEffect } from "react"
import NxBaseContainer from "../../../../../components/Nx/NxBaseContainer"
import NxBreadCrumb from "../../../../../components/Nx/NxBreadCrumb"
import NxCardContainer from "../../../../../components/Nx/NxCardContainer"
import NxDetailText from "../../../../../components/Nx/NxDetailText"
import NxTable from "../../../../../components/Nx/NxTable"
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes"
import InputComponent from "../../../../../components/InputComponent"
import SelectComponent from "../../../../../components/SelectComponent"
import { useDispatch, useSelector } from "react-redux"
import { getCriteria, getSourceType, getSrCategory, getSrSubCategory } from "../../../../../redux/slices/system_setup/preRequisiteTemplate"

const CreateUpdatePreRequisiteTemplate = ({ formType = "create" }) => {
    const dispatch = useDispatch();
    const {
        list_source_type = [],
        loading_source_type = false,
        list_sr_category = [],
        loading_sr_category = false,
        list_sr_sub_category = [],
        loading_sr_sub_category = false,
        list_criteria = [],
        loading_criteria = false,
    } = useSelector((state) => state.preRequisiteTemplate);

    const [criteriaValues, setCriteriaValues] = useState([]);

    useEffect(() => {
        dispatch(getSourceType());
        dispatch(getSrCategory());
        dispatch(getSrSubCategory());
        dispatch(getCriteria());
    }, [dispatch]);

    const routes = [
        {
            path: "",
            breadcrumbName: "System Setup",
        },
        {
            path: SYSTEM_SETUP_ROUTES.VIEW_PRE_REQUISITE_TEMPLATE,
            breadcrumbName: "Pre-Requisite Template"
        },
        {
            path: "",
            breadcrumbName: "Create Pre-Requisite Template"
        }
    ]

    const [form] = Form.useForm();

    const handleSubmit = () => {
        const {
            name,
            sourceType,
            srCategory,
            srSubCategory,
            description,
            criteria,
            criteriaData,
            detail
        } = form.getFieldsValue(true);

        console.log("submit", {
            name,
            sourceType,
            srCategory,
            srSubCategory,
            description,
            criteria,
            criteriaData,
            detail
        });
    }

    const handleSelectCriteria = (value) => {
        const updated = [...new Set([...criteriaValues, value])];
        setCriteriaValues(updated);
        form.setFieldsValue({ criteria: updated });
    }

    const handleDeselectCriteria = (value) => {
        const updated = criteriaValues.filter((item) => item !== value);
        setCriteriaValues(updated);
        form.setFieldsValue({ criteria: updated });
    }

    const handleClearCriteria = () => {
        setCriteriaValues([]);
        form.setFieldsValue({ criteria: [] });
    }

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
            <NxCardContainer header={"PRE-REQUISITE TEMPLATE INFORMATION"}>
                <NxBaseContainer border>
                    <div className="w-full grid grid-cols-2 gap-4">
                        <Form.Item
                            key="name"
                            name={"name"}
                            label={"Name"}
                            required
                            className="no-margin-form"
                        >
                            <InputComponent />
                        </Form.Item>
                        <Form.Item
                            key="sourceType"
                            name={"sourceType"}
                            label={"Source Type"}
                            required
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(list_source_type || [])?.map((data, index) => (
                                    <Select.Option key={index} value={data.value}>
                                        {data.name}
                                    </Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                        <Form.Item
                            key="srCategory"
                            name={"srCategory"}
                            label={"SR Category"}
                            required
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(list_sr_category || [])?.map((data, index) => (
                                    <Select.Option key={index} value={data.value}>
                                        {data.name}
                                    </Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                        <Form.Item
                            key="srSubCategory"
                            name={"srSubCategory"}
                            label={"SR Sub Category"}
                            required
                            className="no-margin-form"
                        >
                            <SelectComponent>
                                {(list_sr_sub_category || [])?.map((data, index) => (
                                    <Select.Option key={index} value={data.value}>
                                        {data.name}
                                    </Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                    </div>
                    <div className="w-full grid gap-4">
                        <Form.Item
                            key="criteria"
                            name={"criteria"}
                            label={"Criteria"}
                            required
                            className="no-margin-form"
                        >
                            <SelectComponent
                                mode="multiple"
                                onSelect={handleSelectCriteria}
                                onDeselect={handleDeselectCriteria}
                                onClear={handleClearCriteria}
                            >
                                {(list_criteria || [])?.map((data, index) => (
                                    <Select.Option key={index} value={data.value}>
                                        {data.name}
                                    </Select.Option>
                                ))}
                            </SelectComponent>
                        </Form.Item>
                        <Form.Item
                            key="description"
                            name={"description"}
                            label={"Description"}
                            required
                            className="no-margin-form"
                        >
                            <InputComponent
                                type={"textarea"}
                                rows={4}
                                maxLength={255}
                            />
                        </Form.Item>
                        {/* <NxDetailText label="Description">{detail?.description}</NxDetailText> */}
                    </div>
                </NxBaseContainer>
            </NxCardContainer>
            <NxCardContainer header={"PRE-REQUISITE TEMPLATE CRITERIA"}>
                <NxBaseContainer border>
                    {/* <NxTable
                        idTable={"table-criteria-prt"}
                        dataSource={detail?.criteriaDatas || []}
                        totalData={detail?.criteriaDatas?.length || 0}
                        tableScrolled={{ x: "max-content" }}
                        usePagination={false}
                        useInfiniteScroll={false}
                        columns={processedColumnCriteria}
                    /> */}
                </NxBaseContainer>
            </NxCardContainer>
            <NxCardContainer header={"PRE-REQUISITE TEMPLATE LIST"}>
                <NxBaseContainer border>
                    {/* <NxTable
                        idTable={"table-list-prt"}
                        dataSource={detail?.details || []}
                        totalData={detail?.details?.length || 0}
                        tableScrolled={{ x: "max-content" }}
                        usePagination={false}
                        useInfiniteScroll={false}
                        columns={processedColumnDetail}
                    /> */}
                </NxBaseContainer>
            </NxCardContainer>
        </Form>
        </>
    )
}

export default CreateUpdatePreRequisiteTemplate;