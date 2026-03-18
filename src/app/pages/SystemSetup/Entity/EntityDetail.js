import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Spin,
  Image,
} from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";

import {
  UnorderedListOutlined,
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import StatusComponent from "../../../../components/StatusComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getDetailEntity,
  getDetailTaxEntity,
} from "../../../../redux/slices/system_setup/entity";
import { dateFormatting, hasValue, renderColumn, renderDateColumn, toTitleCase } from "../../../../utils";
import moment from "moment";
import TaxIdentifierDetail from "./TaxIdentifierDetail";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { intToNPWP } from "../../../../utils/npwp";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import TablePaginationNew from "../../../../components/TablePaginationNew";


const EntityDetail = () => {
  const dispatch = useDispatch();
  const { data, loading, data_detail, data_tax } = useSelector(
    (state) => state.entity
  );
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const datas = data?.data;
  const [currentTax, setCurrentTax] = useState(1);
  const [sizeTax, setSizeTax] = useState(10);
  const [currentLog, setCurrentLog] = useState(1);
  const [sizeLog, setSizeLog] = useState(10);
  const [openDetailTI, setOpenDetailTI] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [typeColumn, setTypColumn] = useState("string");
  const searchInput2 = useRef(null);
  const [search2, setSearch2] = useState({});
  const [searchedColumn2, setSearchedColumn2] = useState("");
  const [typeColumn2, setTypColumn2] = useState("string");
  const [searchText2, setSearchText2] = useState("");
  useEffect(() => {
    if (id) {
      dispatch(getDetailEntity(id));
    }
  }, []);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    switch (dataIndex) {
      case 'startDate':
      case 'endDate':
        setTypColumn('date')
        break;
      case 'isMain':
        setTypColumn('status')
        break;
      default:
        setTypColumn('string')
        break;
    }
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentTax(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };


  const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
    confirm();
    switch (dataIndex) {
      case 'createdDate':
        setTypColumn2('date')
        break;
      case 'isMain':
        setTypColumn2('status')
        break;
      default:
        setTypColumn2('string')
        break;
    }
    setSearchText2(selectedKeys[0]);
    setSearchedColumn2(dataIndex);
    setSearch2((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentLog(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };
  const handleOpenDetailTI = async (r) => {
    await dispatch(getDetailTaxEntity(r)).unwrap();
    setOpenDetailTI(true);
  };
  const updatePaginationActivationLog = (type = "data") => {
    let result = [...(datas?.activeInactiveLog || [])];
    if (searchedColumn2) {
      const fixSearchText = searchText2.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn2 === "createdDate") {
          const tempDate =
            moment(item[searchedColumn2]).format(dateFormatting.dateTime) || "";
          return tempDate?.toLowerCase().includes(fixSearchText);
        } else {
          return item[searchedColumn2]?.toLowerCase().includes(fixSearchText);
        }
      });
    }
    const fix = result.slice((currentLog - 1) * sizeLog, currentLog * sizeLog);
    return type === "data" ? fix : result.length;
  };
  const updatePaginationTax = (type = "data") => {
    let result = [...(datas?.taxIdentifierList || [])];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        switch (searchedColumn) {
          case "startDate":
          case "endDate":
            const tempDate =
              moment(item[searchedColumn])?.format(dateFormatting.date) || "";
            return tempDate?.toLowerCase().includes(fixSearchText);
          case "taxNumber":
            const temp = item[searchedColumn]
              ? intToNPWP(item[searchedColumn])
              : "";
            return temp?.toLowerCase().includes(fixSearchText);
          case "isMain":
            const tempMain = item[searchedColumn] ? "Primary" : "Non-Primary";
            return tempMain?.toLowerCase().includes(fixSearchText);
          default:
            return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
        }
      });
    }
    const fix = result.slice((currentTax - 1) * sizeTax, currentTax * sizeTax);
    return type === "data" ? fix : result.length;
  };

  const columnsTI = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "TAX IDENTIFIER",
      dataIndex: "taxNumber",
      align: "left",
      sorter: (a, b) => a.taxNumber - b.taxNumber,
      ...getColumnSearchProps(
        "taxNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('taxNumber', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      width: 200,
      sorter: (a, b) => {
        return new Date(a.startDate) - new Date(b.startDate);
      },
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'date'
      ),
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      width: 200,
      sorter: (a, b) => {
        return new Date(a.endDate) - new Date(b.endDate);
      },
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        'date'
      ),
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "remark",
      align: "left",
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      ...getColumnSearchProps(
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "PRIMARY",
      dataIndex: "isMain",
      width: 160,
      align: "center",
      ...getColumnSearchProps(
        "isMain",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      sorter: (a, b) => sorterFunction('isMain', a, b),
      render: (isMain, record, index, ngasal) => {
        const pilsColor = isMain.toLowerCase() === "primary" ? "primary" : "non-primary";
        return (
          <StatusComponent colour={pilsColor}>{isMain}</StatusComponent>
        )
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      align: "center",
      fixed: "right",
      sorter: (a, b) => sorterFunction('status', a, b),
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r) => {
        return (
          <ButtonComponent
            border={false}
            icon={<UnorderedListOutlined style={{ fontSize: 24 }} />}
            onClick={() => {
              // setModalInactive(true);
              handleOpenDetailTI(r?.taxId);
            }}
          />
        );
      },
    },
  ];
  const columns_activation = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (currentLog - 1) * sizeLog + index + 1,
    },
    {
      title: "ACTOR",
      dataIndex: "createdBy",
      align: "left",
      // width: 60,
      sorter: (a, b) => (a.createdBy || "").length - (b.createdBy || "").length,
      ...getColumnSearchProps(
        "createdBy",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2
      ),
      render: (text) => renderColumn('createdBy', searchedColumn2, searchText2, text, false, 'input', search2)
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      align: "left",
      // width: 60,
      sorter: (a, b) => sorterFunction('operation', a, b),
      ...getColumnSearchProps(
        "operation",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        true,
        'status'
      ),
      render: (text) => renderColumn('operation', searchedColumn2, searchText2, text, false, 'input', search2)
    },
    {
      title: "ACTION DATE",
      dataIndex: "createdDate",
      align: "center",
      // width: 60,
      sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
      ...getColumnSearchProps(
        "createdDate",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        true,
        'datetime'
      ),
      render: (v) => renderDateColumn('createdDate', hasValue(search2['createdDate']), searchText2, v, 'datetime', search2),

    },
    {
      title: "REMARK",
      dataIndex: "remark",
      align: "center",
      // width: 60,
      sorter: (a, b) => sorterFunction('remark', a, b),
      ...getColumnSearchProps(
        "remark",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', searchedColumn2, searchText2, text, true, 'input', search2)
    },
  ];


  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ENTITY,
      breadcrumbName: "Entity",
    },
    {
      path: "",
      breadcrumbName: "Detail Entity",
    },
  ];

  const handleChangeActivationLog = (pageChange, pageSizeChange) => {
    setCurrentLog(sizeLog !== pageSizeChange ? 1 : pageChange);
    setSizeLog(pageSizeChange);
  };
  const handleChangeActivationTax = (pageChange, pageSizeChange) => {
    setCurrentTax(sizeTax !== pageSizeChange ? 1 : pageChange);
    setSizeTax(pageSizeChange);
  };


  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className={"my-5"}>
          <BaseContainer header={"ENTITY INFORMATION"}>
            <div className="grid grid-cols-3 w-full gap-y-2.5 pl-8">
              <DetailText label={"Entity Name"}>{datas?.entityName}</DetailText>
              <DetailText label={"Entity Code"}>{datas?.entityCode}</DetailText>
              <DetailText label={"Entity Email"}>{datas?.email}</DetailText>
              <DetailText label={"Address"}>{datas?.address}</DetailText>
              <DetailText label={"Phone Number"}>{datas?.phone}</DetailText>
              <DetailText label={"Fax Number"}>{datas?.fax}</DetailText>
              <DetailText label={"Status"}>{toTitleCase(datas?.status)}</DetailText>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-2.5 pl-8">
              <div className="mr-5">
                <DetailText label={"Description"}>
                  {datas?.description}
                </DetailText>
              </div>
              <DetailText
                classTextAdditional={
                  "whitespace-nowrap text-ellipsis overflow-hidden"
                }
                label={"Logo"}
              >
                <Image width={80} src={datas?.urlLogo2} className="mt-2" />
              </DetailText>
            </div>
          </BaseContainer>
        </div>
        <div className={"my-5"}>
          <BaseContainer header={"HISTORY LOG INFORMATION"}>
            <div className="grid grid-cols-5 w-full gap-y-2.5 px-8">
              <DetailText label={"Record Id"}>
                {datas?.entityId}
              </DetailText>
              <DetailText label={"Created Date"}>
                {datas?.createdDate &&
                  moment(datas?.createdDate).format(dateFormatting.dateTime)}
              </DetailText>
              <DetailText label={"Created By"}>{datas?.createdBy}</DetailText>
              <DetailText label={"Updated Date"}>
                {datas?.updatedDate &&
                  moment(datas?.updatedDate).format(dateFormatting.dateTime)}
              </DetailText>
              <DetailText label={"Updated By"}>{datas?.updatedBy}</DetailText>
            </div>
          </BaseContainer>
        </div>
        <div className={"my-5"}>
          <BaseContainer header={"TAX IDENTIFIER"}>
            <div className="w-full">
              <TablePaginationNew
                type="FE"
                dataSource={datas?.taxIdentifierList?.map(item => ({ ...item, taxNumber: intToNPWP(item?.taxNumber), isMain: item?.isMain === true ? 'Primary' : 'Non Primary' }))}
                columns={columnsTI}
                current={currentTax}
                pageSize={sizeTax}
                onChange={handleChangeActivationTax}
                // onShowSizeChange={handleChangeActivationTax}
                // totalData={updatePagination(datas?.taxIdentifierList?.map(item => ({ ...item, isMain: item?.isMain === true ? 'Primary' : 'Non Primary' })), 'length', searchedColumn, searchText, currentTax, sizeTax, typeColumn)}
                tableScrolled={{ x: 1500, y: 200 }}
              />
            </div>
          </BaseContainer>
        </div>
        <div className={"my-5"}>
          <BaseContainer header={"ACTIVATE/INACTIVATE LOG"}>
            <div className="w-full">
              <TablePaginationNew
                type="FE"
                dataSource={datas?.activeInactiveLog}
                columns={columns_activation}
                current={currentLog}
                pageSize={sizeLog}
                onChange={handleChangeActivationLog}
                onShowSizeChange={handleChangeActivationLog}
                // totalData={updatePagination(datas?.activeInactiveLog, 'length', searchedColumn2, searchText2, currentLog, sizeLog, typeColumn2)}
                tableScrolled={{
                  x: 1300,
                  y: 500,
                }}
              />
            </div>
          </BaseContainer>
        </div>
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(-1)}
          icon={
            <LeftOutlined
              style={{
                color: "#fff",
                fontSize: 16,
                justifyItems: "center",
              }}
            ></LeftOutlined>
          }
        >
          Back
        </ButtonComponent>
      </Spin>

      <ModalCustom
        width={1000}
        isOpen={openDetailTI}
        handleCancel={() => setOpenDetailTI(false)}
        header={"DETAIL TAX IDENTIFIER"}
      >
        <TaxIdentifierDetail data={data_tax} />
        <div className="flex justify-end">
          <ButtonComponent
            // icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
            onClick={() => setOpenDetailTI(false)}
            border={true}
          >
            Back
          </ButtonComponent>
        </div>
      </ModalCustom>

      {/* modal back */}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>
    </LayoutMenu>
  );
};

export default EntityDetail;
