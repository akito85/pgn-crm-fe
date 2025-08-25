import { Form, Modal, Progress, Spin, Typography } from 'antd';
import React, { useEffect } from 'react';
import ButtonComponent from '../ButtonComponent';
import { useState } from 'react';
import { Upload } from 'antd';
import { CloseOutlined, FileOutlined, InboxOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent';
import { bytesConverter } from '../../utils/bytesConverter';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, uploadProfile } from '../../redux/slices/user_management/profile';
import { checkAllowingFile } from '../../redux/slices/system_setup/entity';
import { getBase64 } from '../../utils/getBase64';
import { showModalError } from '../../redux/slices/general_slice';
const { Dragger } = Upload;

const ModalUploadCopied = (props) => {
    const {
        openUpload,
        handleCancel = () => { },
        handleOk = () => { },
        withLink,
        loading,
        data,
        width,
    } = props;
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileProgress, setFileProgress] = useState(0);
    const dispatch = useDispatch();
    const [acceptExtension, setAcceptExtension] = useState("");
    const [validateFile, setValidateFile] = useState(false);
    const { allow_file } = useSelector((state) => state.entity);
    const [base64Image, setBase64Image] = useState("");
    useEffect(() => {
        if (openUpload) {
            dispatch(checkAllowingFile());
        } else {
            setAcceptExtension("");
            setValidateFile(false);
        }
    }, [dispatch, openUpload]);

    useEffect(() => {
        if (allow_file) {
            setAcceptExtension(allow_file?.data?.fileExt?.toLowerCase()?.split(',')?.map(item => `.${item}`)?.join(', '));
        }
    }, [allow_file])

    const handleFileChange = ({ fileList }) => {
        if (validateFile) {
            setFileList(fileList);
            handleUpload()
        }
    };
    const handleFilePreview = async (file) => {
        try {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setImagePreview(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        } catch (error) {
            console.log('Error previewing image:', error);
        }
    };
    const getFileExtension = (file) => {
        return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2)?.toLowerCase();
    };
    const property = {
        name: 'files',
        multiple: true,
        showUploadList: false,
        fileList: fileList,
        accept: acceptExtension,
        maxCount: 1,
        beforeUpload: async (file) => {
            const allowed_file = allow_file?.data?.fileExt?.toLowerCase()?.split(',');
            const file_extension = getFileExtension(file?.name);
            const max_allowed_file = allow_file?.data?.size;
            const fileInMb = file.size / (1024 * 1024);
            if (allowed_file?.includes(file_extension) && fileInMb < max_allowed_file) {
                setValidateFile(true)
                setFileName(file);
                const base64 = await getBase64(file);
                const regex = "";
                setBase64Image(base64.replace(regex, ""));
                setFileList([...fileList, { ...file, percent: 0 }]);
            } else {
                if (allowed_file?.includes(file_extension) === false) {
                    setValidateFile(false)
                    const errorBody = {
                        title: "Failed",
                        description: `Format file not valid`,
                    };
                    dispatch(showModalError(errorBody));
                }
                if (allowed_file?.includes(file_extension) === true && fileInMb > max_allowed_file) {
                    setValidateFile(false)
                    const errorBody = {
                        title: "Failed",
                        description: `File size not valid, file too large!`,
                    };
                    dispatch(showModalError(errorBody));
                }
            }
            return false;
        },
        onChange: handleFileChange,
    };
    const handleRemove = (index) => {
        setFileList((prevFileList) => {
            const updatedFileList = [...prevFileList];
            updatedFileList.splice(index, 1);
            return updatedFileList;
        });
        setFileProgress(0)
    };

    const reUploadImage = async () => {
        setFileList((prevFileList) =>
            prevFileList.map((file) => ({
                ...file,
                percent: 0,
                status: 'uploading'
            }))
        );
        handleUpload();
    }
    const handleUpload = async () => {
        try {
            setFileProgress(0)
            const body = { image: fileName, onProgress: (progress) => setFileProgress(progress) };
            await dispatch(uploadProfile(body)).unwrap();
            // 
        } catch (error) {
            setFileList((prevFileList) =>
                prevFileList.map((file) => {
                    if (file.name === fileName.name) {
                        return { ...file, status: 'error' };
                    }
                    return file;
                })
            );
        }
    };

    const onFinish = async() => {
        await dispatch(getProfile())?.unwrap();

    };
    return (
        <Modal
            open={openUpload}
            onOk={handleOk}
            footer={false}
            className={'modal-custom'}
            closable={false}
            centered={true}
            width={950}
        >
            <Spin spinning={loading}>
                <div className='flex flex-col p-8'>
                    <div className={'rounded-tl-[5px] rounded-tr-[5px]'}>
                        <div className={'flex flex-col gap-y-5'}>
                            <span className='text-xl'>Attach Files</span>
                            <span className='text-gray-500'>Attach files to this section</span>
                        </div>
                    </div>
                    <Form layout={'vertical'} form={form}  name='file_upload_form'>
                        <Form.Item name={'file'}>
                            <div className='py-3'>
                                <Dragger {...property}>
                                    <p className='ant-upload-drag-icon'>
                                        <InboxOutlined />
                                    </p>
                                    <p className='ant-upload-text underline text-bold'>Click here to attach a file</p>
                                    <p className='ant-upload-hint'>The maximum file size is limited to {allow_file?.data?.size } MB</p>
                                    {withLink && (
                                        <>
                                            <div className='flex items-center justify-center my-3 gap-x-3'>
                                                <div className='border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0' />
                                                <span>or</span>
                                                <div className='border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0' />
                                            </div>
                                            <p className='ant-upload-text'>Put URL link below</p>
                                            <div className='flex justify-center items-center gap-3'>
                                                <InputComponent width={'24%'} />
                                                <ButtonComponent icon={<UploadOutlined />} type={'submit'} border={false} />
                                            </div>
                                        </>
                                    )}
                                </Dragger>
                            </div>
                        </Form.Item>
                        {fileList.map((file, index) => (
                            <div className='border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center' key={index}>
                                <div>
                                    <FileOutlined style={{ fontSize: '20px' }} />
                                </div>
                                <div className='flex flex-col w-full'>
                                    <Typography className={'text-red-500'}>{file.name}</Typography>
                                    <Typography>{bytesConverter(file.size)}</Typography>
                                    {file.status === 'error' ? (
                                        <span className={'text-red-700'}>Failed to Upload</span>
                                    ) : (
                                        <Progress percent={fileProgress} format={(percent) => `${percent}%`} />
                                    )}
                                </div>
                                <div className={'flex flex-col justify-end'}>
                                    <ButtonComponent
                                        icon={<CloseOutlined style={{ color: '#58804D' }} />}
                                        border={false}
                                        onClick={() => handleRemove(index)}
                                    />
                                    {file.status === 'error' && (
                                        <ButtonComponent border={false} onClick={reUploadImage}>
                                            <span className={'text-green-800 mr-2'}>Re-upload</span>
                                            <UndoOutlined style={{ color: '#58804D' }} />
                                        </ButtonComponent>
                                    )}
                                </div>
                            </div>
                        ))}
                        <Form.Item>
                            <div className='w-full flex justify-end gap-2'>
                                <ButtonComponent onClick={() => {
                                    handleCancel()
                                    setFileList([]);
                                    handleCancel();
                                    setFileProgress(0)
                                }}>Cancel</ButtonComponent>
                                <ButtonComponent type={'submit'} border={false} htmlType={'submit'} onClick={() => {
                                    handleCancel()
                                    setFileList([]);
                                    handleCancel();
                                    setFileProgress(0)
                                    onFinish()
                                }}>
                                    Save
                                </ButtonComponent>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
};

export default ModalUploadCopied;