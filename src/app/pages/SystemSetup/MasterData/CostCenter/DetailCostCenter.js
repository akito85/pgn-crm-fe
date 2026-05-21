import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { sorterFunction } from "../../../../../utils/sorterFunction";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn, renderDateColumn, renderDateConverter, toTitleCase } from "../../../../../utils";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { Spin } from "antd";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import TablePaginationNew from "../../../../../components/TablePaginationNew";


const DetailCostCenter = (props) => {
  const { data, openModal, closeModal = () => { } } = props;

  const { loading } = useSelector((state) => state.master_cost_center);

  // Declaration
  const searchInput = useRef(null);

  // State
  const [currentLog, setCurrentLog] = useState(1);
  const [sizeLog, setSizeLog] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");


  const handleResetState = useCallback(() => {
    setCurrentLog(1)
    setSizeLog(10)
    setSearchText("")
    setSearchedColumn('')
    setSearch({})
  }, [])

  useEffect(() => {
    if (openModal === false) {
      handleResetState()
    }
  }, [openModal, handleResetState]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setCurrentLog(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setCurrentLog(sizeLog !== pageSizeChange ? 1 : pageChange);
    setSizeLog(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 90,
      render: (text, object, index) => (currentLog - 1) * sizeLog + index + 1,
    },
    {
      title: "ACTOR",
      dataIndex: "createdBy",
      width: 130,
      sorter: (a, b) => sorterFunction('createdBy', a, b),
      filteredValue: hasValue(search?.createdBy) ? [search?.createdBy] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'createdBy',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('createdBy', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      width: 150,
      align:'center',
      sorter: (a, b) => sorterFunction('operation', a, b),
      filteredValue: hasValue(search?.operation) ? [search?.operation] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'operation',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (text) => renderColumn('operation', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACTION DATE",
      dataIndex: "createdDate",
      width: 250,
      align: 'center',
      sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
      filteredValue: hasValue(search?.createdDate) ? [search?.createdDate] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'createdDate',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datetime'
      ),
      render: (value) => renderDateColumn('createdDate', searchedColumn, searchText, value, 'datetime', search)
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 350,
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      filteredValue: hasValue(search?.remark) ? [search?.remark] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'remark',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', searchedColumn, searchText, text, true, 'input', search)
    },
  ];

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Cost Center"
      width={1000}
      footer={
        <ButtonComponent border={true} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <Spin spinning={loading}>
        <CardComponent header={"COST CENTER INFORMATION"} cols={3}>
          <DetailText label={"Cost Center  Name"}>{data?.name}</DetailText>
          <DetailText label={"Cost Center Code"}>{data?.code}</DetailText>
          <DetailText label={"Status"}>{toTitleCase(data?.status)}</DetailText>
          <DetailText label={"Type"}>{data?.type}</DetailText>
          <DetailText label={"Value Name"}>{data?.valName}</DetailText>
          <DetailText label={"Value Code"}>{data?.valCode}</DetailText>
          <DetailText label={"Description"}>{data?.description}</DetailText>
        </CardComponent>

        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record Id">
            {data?.id}
          </DetailText>
          <DetailText label="Created Date">
            {data?.createdDate &&
              renderDateConverter(data?.createdDate, 'datetime')}
          </DetailText>
          <DetailText label="Created By">{data?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data?.updatedDate &&
              renderDateConverter(data?.updatedDate, 'datetime')}
          </DetailText>
          <DetailText label="Updated By">{data?.updatedBy}</DetailText>
        </CardComponent>

        <div className="mb-[30px]">
          <div>
            <p className="text-primary text-xs font-semibold uppercase">
              ACTIVATE/INACTIVATE LOG INFORMATION
            </p>
          </div>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              dataSource={data?.activeInactiveLog}
              columns={columns}
              current={currentLog}
              pageSize={sizeLog}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              // totalData={updatePagination(dataTable, 'length', searchedColumn, searchText, page, pageSize, typeColumn)}
              tableScrolled={{
                x: 1300,
                y: 300,
              }}
            />
          </div>
        </div>
      </Spin>
    </ModalCustom>
  );
};

export default DetailCostCenter;
