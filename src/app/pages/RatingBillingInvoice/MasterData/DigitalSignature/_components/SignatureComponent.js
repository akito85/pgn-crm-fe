import React, { useRef, useState, useEffect } from "react";
import { Modal, Button, Upload, Progress, Radio, message, Tag } from "antd";
import SignatureCanvas from "react-signature-canvas";
import {
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const SignatureComponent = ({
  value,
  onChange,
  onMethodChange,
  onFileChange,
  onBase64Change,
  fileId,
}) => {
  // Initialize state based on existing fileId or value
  const [signatureType, setSignatureType] = useState(() => {
    if (fileId) return "upload";
    return "draw";
  });
  const [signatureMethod, setSignatureMethod] = useState(() => {
    if (fileId) return "UPLOAD";
    return "DRAW";
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatureData, setSignatureData] = useState(value || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [hasUploadedFile, setHasUploadedFile] = useState(!!fileId);
  const sigCanvas = useRef(null);

  // Update signatureData when value prop changes (for update mode)
  // ONLY update if value is not from local upload (to prevent override)
  useEffect(() => {
    if (value && !uploadedFile) {
      setSignatureData(value);
    }
  }, [value, uploadedFile]);

  // Check if there's an existing fileId (uploaded signature)
  useEffect(() => {
    if (fileId) {
      setHasUploadedFile(true);
      setSignatureType("upload");
      setSignatureMethod("UPLOAD");
      // Set a placeholder value to satisfy validation
      const placeholderValue = `EXISTING_FILE_${fileId}`;
      setSignatureData(placeholderValue);
      onChange && onChange(placeholderValue);
    }
  }, [fileId]);

  const handleRadioChange = (e) => {
    const type = e.target.value;
    setSignatureType(type);
    const method = type === "draw" ? "DRAW" : "UPLOAD";
    setSignatureMethod(method);

    // Notify parent about method change
    if (onMethodChange) {
      onMethodChange(method);
    }

    // Handle switching between methods
    if (type === "draw") {
      setUploadedFile(null);
      setFileList([]);
      setHasUploadedFile(false);
      onFileChange(null);

      // Keep existing drawn signature if available
      if (signatureData && signatureData.includes("data:image")) {
        onChange && onChange(signatureData);
      } else {
        setSignatureData(null);
        onChange && onChange(null);
      }
    } else {
      // Clear drawn signature
      setSignatureData(null);

      // Restore file if exists
      if (hasUploadedFile && fileId) {
        const placeholderValue = `EXISTING_FILE_${fileId}`;
        setSignatureData(placeholderValue);
        onChange && onChange(placeholderValue);
      } else if (uploadedFile) {
        // If there's already an uploaded file, restore it
        onChange && onChange(uploadedFile.name);
      }
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
      setUploadedFile(null);
      setFileList([]);
      setHasUploadedFile(false);

      // Set value for form validation
      onChange && onChange(base64Data);

      // Update signatureBase64 field
      if (onBase64Change) {
        onBase64Change(base64Data);
      }

      if (onMethodChange) {
        onMethodChange("DRAW");
      }
      if (onFileChange) {
        onFileChange(null);
      }

      setIsModalVisible(false);
      message.success("Signature saved successfully!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Process file upload with FileReader
  const processFileUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();

    // Simulate upload progress
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

      // Store file data
      setSignatureData(base64Data);
      setUploadedFile(file);
      setSignatureMethod("UPLOAD");
      setHasUploadedFile(true);

      // Send file to parent components
      if (onMethodChange) {
        onMethodChange("UPLOAD");
      }

      if (onFileChange) {
        onFileChange(file);
      }

      if (onChange) {
        onChange(file.name);
      }

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        message.success(`File "${file.name}" uploaded successfully!`);
      }, 500);
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      message.error("Failed to read file!");
    };

    reader.readAsDataURL(file);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    // Process file IMMEDIATELY in beforeUpload
    processFileUpload(file);

    return false; // Prevent default upload behavior
  };

  const handleUploadChange = (info) => {
    const { fileList: newFileList } = info;

    // Update fileList to only keep the latest file
    const latestFileList = newFileList.slice(-1);
    setFileList(latestFileList);
  };

  const handleRemove = () => {
    setFileList([]);
    setUploadedFile(null);
    setSignatureData(null);
    setHasUploadedFile(false);
    onChange && onChange(null);
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleViewSignature = () => {
    // Determine the image source based on signature type
    let imageSrc = null;

    if (
      signatureType === "draw" &&
      signatureData &&
      signatureData.includes("data:image")
    ) {
      // For drawn signature
      imageSrc = signatureData;
    } else if (signatureType === "upload" && signatureData) {
      // For uploaded signature
      if (signatureData.includes("data:image")) {
        imageSrc = signatureData;
      } else if (signatureData.startsWith("EXISTING_FILE_")) {
        // Can't preview existing file without fetching it
        Modal.warning({
          title: "Preview Not Available",
          content: "Preview is not available for existing uploaded signatures.",
        });
        return;
      }
    }

    if (imageSrc) {
      Modal.info({
        title: "Signature Preview",
        width: 600,
        content: (
          <div className="flex justify-center items-center p-4">
            <img
              src={imageSrc}
              alt="Signature"
              style={{ maxWidth: "100%", border: "1px solid #d9d9d9" }}
            />
          </div>
        ),
      });
    }
  };

  const uploadProps = {
    beforeUpload,
    onChange: handleUploadChange,
    onRemove: handleRemove,
    fileList,
    maxCount: 1,
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Radio Group */}
        <div className="flex items-center gap-4">
          <Radio.Group value={signatureType} onChange={handleRadioChange}>
            <Radio value="draw" style={{ marginRight: 16 }}>
              <div className="flex items-center gap-2">
                <span>Draw</span>
                {signatureType === "draw" &&
                  signatureData &&
                  signatureData.includes("data:image") && (
                    <CheckCircleOutlined className="text-green-500" />
                  )}
              </div>
            </Radio>
            <Radio value="upload">
              <div className="flex items-center gap-2">
                <span>Upload</span>
                {signatureType === "upload" &&
                  (hasUploadedFile || uploadedFile) && (
                    <CheckCircleOutlined className="text-green-500" />
                  )}
              </div>
            </Radio>
          </Radio.Group>

          {((signatureType === "draw" &&
            signatureData &&
            signatureData.includes("data:image")) ||
            (signatureType === "upload" &&
              (hasUploadedFile || uploadedFile))) && (
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={handleViewSignature}
              className="text-gray-500"
            >
              View Signature
            </Button>
          )}
        </div>

        {/* Draw Section */}
        {signatureType === "draw" && (
          <div className="mt-2">
            <Button type="primary" onClick={handleDrawClick}>
              Draw Signature
            </Button>
            {signatureData && signatureData.includes("data:image") && (
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                className="mt-2 ml-2"
              >
                Signature drawn successfully
              </Tag>
            )}
          </div>
        )}

        {/* Upload Section */}
        {signatureType === "upload" && (
          <div className="mt-2">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Choose File</Button>
            </Upload>
            {(hasUploadedFile || uploadedFile) && (
              <Tag
                color="success"
                icon={<CheckCircleOutlined />}
                className="mt-2"
              >
                {fileId && !uploadedFile
                  ? "Using existing uploaded signature"
                  : `File uploaded: ${uploadedFile?.name || "signature"}`}
              </Tag>
            )}
          </div>
        )}

        {isUploading && uploadProgress > 0 && (
          <div className="mt-2">
            <Progress percent={uploadProgress} status="active" />
          </div>
        )}
      </div>

      <Modal
        title="Draw Your Signature"
        visible={isModalVisible}
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
