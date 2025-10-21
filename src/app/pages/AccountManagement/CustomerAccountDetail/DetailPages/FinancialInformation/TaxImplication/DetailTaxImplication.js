import React, { useState, useEffect, useRef } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../../components/DetailText";
import { hasValue, dateFormatting } from "../../../../../../../utils";
import moment from "moment";
import TablePagination from "../../../../../../../components/TablePagination";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";

const expandedRowRender = (record) => {
  const dataExpand = record.listRuleOvrCondition;

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "CONDITION NAME",
      dataIndex: "conditionName",
    },
    {
      title: "OPERATOR",
      dataIndex: "operator",
    },
    {
      title: "DATA TYPE",
      dataIndex: "dataType",
    },
    {
      title: "VALUE",
      dataIndex: "value",
    },
  ];
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">
        TAX IMPLICATION OVERIDE
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={dataExpand}
        columns={columns}
        tableScrolled={{
          x: 1000,
        }}
      />
    </div>
  );
};

const DetailTaxImplication = ({
  setModalDetail,
  modalDetail,
  detail_taxImplication = {},
}) => {
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  useEffect(() => {
    if (
      detail_taxImplication?.listRuleOvr &&
      detail_taxImplication?.listRuleOvr?.length > 0
    ) {
      const dataModif = detail_taxImplication?.listRuleOvr.map((a, index) => ({
        ...a,
        key: index + 1,
        listRuleOvrCondition: a.listRuleOvrCondition?.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(dataModif);
    }
  }, [detail_taxImplication]);

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const onSort = (_, __, sort) => {
    const dataOrder = sort.order === "ascend" ? "asc" : "desc";
    const dataSort = sort.order ? `${sort.field}~${dataOrder}` : "";
    setSort(dataSort);
  };

  const columns = [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "IMPLICATION",
      dataIndex: "implicationType",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "implicationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "TRANSACTION CODE",
      dataIndex: "transCode",
      width: 80,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "jobName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
  ];

  return (
    <ModalCustom
      header={"DETAIL TAX IMPLICATION"}
      isOpen={modalDetail}
      handleCancel={() => {
        setModalDetail(false);
      }}
      type={"detail"}
      width={900}
      footer={
        <ButtonComponent
          type={"default"}
          onClick={() => {
            setModalDetail(false);
          }}
        >
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"TAX IMPLICATION INFORMATION"} cols={1}>
        <div className="grid grid-cols-4 gap-y-2.5">
          <DetailText label="Category">
            {detail_taxImplication?.category}
          </DetailText>
          <DetailText label="Tax Implication Name">
            {detail_taxImplication?.name}
          </DetailText>
          <DetailText label="Service Type">
            {detail_taxImplication?.serviceType}
          </DetailText>
          <DetailText label="Implication Type">
            {detail_taxImplication?.type}
          </DetailText>
          <DetailText label="Gunggung">
            {detail_taxImplication?.gunggung}
          </DetailText>
          <DetailText label="VAT Invoice Issuance">
            {detail_taxImplication?.VatInv}
          </DetailText>
          <DetailText label="Transaction Code">
            {detail_taxImplication?.transCode}
          </DetailText>
          <DetailText label="Description">
            {detail_taxImplication?.description}
          </DetailText>
        </div>
      </CardComponent>

      <div className={"w-full"}>
        <TablePagination
          dataSource={
            detail_taxImplication &&
            detail_taxImplication?.listRuleOvr?.length === 0
              ? null
              : dataTable
          }
          columns={columns}
          pageSize={pageSize}
          current={page}
          expandable={{ expandedRowRender }}
          totalData={detail_taxImplication?.listRuleOvr?.length}
          onChange={handleChangeSize}
          onSort={onSort}
          tableScrolled={{ x: 1000 }}
        />
      </div>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={1}>
        <div className="grid grid-cols-5 gap-y-2.5">
          <DetailText label="Record Id">{detail_taxImplication?.id}</DetailText>
          <DetailText label="Created Date">
            {hasValue(detail_taxImplication?.createdDate)
              ? moment(detail_taxImplication?.createdDate).format(
                  dateFormatting.dateTime,
                )
              : ""}
          </DetailText>
          <DetailText label="Created By">
            {hasValue(detail_taxImplication?.createdBy)
              ? detail_taxImplication?.createdBy
              : ""}
          </DetailText>
          <DetailText label="Updated Date">
            {hasValue(detail_taxImplication?.UpdateDate)
              ? moment(detail_taxImplication?.UpdateDate).format(
                  dateFormatting.dateTime,
                )
              : ""}
          </DetailText>
          <DetailText label="Updated By">
            {hasValue(detail_taxImplication?.updatedBy)
              ? detail_taxImplication?.updatedBy
              : ""}
          </DetailText>
        </div>
      </CardComponent>
    </ModalCustom>
  );
};

export default DetailTaxImplication;
