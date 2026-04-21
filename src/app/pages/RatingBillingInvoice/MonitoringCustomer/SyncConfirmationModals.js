import React from "react";
import { Modal } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../assets/Icon/index";

const SyncConfirmationModals = ({
  syncModalOpen,
  syncRecord,
  dataInfoExpanded,
  setDataInfoExpanded,
  syncing,
  successModalOpen,
  failedModalOpen,
  onCancelSync,
  onConfirmSync,
  onCloseSuccess,
  onCloseFailed,
}) => (
  <>
    {/* Modal 1: Sync Confirmation */}
    <ModalCustom
      isOpen={syncModalOpen}
      type="confirmation"
      header="DATA SYNCHRONIZATION CONFIRMATION"
      width={550}
      handleCancel={onCancelSync}
      footer={
        <div className="w-full flex justify-end gap-3 px-4 py-3">
          <ButtonComponent type="default" onClick={onCancelSync} disabled={syncing}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            icon={<SyncOutlined spin={syncing} />}
            onClick={onConfirmSync}
            disabled={syncing}
            loading={syncing}
          >
            {syncing ? "Synchronizing..." : "Sync Data"}
          </ButtonComponent>
        </div>
      }
    >
      <div
        style={{
          border: "1px solid #d9e8f5",
          borderRadius: 6,
          backgroundColor: "#f0f7ff",
        }}
      >
        <div
          className="flex justify-between items-center cursor-pointer px-4 py-2"
          style={{
            borderBottom: dataInfoExpanded ? "1px solid #d9e8f5" : "none",
          }}
          onClick={() => setDataInfoExpanded((prev) => !prev)}
        >
          <span style={{ fontWeight: 600, fontSize: 13, color: "#0075bf" }}>
            DATA INFORMATION
          </span>
          <span style={{ fontSize: 16, color: "#0075bf" }}>
            {dataInfoExpanded ? "^" : "v"}
          </span>
        </div>
        {dataInfoExpanded && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 16px",
              padding: "12px 16px",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                Customer ID
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {syncRecord?.customerId ?? "-"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                Field Mismatch
              </div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>
                {syncRecord?.fieldMismatch ?? "-"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                Pra-Billing Value
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#fa8c16" }}>
                {syncRecord?.praBillingValue ?? "-"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                Master Value
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#52c41a" }}>
                {syncRecord?.masterValue ?? "-"}
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalCustom>

    {/* Modal 2: Success */}
    <Modal
      open={successModalOpen}
      onCancel={onCloseSuccess}
      centered
      width={450}
      maskClosable={false}
      className="modal-custom"
      footer={[
        <div key="footer" className="w-full flex justify-center pb-2">
          <ButtonComponent type="submit" onClick={onCloseSuccess}>
            Done
          </ButtonComponent>
        </div>,
      ]}
    >
      <div className="flex flex-col items-center text-center py-8 px-4">
        <SVGIcon name="IconSuccess" width={64} />
        <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>
          Successful
        </p>
        <p style={{ fontSize: 13, color: "#555" }}>
          Your data has been successfully synchronized with the Master Data.
        </p>
      </div>
    </Modal>

    {/* Modal 3: Failed */}
    <Modal
      open={failedModalOpen}
      onCancel={onCloseFailed}
      centered
      width={450}
      maskClosable={false}
      className="modal-custom"
      footer={[
        <div key="footer" className="w-full flex justify-center pb-2">
          <ButtonComponent type="submit" onClick={onCloseFailed}>
            Done
          </ButtonComponent>
        </div>,
      ]}
    >
      <div className="flex flex-col items-center text-center py-8 px-4">
        <SVGIcon name="IconFailed" width={64} />
        <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>
          Unsuccessful
        </p>
        <div
          style={{
            width: "80%",
            borderTop: "1px dashed #d9d9d9",
            margin: "8px auto 12px",
          }}
        />
        <p style={{ fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>
          {"Failed to synchronize data with Master Data.\nPlease try again."}
        </p>
      </div>
    </Modal>
  </>
);

export default SyncConfirmationModals;
