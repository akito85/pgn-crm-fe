import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Switch, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxSelect from "../../../../components/Nx/NxSelect";
import ButtonComponent from "../../../../components/ButtonComponent";
import StatusComponent from "../../../../components/StatusComponent";
import {
  MODULES,
  MODULE_SUBMODULES,
  DATA_TYPES,
  RESOLVER_TYPES,
  toOptions,
  FIELD_HELP,
  RESOLVER_REF_PLACEHOLDER,
} from "./catalogConstants";
import {
  fetchCatalogFields,
  saveCatalogField,
  selectCatalogFields,
  selectCatalogLoading,
  selectCatalogSaving,
} from "../../../../redux/slices/notificationAdmin";

const columnsCatalog = [
  { title: "NO", align: "center", width: 60, key: "no", fixed: "left", render: (t, o, i) => i + 1 },
  { title: "FIELD KEY", dataIndex: "fieldKey", key: "fieldKey", align: "left", width: 200, sorter: true, ellipsis: true },
  { title: "LABEL", dataIndex: "displayLabel", key: "displayLabel", align: "left", width: 180, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "MODULE", dataIndex: "module", key: "module", align: "left", width: 110, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "SUBMODULE", dataIndex: "submodule", key: "submodule", align: "left", width: 150, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "DATA TYPE", dataIndex: "dataType", key: "dataType", align: "center", width: 110, sorter: true, render: (v) => v || "-" },
  { title: "RESOLVER TYPE", dataIndex: "resolverType", key: "resolverType", align: "left", width: 140, sorter: true, render: (v) => v || "-" },
  { title: "RESOLVER REF", dataIndex: "resolverRef", key: "resolverRef", align: "left", width: 200, ellipsis: true, render: (v) => v || "-" },
  {
    title: "KIND",
    dataIndex: "kind",
    key: "kind",
    align: "center",
    width: 120,
    fixed: "right",
    render: (v, r) => {
      const joined = v === "joined" || r.isJoined;
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Tooltip title={joined ? r.sourceRelation || "cross-module join" : "payload field"}>
            <StatusComponent colour={joined ? "INACTIVE" : "ACTIVE"} size="small">
              {joined ? "Joined" : "Direct"}
            </StatusComponent>
          </Tooltip>
        </div>
      );
    },
  },
];

// Small section heading inside the register modal.
const SectionTitle = ({ children }) => (
  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1 mb-2">
    {children}
  </div>
);

const FieldCatalog = () => {
  const dispatch = useDispatch();
  const groups = useSelector(selectCatalogFields);
  const loading = useSelector(selectCatalogLoading);
  const saving = useSelector(selectCatalogSaving);
  const rawToken = useSelector((state) => state.auth?.token);

  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch {
      return null;
    }
  }, [rawToken]);

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Watch fields that drive dependent UI.
  const selectedModule = Form.useWatch("module", form);
  const selectedResolver = Form.useWatch("resolverType", form);

  const submoduleOptions = useMemo(
    () => toOptions(MODULE_SUBMODULES[selectedModule] || []),
    [selectedModule]
  );
  const refPlaceholder =
    RESOLVER_REF_PLACEHOLDER[selectedResolver] || "whitelisted resolver reference";

  useEffect(() => {
    dispatch(fetchCatalogFields());
  }, [dispatch]);

  const rows = useMemo(() => {
    const out = [];
    (groups || []).forEach((g) => {
      (g.fields || []).forEach((f) => {
        out.push({ ...f, module: f.module || g.module, submodule: f.submodule || g.submodule });
      });
    });
    return out;
  }, [groups]);

  const openCreate = () => {
    form.resetFields();
    setModalOpen(true);
  };

  // Clear submodule when the module changes so a stale value can't be saved.
  const onModuleChange = () => form.setFieldsValue({ submodule: undefined });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // submodule uses tags mode (array); persist the single chosen string.
      const submodule = Array.isArray(values.submodule)
        ? values.submodule.slice(-1)[0]
        : values.submodule;
      await dispatch(
        saveCatalogField({ ...values, submodule, isJoined: !!values.isJoined })
      ).unwrap();
      message.success("Field registered");
      setModalOpen(false);
    } catch (e) {
      if (e?.errorFields) return; // antd validation — keep modal open
      message.error(e?.message || (typeof e === "string" ? e : "Failed to register field"));
    }
  };

  const itemActions = useMemo(
    () => [
      {
        action: "Create",
        render: (
          <ButtonComponent icon={<PlusOutlined />} type="submit" onClick={openCreate}>
            Register Field
          </ButtonComponent>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <BreadCrumb routes={[{ breadcrumbName: "Notifications" }, { breadcrumbName: "Field Catalogue" }]} />
      <NxCardContainer header="NOTIFICATION FIELD CATALOGUE" actions={itemActions}>
        <div className="w-full">
          <NxTable
            idTable="notification-field-catalog-table"
            userId={userId}
            dataSource={rows}
            columns={columnsCatalog}
            rowKey={(r) => r.fieldId ?? r.fieldKey}
            loading={loading}
            totalData={rows?.length || 0}
            usePagination={false}
            useInfiniteScroll={false}
            showExport={true}
            showSearchBar={true}
            showAdvanceSearch={false}
            showRefresh={true}
            onRefresh={() => dispatch(fetchCatalogFields())}
            tableScrolled={{ x: 1300, y: 600 }}
          />
        </div>

        <Modal
          title="Register Catalogue Field"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          destroyOnClose
          footer={
            <div className="flex items-center justify-between">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" loading={saving} onClick={handleSubmit}>
                Register
              </Button>
            </div>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ isJoined: false, dataType: "STRING", resolverType: "PAYLOAD" }}
          >
            <SectionTitle>Identity</SectionTitle>
            <Form.Item
              name="fieldKey"
              label="Field Key"
              tooltip={FIELD_HELP.fieldKey}
              rules={[{ required: true, message: "Field key is required" }]}
            >
              <Input placeholder="e.g. object_account_number" />
            </Form.Item>
            <Form.Item
              name="displayLabel"
              label="Display Label"
              tooltip={FIELD_HELP.displayLabel}
              rules={[{ required: true, message: "Label is required" }]}
            >
              <Input placeholder="e.g. Account Number" />
            </Form.Item>
            <Form.Item name="dataType" label="Data Type" tooltip={FIELD_HELP.dataType}>
              <NxSelect options={toOptions(DATA_TYPES)} />
            </Form.Item>

            <SectionTitle>Classification</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="module"
                label="Module"
                tooltip={FIELD_HELP.module}
                rules={[{ required: true, message: "Module is required" }]}
              >
                <NxSelect
                  options={MODULES}
                  placeholder="Select module"
                  onChange={onModuleChange}
                />
              </Form.Item>
              <Form.Item name="submodule" label="Submodule" tooltip={FIELD_HELP.submodule}>
                <NxSelect
                  mode="tags"
                  maxTagCount={1}
                  options={submoduleOptions}
                  placeholder={selectedModule ? "Select or type a category" : "Pick a module first"}
                  disabled={!selectedModule}
                  // antd v4 has no maxCount; keep only the latest pick (still an array)
                  onChange={(vals) =>
                    form.setFieldsValue({ submodule: (vals || []).slice(-1) })
                  }
                />
              </Form.Item>
            </div>

            <SectionTitle>Resolver / Source</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="resolverType"
                label="Resolver Type"
                tooltip={FIELD_HELP.resolverType}
                rules={[{ required: true }]}
              >
                <NxSelect showSearch options={toOptions(RESOLVER_TYPES)} />
              </Form.Item>
              <Form.Item name="resolverRef" label="Resolver Ref" tooltip={FIELD_HELP.resolverRef}>
                <Input placeholder={refPlaceholder} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <Form.Item
                name="isJoined"
                label="Joined (cross-module)"
                tooltip={FIELD_HELP.isJoined}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item name="sourceRelation" label="Source Relation" tooltip={FIELD_HELP.sourceRelation}>
                <Input placeholder="e.g. M_ACCOUNT" />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </NxCardContainer>
    </>
  );
};

export default FieldCatalog;
