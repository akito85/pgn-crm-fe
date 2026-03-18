import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../routes/account_management/customer_account_routes';
import BreadCrumb from '../../../../../components/BreadCrumb';
import { Form, Select, Spin } from 'antd';
import BaseContainer from '../../../../../components/BaseContainer';
import ButtonComponent from '../../../../../components/ButtonComponent';
import { LeftOutlined } from '@ant-design/icons';
import SVGIcon from "../../../../../assets/Icon/index";
import { createAddress, getDetailAddress, getListCity, getListCountry, getListDistrict, getListPostalCode, getListProvince, getListSubDistrict, getTypeAddress, updateAddress } from '../../../../../redux/slices/account_management/MasterData/addresses_slice';
import FormItem from 'antd/es/form/FormItem';
import SelectComponent from '../../../../../components/SelectComponent';
import InputComponent from '../../../../../components/InputComponent';
import GoogleMapsCustom from '../../../AccountManagement/CustomerAccountDetail/DetailPages/AccountAddress/GoogleMapsCustom';
import { formMessageRequired, hasValue } from '../../../../../utils';
import DetailText from '../../../../../components/DetailText';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import { validateCreateUpdate } from '../../../../../redux/slices/general_slice';
import ModalBack from '../../../../../components/Modal/ModalBack';
import accountManagementService from '../../../../../redux/services/account_management/accountManagementService';
import { useTryAgainHooks } from '../../../../../utils/useTryAgainHooks';
import Maps from '../../../../../components/Maps';

const FormAddresses = ({ type }) => {
    const { data_country, loading, data_province, data_city, data_district, data_sub_district, data_postal_code, data_detail, data_type } = useSelector((state) => state?.address)
    const { bodyError, isLoading } = useSelector(state => state?.general);
    const dispatch = useDispatch();
    const location = useLocation();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // use state
    const [modalBack, setModalBack] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [body, setBody] = useState({});
    const [selectedLocationCreateNew, setSelectedLocationCreateNew] = useState({
        lat: -6.1944491,
        lng: 106.8229198,
    });
    const [combinedText, setCombinedText] = useState("");
    const [selectedMaps, setSelectedMaps] = useState('')
    // form value
    const { countryId,
        provinceId,
        cityId,
        districtId,
        subDistrictId,
        building,
        floor,
        houseName,
        streetName,
        block,
        houseNumber,
        rt,
        rw,
        postalCodeId,
        additionalInfo } = form.getFieldsValue();

    // assert
    const assert = useCallback((data) => {
        if (data) {
            form.setFieldsValue({
                countryId: data?.information?.countryId,
                provinceId: data?.information?.provinceId,
                cityId: data?.information?.cityId,
                districtId: data?.information?.districtId,
                subDistrictId: data?.information?.subDistrictId,
                postalCodeId: data?.information?.postalCodeId,
                type: data?.information?.typeId,
                building: data?.information?.building,
                floor: data?.information?.floor,
                houseName: data?.information?.houseName,
                houseNumber: data?.information?.houseNumber,
                streetName: data?.information?.streetName,
                block: data?.information?.streetNumber,
                rt: data?.information?.rt,
                rw: data?.information?.rw,
                additionalInfo: data?.information?.additionalInfo,
                description: data?.information?.description,
                altitude: data?.coordinateInformation?.altitude,
                longitude: hasValue(data?.coordinateInformation?.longtitude) ? data?.coordinateInformation?.longtitude : undefined,
                latitude: data?.coordinateInformation?.latitude,
                source: data?.coordinateInformation?.source
            })
            setSelectedLocationCreateNew({
                lat: hasValue(data?.coordinateInformation?.latitude) ? parseFloat(data?.coordinateInformation?.latitude) : '',
                lng: hasValue(data?.coordinateInformation?.longtitude) ? parseFloat(data?.coordinateInformation?.longtitude) : "",
            })
            setSelectedMaps(data?.coordinateInformation?.source)
        }
    }, [form]);

    // use effect
    useEffect(() => {
        dispatch(getListCountry());
        dispatch(getTypeAddress());
        if (location?.state?.id) {
            dispatch(getDetailAddress(location.state.id));
        }
    }, [dispatch, location]);

    useEffect(() => {
        if (location?.state?.id && type === 'update') {
            assert(data_detail)
        }
    }, [assert, location, type, data_detail])

    useEffect(() => {
        if (hasValue(selectedMaps) &&
            (selectedLocationCreateNew.lat !== -6.1944491 ||
                selectedLocationCreateNew.lng !== 106.8229198)
        ) {
            form.setFieldsValue({
                latitude: selectedLocationCreateNew?.lat.toString(),
                longitude: selectedLocationCreateNew?.lng.toString(),
            });
        }
    }, [selectedLocationCreateNew, form, selectedMaps]);

    const getValueForm = useCallback((countryId, provinceId, cityId, districtId, subDistrictId) => {
        if (hasValue(countryId) === true) {
            dispatch(getListProvince(countryId));
        }
        if (hasValue(provinceId) === true) {
            dispatch(getListCity(provinceId))
        }
        if (hasValue(cityId) === true) {
            dispatch(getListDistrict(cityId))
        }
        if (hasValue(districtId) === true) {
            dispatch(getListSubDistrict(districtId))
        }
        if (hasValue(subDistrictId)) {
            dispatch(getListPostalCode(subDistrictId))
        }
    }, [dispatch]);


    useEffect(() => {
        if (type === 'update') {
            getValueForm(countryId, provinceId, cityId, districtId, subDistrictId)
        }
    }, [cityId, countryId, getValueForm, districtId, provinceId, subDistrictId, type]);


    // handle full address
    const replaceWord = useCallback(
        (val) => {
            if (val) {
                const result = val.replace(
                    // /JALAN|JALAN.|jLN|JL|JL.|JL.|JLN.|JL|JLan|jaln|Jaln|/gi,
                    /JL\.|JLN\.|JLN|JALAN\.|JALAN|JL|Jaln/ig, "",
                    // function (x) {
                    //     return (x = "");
                    // }
                );
                return result;
            }
            return "";
        },
        [form]
    );
    const handleInputChange = (value, name) => {
        setCombinedText((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    let fullAddress = useMemo(() => {
        const addresses =
            `${hasValue(building) && `GEDUNG ${building}, `}${hasValue(floor) && `LANTAI ${floor}, `}${hasValue(houseName) && houseName + ', '}${hasValue(streetName) && 'JL. ' + replaceWord(streetName) + ', '}${hasValue(block) && `BLOCK ${block}, `}${hasValue(houseNumber) && "No. " + houseNumber + ', '}${hasValue(rt) && 'RT. ' + rt + ', '}${hasValue(rw) && 'RW. ' + rw + ', '}${hasValue(additionalInfo) && additionalInfo + ', '}${hasValue(subDistrictId) && data_sub_district?.find(a => a?.value === subDistrictId)?.name + ', '}${hasValue(districtId) && data_district?.find(a => a?.value === districtId)?.name + ', '}${hasValue(cityId) && data_city?.find(a => a?.value === cityId)?.name + ', '}${hasValue(provinceId) && data_province?.find(a => a?.value === provinceId)?.name + ', '}${hasValue(countryId) && data_country?.find(a => a?.value === countryId)?.name + ', '}${hasValue(postalCodeId) && data_postal_code?.find(a => a?.value === postalCodeId)?.name}`

        return addresses.replace(/false/g, "").replace(/, ,/g, ",").replace(/\s\s+/g, ' ').trim();
    }, [additionalInfo, block, building, cityId, countryId, data_city, data_country, data_district, data_postal_code, data_province, data_sub_district, districtId, floor, houseName, houseNumber, postalCodeId, provinceId, replaceWord, rt, rw, streetName, subDistrictId])


    // // Handle Function Maps
    // const onMapClick = useCallback(
    //     (event) => {
    //         setSelectedLocationCreateNew({
    //             lat: event.latLng.lat(),
    //             lng: event.latLng.lng(),
    //         });
    //     },
    //     [selectedLocationCreateNew]
    // );

    // handle change country
    const handleChangeCountry = (e) => {
        dispatch(getListProvince(e));
        form.resetFields([
            'provinceId',
            'cityId',
            'districtId',
            'subDistrictId',
            'postalCodeId'
        ])
    };

    // handle change province 
    const handleChangeProvince = (e) => {
        dispatch(getListCity(e));
        form.resetFields([
            'cityId',
            'districtId',
            'subDistrictId',
            'postalCodeId'
        ])
    }

    // handle change city
    const handleChangeCity = (e) => {
        dispatch(getListDistrict(e));
        form.resetFields([
            'districtId',
            'subDistrictId',
            'postalCodeId'
        ])

    }

    // handle change district
    const handleChangeDistrict = (e) => {
        dispatch(getListSubDistrict(e));
        form.resetFields([
            'subDistrictId',
            'postalCodeId'
        ])
    }

    // handle change sub district
    const handleChangeSubDistrict = (e) => {
        dispatch(getListPostalCode(e));
        form.resetFields([
            'postalCodeId'
        ])
    }

    // handle confirmation
    const handleFinish = async (formValue) => {
        try {
            let validateValueObj;
            let body;
            if (type === 'update') {
                body = {
                    ...formValue,
                    addressId: location?.state?.id,
                    fullAddress: fullAddress,
                    neighborhood1: formValue?.rt,
                    neighborhood2: formValue?.rw
                }
                validateValueObj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: '/v1/dbs/api/master/address/validate-update',
                    type
                }
            } else {
                body = {
                    ...formValue,
                    fullAddress: fullAddress,
                    neighborhood1: formValue?.rt,
                    neighborhood2: formValue?.rw
                }
                validateValueObj = {
                    body: body,
                    services: accountManagementService,
                    endPoint: '/v1/dbs/api/master/address/validate-create',
                    type
                }
            }
            await dispatch(validateCreateUpdate(validateValueObj))?.unwrap()
            setOpenConfirmation(true);
            setBody({
                body: body,
                validateValue: validateValueObj
            });

        } catch (error) {
            setOpenConfirmation(false);

        }
    };
    // handle cancel 
    const handleCancel = () => {
        setOpenConfirmation(false)
        setModalBack(false)
    };

    // handle save
    const handleSave = async () => {
        setOpenConfirmation(false);
        if (type === 'create') {
            await dispatch(createAddress(body?.body))?.unwrap();
        } else {
            await dispatch(updateAddress(body?.body))?.unwrap();
        }
    }

    // handle reset 
    const handleReset = () => {
        if (type === 'create') {
            form.resetFields();
            handleInputChange(null, form);
        } else {
            assert(data_detail);
            getValueForm(countryId, provinceId, cityId, districtId, subDistrictId)

        }
    };


    const RenderMaps = useMemo(() => {
        if (hasValue(selectedMaps)) {
            if (selectedMaps?.toLowerCase() === 'google maps') {
                return <Maps keyword={fullAddress} setSelectedLocationFront={setSelectedLocationCreateNew} />
            }
        } else {
            return <></>
        }
    }, [fullAddress, selectedMaps]);



    // Breadcrumbs
    const routes = [
        {
            path: "",
            breadcrumbName: "System Setup",
        },
        {
            path: "",
            breadcrumbName: "Master Data",
        },
        {
            path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ADDRESSES,
            breadcrumbName: "Address",
        },
        {
            path: "",
            breadcrumbName: type === 'update' ? "Update Address" : 'Create Address',
        },
    ];

    // handle retry
    const handleRetry = () => {
        handleCancelTryAgain()
        if (bodyError?.action === "GET_DETAIL_ADDRESS") {
            dispatch(getDetailAddress(location.state.id));
        } else if (bodyError?.action === "CREATE_ADDRESS") {
            dispatch(createAddress(body?.body))
        } else if (bodyError?.action === "UPDATE_ADDRESS") {
            dispatch(updateAddress(body?.body))
        } else {
            dispatch(validateCreateUpdate(body?.validateValue))
        }
    };

    const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)

    const onInputUpperCase = (e) => {
        const { selectionStart, selectionEnd } = e.target;
        // Use Object.assign to update the value property
        Object.assign(e.target, { value: e.target.value.toUpperCase().trimStart() });
        // Set the cursor position using setSelectionRange
        e.target.setSelectionRange(selectionStart, selectionEnd);
    };

    return (
        <LayoutMenu>
            <BreadCrumb routes={routes} />
            <Spin spinning={loading || isLoading}>
                <Form form={form} layout={'vertical'} onFinish={handleFinish}>
                    <BaseContainer header={'create address information'}>
                        <div className='w-full grid grid-cols-3 gap-3'>
                            <FormItem label={'Country'} name={'countryId'} rules={formMessageRequired('Country')}>
                                <SelectComponent onChange={(e) => handleChangeCountry(e)} disabled={type === 'update'}>
                                    {data_country?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'Province'} name={'provinceId'} rules={formMessageRequired('Province')}>
                                <SelectComponent onChange={(e) => handleChangeProvince(e)} disabled={hasValue(countryId) === false || type === 'update'}>
                                    {data_province?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'City'} name={'cityId'} rules={formMessageRequired('City')}>
                                <SelectComponent onChange={(e) => handleChangeCity(e)} disabled={hasValue(provinceId) === false || type === 'update'}>
                                    {data_city?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'District'} name={'districtId'} rules={formMessageRequired('District')}>
                                <SelectComponent onChange={(e) => handleChangeDistrict(e)} disabled={hasValue(cityId) === false || type === 'update'}>
                                    {data_district?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'Sub District'} name={'subDistrictId'} rules={formMessageRequired('Sub District')}>
                                <SelectComponent onChange={(e) => handleChangeSubDistrict(e)} disabled={hasValue(districtId) === false || type === 'update'}>
                                    {data_sub_district?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'Postal Code'} name={'postalCodeId'} rules={formMessageRequired('Postal Code')}>
                                <SelectComponent disabled={hasValue(subDistrictId) === false || type === 'update'}>
                                    {data_postal_code?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'Building'} name={'building'}>
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "building")}
                                    disabled={type === 'update'}
                                    onInput={onInputUpperCase}
                                />
                            </FormItem>
                            <FormItem label={'Floor'} name={'floor'}
                            >
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "floor")}
                                    disabled={type === 'update'}
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/\D/g, ""))
                                    }
                                />
                            </FormItem>
                            <FormItem label={'House Name'} name={'houseName'}>
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "houseName")}
                                    disabled={type === 'update'}
                                    onInput={onInputUpperCase}
                                />
                            </FormItem>
                            <FormItem
                                label={'Street Name'}
                                name={'streetName'}
                                rules={[
                                    {
                                        message: "Please input your Street Name!",
                                        required: true,
                                    },
                                ]}
                            >
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "streetName")}
                                    disabled={type === 'update'}
                                    onInput={onInputUpperCase}

                                />
                            </FormItem>
                            <FormItem label={'Block'} name={'block'}>
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "block")}
                                    disabled={type === 'update'}
                                    onInput={onInputUpperCase}
                                />
                            </FormItem>
                            <FormItem label={'House Number'} name={'houseNumber'}>
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "houseNumber")}
                                    disabled={type === 'update'}
                                    onInput={onInputUpperCase}
                                />
                            </FormItem>
                            <FormItem label={'RT'} name={'rt'}>
                                <InputComponent
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/\D/g, ""))
                                    }
                                    onChange={(e) => handleInputChange(e.target.value, "rt")}
                                    disabled={type === 'update'}

                                />
                            </FormItem>
                            <FormItem label={'RW'} name={'rw'}>
                                <InputComponent
                                    onInput={(e) =>
                                        (e.target.value = e.target.value.replace(/\D/g, ""))
                                    }
                                    onChange={(e) => handleInputChange(e.target.value, "rw")}
                                    disabled={type === 'update'}

                                />
                            </FormItem>
                            <FormItem
                                label={'Type'}
                                name={'type'}
                                rules={[
                                    {
                                        message: "Please input your Type!",
                                        required: true,
                                    },
                                ]}
                            >
                                <SelectComponent disabled={type === 'update'}>
                                    {data_type?.map(item => (
                                        <Select.Option value={item?.value}>{item?.name}</Select.Option>
                                    ))}
                                </SelectComponent>
                            </FormItem>
                            <FormItem label={'Additional Note'} name={'additionalInfo'}>
                                <InputComponent
                                    onChange={(e) => handleInputChange(e.target.value, "additionalInfo")}
                                    onInput={onInputUpperCase}
                                    disabled={type === 'update'}
                                />
                            </FormItem>
                        </div>
                        <FormItem label={'Description'} name={'description'}>
                            <InputComponent type={'textarea'} />
                        </FormItem>
                        <div className="col-span-3">
                            <p>
                                Address <span className="font-bold text-red-600">*</span>
                            </p>
                            <p>{(fullAddress || "").toUpperCase()}</p>
                        </div>
                        <span className="text-primary uppercase font-bold">
                            ADDRESS COORDINATE
                        </span>

                        <div className="w-full grid grid-cols-4 gap-2 pt-[30px]">
                            <Form.Item
                                label="Source"
                                name="source"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your Source",
                                    },
                                ]}
                            >
                                <SelectComponent onChange={e => setSelectedMaps(e)}>
                                    {/* {data_productName &&
                  data_productName?.map((data) => (
                    <Select.Option key={data.value} value={data.value}>
                      {data.name}
                    </Select.Option>
                  ))} */}
                                    <Select.Option key={1} value={"Google Maps"}>
                                        Google Maps
                                    </Select.Option>
                                </SelectComponent>
                            </Form.Item>
                            <Form.Item
                                label="Longitude"
                                name="longitude"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input longitude on maps!",
                                    },
                                ]}
                            >
                                <InputComponent disabled />
                            </Form.Item>
                            <Form.Item
                                label="Latitude"
                                name="latitude"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input latitude on maps!",
                                    },
                                ]}
                            >
                                <InputComponent disabled />
                            </Form.Item>
                            <Form.Item label="Altitude" name="altitude">
                                <InputComponent disabled />
                            </Form.Item>
                        </div>

                        <div className={"w-full grid grid-cols-1 gap-2"}>
                            <span className="text-primary">Pinpoint address coordinate</span>
                            <div className="w-full">
                                {RenderMaps}
                            </div>
                        </div>
                    </BaseContainer>
                    <div className='w-full my-5 flex gap-5'>
                        <ButtonComponent
                            icon={
                                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
                            }
                            type="submit"
                            onClick={() => setModalBack(true)}
                        >
                            Back
                        </ButtonComponent>
                        <div className={"w-full flex justify-end gap-2"}>
                            <ButtonComponent
                                icon={
                                    <SVGIcon
                                        name={
                                            type === "update" ? `IconButtonReset` : `IconButtonClear`
                                        }
                                        width={24}
                                    />
                                }
                                type="submit"
                                onClick={handleReset}
                            >
                                {type === "update" ? "Reset" : "Clear"}
                            </ButtonComponent>
                            <Form.Item>
                                <ButtonComponent type="submit" htmlType={"submit"}>
                                    Save
                                </ButtonComponent>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Spin>
            <ModalCustom
                isOpen={openConfirmation}
                handleCancel={handleCancel}
                type={'confirmation'}
                width={900}
                header={'confirmation'}
                footer={[
                    <div key="footer" className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                        <ButtonComponent
                            onClick={handleCancel}
                            type="default"
                        >
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            onClick={handleSave}
                            type={'submit'}
                        >
                            Confirm
                        </ButtonComponent>
                    </div>
                ]}
            >
                <div>
                    <div className="text-primary text-xs font-bold uppercase py-4">
                        address information
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'Country'}>{
                            data_country?.filter(item => (item?.value === body?.body?.countryId))[0]?.name
                        }</DetailText>
                        <DetailText label={'Province'}>{
                            data_province?.filter(item => (item?.value === body?.body?.provinceId))[0]?.name
                        }</DetailText>
                        <DetailText label={'City'}>{
                            data_city?.filter(item => (item?.value === body?.body?.cityId))[0]?.name

                        }</DetailText>
                        <DetailText label={'District'}>{
                            data_district?.filter(item => (item?.value === body?.body?.districtId))[0]?.name
                        }</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'Sub District'}>{
                            data_sub_district?.filter(item => (item?.value === body?.body?.subDistrictId))[0]?.name
                        }</DetailText>
                        <DetailText label={'Postal Code'}>{
                            data_postal_code?.filter(item => (item?.value === body?.body?.postalCodeId))[0]?.name

                        }</DetailText>
                        <DetailText label={'Building'}>{body?.body?.building}</DetailText>
                        <DetailText label={'Floor'}>{body?.body?.floor}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'House Name'}>{body?.body?.houseName}</DetailText>
                        <DetailText label={'Street Name'}>{body?.body?.streetName}</DetailText>
                        <DetailText label={'Block'}>{body?.body?.block}</DetailText>
                        <DetailText label={'House Number'}>{body?.body?.houseNumber}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'RT'}>{body?.body?.neighborhood1}</DetailText>
                        <DetailText label={'RW'}>{body?.body?.neighborhood2}</DetailText>
                        <DetailText label={'Type'}>{

                            data_type?.filter(item => (item?.value === body?.body?.type))[0]?.name
                        }</DetailText>
                        <DetailText label={'Additional Note'}>{body?.body?.additionalInfo}</DetailText>
                    </div>
                    <div className='w-full grid grid-cols-1'>
                        <DetailText label={'Address'}>{fullAddress}</DetailText>
                        <DetailText label={'Description'}>{body?.body?.description}</DetailText>
                    </div>
                    <div className="text-primary text-xs font-bold uppercase py-4">
                        address coordinate
                    </div>
                    <div className='w-full grid grid-cols-4'>
                        <DetailText label={'Source'}>{body?.body?.source}</DetailText>
                        <DetailText label={'Longitude'}>{body?.body?.longitude}</DetailText>
                        <DetailText label={'Lattitude'}>{body?.body?.latitude}</DetailText>
                        <DetailText label={'Attitude'}>{body?.body?.attitude}</DetailText>
                    </div>
                    <div className='w-full'>
                        <GoogleMapsCustom
                            zoom={13}
                            selectedLocation={selectedLocationCreateNew}
                        // onMapClick={onMapClick}
                        />
                    </div>
                </div>

            </ModalCustom>
            {/** Modal Retry */}
            {renderModal()}

            {/* Modal Back */}
            <ModalBack
                isOpen={modalBack}
                handleCancel={() => setModalBack(false)}
                handleOk={() => navigate(-1)}
            />
        </LayoutMenu>
    );
}

export default FormAddresses;
