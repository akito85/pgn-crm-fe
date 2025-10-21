import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import Highlighter from "react-highlight-words";

import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../../../components/DetailText";
import { dateFormatting } from "../../../../../../../../../utils";
import { Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import TableInlineTos from "./TableInlineTos";

const ModalForm = ({
  modalFormTos,
  closeModalFormTos,
  dataFormTosModal = {},
  dataTermOfService = [],
  setDataTermOfService,
  tempDataUpdateTos = {},
  resetTableTosUpdate,
  dataTableTos,
  setDataTableTos,
  setModalFormTos,
}) => {
  const searchInput = useRef(null);
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);
  const [disabledButton, setDisabledButton] = useState(false);

  useEffect(() => {
    setDataTableTos(dataFormTosModal?.tosDetail);
  }, [dataFormTosModal?.tosdetail, tempDataUpdateTos]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const filterDataByPage = () => {
    let result = [...(dataTableTos || [])];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format(dateFormatting.date)
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
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

  // Search Column Table
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text || ""
      ),
  });

  const column = [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 60,
      render: (t, r, i) => i + 1,
    },
    {
      title: "ATTRIBUTE",
      dataIndex: "attributeName",
      editable: true,
      sorter: true,
      width: 150,
      disabledField: true,
      ...getColumnSearchProps("attributeName"),
    },
    {
      title: "VALUE",
      dataIndex: "value",
      editable: true,
      inputType: "number",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("value"),
      render: (text) => <span>{text?.toString()}</span>,
    },
  ];

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const updateDataTos = (id) => {
    let newData = {
      description: dataFormTosModal.description,
      tosDetail: dataTableTos,
      termOfService: dataFormTosModal.termOfService,
    };
    const updatedData = dataTermOfService.map((item) => {
      if (item.key === id) {
        return { ...item, ...newData };
      }
      return item;
    });
    setDataTermOfService(updatedData);
    setModalFormTos(false);
  };

  return (
    <div>
      <ModalCustom
        header={"UPDATE TERM OF SERVICE VALUE"}
        isOpen={modalFormTos}
        type={"confirmation"}
        handleCancel={closeModalFormTos}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={resetTableTosUpdate}
              type="default"
              disabled={disabledButton}
            >
              Reset
            </ButtonComponent>
            <ButtonComponent
              disabled={disabledButton}
              onClick={() => updateDataTos(dataFormTosModal?.key)}
              type="submit"
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <div className="w-full p-5">
          <span className="text-primary uppercase font-bold">
            TERM OF SERVICE INFORMATION
          </span>
          <div className="grid grid-cols-2 gap-5 pt-[30px]">
            <DetailText label="Term of Service">
              {dataFormTosModal.tosName}
            </DetailText>
            <DetailText label="Description">
              {dataFormTosModal.description}
            </DetailText>
          </div>

          <TableInlineTos
            tableData={filterDataByPage()}
            onDataChange={setDataTableTos}
            cols={column}
            scrollTable={{ y: 500 }}
            usePagination={true}
            useSelect={true}
            totalData={totalElements}
            pageSize={pageSize}
            current={page}
            onChangePage={handleChange}
            actionButton={["update", "delete"]}
            onSort={onSort}
            showCreateButton={false}
            setDisabledButton={setDisabledButton}
          />
        </div>
      </ModalCustom>
    </div>
  );
};

export default ModalForm;
