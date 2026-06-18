import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Form, message, Tooltip, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Pencil, Trash2, CircleCheck, Ban } from "lucide-react";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import NxSelect from "../../../../components/Nx/NxSelect";
import NxInput from "../../../../components/Nx/NxInput";
import ButtonComponent from "../../../../components/ButtonComponent";
import StatusComponent from "../../../../components/StatusComponent";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import {
  MODULES,
  MODULE_SUBMODULES,
  DATA_TYPES,
  toOptions,
  FIELD_HELP,
  FIELD_SOURCES,
  LOOKUP_RESOLVER_TYPES,
  sourceLabel,
} from "./catalogConstants";
import {
  useCatalogFields,
  useSaveCatalogField,
  useResolvers,
} from "../../../../hooks/notifications/useNotificationAdmin";

const columnsCatalog = [
  { title: "NO", align: "center", width: 60, key: "no", fixed: "left", render: (t, o, i) => i + 1 },
  { title: "FIELD KEY", dataIndex: "fieldKey", key: "fieldKey", align: "left", width: 200, sorter: true, ellipsis: true },
  { title: "LABEL", dataIndex: "displayLabel", key: "displayLabel", align: "left", width: 180, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "MODULE", dataIndex: "module", key: "module", align: "left", width: 110, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "SUBMODULE", dataIndex: "submodule", key: "submodule", align: "left", width: 150, sorter: true, ellipsis: true, render: (v) => v || "-" },
  { title: "DATA TYPE", dataIndex: "dataType", key: "dataType", align: "center", width: 110, sorter: true, render: (v) => v || "-" },
  { title: "SOURCE", dataIndex: "resolverType", key: "source", align: "left", width: 170, sorter: true, render: (v) => sourceLabel(v) },
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
  const { data: groups = [], isLoading: loading, refetch } = useCatalogFields();
  const saveFieldMutation = useSaveCatalogField();
  const saving = saveFieldMutation.isPending;
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

  const { data: resolverDescriptors = [] } = useResolvers();

  // Watch fields that drive dependent UI.
  const selectedModule = Form.useWatch("module", form);
  const selectedSourceKey = Form.useWatch("source", form);
  const selectedSource = useMemo(
    () => FIELD_SOURCES.find((s) => s.key === selectedSourceKey),
    [selectedSourceKey]
  );

  const submoduleOptions = useMemo(
    () => toOptions(MODULE_SUBMODULES[selectedModule] || []),
    [selectedModule]
  );

  // Whitelisted lookup refs across NAMED_QUERY + JPA_PROJECTION, labelled with the
  // friendly relation name from any existing catalogue row that already uses the
  // ref (falls back to the raw ref).
  const lookupOptions = useMemo(() => {
    const relByRef = {};
    (groups || []).forEach((g) =>
      (g.fields || []).forEach((f) => {
        if (LOOKUP_RESOLVER_TYPES.includes(f.resolverType) && f.resolverRef) {
          relByRef[f.resolverRef] = f.sourceRelation || f.displayLabel || f.resolverRef;
        }
      })
    );
    const opts = [];
    resolverDescriptors
      .filter((d) => LOOKUP_RESOLVER_TYPES.includes(d.type) && d.whitelisted)
      .forEach((d) =>
        (d.refs || []).forEach((ref) =>
          opts.push({
            value: `${d.type}::${ref}`, // carries type + ref
            label: relByRef[ref] ? `${relByRef[ref]} (${ref})` : ref,
            sourceRelation: relByRef[ref] || null,
          })
        )
      );
    return opts;
  }, [resolverDescriptors, groups]);

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
    let values;
    try {
      values = await form.validateFields();
    } catch (e) {
      return; // antd validation — keep modal open
    }
    // submodule uses tags mode (array); persist the single chosen string.
    const submodule = Array.isArray(values.submodule)
      ? values.submodule.slice(-1)[0]
      : values.submodule;

    const src = FIELD_SOURCES.find((s) => s.key === values.source);
    let resolverType = src?.resolverType;
    let resolverRef = values.sourceRef;
    let sourceRelation = null;
    let isJoined = false;

    if (src?.refKind === "lookup") {
      // sourceRef holds "TYPE::ref"; split back into the real enum + ref.
      const [lookType, ...rest] = String(values.sourceRef || "").split("::");
      resolverType = lookType || "NAMED_QUERY";
      resolverRef = rest.join("::");
      const opt = lookupOptions.find((o) => o.value === values.sourceRef);
      sourceRelation = opt?.sourceRelation || null;
      isJoined = true;
    }

    const payload = {
      fieldKey: values.fieldKey,
      displayLabel: values.displayLabel,
      dataType: values.dataType,
      module: values.module,
      submodule,
      resolverType,
      resolverRef,
      sourceRelation,
      isJoined,
    };

    saveFieldMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Field registered");
        setModalOpen(false);
      },
      onError: (e) =>
        message.error(
          e?.response?.data?.message ||
            e?.message ||
            (typeof e === "string" ? e : "Failed to register field")
        ),
    });
  };

  // Catalogue row actions. The backend is insert-only today (no update / delete /
  // activate / inactivate endpoint for catalogue fields), so these are rendered
  // disabled until those endpoints land.
  const disabledAction = (label, Icon) => ({
    render: () => (
      <Tooltip title={`${label} (pending backend support)`}>
        <span className="inline-flex items-center text-gray-300 cursor-not-allowed pointer-events-none">
          <Icon size={18} />
        </span>
      </Tooltip>
    ),
  });

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
      { action: "Update", type: "table", ...disabledAction("Update", Pencil) },
      { action: "Activate", type: "table", ...disabledAction("Activate", CircleCheck) },
      { action: "Inactivate", type: "table", ...disabledAction("Inactivate", Ban) },
      { action: "Delete", type: "table", ...disabledAction("Delete", Trash2) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const actionColumns = useColumnActionPermission(
    ["Update", "Activate", "Inactivate", "Delete"],
    itemActions,
    "Update"
  );

  const allColumns = useMemo(
    () => [...columnsCatalog, ...actionColumns],
    [actionColumns]
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
            columns={allColumns}
            rowKey={(r) => r.fieldId ?? r.fieldKey}
            loading={loading}
            totalData={rows?.length || 0}
            usePagination={false}
            useInfiniteScroll={false}
            showExport={true}
            showSearchBar={true}
            showAdvanceSearch={false}
            showRefresh={true}
            onRefresh={() => refetch()}
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
            initialValues={{ dataType: "STRING" }}
          >
            <SectionTitle>Identity</SectionTitle>
            <Form.Item
              name="fieldKey"
              label="Field Key"
              tooltip={FIELD_HELP.fieldKey}
              rules={[{ required: true, message: "Field key is required" }]}
            >
              <NxInput placeholder="e.g. object_account_number" />
            </Form.Item>
            <Form.Item
              name="displayLabel"
              label="Display Label"
              tooltip={FIELD_HELP.displayLabel}
              rules={[{ required: true, message: "Label is required" }]}
            >
              <NxInput placeholder="e.g. Account Number" />
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

            <SectionTitle>Source</SectionTitle>
            <Form.Item
              name="source"
              label="Source"
              tooltip={FIELD_HELP.source}
              rules={[{ required: true, message: "Source is required" }]}
            >
              <NxSelect
                options={FIELD_SOURCES.map((s) => ({ value: s.key, label: s.label }))}
                placeholder="Where does this value come from?"
                onChange={() => form.setFieldsValue({ sourceRef: undefined })}
              />
            </Form.Item>

            {selectedSource && selectedSource.refKind === "lookup" ? (
              <Form.Item
                name="sourceRef"
                label={selectedSource.refLabel}
                tooltip={FIELD_HELP.sourceRef}
                rules={[{ required: true, message: "Pick a lookup" }]}
              >
                <NxSelect
                  showSearch
                  optionFilterProp="label"
                  options={lookupOptions}
                  placeholder="Pick a prepared lookup"
                />
              </Form.Item>
            ) : selectedSource ? (
              <Form.Item
                name="sourceRef"
                label={selectedSource.refLabel}
                tooltip={FIELD_HELP.sourceRef}
                rules={[{ required: true, message: `${selectedSource.refLabel} is required` }]}
              >
                <NxInput placeholder={selectedSource.refHint} />
              </Form.Item>
            ) : null}
          </Form>
        </Modal>
      </NxCardContainer>
    </>
  );
};

export default FieldCatalog;
