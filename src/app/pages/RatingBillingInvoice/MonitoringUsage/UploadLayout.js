import React, { useEffect } from 'react';
import DetailText from '../../../../components/DetailText';
import BaseContainer from '../../../../components/BaseContainer';
import { useState } from 'react';
import { Alert, Form, Modal, Progress, Select, Spin, Tooltip, Typography } from 'antd';
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
    // const [page, setPage] = useState(1)
    // const [pageSize, setPageSize] = useState(10);
    // const [sort, setSort] = useState('');
    const [format, setFormat] = useState();
    const [urlLink, setUrlLink] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState("");
    const [fileProgress, setFileProgress] = useState(0);
    const [dataSource, setDataSource] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [deletedRecord, setDeletedRecord] = useState(null);
    const [isFileUploadEnabled, setFileUploadEnabled] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false)
    const MAX_FILE_SIZE = 5000000;
    const { loading } = useSelector((state) => state.monitoring_usage)
    const { columns, page, setPage, pageSize, setPageSize, onSort } = useMonitoringList(tabHeader, id);
    const [tableDataSource, setTableDataSource] = useState([]);
    const dispatch = useDispatch();

    const { list_usage_type, updatedData, deletedData } = useSelector((state) => state.monitoring_usage);
    useEffect(() => {
        try {
            dispatch(getFormatUsageType());
            // setTableDataSource(data?.usageList?.result)
        } catch (error) {
            console.log('Error', error)
        }
    }, [dispatch]);

    // useEffect(() => {
    //     if (updatedData.length > 0 || deletedData.length > 0) {
    //         const updatedTableDataSource = tableDataSource?.map((item) => {
    //             const updatedItem = updatedData?.find((updated) => updated.recordId === item.recordId);
    //             return updatedItem ? { ...item, ...updatedItem } : item;
    //         });

    //         const finalTableDataSource = updatedTableDataSource?.filter(
    //             (item) => !deletedData?.some((deleted) => deleted.recordId === item.recordId)
    //         );
    //         setTableDataSource(finalTableDataSource);
    //     }
    // }, [tableDataSource, updatedData, deletedData]);

    // onChange Size
    const onChangeSize = (page, pageSize) => {
        setPage(page)
        setPageSize(pageSize)
    }

    const handleUpdate = (record, values) => {
        const updatedData = { record }
        setDataSource((prevDataSource) => {
            return prevDataSource.map((data) =>
                data.key === record.key ? { ...data, ...updatedData } : data
            );
        });
        setSelectedRecord(null);
    };

    const handleDeleteOk = (record) => {
        setModalDelete(false);
        dispatch(addDeletedData(deletedRecord));
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
                                    <SVGIcon name="IconEdit" width={24} onClick={() => handleUpdate(record)} />
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
                                        setDeletedRecord(record)
                                    }}
                                />
                            </div>
                        </Tooltip>
                    </div>
                )

            }
        }
    ];

    // handle pagination
    const updateDataPagination = (page, pageSize) => {
        return dataTable?.slice((page - 1) * pageSize, page * pageSize);
    };

    // handle format change
    const handleFormat = (value) => {
        // console.log(value)
        setFormat(value)
        setFileUploadEnabled(!!value);
    };

    // data format 
    const dataFormat = [
        { id: 1, text: 'docs' },
        { id: 2, text: 'xlxs' },
        { id: 3, text: 'csv' },
    ];

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
        handleUpload();
    };

    // properties dragger
    const property = {
        name: "file",
        multiple: false,
        fileList: fileList,
        showUploadList: false,
        accept: ".xlsx, .xls",
        maxCount: 1,
        beforeUpload: async (file) => {
            setFileName(file);
            return false;
        },
        onChange: handleFileChange,
    };

    const handleUploadButtonClick = () => {
        if (!format) {
            setModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };



    const handleUpload = async () => {
        try {
            setFileProgress(0)
            const body = {
                document: fileName,
                calculationType: format.value,
                onProgress: (progress) => setFileProgress(progress)
            };
            setLoadingUpload(true)
            await dispatch(uploadMonitoringUsage(body)).unwrap();
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
        setLoadingUpload(false)
    };
    // handle upload by link
    const handleUploadLink = async () => {
        try {
            setFileProgress(0)
            const body = {
                document: urlLink,
                calculationType: format.value,
                onProgress: (progress) => setFileProgress(progress)
            };
            await dispatch(uploadMonitoringUsage(body)).unwrap();
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

    const handleChangePage = (page, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : page;
        setPage(tempPage);
        setPageSize(pageSizeChange);
    };

    // const onSort = (_, __, sort) => {
    //     const dataSort =
    //         sort.order !== undefined
    //             ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
    //             : "";
    //     setSort(dataSort);
    // };

    // update link files
    const updateLink = (e) => {
        console.log(e)
        e.stopPropagation();
        setUrlLink(e.target.value);
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
    };

    // remove file list
    const handleRemove = (index) => {
        setFileList((prevFileList) => {
            const updatedFileList = [...prevFileList];
            updatedFileList.splice(index, 1);
            return updatedFileList;
        });
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
                            totalData={dataTable?.length}
                            current={page}
                            pageSize={pageSize}
                            onChange={handleChangePage}
                            tableScrolled={{ x: 10000, y: 600 }}
                            onSort={onSort}
                        />
                    </div>
                </div>
            )
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
                                >
                                    {list_usage_type?.map((data, index) => (
                                        <Select.Option key={data.id} value={data.id}>
                                            {data.name}
                                        </Select.Option>
                                    ))}
                                </SelectComponent>
                            </Form.Item>
                        </div>
                        <Form.Item name={"file"}>
                            <div className="w-full">
                                <Spin spinning={loadingUpload}>
                                    <Dragger {...property} disabled={!isFileUploadEnabled}>
                                        <p className="ant-upload-drag-icon">
                                            <SVGIcon name={'IconUploadAttachment'} onClick={handleUploadButtonClick} />
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
                                                    onChange={updateLink}
                                                />
                                                <ButtonComponent
                                                    icon={<UploadOutlined />}
                                                    type={"submit"}
                                                    border={false}
                                                    onClick={handleUploadLink}
                                                />
                                            </div>
                                        </div>
                                    </Dragger>
                                </Spin>
                            </div>
                        </Form.Item>
                        {fileList.map((file, index) => (
                            <div
                                className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center"
                                key={index}
                            >
                                <div>
                                    <FileOutlined style={{ fontSize: "20px" }} />
                                </div>
                                <div className="flex flex-col w-full">
                                    <div className="flex w-full justify-between">
                                        <Typography className={"text-red-500"}>
                                            {file.fileName}
                                        </Typography>
                                        <ButtonComponent
                                            icon={<CloseOutlined style={{ color: "#58804D" }} />}
                                            border={false}
                                            onClick={() => handleRemove(index)}
                                        />
                                    </div>
                                    <Typography>{bytesConverter(file.size)}</Typography>
                                    {file.fileStatus === "error" ? (
                                        <div className="flex w-full justify-between">
                                            <span className={"text-red-700"}>Failed to Upload</span>
                                            <ButtonComponent border={false}>
                                                <span className={"text-green-800 mr-2"}>Re-upload</span>
                                                <UndoOutlined style={{ color: "#58804D" }} />
                                            </ButtonComponent>
                                        </div>
                                    ) : file.size <= MAX_FILE_SIZE ? (
                                        <Progress
                                            percent={fileProgress}
                                            format={(percent) => `${percent}%`}
                                        />
                                    ) : (
                                        <span className={"text-red-700"}>
                                            File is bigger than 5MB
                                        </span>
                                    )}
                                </div>
                                <div className={"flex flex-col justify-end items-end"}>
                                    <ButtonComponent
                                        icon={<CloseOutlined style={{ color: "#58804D" }} />}
                                        border={false}
                                        onClick={() => handleRemove(index)}
                                    />
                                    {file.status === "error" && (
                                        <ButtonComponent border={false}>
                                            <span className={"text-green-800 mr-2"} onClick={reUploadImage}>Re-upload</span>
                                            <UndoOutlined style={{ color: "#58804D" }} />
                                        </ButtonComponent>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Form>
            )
        }
    }
    return (
        <>
            {renderLayout(type)}
            <ModalAttention
                isOpen={isModalVisible}
                handleCancel={handleModalClose}
                handleOk={handleModalClose}
                textList={"format usage type before uploading a file"}
                header='Failed'
            />
            <ModalConfirm
                isOpen={modalDelete}
                handleCancel={() => setModalDelete(false)}
                handleOk={handleDeleteOk}
                width={500}
                useOk={true}
            >
                <div className="flex justify-center gap-[20px] mt-6">
                    <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
                    <p className={"text-[18px] font-bold"}>
                        {`Are you sure want to delete it?`}
                    </p>
                </div>
                <Alert
                    message="Warning! if you delete this data, it will be permanently."
                    type={"error"}
                />
            </ModalConfirm>
        </>
    );
}

export default UploadLayout;
