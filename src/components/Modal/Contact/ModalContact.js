import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableContact from '../../Table/Contact/TableContact';
import ModalCustom from '../ModalCustom';
import { Checkbox, Form, Select } from 'antd';
import ButtonComponent from '../../ButtonComponent';
import ModalChooseContact from './ModalChooseContact';
import { sorterFunction } from '../../../utils/sorterFunction';
import { formMessageRequired, hasValue, renderColumn } from '../../../utils';
import { getColumnSearchProps } from '../../../utils/getColumnSearchProps';
import InputComponent from '../../InputComponent';
import { onInputUpperCase } from '../../../app/pages/AccountManagement/Utils';
import SelectComponent from '../../SelectComponent';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import SVGIcon from '../../../assets/Icon/index'

const ModalContact = ({
    open = false,
    setOpen = () => { },
    handleSaveContact = () => { },
    dispatcherChooseContact = {},
    datas_option = {},
    module_name,
    dispatcher = {},
    data_exist = {},
    typeContact = 'default',
    setTypeContact = () => { },
    formContact,
    formModal,
    dataTable = [],
    setDataTable = () => { },
    setTempData = () => { }
}) => {
    const dispatch = useDispatch();
    // const [dataTable, setDataTable] = useState([]);
    const searchInput = useRef(null);
    const [openModalChoose, setOpenModalChoose] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [pageContact, setPageContact] = useState(1);
    const [pageContactSize, setPageContactSize] = useState(10);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState("");
    const [search, setSearch] = useState({});

    



    // cancel modal
    const handleCancelContact = useCallback(() => {
        setOpenModalChoose(false)
        setOpen(false)
        formModal?.resetFields();
        formContact?.resetFields([
            ['values', 0]
        ])
        setDataTable([])
        setTypeContact('default')
        setTempData([])
    }, [formContact, formModal, setDataTable, setOpen, setTempData, setTypeContact]);

    // render data options
    const renderDataOptions = useCallback((dataOptions) => {
        const obj = {
            741: [748, 749], // phone = phone, mobile phone
            743: [750], // email = email
            742: [750], // pgn mobile (email) = email
            746: [749], // Whatsapp = mobile phone
            747: [749], // pgn mobile (phone) = mobile phone
            745: [751], // fax = fax
            744: [752], // url = free
        };
        return dataOptions?.filter((a) => obj[selectedType]?.includes(a.value));
    }, [selectedType]);

    // handle search
    const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
            if (prevState[dataIndex] !== selectedKeys[0]) {
                setPageContact(1);
            }
            return {
                ...prevState,
                [dataIndex]: selectedKeys[0],
            };
        });
    }, []);


    // edit record
    const editRecord = useCallback((record) => {

    }, [])


    // open modal choose
    const handleOpenModalChoose = useCallback(() => {
        formModal?.resetFields();
        formContact?.resetFields([
            ['values', 0]
        ])
        setOpenModalChoose(true)
    }, [formContact, formModal]);

    // handle choose contact
    const handleChooseContact = useCallback((r) => {
        setTypeContact('choosed')
        setOpenModalChoose(false)
        setOpen(true);
        dispatcherChooseContact?.dispatchChooseDetail(r?.id)
    }, [dispatcherChooseContact, setOpen, setTypeContact])

    // handle change type
    const handleChangeType = useCallback((e) => {
        setSelectedType(e?.value);

        if (e?.value === 744) {
            formContact?.setFieldsValue({
                inputType: datas_option?.data_input_type?.find(item => item?.value === 752)
            })
        } else if (e?.value === 743 || e?.value === 742) {
            formContact?.setFieldsValue({
                inputType: datas_option?.data_input_type?.find(item => item?.value === 750)
            })
        } else if (e?.value === 747 || e?.value === 746) {
            formContact?.setFieldsValue({
                inputType: datas_option?.data_input_type?.find(item => item?.value === 749)
            })
        } else if (e?.value === 745) {
            formContact?.setFieldsValue({
                inputType: datas_option?.data_input_type?.find(item => item?.value === 751)
            })
        } else if (e?.value === 741) {
            formContact?.setFieldsValue({
                inputType: datas_option?.data_input_type?.find(item => item?.value === 748)
            })
        } else {
            formContact?.resetFields(['inputType'])
        }
        formContact?.resetFields([
            ['values', 0, 'prefix_1'],
            ['values', 0, 'prefix_2'],
            ['values', 0, 'sufix'],
            ['values', 0, 'value']
        ]);
    }, [datas_option?.data_input_type, formContact])

    // handle change input type 
    const handleChangeInputType = useCallback((e) => {
        formContact?.setFieldsValue({
            values: [{
                prefix_1: undefined,
                prefix_2: undefined,
                sufix: undefined,
                values: undefined
            }]
        })
        // setInputTypeRow(e?.value);
    }, [formContact]);


    const columns = useMemo(() => {
        return [
            {
                title: "NO",
                dataIndex: "no",
                align: "center",
                width: 60,
                render: (text, object, index) => (pageContact - 1) * pageContactSize + index + 1,
            },
            {
                title: "TYPE",
                dataIndex: "type",
                editable: true,
                sorter: (a, b) => sorterFunction('type', a?.type?.label, b?.type?.label, 'select'),
                inputType: "select",
                align: "left",
                required: true,
                width: 250,
                onClick: (e) => handleChangeType(e),
                options: datas_option?.data_contact_type,
                rules: formMessageRequired('Type'),
                ...getColumnSearchProps(
                    "type",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) => renderColumn('type', searchedColumn, searchText, text?.label, false, 'input', search)
            },
            {
                title: "INPUT TYPE",
                dataIndex: "inputType",
                editable: true,
                sorter: (a, b) => sorterFunction('inputType', a?.inputType?.label, b?.inputType?.label, 'select'),
                inputType: "select",
                align: "left",
                required: true,
                width: 200,
                onClick: (e) => handleChangeInputType(e),
                options: renderDataOptions(datas_option?.data_input_type),
                rules: formMessageRequired('Input Type'),
                ...getColumnSearchProps(
                    "inputType",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true
                ),
                render: (text) => renderColumn('inputType', searchedColumn, searchText, text?.label, false, 'input', search)
            },
            {
                title: "VALUE",
                dataIndex: "value",
                inputType: "input",
                editable: true,
                sorter: true,
                required: true,
                options: {
                    country_code: datas_option?.data_country_code,
                    country_zone: datas_option?.data_country_zone
                },
                ellipsis: {
                    showTitle: false,
                },
                ...getColumnSearchProps(
                    "value",
                    searchInput,
                    searchedColumn,
                    searchText,
                    handleSearch,
                    true,
                    'contact'
                ),
                render: (text, record, id) => {
                    return renderColumn('value', searchedColumn, searchText, record?.fullValue, true, 'input', search)
                }
            },
        ]
    }, [datas_option?.data_contact_type, datas_option?.data_country_code, datas_option?.data_country_zone, datas_option?.data_input_type, handleChangeInputType, handleChangeType, handleSearch, pageContact, pageContactSize, renderDataOptions, search, searchText, searchedColumn])


    // change prefix
    const changePrefix = useCallback((record, formValue, value, prefix) => {
        if (prefix[1] === 'prefix_1') {
            formContact?.resetFields([
                ['values', 0, 'prefix_2'],
                ['values', 0, 'sufix'],
                ['values', 0, 'value']
            ]);
            hasValue(value?.value) && dispatch(dispatcher?.dispatcherCountryZone(value?.value))
        } else {
            formContact?.resetFields([
                ['values', 0, 'sufix'],
                ['values', 0, 'value']
            ]);

        }
    }, [dispatch, dispatcher, formContact]);

    // handle change
    const handleChange = (pageChange, pageSizeChange) => {
        setPageContact(pageContactSize !== pageSizeChange ? 1 : pageChange);
        setPageContactSize(pageSizeChange);
    };

    // cancel modal choose
    const handleCancelModalChoose = useCallback(() => {
        setOpenModalChoose(false)
        setOpen(true)
        setTypeContact('default')
    }, [setOpen, setTypeContact])


    return (
        <>
            <ModalCustom
                isOpen={open}
                type='confirmation'
                header={'Contact Information'}
                handleCancel={handleCancelContact}
                footer={[
                    <div className='w-full flex'>
                        <ButtonComponent onClick={handleCancelContact} type={'submit'}>
                            Back
                        </ButtonComponent>
                        <div className='justify-end flex gap-2 w-full'>
                            <ButtonComponent
                                icon={<SVGIcon
                                    name={`IconButtonClear`}
                                    width={24}
                                />}
                                onClick={handleCancelContact} type={'submit'}>
                                Clear
                            </ButtonComponent>
                            <ButtonComponent type={'submit'} htmlType={'submit'} form={'modalContact'}>
                                Save
                            </ButtonComponent>
                        </div>
                    </div>
                ]}
                width={1200}
            >
                <div className='w-full'>
                    <div className="text-primary text-xs font-bold uppercase pt-6">
                        Contact Information
                    </div>
                    {
                        typeContact !== 'update' &&
                        <div className='w-full justify-end flex mb-4'>
                            <ButtonComponent type={'submit'} border={true} onClick={handleOpenModalChoose}>
                                Choose Contact
                            </ButtonComponent>
                        </div>
                    }
                    <Form
                        form={formModal}
                        id={'modalContact'}
                        onFinish={(formValue) => {
                            handleSaveContact(formValue, dataTable)
                            setOpenModalChoose(false)
                            setOpen(false)
                            formModal?.resetFields();
                            formContact?.resetFields([
                                ['values', 0]
                            ])
                            setDataTable([])
                        }}
                        layout='vertical'>
                        <div className='w-full grid grid-cols-3 gap-5'>
                            <Form.Item
                                label={'First Name'}
                                name={'firstName'}
                                rules={formMessageRequired('First Name')}
                            >
                                <InputComponent onInput={onInputUpperCase} disabled={typeContact === 'choosed' || typeContact === 'update'} />
                            </Form.Item>
                            <Form.Item
                                label={'Middle Name'}
                                name={'middleName'}
                            >
                                <InputComponent onInput={onInputUpperCase} disabled={typeContact === 'choosed' || typeContact === 'update'} />
                            </Form.Item>
                            <Form.Item
                                label={'Last Name'}
                                name={'lastName'}
                            >
                                <InputComponent onInput={onInputUpperCase} disabled={typeContact === 'choosed' || typeContact === 'update'} />
                            </Form.Item>
                        </div>
                        <div className='w-full grid grid-cols-3 gap-5'>
                            <Form.Item
                                label={'Job'}
                                name={'jobId'}
                            >
                                <SelectComponent options={datas_option?.data_job} disabled={typeContact === 'choosed' || typeContact === 'update'} />
                            </Form.Item>
                            <Form.Item
                                label={'Position'}
                                name={'positionId'}
                            >
                                <SelectComponent options={datas_option?.data_position} disabled={typeContact === 'choosed' || typeContact === 'update'} />
                            </Form.Item>
                        </div>
                        <div className="text-primary text-xs font-bold uppercase pt-6">
                            Contact detail
                        </div>
                        <TableContact
                            cols={columns}
                            dataTable={dataTable}
                            setDataTable={setDataTable}
                            form={formContact}
                            editRecords={editRecord}
                            actionButtons={typeContact === 'default' ? ['update', 'delete'] : []}
                            changePrefix={changePrefix}
                            onChangePage={handleChange}
                            onSizeChanger={handleChange}
                            page={pageContact}
                            pageSize={pageContactSize}
                            showButtonCreate={typeContact === 'default'}
                        />
                        <div className="text-primary text-xs font-bold uppercase pt-6">
                            Contact Purpose Information
                        </div>
                        <div className='w-full grid-cols-3 grid gap-5'>
                            <div className="flex flex-col pt-[12px]">
                                <Form.Item
                                    name={'isPrimary'}
                                    valuePropName={'checked'}
                                >
                                    <Checkbox disabled={typeContact === 'update' && formModal?.getFieldsValue()?.isPrimary === true}>
                                        <p className='m-0'>
                                            Primary Contact
                                        </p>
                                        <span className="text-[10px]">
                                            Click or tap this checkbox if data is branch.
                                        </span>
                                    </Checkbox>
                                </Form.Item>
                            </div>

                            {module_name === "contact" &&
                                (
                                    <>
                                        <Form.Item
                                            label={'Contact Address'}
                                            name={'contactAddressId'}
                                        >
                                            <SelectComponent options={datas_option?.data_contact_address} disabled={typeContact === 'update'} />
                                        </Form.Item>
                                        <Form.Item
                                            label={'Contact Address Additional Note'}
                                            name={'additionalNote'}
                                        >
                                            <InputComponent disabled={typeContact === 'update'} />
                                        </Form.Item>
                                    </>
                                )
                            }
                        </div>
                        <div className='w-full'>
                            <Form.Item
                                label={"Description"}
                                name={"description"}
                            >
                                <InputComponent rows={5} type="textarea" />
                            </Form.Item>
                        </div>
                    </Form>
                </div>

            </ModalCustom>

            <ModalChooseContact
                isOpen={openModalChoose}
                handleCancelModalChoose={handleCancelModalChoose}
                dispactherChoose={dispatcherChooseContact?.disptachListChoose}
                dataChoose={datas_option?.data_choose_contact}
                handleChooseContact={handleChooseContact}
            />

        </>
    );
}

export default ModalContact;
