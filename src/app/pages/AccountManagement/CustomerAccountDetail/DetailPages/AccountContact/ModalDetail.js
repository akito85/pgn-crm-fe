import React, { useRef, useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import moment from "moment";
import { dateFormatting, renderColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";

const ModalDetail = ({ isOpen, closeModal = () => {}, dataDetail }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const handleCloseModal = () => {
    closeModal(false);
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
  const columns = [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: (a, b) =>
        sorterFunction("type", a?.type?.label, b?.type?.label, "select"),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => {
        return renderColumn(
          "type",
          searchedColumn,
          searchText,
          text?.label,
          false,
          "input",
          search,
        );
      },
    },
    {
      title: "VALUE",
      dataIndex: "contactValue",
      width: 150,
      sorter: (a, b) => sorterFunction("contactValue", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "contactValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) => {
        return renderColumn(
          "contactValue",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        );
      },
    },
  ];

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  return (
    <ModalCustom
      header={"Detail Contact"}
      isOpen={isOpen}
      handleCancel={() => {
        handleCloseModal();
      }}
      type={"detail"}
      width={1000}
      footer={
        <ButtonComponent
          type={"default"}
          onClick={() => {
            handleCloseModal();
          }}
        >
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"CONTACT INFORMATION"} cols={3}>
        <DetailText label="First Name">
          {dataDetail?.contact?.firstName}
        </DetailText>
        <DetailText label="Middle Name">
          {dataDetail?.contact?.middleName}
        </DetailText>
        <DetailText label="Last Name">
          {dataDetail?.contact?.lastName}
        </DetailText>
        <DetailText label="Job">{dataDetail?.contact?.jobName}</DetailText>
        <DetailText label="Position">
          {dataDetail?.contact?.positionName}
        </DetailText>
      </CardComponent>

      <div className="mb-6">
        <div className="text-primary text-xs font-semibold uppercase py-[30px]">
          CONTACT DETAIL INFORMATION
        </div>
        <TablePaginationNew
          type="FE"
          useSelect
          pageSize={pageSize}
          current={page}
          dataSource={dataDetail?.contact?.contactDetail}
          tableScrolled={{ y: 625 }}
          onChange={handleChangeDetail}
          columns={columns}
        />
      </div>

      <CardComponent header={"CONTACT PURPOSE INFORMATION"} cols={2}>
        <DetailText label="Contact Address">
          {dataDetail?.contactAddress}
        </DetailText>
        <DetailText label="Contact Address Additional Note">
          {dataDetail?.additionalNote}
        </DetailText>
        <DetailText label="Description">{dataDetail?.description}</DetailText>
        <DetailText label="Primary">
          {dataDetail?.primaryFlagValue ? "Yes" : "No"}
        </DetailText>
      </CardComponent>
      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">
          {dataDetail?.accountContactId}
        </DetailText>
        <DetailText label="Created Date">
          {moment(dataDetail?.cretedDate).format(dateFormatting.dateTime)}
        </DetailText>
        <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
        <DetailText label="Updated Date">
          {dataDetail?.updatedDate !== null
            ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
      </CardComponent>
    </ModalCustom>
  );
};

export default ModalDetail;
