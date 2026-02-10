import { Modal, Descriptions, Table } from "antd";

const SectionCard = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #D0D5DD",
      borderRadius: 12,
      marginBottom: 20,
      overflow: "hidden",
      background: "#FFFFFF",
    }}
  >
    {title && (
      <div
        style={{
          padding: "12px 16px",
          fontWeight: 700,
          color: "#1570EF",
          background: "#F9FAFB",
          borderBottom: "1px solid #D0D5DD",
        }}
      >
        {title}
      </div>
    )}

    <div style={{ padding: 16 }}>{children}</div>
  </div>
);

const DetailPopupLayout = ({
  open,
  title,
  onClose,

  /** MAIN INFO */
  mainTitle = "DETAIL INFORMATION",
  mainInfo = [],
  showMainHeader = true,

  /** TABLE (optional) */
  tableTitle,
  tableData = [],
  tableColumns = [],
  tableHeight = 300,

  /** HISTORY */
  historyInfo = [],
  children,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
      title={title}
      modalRender={(modal) => (
        <div style={{ borderRadius: 16, overflow: "hidden" }}>{modal}</div>
      )}
      styles={{
        body: { padding: 24 },
        header: { padding: "16px 24px", marginBottom: 0 },
      }}
    >
      {/* ================= MAIN INFO ================= */}
      {mainInfo.length > 0 && (
        <SectionCard title={showMainHeader ? mainTitle : null}>
          <Descriptions
            layout="vertical"
            column={4}
            size="small"
            labelStyle={{ fontWeight: 600, color: "#344054" }}
            contentStyle={{ color: "#101828" }}
          >
            {mainInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value || "-"}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </SectionCard>
      )}

      {tableColumns.length > 0 && (
        <SectionCard title={tableTitle}>
          <Table
            rowKey={(record, index) => index}
            dataSource={tableData}
            columns={tableColumns}
            pagination={false}
            scroll={{ y: tableHeight }}
            size="small"
          />
        </SectionCard>
      )}
      {children}
      {historyInfo.length > 0 && (
        <SectionCard title="HISTORY LOG INFORMATION">
          <Descriptions
            layout="vertical"
            column={5}
            size="small"
            labelStyle={{ fontWeight: 600, color: "#344054" }}
            contentStyle={{ color: "#101828" }}
          >
            {historyInfo.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value || "-"}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </SectionCard>
      )}
    </Modal>
  );
};

export default DetailPopupLayout;
