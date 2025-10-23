import { Fragment, useState } from "react";
import React, { useEffect, useRef } from "react";
import DetailText from "../../../../../../components/DetailText";
import CardComponent from "../../../../../../components/Card/CardComponent";
import moment from "moment";
import { dateFormatting, renderColumn, toTitleCase } from "../../../../../../utils";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../components/StatusComponent";

const CustomerContactDetail = ({ data_detail = {} }) => {
  // const { data_detail, loading} = useSelector(
  //   (state) => state.tos
  // );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});


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

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const columns = [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "inputTypeName",
      width: 150,
      sorter: (a, b) => sorterFunction('inputTypeName', a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "inputTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => {
        return renderColumn('inputTypeName', searchedColumn, searchText, text, false, 'input', search)

      }
    },
    {
      title: "VALUE",
      dataIndex: "fullValue",
      width: 150,
      sorter: (a, b) => sorterFunction('fullValue', a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fullValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => {
        return renderColumn('fullValue', searchedColumn, searchText, text, false, 'input', search)

      }
    },

  ];


  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  return (
    <Fragment>
      <CardComponent header={"CONTACT INFORMATION"} cols={3}>
        <DetailText label="First Name">{data_detail?.firstName}</DetailText>
        <DetailText label="Middle Name">{data_detail?.middleName}</DetailText>
        <DetailText label="Last Name">{data_detail?.lastName}</DetailText>
        <DetailText label="Job">{data_detail?.jobName}</DetailText>
        <DetailText label="Position">{data_detail?.positionName}</DetailText>
      </CardComponent>

      <div className="mb-6">
        <div className="text-primary text-xs font-semibold uppercase py-[30px]">CONTACT DETAIL INFORMATION</div>
        <TablePaginationNew
          type='FE'
          useSelect
          pageSize={pageSize}
          current={page}
          dataSource={data_detail?.contactDetails}
          tableScrolled={{ y: 625 }}
          onChange={handleChangeDetail}
          columns={columns}
        />
      </div>

      <CardComponent header={"CONTACT PURPOSE INFORMATION"} cols={2}>
        <DetailText label="Contact Address">{data_detail?.contactAddress}</DetailText>
        <DetailText label="Contact Address Additional Note">{data_detail?.additionalNote}</DetailText>
        <DetailText label="Description">{data_detail?.description}</DetailText>
        <DetailText label="Primary">
          <div className="w-1/4">

          <StatusComponent colour={data_detail?.primaryFlagValue ? "primary" : "non primary"}>
          {data_detail?.primaryFlagValue ? "Primary" : "Non Primary"}
          </StatusComponent>
          </div>
        </DetailText>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">{data_detail?.accountContactId}</DetailText>
        <DetailText label="Created Date">{moment(data_detail?.cretedDate).format(dateFormatting.dateTime)}</DetailText>
        <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
        <DetailText label="Updated Date">{data_detail?.updatedDate !== null ? moment(data_detail?.updatedDate).format(dateFormatting.dateTime) : ""}</DetailText>
        <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
      </CardComponent>
    </Fragment>
  );
};
export default CustomerContactDetail;
