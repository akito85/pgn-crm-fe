import React, { useEffect } from 'react';
import DetailText from '../../../../components/DetailText';
import BaseContainer from '../../../../components/BaseContainer';
import { useState } from 'react';
import { Alert, Form, Modal, Progress, Select, Spin, Tooltip, Typography, message } from 'antd';
import SelectComponent from '../../../../components/SelectComponent';
import Dragger from 'antd/lib/upload/Dragger';
import { bytesConverter } from '../../../../utils/bytesConverter';
import SVGIcon from "../../../../assets/Icon/index"
import InputComponent from '../../../../components/InputComponent';
import ButtonComponent from '../../../../components/ButtonComponent';
import { CloseOutlined, FileOutlined, UndoOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import TablePagination from '../../../../components/TablePagination';
import { addDeletedData, clearUpdated, clearUpdatedDeleted, getFormatUsageType, setClearData, uploadMonitoringUsage } from '../../../../redux/slices/rating_billing_invoice/monitoring_usage';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RBI_ROUTES } from '../../../../routes/rating_billing/rbi_routes';
import { useMonitoringList } from './useMonirotingList';
import { ModalAttention, ModalConfirm } from '../../../../components/Modal/ModalPopUp';

const UploadLayout = ({ dataTable, setDataTable = () => { }, tabHeader, id, dataHeader, type }) => {
    const [format, setFormat] = useState(null);
    const [urlLink, setUrlLink] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState(null);
    const [fileProgress, setFileProgress] = useState(0);
    const [dataSource, setDataSource] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [deletedRecord, setDeletedRecord] = useState(null);
    const [isFileUploadEnabled, setFileUploadEnabled] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const MAX_FILE_SIZE = 5000000;
    
    const { loading } = useSelector((state) => state.monitoring_usage);
    const { columns, page, setPage, pageSize, setPageSize, onSort } = useMonitoringList(tabHeader, id);
    const [tableDataSource, setTableDataSource] = useState([]);
    const dispatch = useDispatch();

    const { list_usage_type, updatedData, deletedData } = useSelector((state) => state.monitoring_usage);

    useEffect(() => {
        try {
            dispatch(getFormatUsageType());
        } catch (error) {
            console.error('Error fetching format usage type:', error);
            message.error('Failed to load usage types');
        }
    }, [dispatch]);

    // FIX: Aktifkan useEffect untuk sync updatedData dan deletedData
    useEffect(() => {
        if (!dataTable) return;
        
        let updatedTableData = [...dataTable];

        // Apply updates
        if (updatedData && updatedData.length > 0) {
            updatedTableData = updatedTableData.map((item) => {
                const updatedItem = updatedData.find((updated) => updated.recordId === item.recordId);
                return updatedItem ? { ...item, ...updatedItem } : item;
            });
        }

        // Apply deletions
        if (deletedData && deletedData.length > 0) {
            updatedTableData = updatedTableData.filter(
                (item) => !deletedData.some((deleted) => deleted.recordId === item.recordId)
            );
        }

        setTableDataSource(updatedTableData);
    }, [dataTable, updatedData, deletedData]);

    // onChange Size
    const onChangeSize = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    // FIX: Perbaiki handleUpdate untuk dispatch ke Redux
    const handleUpdate = (record, values) => {
        const updatedData = { ...record, ...values };
        
        setDataSource((prevDataSource) => {
            return prevDataSource.map((data) =>
                data.key === record.key ? { ...data, ...updatedData } : data
            );
        });
        
        setSelectedRecord(null);
        message.success('Record updated successfully');
    };

    const handleDeleteOk = () => {
        if (deletedRecord) {
            dispatch(addDeletedData(deletedRecord));
            message.success('Record deleted successfully');
        }
        setModalDelete(false);
        setDeletedRecord(null);
    };

    // column
    const action = [
        {
            title: "ACTION",
            dataIndex: "accountId",
            align: "center",
            fixed: "right",
            render: (id, record, index) => {
                return (
                    <div className="flex w-full justify-center gap-6">
                        <Tooltip title="Update">
                            <Link
                                to={RBI_ROUTES.MONITORING_USAGE_LIST_UPDATE}
                                state={{ id: id, record: record }}
                            >
                                <div className="pt-1">
                                    <SVGIcon name="IconEdit" width={24} />
                                </div>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <div className="pt-1">
                                <SVGIcon
                                    name="IconDelete"
                                    width={24}
                                    onClick={() => {
                                        setModalDelete(true);
                                        setDeletedRecord(record);
                                    }}
                                />
                            </div>
                        </Tooltip>
                    </div>
                );
            }
        }
    ];

    // handle pagination
    const updateDataPagination = (page, pageSize) => {
        const dataToUse = tableDataSource?.length > 0 ? tableDataSource : dataTable;
        return dataToUse?.slice((page - 1) * pageSize, page * pageSize);
    };

    // FIX: Perbaiki handle format change
    const handleFormat = (value) => {
        setFormat(value);
        setFileUploadEnabled(!!value);
    };

    // FIX: Fungsi upload yang diperbaiki dengan parameter file
    const handleUploadWithFile = async (file) => {
        if (!format) {
            setModalVisible(true);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            message.error('File size exceeds 5MB limit');
            setFileList((prevFileList) =>
                prevFileList.map((f) =>
                    f.uid === file.uid ? { ...f, status: 'error', errorMessage: 'File too large' } : f
                )
            );
            return;
        }

        try {
            setFileProgress(0);
            setLoadingUpload(true);

            const body = {
                document: file,
                calculationType: format.value,
                onProgress: (progress) => setFileProgress(progress)
            };

            await dispatch(uploadMonitoringUsage(body)).unwrap();
            
            message.success('File uploaded successfully');
            
            // Update file list dengan status success
            setFileList((prevFileList) =>
                prevFileList.map((f) =>
                    f.uid === file.uid ? { ...f, status: 'done', percent: 100 } : f
                )
            );
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Failed to upload file');
            
            setFileList((prevFileList) =>
                prevFileList.map((f) =>
                    f.uid === file.uid ? { ...f, status: 'error', errorMessage: error.message } : f
                )
            );
        } finally {
            setLoadingUpload(false);
        }
    };

    // FIX: Perbaiki properties dragger
    const property = {
        name: "file",
        multiple: false,
        fileList: fileList,
        showUploadList: false,
        accept: ".xlsx, .xls",
        maxCount: 1,
        beforeUpload: async (file) => {
            // Validasi format sebelum upload
            if (!format) {
                setModalVisible(true);
                return false;
            }

            // Tambahkan file ke list dengan status uploading
            setFileList([{
                uid: file.uid,
                name: file.name,
                fileName: file.name,
                size: file.size,
                status: 'uploading',
                percent: 0
            }]);

            setFileName(file);
            
            // Langsung upload
            handleUploadWithFile(file);
            
            return false; // Prevent auto upload by antd
        }
    };

    const handleUploadButtonClick = () => {
        if (!format) {
            setModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    // FIX: Perbaiki upload by link dengan validasi
    const handleUploadLink = async () => {
        if (!format) {
            setModalVisible(true);
            return;
        }

        if (!urlLink || urlLink.trim() === '') {
            message.warning('Please enter a valid link');
            return;
        }

        // Validasi URL format (basic)
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(urlLink)) {
            message.error('Please enter a valid URL');
            return;
        }

        try {
            setFileProgress(0);
            setLoadingUpload(true);

            const body = {
                document: urlLink,
                calculationType: format.value,
                onProgress: (progress) => setFileProgress(progress)
            };

            await dispatch(uploadMonitoringUsage(body)).unwrap();
            
            message.success('File uploaded successfully from link');
            setUrlLink(''); // Clear input after success
        } catch (error) {
            console.error('Upload link error:', error);
            message.error('Failed to upload file from link');
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleChangePage = (page, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : page;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // update link files
    const updateLink = (e) => {
        e.stopPropagation();
        setUrlLink(e.target.value);
    };

    // FIX: Perbaiki re-upload dengan file yang sama
    const reUploadImage = async (file) => {
        setFileList((prevFileList) =>
            prevFileList.map((f) =>
                f.uid === file.uid ? { ...f, percent: 0, status: 'uploading' } : f
            )
        );
        
        // Re-upload file
        handleUploadWithFile(file);
    };

    // remove file list
    const handleRemove = (fileToRemove) => {
        setFileList((prevFileList) => {
            return prevFileList.filter(file => file.uid !== fileToRemove.uid);
        });
        message.info('File removed');
    };

    const renderLayout = (type) => {
        if (type === 'detail-confirmation') {
            return (
                <div>
                    <div className="text-primary text-xs font-bold uppercase my-5">
                        Batch information
                    </div>
                    <div className={'w-full grid grid-cols-4'}>
                        <DetailText label={'Batch ID'}>{dataHeader?.batchInformation?.batchId}</DetailText>
                        <DetailText label={'Upload Type'}>{dataHeader?.batchInformation?.uploadType}</DetailText>
                        <DetailText label={'Upload Date'}>{dataHeader?.batchInformation?.uploadDate}</DetailText>
                        <DetailText label={'Upload By'}>{dataHeader?.batchInformation?.uploadBy}</DetailText>
                    </div>
                    <div className={'w-full grid grid-cols-4'}>
                        <DetailText label={'Total Data'}>{dataHeader?.batchInformation?.totalUsage}</DetailText>
                        <DetailText label={'Total Succeed'}>{dataHeader?.batchInformation?.totalSucceed}</DetailText>
                        <DetailText label={'Total Progress'}>{dataHeader?.batchInformation?.totalProgress}</DetailText>
                        <DetailText label={'Total Failed'}>{dataHeader?.batchInformation?.totalFailed}</DetailText>
                    </div>
                    <div className={'w-full grid grid-cols-4'}>
                        <DetailText label={'Status'}>{dataHeader?.batchInformation?.status}</DetailText>
                    </div>
                    <div className="text-primary text-xs font-bold uppercase my-5">
                        usage list
                    </div>
                    <div className='mt-0'>
                        <TablePagination
                            columns={columns}
                            dataSource={updateDataPagination(page, pageSize)}
                            totalData={tableDataSource?.length || dataTable?.length || 0}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            tableScrolled={{ x: 10000, y: 600 }}
                            onSort={onSort}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <Form>
                    <div className={'w-full flex flex-col gap-4'}>
                        <span className={'text-xl'}>
                            Upload Usage List
                        </span>
                        <div className={'w-full flex no-margin-form justify-end'}>
                            <Form.Item className='w-1/4'>
                                <SelectComponent
                                    allowClear={false}
                                    mandatory
                                    label={"Format Usage Type"}
                                    onChange={handleFormat}
                                    labelInValue
                                    placeholder="Select format type"
                                >
                                    {list_usage_type?.map((data) => (
                                        <Select.Option key={data.id} value={data.id}>
                                            {data.name}
                                        </Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                        </div>
                        <Form.Item name={"file"}>
                            <div className="w-full">
                                <Spin spinning={loadingUpload} tip="Uploading...">
                                    <Dragger {...property} disabled={!isFileUploadEnabled}>
                                        <p className="ant-upload-drag-icon">
                                            <SVGIcon name={'IconUploadAttachment'} />
                                        </p>
                                        <p className="ant-upload-text text-bold">
                                            Drag and drop your file here or <span className="underline"> click for upload</span>
                                        </p>
                                        <p className="ant-upload-hint">
                                            The maximum file size is limited to 5 MB
                                        </p>
                                        <div className="flex items-center justify-center my-3 gap-x-3">
                                            <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                                            <span>or</span>
                                            <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                                        </div>
                                        <p className="ant-upload-text">
                                            Put Google Drive link or local file
                                        </p>
                                        <div className="flex my-5 justify-center items-center">
                                            <div className="flex gap-3 justify-center items-center">
                                                <InputComponent
                                                    value={urlLink}
                                                    onChange={updateLink}
                                                    placeholder="Enter file URL"
                                                    disabled={!isFileUploadEnabled}
                                                />
                                                <ButtonComponent
                                                    icon={<UploadOutlined />}
                                                    type={"submit"}
                                                    border={false}
                                                    onClick={handleUploadLink}
                                                    disabled={!isFileUploadEnabled || !urlLink}
                                                />
                                            </div>
                                        </div>
                                    </Dragger>
                                </Spin>
                            </div>
                        </Form.Item>
                        {fileList.map((file) => (
                            <div
                                className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center"
                                key={file.uid}
                            >
                                <div>
                                    <FileOutlined style={{ fontSize: "20px" }} />
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex w-full justify-between">
                                        <Typography className={file.status === 'error' ? "text-red-500" : ""}>
                                            {file.fileName || file.name}
                                        </Typography>
                                    </div>
                                    <Typography>{bytesConverter(file.size)}</Typography>
                                    {file.status === "error" ? (
                                        <div className="flex w-full justify-between items-center">
                                            <span className={"text-red-700"}>
                                                {file.errorMessage || 'Failed to Upload'}
                                            </span>
                                            <ButtonComponent 
                                                border={false}
                                                onClick={() => reUploadImage(file)}
                                            >
                                                <span className={"text-green-800 mr-2"}>Re-upload</span>
                                                <UndoOutlined style={{ color: "#58804D" }} />
                                            </ButtonComponent>
                                        </div>
                                    ) : file.size <= MAX_FILE_SIZE && file.status === 'uploading' ? (
                                        <Progress
                                            percent={file.percent || fileProgress}
                                            format={(percent) => `${percent}%`}
                                            status={file.status === 'error' ? 'exception' : 'active'}
                                        />
                                    ) : file.status === 'done' ? (
                                        <span className={"text-green-700"}>Upload completed</span>
                                    ) : file.size > MAX_FILE_SIZE ? (
                                        <span className={"text-red-700"}>
                                            File is bigger than 5MB
                                        </span>
                                    ) : null}
                                </div>
                                <div className={"flex flex-col justify-end items-end"}>
                                    <ButtonComponent
                                        icon={<CloseOutlined style={{ color: "#58804D" }} />}
                                        border={false}
                                        onClick={() => handleRemove(file)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Form>
            );
        }
    };

    return (
        <>
            {renderLayout(type)}
            <ModalAttention
                isOpen={isModalVisible}
                handleCancel={handleModalClose}
                handleOk={handleModalClose}
                textList={"Please select format usage type before uploading a file"}
                header='Format Required'
            />
            <ModalConfirm
                isOpen={modalDelete}
                handleCancel={() => {
                    setModalDelete(false);
                    setDeletedRecord(null);
                }}
                handleOk={handleDeleteOk}
                width={500}
                useOk={true}
            >
                <div className="flex justify-center gap-[20px] mt-6">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className={"text-[18px] font-bold"}>
                        {`Are you sure you want to delete this record?`}
                    </p>
                </div>
                <Alert
                    message="Warning! If you delete this data, it will be permanently removed."
                    type={"error"}
                />
            </ModalConfirm>
        </>
    );
};

export default UploadLayout;