import React, { useRef, useState } from "react";
import { Modal, Button, Upload, Progress, Radio, message } from "antd";
import SignatureCanvas from "react-signature-canvas";
import { EyeOutlined } from "@ant-design/icons";

const SignatureComponent = ({ value, onChange }) => {
  const [signatureType, setSignatureType] = useState("draw");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatureData, setSignatureData] = useState(value || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const sigCanvas = useRef(null);

  const handleRadioChange = (e) => {
    setSignatureType(e.target.value);
  };

  const handleDrawClick = () => {
    if (signatureType === "draw") {
      setIsModalVisible(true);
    }
  };

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleSave = () => {
    if (sigCanvas.current) {
      // Check if canvas is empty
      if (sigCanvas.current.isEmpty()) {
        message.warning("Please draw your signature first!");
        return;
      }

      // Get canvas data directly without trimming first
      const canvas = sigCanvas.current.getCanvas();
      const base64Data = canvas.toDataURL("image/png");

      // Log to console
      console.log("Signature Base64:", base64Data);

      setSignatureData(base64Data);
      onChange && onChange(base64Data);
      setIsModalVisible(false);
      message.success("Signature saved successfully!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const beforeUpload = (file) => {
    const isPNG = file.type === "image/png";
    if (!isPNG) {
      message.error("You can only upload PNG files!");
      return false;
    }
    return true;
  };

  const handleUpload = (info) => {
    const { file } = info;

    if (file.status === "uploading") {
      setIsUploading(true);
      return;
    }

    if (file.originFileObj) {
      setIsUploading(true);
      setUploadProgress(0);

      const reader = new FileReader();

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      reader.onload = (e) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        const base64Data = e.target.result;

        // Log to console
        console.log("Uploaded File Base64:", base64Data);

        setSignatureData(base64Data);
        onChange && onChange(base64Data);

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          message.success("File uploaded successfully!");
        }, 500);
      };

      reader.readAsDataURL(file.originFileObj);
    }

    return false;
  };

  const handleViewSignature = () => {
    if (signatureData) {
      Modal.info({
        title: "Signature Preview",
        width: 600,
        content: (
          <div className="flex justify-center items-center p-4">
            <img
              src={signatureData}
              alt="Signature"
              style={{ maxWidth: "100%", border: "1px solid #d9d9d9" }}
            />
          </div>
        ),
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Radio.Group value={signatureType} onChange={handleRadioChange}>
          <Radio.Button value="draw" onClick={handleDrawClick}>
            Draw
          </Radio.Button>
          <Radio.Button value="upload">
            <Upload
              accept=".png"
              beforeUpload={beforeUpload}
              customRequest={handleUpload}
              showUploadList={false}
              disabled={signatureType !== "upload"}
            >
              <span>Choose File</span>
            </Upload>
          </Radio.Button>
        </Radio.Group>

        {signatureData && (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={handleViewSignature}
            className="text-gray-500"
          >
            uploaded
          </Button>
        )}
      </div>

      {isUploading && uploadProgress > 0 && (
        <div className="mt-2">
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}

      <Modal
        title="Draw Your Signature"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        centered
      >
        <div className="flex flex-col gap-4">
          <div className="border-2 border-gray-300 rounded">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: "w-full h-64 bg-white",
              }}
              backgroundColor="white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleClear}>Clear</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignatureComponent;
