import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Switch,
  Tag,
  Collapse,
  Tooltip,
  Alert,
  Space,
  Spin,
  Empty,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSelect from "../../../../components/Nx/NxSelect";
import NxInput, { NxTextArea } from "../../../../components/Nx/NxInput";
import { CHANNELS, toOptions, sourceLabel } from "./catalogConstants";
import {
  fetchEvents,
  fetchCategoryFields,
  fetchTemplate,
  validateTemplate,
  previewTemplate,
  saveTemplate,
  clearCurrentTemplate,
  selectEvents,
  selectEventsLoading,
  selectCategoryFields,
  selectCategoryFieldsLoading,
  selectCurrentTemplate,
  selectCurrentTemplateLoading,
  selectValidation,
  selectValidating,
  selectPreview,
  selectPreviewing,
  selectSaving,
} from "../../../../redux/slices/notificationAdmin";

const { Panel } = Collapse;

// mode: "create" | "update". On update the template id is passed via route
// state (location.state.id) — never in the URL — mirroring UserForm.
const TemplateBuilder = ({ mode = "create" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = mode === "update";
  const id = location?.state?.id;

  const events = useSelector(selectEvents);
  const eventsLoading = useSelector(selectEventsLoading);
  const categoryFields = useSelector(selectCategoryFields);
  const categoryFieldsLoading = useSelector(selectCategoryFieldsLoading);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const currentTemplateLoading = useSelector(selectCurrentTemplateLoading);
  const validation = useSelector(selectValidation);
  const validating = useSelector(selectValidating);
  const preview = useSelector(selectPreview);
  const previewing = useSelector(selectPreviewing);
  const saving = useSelector(selectSaving);

  const bodyRef = useRef(null);

  // Template form state
  const [form, setForm] = useState({
    templateCode: "",
    templateName: "",
    channelType: "TASKLIST",
    templateLanguage: "id",
    eventCode: undefined,
    subjectTemplate: "",
    bodyTemplate: "",
    isDefault: false,
  });

  // Selected fields (content variables + layout), ordered
  // each: { fieldKey, displayLabel, resolverType, resolverRef, isVisible, kind }
  const [selected, setSelected] = useState([]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    // Update reached without an id in route state (e.g. direct URL hit / refresh):
    // there is nothing to load, so bounce back to the list.
    if (isEdit && !id) {
      navigate("/notifications/templates", { replace: true });
      return;
    }
    dispatch(fetchEvents());
    if (isEdit) dispatch(fetchTemplate(id));
    return () => dispatch(clearCurrentTemplate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  // Hydrate the form when editing an existing template
  useEffect(() => {
    if (!isEdit || !currentTemplate?.template) return;
    const t = currentTemplate.template;
    setForm({
      templateCode: t.templateCode || "",
      templateName: t.templateName || "",
      channelType: t.channelType || "TASKLIST",
      templateLanguage: t.templateLanguage || t.language || "id",
      eventCode: t.eventCode || undefined,
      subjectTemplate: t.subjectTemplate || "",
      bodyTemplate: t.bodyTemplate || "",
      isDefault: !!t.isDefault,
    });
    if (t.eventCode) dispatch(fetchCategoryFields(t.eventCode));

    const vars = currentTemplate.contentVariables || [];
    const layout = currentTemplate.layout || [];
    const labelByVar = {};
    const visByVar = {};
    layout.forEach((l) => {
      labelByVar[l.variableName] = l.displayLabel;
      visByVar[l.variableName] = l.isVisible !== false;
    });
    setSelected(
      vars
        .slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((v) => ({
          fieldKey: v.variableName,
          displayLabel: labelByVar[v.variableName] || v.variableName,
          resolverType: v.resolverType,
          resolverRef: v.resolverRef,
          isVisible: visByVar[v.variableName] !== false,
          kind: undefined,
        }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTemplate, isEdit]);

  const onPickEvent = (eventCode) => {
    setField("eventCode", eventCode);
    if (eventCode) dispatch(fetchCategoryFields(eventCode));
  };

  const selectedKeys = useMemo(() => new Set(selected.map((s) => s.fieldKey)), [selected]);

  const addField = (field) => {
    if (selectedKeys.has(field.fieldKey)) return;
    setSelected((p) => [
      ...p,
      {
        fieldKey: field.fieldKey,
        displayLabel: field.displayLabel || field.fieldKey,
        resolverType: field.resolverType,
        resolverRef: field.resolverRef,
        isVisible: true,
        kind: field.kind,
      },
    ]);
  };

  const removeField = (fieldKey) =>
    setSelected((p) => p.filter((s) => s.fieldKey !== fieldKey));

  const moveField = (index, dir) => {
    setSelected((p) => {
      const next = [...p];
      const target = index + dir;
      if (target < 0 || target >= next.length) return p;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateSelected = (fieldKey, patch) =>
    setSelected((p) => p.map((s) => (s.fieldKey === fieldKey ? { ...s, ...patch } : s)));

  // Insert a ${token} at the body editor caret
  const insertToken = (fieldKey) => {
    const token = "${" + fieldKey + "}";
    const el = bodyRef.current?.resizableTextArea?.textArea;
    if (!el) {
      setField("bodyTemplate", (form.bodyTemplate || "") + token);
      return;
    }
    const start = el.selectionStart ?? form.bodyTemplate.length;
    const end = el.selectionEnd ?? form.bodyTemplate.length;
    const next = form.bodyTemplate.slice(0, start) + token + form.bodyTemplate.slice(end);
    setField("bodyTemplate", next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + token.length;
      el.setSelectionRange(caret, caret);
    });
  };

  const buildRequest = () => ({
    templateCode: form.templateCode,
    templateName: form.templateName,
    channelType: form.channelType,
    templateLanguage: form.templateLanguage,
    eventCode: form.eventCode,
    subjectTemplate: form.subjectTemplate,
    bodyTemplate: form.bodyTemplate,
    isDefault: form.isDefault,
    contentVariables: selected.map((s, i) => ({
      variableName: s.fieldKey,
      resolverType: s.resolverType,
      resolverRef: s.resolverRef,
      sortOrder: i,
    })),
    layout: selected.map((s, i) => ({
      variableName: s.fieldKey,
      channelType: form.channelType,
      sortOrder: i,
      isVisible: s.isVisible,
      displayLabel: s.displayLabel,
    })),
  });

  const requiredOk = form.templateCode && form.templateName && form.eventCode && form.channelType;

  const handleValidate = async () => {
    if (!requiredOk) {
      message.warning("Fill code, name, category and channel first");
      return;
    }
    try {
      const res = await dispatch(validateTemplate(buildRequest())).unwrap();
      if (res?.valid) message.success("Template is valid");
    } catch (e) {
      message.error(typeof e === "string" ? e : "Validation failed");
    }
  };

  const handlePreview = async () => {
    if (!isEdit) {
      message.info("Save the template first to preview it");
      return;
    }
    dispatch(previewTemplate({ id }));
  };

  const handleSave = async () => {
    if (!requiredOk) {
      message.warning("Fill code, name, category and channel first");
      return;
    }
    try {
      await dispatch(saveTemplate(buildRequest())).unwrap();
      message.success("Template saved");
      navigate("/notifications/templates");
    } catch (e) {
      // validation rejection carries a ValidationResult — surfaced in the banner
      if (e?.errorCode) {
        message.error(`${e.errorCode}: ${e.offendingValue || ""}`);
      } else {
        message.error(e?.message || "Failed to save template");
      }
    }
  };

  if (isEdit && currentTemplateLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" tip="Loading template..." />
      </div>
    );
  }

  const breadcrumb = [
    { breadcrumbName: "Notifications" },
    { path: "/notifications/templates", breadcrumbName: "Templates" },
    { breadcrumbName: isEdit ? "Update" : "Create" },
  ];

  return (
    <>
      <BreadCrumb routes={breadcrumb} />
      <NxCardContainer
        header={isEdit ? "UPDATE TEMPLATE" : "CREATE TEMPLATE"}
      >
      {validation && !validation.valid && (
        <Alert
          type="error"
          showIcon
          className="mb-4"
          message={`Validation failed: ${validation.errorCode}`}
          description={
            <span>
              Offending value: <code>{validation.offendingValue}</code>
              {validation.message ? ` — ${validation.message}` : ""}
            </span>
          }
        />
      )}
      {validation && validation.valid && (
        <Alert type="success" showIcon className="mb-4" message="Template is valid" />
      )}

      {/* Template metadata */}
      <NxBaseContainer border header="Details" className="mb-4" bodyClassName="pt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <div className="text-xs text-gray-500 mb-1">Template Code *</div>
            <NxInput
              placeholder="e.g. SA_APPROVAL_TASKLIST_ID"
              value={form.templateCode}
              onChange={(e) => setField("templateCode", e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Template Name *</div>
            <NxInput
              placeholder="Human-readable name"
              value={form.templateName}
              onChange={(e) => setField("templateName", e.target.value)}
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Category (event) *</div>
            <NxSelect
              showSearch
              loading={eventsLoading}
              placeholder="Pick an approval category"
              value={form.eventCode}
              optionFilterProp="label"
              onChange={onPickEvent}
              options={events.map((ev) => ({
                value: ev.eventCode,
                label: `${ev.category || ev.eventCode}${ev.module ? ` (${ev.module})` : ""}`,
              }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Channel *</div>
              <NxSelect
                value={form.channelType}
                onChange={(v) => setField("channelType", v)}
                options={toOptions(CHANNELS)}
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Language</div>
              <NxInput
                placeholder="id / en"
                value={form.templateLanguage}
                onChange={(e) => setField("templateLanguage", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isDefault} onChange={(v) => setField("isDefault", v)} />
            <span className="text-sm text-gray-700">Default template for this category/channel</span>
          </div>
        </div>
      </NxBaseContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Field picker */}
        <NxBaseContainer border header="Available Fields" bodyClassName="pt-3">
          {!form.eventCode ? (
            <Empty description="Pick a category to discover its fields" />
          ) : categoryFieldsLoading ? (
            <div className="py-8 flex justify-center w-full"><Spin /></div>
          ) : categoryFields.length === 0 ? (
            <Empty description="No fields available for this category" />
          ) : (
            <Collapse
              defaultActiveKey={categoryFields.map((g, i) => `${g.module}-${g.submodule}-${i}`)}
              className="w-full"
            >
              {categoryFields.map((group, gi) => (
                <Panel
                  key={`${group.module}-${group.submodule}-${gi}`}
                  header={
                    <span className="font-medium">
                      {group.module}
                      {group.submodule ? ` / ${group.submodule}` : ""}
                      <Tag className="ml-2" color="default">{group.fields?.length || 0}</Tag>
                    </span>
                  }
                >
                  <div className="space-y-2">
                    {(group.fields || []).map((field) => (
                      <div
                        key={field.fieldKey}
                        className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-gray-800 truncate">
                            {field.displayLabel || field.fieldKey}{" "}
                            {field.kind === "joined" ? (
                              <Tooltip title={field.sourceRelation || "cross-module lookup"}>
                                <Tag color="purple">{sourceLabel(field.resolverType)}</Tag>
                              </Tooltip>
                            ) : (
                              <Tag color="cyan">{sourceLabel(field.resolverType)}</Tag>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            <code>{field.fieldKey}</code>
                            {field.dataType ? ` · ${field.dataType}` : ""}
                          </div>
                        </div>
                        <Button
                          size="small"
                          type="link"
                          icon={<PlusOutlined />}
                          disabled={selectedKeys.has(field.fieldKey)}
                          onClick={() => addField(field)}
                        >
                          {selectedKeys.has(field.fieldKey) ? "Added" : "Add"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Panel>
              ))}
            </Collapse>
          )}
        </NxBaseContainer>

        {/* Selected fields / layout */}
        <NxBaseContainer border header={`Selected Fields (${selected.length})`} bodyClassName="pt-3">
          {selected.length === 0 ? (
            <Empty description="Add fields from the left to build the layout" />
          ) : (
            <div className="space-y-2 w-full">
              {selected.map((s, i) => (
                <div key={s.fieldKey} className="border border-gray-100 rounded p-2">
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-gray-500">{s.fieldKey}</code>
                    <Space size={2}>
                      <Button size="small" type="text" icon={<ArrowUpOutlined />} disabled={i === 0} onClick={() => moveField(i, -1)} />
                      <Button size="small" type="text" icon={<ArrowDownOutlined />} disabled={i === selected.length - 1} onClick={() => moveField(i, 1)} />
                      <Tooltip title="Insert token into body">
                        <Button size="small" type="text" icon={<PlusOutlined />} onClick={() => insertToken(s.fieldKey)} />
                      </Tooltip>
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeField(s.fieldKey)} />
                    </Space>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <NxInput
                      size="small"
                      addonBefore="Label"
                      value={s.displayLabel}
                      onChange={(e) => updateSelected(s.fieldKey, { displayLabel: e.target.value })}
                    />
                    <Tooltip title="Visible on this channel">
                      <Switch
                        size="small"
                        checked={s.isVisible}
                        onChange={(v) => updateSelected(s.fieldKey, { isVisible: v })}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          )}
        </NxBaseContainer>
      </div>

      {/* Body editor */}
      <NxBaseContainer border header="Body" className="mt-4" bodyClassName="pt-3">
        <div className="w-full">
          <div className="text-xs text-gray-500 mb-1">Subject</div>
          <NxInput
            className="mb-3"
            placeholder="Subject (supports ${token})"
            value={form.subjectTemplate}
            onChange={(e) => setField("subjectTemplate", e.target.value)}
          />
          <div className="text-xs text-gray-500 mb-1">
            Body (FreeMarker — insert tokens from the selected fields)
          </div>
          <NxTextArea
            ref={bodyRef}
            rows={10}
            placeholder={"Compose the message. Use ${fieldKey} tokens."}
            value={form.bodyTemplate}
            onChange={(e) => setField("bodyTemplate", e.target.value)}
          />
        </div>
      </NxBaseContainer>

      {/* Preview */}
      {preview && (
        <NxBaseContainer border header="Preview" className="mt-4" bodyClassName="pt-3">
          <pre className="w-full text-xs bg-gray-50 p-3 rounded overflow-auto">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </NxBaseContainer>
      )}

      {/* Footer actions — Back on the left, primary actions on the right */}
      <div className="flex items-center justify-between mt-6 mb-8">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/notifications/templates")}>
          Back
        </Button>
        <div className="flex gap-3">
          <Button icon={<CheckCircleOutlined />} loading={validating} onClick={handleValidate}>
            Validate
          </Button>
          <Button icon={<EyeOutlined />} loading={previewing} onClick={handlePreview}>
            Preview
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!requiredOk}
            onClick={handleSave}
            style={{ backgroundColor: requiredOk ? "#0075bf" : undefined, borderColor: requiredOk ? "#0075bf" : undefined }}
          >
            Save Template
          </Button>
        </div>
      </div>
      </NxCardContainer>
    </>
  );
};

export default TemplateBuilder;
