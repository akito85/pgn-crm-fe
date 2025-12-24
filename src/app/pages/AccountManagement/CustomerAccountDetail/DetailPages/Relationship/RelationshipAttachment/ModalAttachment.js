import { InboxOutlined } from "@ant-design/icons";
import { Form, Select, Upload } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../../components/SelectComponent";
import { uploadAttachment } from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { getBase64 } from "../../../../../../../utils/getBase64";

const { Dragger } = Upload;

const ModalAttachment = ({
  openUpload = false,
  handleCancel = () => { },
  updateData = () => { },
  categoryOptions = [],
  idAccount,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();

      // Validasi apakah file sudah dipilih
      if (fileList.length === 0) {
        form.setFields([
          {
            name: "file",
            errors: ["Please upload a file"],
          },
        ]);
        return;
      }

      const file = fileList[0]?.originFileObj || fileList[0];

      // Validasi ukuran file (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        form.setFields([
          {
            name: "file",
            errors: ["File must be smaller than 10MB"],
          },
        ]);
        return;
      }

      const formData = new FormData();
      formData.append("files", file);
      formData.append("category", values.type);
      formData.append("refId", idAccount);

      await dispatch(
        uploadAttachment({ idAccount, payload: formData })
      ).unwrap();

      const base64 = await getBase64(file);
      const newAttachment = {
        key: Date.now(),
        type:
          categoryOptions.find((c) => c.id === values.type)?.text ||
          values.type,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        base64: base64,
        fileType: file.type,
        file: file,
        categoryId: values.type,
        dataType: "new",
      };

      updateData((prevState) => [...prevState, newAttachment]);

      form.resetFields();
      setFileList([]);
      handleCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    fileList: fileList,
    beforeUpload: (file) => {
      // Validasi ukuran file (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        form.setFields([
          {
            name: "file",
            errors: ["File must be smaller than 10MB"],
          },
        ]);
        return false;
      }

      setFileList([file]);
      // Clear error ketika file dipilih
      form.setFields([
        {
          name: "file",
          errors: [],
        },
      ]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    onChange: (info) => {
      // Update fileList state
      setFileList(info.fileList);
    },
  };

  const mockCategoryOptions = [
    { id: 1, name: "Lorem ipsum" },
    { id: 2, name: "Document" },
    { id: 3, name: "Contract" },
  ];

  return (
    <ModalCustom
      isOpen={openUpload}
      type="default"
      header="ATTACH FILE"
      width={600}
      handleCancel={() => {
        form.resetFields();
        setFileList([]);
        handleCancel();
      }}
      footer={
        <div className="w-full flex justify-end gap-5">
          <ButtonComponent
            type="default"
            onClick={() => {
              form.resetFields();
              setFileList([]);
              handleCancel();
            }}
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent type="submit" onClick={handleUpload}>
            Upload
          </ButtonComponent>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select type" }]}
        >
          <SelectComponent placeholder="Select type">
            {(categoryOptions.length > 0
              ? categoryOptions
              : mockCategoryOptions
            ).map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.text || item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name="file"
          label="File"
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single file upload. Maximum file size: 10MB
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </ModalCustom>
  );
};

export default ModalAttachment;
