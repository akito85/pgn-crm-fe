import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Upload, Progress, Radio, message } from "antd";
import SignatureCanvas from "react-signature-canvas";
import { EyeOutlined } from "@ant-design/icons";

const SignatureComponent = ({ value, onChange, onMethodChange }) => {
  const [signatureType, setSignatureType] = useState("draw");
  const [signatureMethod, setSignatureMethod] = useState("DRAW");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatureData, setSignatureData] = useState(value || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const sigCanvas = useRef(null);

  // Update signatureData when value prop changes (for update mode)
  useEffect(() => {
    if (value) {
      setSignatureData(value);
    }
  }, [value]);

  const handleRadioChange = (e) => {
    const type = e.target.value;
    setSignatureType(type);
    const method = type === "draw" ? "DRAW" : "UPLOAD";
    setSignatureMethod(method);
    // Notify parent about method change
    if (onMethodChange) {
      onMethodChange(method);
    }
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
      if (sigCanvas.current.isEmpty()) {
        message.warning("Please draw your signature first!");
        return;
      }

      const canvas = sigCanvas.current.getCanvas();
      const base64Data = canvas.toDataURL("image/png");

      setSignatureData(base64Data);
      setSignatureMethod("DRAW");
      onChange && onChange(base64Data);
      if (onMethodChange) {
        onMethodChange("DRAW");
      }
      setIsModalVisible(false);
      message.success("Signature saved successfully!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const beforeUpload = (file) => {
    // Check file type - hanya accept gambar
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    // Check file size - maksimal 5MB
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
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

        setSignatureData(base64Data);
        setSignatureMethod("UPLOAD");
        onChange && onChange(base64Data);
        if (onMethodChange) {
          onMethodChange("UPLOAD");
        }

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
              src={
                signatureData.includes("data:image")
                  ? signatureData
                  : `data:image/png;base64,${signatureData}`
              }
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
              accept="image/*"
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
            {signatureType === "draw" ? "drawn" : "uploaded"}
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
                width: 600,
                height: 250,
                style: {
                  width: "100%",
                  height: "250px",
                  backgroundColor: "white",
                },
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
