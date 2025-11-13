import React,{useState, useEffect, useRef} from 'react'
import moment from 'moment'
import { getColumnSearchProps } from "../../../../../../../../utils/getColumnSearchProps";

import BaseContainer from '../../../../../../../../components/BaseContainer'
import GridLayout from '../../../../../../../../components/GridLayout'
import DetailText from '../../../../../../../../components/DetailText'
import RadioTabs from '../../../../../../../../components/RadioTabs'
import Pricing from './Pricing'
import LateCharge from './LateCharge'
import CalculationRule from './CalculationRule'
import TermOfService from './TermOfService'
import { dateFormatting, hasValue, renderColumn } from '../../../../../../../../utils'
import TaxImplication from './TaxImplication'
import Attachment from '../Attachment';
import { sorterFunction } from '../../../../../../../../utils/sorterFunction';
import TablePaginationNew from '../../../../../../../../components/TablePaginationNew';

const ServiceAgreementDetailCompoment = ({data, dataDraft}) => {

  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [search, setSearch ] = useState({});

  useEffect(() => {
    if(data?.saDetail){
      setTotalElement(data?.saDetail?.length)
      let modifyData = data?.saDetail.map(item=> {
        return {
          ...item,
          value: item.value !== null ? item.value.toString() : '',
        }
      })
      setDataTable(modifyData)
    }
  }, [data?.saDetail])
  
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const filterDataByPage = () => {
    const excludedIds = [paymentTypeId, chargingMethodId]
    const tempProductWithoutTwoNameProduct = dataTable.filter(item => !excludedIds.includes(item.nameId))
    let result = [...tempProductWithoutTwoNameProduct];
    if (searchedColumn) {
      const fixSearchText = searchText?.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase()?.includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const dataAttachment = (data?.attachment || []).map(
    (item) => {
      return {
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.type,
        category: item.fileCategoryName,
        categoryName: item.categoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        uploadBy: item.createdBy,
        uploadDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY HH:mm:ss")
          : "",
        dataType: "exist",
      };
    }
  );

  const listSectionSection= [
    { value: "Pricing" },
    { value: "Calculation Rule" },
    { value: "Term of Service" },
    { value: "Late Charge" },
    { value: "Tax Implication" },
  ];
  const dataTabs = {
    pricing: "Pricing",
    calculationRule: "Calculation Rule",
    tos: "Term of Service",
    lateCharge: "Late Charge",
    taxImplication: "Tax Implication",
  };
  const [typeTabSection, setTypeTabSection] = useState(
    listSectionSection[0].value
  );
  const handleChangeTab = (e) => {
    setTypeTabSection(e.target.value);
  };
  const renderSection = () => {
    switch (typeTabSection) {
      case dataTabs.pricing:
        return <Pricing data={data}/>;
      case dataTabs.calculationRule:
        return <CalculationRule data={data}/>;
      case dataTabs.tos:
        return <TermOfService data={data}/>;
      case dataTabs.lateCharge:
        return <LateCharge data={data}/>;
      case dataTabs.taxImplication:
        return <TaxImplication data={data}/>;
      default:
        return <></>;
    }
  };

  const columns = ({
    search,
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn = "",
    searchText = "",
    handleSearch = () => {},
  }) => {
    const result = [
      {
        title: "NO",
        width: 25,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "NAME",
        dataIndex: "name",
        width: 150,
        sorter: (a, b) => sorterFunction('name', a,b),
        ...getColumnSearchProps(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => renderColumn('name', hasValue(search['name']), searchText, text, false, 'input', search)
      },
      {
        title: "VALUE",
        dataIndex: "value",
        width: 150,
        sorter: (a, b) => sorterFunction('value', a, b, 'number'),
        align: 'right',
        ...getColumnSearchProps(
          "value",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => renderColumn('value', hasValue(search['value']), searchText, text, false, 'input', search)
      },
      {
        title: "UNIT",
        dataIndex: "unit",
        width: 150,
        sorter: (a, b) => sorterFunction('unit', a, b),
        ...getColumnSearchProps(
          "unit",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => renderColumn('unit', hasValue(search['unit']), searchText, text, false, 'input', search)
      },
      {
        title: "DESCRIPTION",
        width: 150,
        sorter: (a, b) => sorterFunction("description", a, b),
        dataIndex: "description",
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchProps(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
      },
    ]

    return result;
  }

  // Start DDL Product Selected
  const paymentTypeId = 210;
  const chargingMethodId = 214;
  const hasIdpaymentTypeId = dataTable?.filter(item => item?.nameId === paymentTypeId);
  const haschargingMethodId = dataTable?.filter(item => item?.nameId === chargingMethodId);
  // End DDL Product Selected

  return (
    <div>
      {/* SA DETAIL VIEW */}
      <BaseContainer header={"SERVICE AGREEMENT DETAIL"} >
        
        {/* ====== SA Origin ====== */}
        <div >
          <GridLayout cols={4}>
            {data?.saInfo?.productVersionId && (
              <>
                <DetailText label={"Product"}>{data?.saInfo?.productName}</DetailText>
                <DetailText label={"Product Type"}>{data?.saInfo?.productType}</DetailText>
              </>
            )}
            <DetailText label={"Service Type"}>{data?.saInfo?.saServiceType}</DetailText>
            {data?.saInfo?.productVersionId && (
              <>
                <DetailText label={"Product Class"}>{data?.saInfo?.productClass}</DetailText>
                <DetailText label={"Product Version"}>{data?.saInfo?.productVersion}</DetailText>
              </>
            )}
            <DetailText label={"Create From"}>{data?.saInfo?.isCustom === "Y" ? "Product" : data?.saInfo?.isCustom  === null ? "": "Custom"}</DetailText>
          </GridLayout>

          <div className={"w-full py-6"}>
            <GridLayout cols={2}>
              <div>
                <div className='text-primary text-xs font-bold uppercase pb-6'>
                  PAYMENT TYPE
                </div>
                <DetailText label={"Payment Type"}>{hasIdpaymentTypeId[0]?.unit}</DetailText>
              </div>
              <div>
                <div className='text-primary text-xs font-bold uppercase pb-6'>
                  CHARGING METHOD
                </div>
                <DetailText label={"Charging Method"}>{haschargingMethodId[0]?.unit}</DetailText>
              </div>
            </GridLayout>
            {/* Table Service Agreement Detail */}
            <TablePaginationNew
              type='FE'
              pageSize={pageSize}
              current={page}
              dataSource={dataTable.filter(item => ![paymentTypeId, chargingMethodId].includes(item.nameId))}
              tableScrolled={{y: 525, x: 1000 }}
              totalData={totalElement}
              onChange={handleChangeSize}
              onSort={onSort}
              columns={columns({
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
              })}
            />
          </div>

          <div className='pt-6 pb-4'>
            <span>
              <RadioTabs 
                currentPosition={typeTabSection}
                data={listSectionSection} 
                onChange={handleChangeTab}
              />
            </span>
          </div>

          {renderSection()}

        </div>
      </BaseContainer>

      <BaseContainer header={"Attachment"}>
        <Attachment dataSource={dataAttachment}/>
      </BaseContainer>

      {/* History Log Information */}
      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label={"Record ID"}>
          {data?.saHistory?.saId}
          </DetailText>
          <DetailText label={"Created Date"}>
            {data?.saHistory?.createdDate ? moment(data?.saHistory?.createdDate).format(dateFormatting.dateTime) : ''}
          </DetailText>
          <DetailText label={"Created By"}>
          {data?.saHistory?.createdBy}
          </DetailText>
          <DetailText label={"Updated Date"}>
            {data?.saHistory?.updateDate ? moment(data?.saHistory?.updateDate).format(dateFormatting.dateTime) : ''}
          </DetailText>
          <DetailText label={"Updated By"}>
          {data?.saHistory?.updatedBy}
          </DetailText>
        </div>
      </BaseContainer>
    </div>
  )
}

export default ServiceAgreementDetailCompoment