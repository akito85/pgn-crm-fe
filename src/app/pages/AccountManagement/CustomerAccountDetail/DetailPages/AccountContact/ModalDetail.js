import React,{useRef, useState} from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import moment from 'moment'
import { dateFormatting, renderColumn} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import NxTable from "../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../components/Nx/NxModal";
import { Button } from "antd";
import NxDetailText from "../../../../../../components/Nx/NxDetailText";


const ModalDetail = ({
  isOpen,
  closeModal = () => {} ,
  dataDetail
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});


  const handleCloseModal = () =>{
    closeModal(false)
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
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
      render: (text, object, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: (a, b) => sorterFunction('type', a?.type?.label, b?.type?.label, 'select'),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => {
        return renderColumn('type', searchedColumn, searchText, text?.label, false, 'input', search)

      }
    },
    {
      title: "VALUE",
      dataIndex: "contactValue",
      width: 150,
      sorter: (a, b) => sorterFunction('contactValue', a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "contactValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => {
        return renderColumn('contactValue', searchedColumn, searchText, text, false, 'input', search)

      }
    },
 
  ];


  return (
    <NxModal
      title={"Detail Contact"}
      isOpen={isOpen}
      handleCancel={() => {
        handleCloseModal()
      }}
      width={1000}
      footer={
        <div className="flex justify-end w-full">
          <Button
            type={"menu"}
            onClick={() => {
              handleCloseModal()
            }}
          >
            Back
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-y-4 p-4">

        <NxCardContainer header="CONTACT INFORMATION">
          <div className="grid grid-cols-3 gap-4">
            <NxDetailText label="First Name">{dataDetail?.contact?.firstName}</NxDetailText>
            <NxDetailText label="Middle Name">{dataDetail?.contact?.middleName}</NxDetailText>
            <NxDetailText label="Last Name">{dataDetail?.contact?.lastName}</NxDetailText>
            <NxDetailText label="Job">{dataDetail?.contact?.jobName}</NxDetailText>
            <NxDetailText label="Position">{dataDetail?.contact?.positionName}</NxDetailText>
          </div>
        </NxCardContainer>

        <NxCardContainer header="CONTACT DETAIL INFORMATION">
          <NxTable
            idTable="account-contact-detail-modal-table"
            useSelect
            usePagination={false}
            showAdvanceSearch={false}
            showSearchBar={false}
            dataSource={dataDetail?.contact?.contactDetail}
            totalData={dataDetail?.contact?.contactDetail?.length || 0}
            tableScrolled={{ y: 300, x: "max-content" }}
            columns={columns}
          />
        </NxCardContainer>

        <NxCardContainer header="CONTACT PURPOSE INFORMATION">
          <div className="flex flex-col gap-y-4">
            <div className="grid grid-cols-2 gap-4">
              <NxDetailText label="Contact Address">{dataDetail?.contactAddress}</NxDetailText>
              <NxDetailText label="Contact Address Additional Note">{dataDetail?.additionalNote}</NxDetailText>
              <NxDetailText label="Primary">{dataDetail?.primaryFlagValue ? "Yes" : "No"}</NxDetailText>
            </div>
            <NxDetailText label="Description">{dataDetail?.description}</NxDetailText>
          </div>
        </NxCardContainer>

        <NxCardContainer header="HISTORY LOG INFORMATION">
          <div className="grid grid-cols-5 gap-4">
            <NxDetailText label="Record ID">{dataDetail?.accountContactId}</NxDetailText>
            <NxDetailText label="Created Date">{moment(dataDetail?.cretedDate).format(dateFormatting.dateTime)}</NxDetailText>
            <NxDetailText label="Created By">{dataDetail?.createdBy}</NxDetailText>
            <NxDetailText label="Updated Date">{dataDetail?.updatedDate !== null ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime) : ""}</NxDetailText>
            <NxDetailText label="Updated By">{dataDetail?.updatedBy}</NxDetailText>
          </div>
        </NxCardContainer>

      </div>
    </NxModal>
  );
};

export default ModalDetail;
