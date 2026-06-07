import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Input, Select, Switch, message, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import ButtonComponent from "../../../../components/ButtonComponent";
import StatusComponent from "../../../../components/StatusComponent";
import {
  fetchCatalogFields,
  saveCatalogField,
  selectCatalogFields,
  selectCatalogLoading,
  selectCatalogSaving,
} from "../../../../redux/slices/notificationAdmin";

const { Option } = Select;

// Resolver types are bound server-side to a whitelist; guided picker.
const RESOLVER_TYPES = ["PAYLOAD", "JOIN", "STATIC", "EXPRESSION"];
const DATA_TYPES = ["STRING", "NUMBER", "DATE", "BOOLEAN", "CURRENCY"];

const columnsCatalog = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    fixed: "left",
    render: (text, object, index) => index + 1,
  },
  {
    title: "FIELD KEY",
    dataIndex: "fieldKey",
    key: "fieldKey",
    align: "left",
    width: 200,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "LABEL",
    dataIndex: "displayLabel",
    key: "displayLabel",
    align: "left",
    width: 180,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "MODULE",
    dataIndex: "module",
    key: "module",
    align: "left",
    width: 110,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "SUBMODULE",
    dataIndex: "submodule",
    key: "submodule",
    align: "left",
    width: 120,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "DATA TYPE",
    dataIndex: "dataType",
    key: "dataType",
    align: "center",
    width: 110,
    sorter: true,
    render: (v) => v || "-",
  },
  {
    title: "RESOLVER TYPE",
    dataIndex: "resolverType",
    key: "resolverType",
    align: "left",
    width: 140,
    sorter: true,
    render: (v) => v || "-",
  },
  {
    title: "RESOLVER REF",
    dataIndex: "resolverRef",
    key: "resolverRef",
    align: "left",
    width: 200,
    ellipsis: true,
    render: (v) => v || "-",
  },
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

  useEffect(() => {
    dispatch(fetchCatalogFields());
  }, [dispatch]);

  // Flatten grouped FieldGroupDto[] into rows.
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(saveCatalogField({ ...values, isJoined: !!values.isJoined })).unwrap();
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
      <BreadCrumb
        routes={[
          { breadcrumbName: "Notifications" },
          { breadcrumbName: "Field Catalogue" },
        ]}
      />
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
        onOk={handleSubmit}
        confirmLoading={saving}
        okText="Register"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ isJoined: false, dataType: "STRING", resolverType: "PAYLOAD" }}
        >
          <Form.Item name="fieldKey" label="Field Key" rules={[{ required: true, message: "Field key is required" }]}>
            <Input placeholder="e.g. object_account_number" />
          </Form.Item>
          <Form.Item name="displayLabel" label="Display Label" rules={[{ required: true, message: "Label is required" }]}>
            <Input placeholder="e.g. Account Number" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="module" label="Module" rules={[{ required: true, message: "Module is required" }]}>
              <Input placeholder="e.g. ACC" />
            </Form.Item>
            <Form.Item name="submodule" label="Submodule">
              <Input placeholder="optional" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="dataType" label="Data Type">
              <Select>
                {DATA_TYPES.map((d) => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="resolverType" label="Resolver Type" rules={[{ required: true }]}>
              <Select showSearch>
                {RESOLVER_TYPES.map((d) => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="resolverRef" label="Resolver Ref" tooltip="Whitelisted resolver reference (payload key, join name, or expression)">
            <Input placeholder="e.g. payload.objectAccountNumber" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3 items-end">
            <Form.Item name="isJoined" label="Joined (cross-module)" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="sourceRelation" label="Source Relation" tooltip="Relation label when joined">
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
