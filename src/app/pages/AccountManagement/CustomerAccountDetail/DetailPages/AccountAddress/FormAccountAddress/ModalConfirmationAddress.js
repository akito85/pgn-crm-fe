import React from 'react'
import ModalCustom from '../../../../../../../components/Modal/ModalCustom'
import ButtonComponent from '../../../../../../../components/ButtonComponent'
import DetailText from '../../../../../../../components/DetailText'

const ModalConfirmationAddress = ({
  isOpen,
  closeModal = () => { },
  modalCreateNewAddress = () => { },
  handleConfirmation = () => { },
  dataToSend,
  dataCountry,
  dataProvince,
  dataCity,
  dataDistrict,
  dataSubdistrict,
  dataPostalcode,
  dataBusiness,
  dataType,
  setModalCheckPrimaryExist,
  setTypeValidation
}) => {
  const handleCloseModal = () => {
    closeModal((prevState) => prevState = false)
    setModalCheckPrimaryExist(false);
    setTypeValidation(false);
  }
  const handleOpenModalCreateAddress = () => {
    modalCreateNewAddress((prevState) => prevState = true)
  }

  const getCountryName = (val) => {
    const countryName = dataCountry && dataCountry?.data?.filter((item) => item?.id === val)
    if (countryName === undefined) {
      return ''
    }
    if (countryName.length !== 0) {
      return countryName[0].name
    }
  }
  const getProvinceName = (val) => {
    const provinceName = dataProvince && dataProvince?.data?.filter((item) => item?.id === val)
    if (provinceName === undefined) {
      return ''
    }
    if (provinceName.length !== 0) {
      return provinceName[0].name
    }
  }
  const getCityName = (val) => {
    const cityName = dataCity && dataCity?.data?.filter((item) => item?.id === val)
    if (cityName === undefined) {
      return ''
    }
    if (cityName.length !== 0) {
      return cityName[0].name
    }
  }
  const getDistrictName = (val) => {
    const districtName = dataDistrict && dataDistrict?.data?.filter((item) => item?.id === val)
    if (districtName === undefined) {
      return ''
    }
    if (districtName.length !== 0) {
      return districtName[0].name
    }
  }
  const getSubDistrictName = (val) => {
    const subDistrictName = dataSubdistrict && dataSubdistrict?.data?.filter((item) => item?.id === val)
    if (subDistrictName === undefined) {
      return ''
    }
    if (subDistrictName.length !== 0) {
      return subDistrictName[0].name
    }
  }
  const getPostalCodeName = (val) => {
    const postalCodeName = dataPostalcode && dataPostalcode?.data?.filter((item) => item?.id === val)
    if (postalCodeName === undefined) {
      return ''
    }
    if (postalCodeName.length !== 0) {
      return postalCodeName[0].name
    }
  }
  const getBusiness = (val) => {
    const postalCodeName = dataBusiness && dataBusiness?.filter((item) => item?.id === val)
    if (postalCodeName === undefined) {
      return ''
    }
    if (postalCodeName.length !== 0) {
      return postalCodeName[0].name
    }
  }
  const getTypeName = (val) => {
    const typeName = dataType && dataType?.filter((item) => item?.id === val)
    if (typeName === undefined) {
      return ''
    }
    if (typeName.length !== 0) {
      return typeName[0].name
    }
  }
  return (
    <div>
      <ModalCustom
        header={"CONFIRMATION"}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={handleCloseModal}
        width={800}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={() => {
                handleCloseModal();
                handleOpenModalCreateAddress();
                setModalCheckPrimaryExist(false);
                setTypeValidation(false);
              }}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              border={false}
              onClick={handleConfirmation}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div>
          {/* SECTION ADDRESS INFORMATION */}
          <p className="text-primary uppercase font-bold">ADDRESS INFORMATION</p>
          <div className={'w-full grid grid-cols-4 gap-5'}>
            <DetailText label={"Country"}>{getCountryName(dataToSend?.countryId)}</DetailText>
            <DetailText label={"Province"}>{getProvinceName(dataToSend?.provinceId)}</DetailText>
            <DetailText label={"City"}>{getCityName(dataToSend?.cityId)} </DetailText>
            <DetailText label={"District"}>{getDistrictName(dataToSend?.districtId)}</DetailText>
            <DetailText label={"Sub District"}>{getSubDistrictName(dataToSend?.subDistrictId)}</DetailText>
            <DetailText label={"Postal Code"}>{getPostalCodeName(dataToSend?.postalCodeId)}</DetailText>
            <DetailText label={"Building"}>{dataToSend?.building}</DetailText>
            <DetailText label={"Floor"}>{dataToSend?.floor}</DetailText>
            <DetailText label={"House Name"}>{dataToSend?.houseName}</DetailText>
            <DetailText label={"Street Name"}>{dataToSend?.streetName}</DetailText>
            <DetailText label={"Block"}>{dataToSend?.block}</DetailText>
            <DetailText label={"House Number"}>{dataToSend?.houseNumber}</DetailText>
            <DetailText label={"RT"}>{dataToSend?.rt}</DetailText>
            <DetailText label={"RW"}>{dataToSend?.rw}</DetailText>
            <DetailText label={"Type"}>{getTypeName(dataToSend?.typeId)}</DetailText>
            <DetailText label={"Additional Note"}>{dataToSend?.additionalInfo}</DetailText>
          </div>
          <div className={'w-full grid grid-cols-1 gap-5'}>
            <DetailText label={"Address"}>{(dataToSend?.address || "").toUpperCase()}</DetailText>
          </div>
          <div className={'w-full grid grid-cols-1 gap-5'}>
            <DetailText label={"Description"}>{dataToSend?.descAddress}</DetailText>
          </div>

          {/* SECTION ADDRESS COORDINATE */}
          <p className="text-primary uppercase font-bold pt-4">ADDRESS COORDINATE</p>
          <div className={'w-full grid grid-cols-4 gap-5'}>
            <DetailText label={"Source"}>{dataToSend?.source}</DetailText>
            <DetailText label={"Longitude"}>{dataToSend?.longitude}</DetailText>
            <DetailText label={"Latitude"}>{dataToSend?.latitude}</DetailText>
            <DetailText label={"Altitude"}>{""}</DetailText>
          </div>

          {/* SECTION ADDRESS PURPOSE INFORMATION */}
          <p className="text-primary uppercase font-bold pt-4">ADDRESS PURPOSE INFORMATION</p>
          <div className={'w-full grid grid-cols-4 gap-5'}>
            <DetailText label={"Premise"}>{dataToSend?.premiseFlag ? 'Yes' : 'No'}</DetailText>
            <DetailText label={"Primary"}>{dataToSend?.primaryFlag ? 'Yes' : 'No'}</DetailText>
            {/* <DetailText label={"Business Purpose"}>{dataToSend?.businessPurpose?.map((item, index) =>(
              <span>{`${getBusiness(item)} ${index > 0 ? ", " : ""}`} </span>
            )
            )}</DetailText> */}
            {/* <div className='grid col-span-2'> */}
              <DetailText label={"Remark"}>{dataToSend?.descAccountAddress}</DetailText>
            {/* </div> */}
          </div>
        </div>
      </ModalCustom>
    </div>
  )
}

export default ModalConfirmationAddress