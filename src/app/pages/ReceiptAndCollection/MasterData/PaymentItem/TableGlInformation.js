import { Select } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch } from "react-redux";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import DynamicTableInlinePaymentAll from "../../DynamicTableInlinePaymentAll";
const { Option } = Select;

const TableGlInformation = ({
  tableData = [],
  onDataChange,
  type,
  data_bank,
  data_GLAccount,
  onSort,
  formValueHeader
}) => {
  // const { data_bank, data_GLAccount } = useSelector((state) => state.item);
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const dispatch = useDispatch();


  console.log(formValueHeader);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const dataBank = data_bank?.map((item) => {
    return {
      label: item?.name,
      value: item?.id,
    };
  });

  const dataGLDDL = data_GLAccount?.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  const columnsGL = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
  ) => [
      {
        key: "no",
        title: "NO",
        dataIndex: "no",
        width: "5%",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "bankAccountId",
        title: "BANK ACCOUNT",
        dataIndex: "bankAccountId",
        sorter: true,
        inputType: "select",
        required: true,
        options: dataBank,
        ...getColumnSearchProps(
          "bankAccountId",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        //   const bankName = text;
        //   console.log("🚀 ~ bankName:", bankName);
        //   searchedColumn === "bankAccountId" ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: "#ffc069",
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={
        //         text
        //           ? data_bank &&
        //             data_bank.filter((a) => a.id === text)?.find((b) => b.name)
        //               ?.name
        //           : data_bank &&
        //             data_bank.filter((a) => a.id === text)?.find((b) => b.name)
        //               ?.name
        //       }
        //     />
        //   ) : text ? (
        //     data_bank &&
        //     data_bank.filter((a) => a.id === text)?.find((b) => b.name)?.name
        //   ) : (
        //     data_bank &&
        //     data_bank.filter((a) => a.id === text)?.find((b) => b.name)?.name
        //   );
        // },

        render: (text) => {
          const bankName = data_bank
            ?.filter((item) => item?.id === text)
            .map((name) => name?.name)
            .shift();

          if (searchedColumn === "billingItem") {
            const highlight = (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={bankName || ""}
              />
            );
            if (bankName) {
              return highlight;
            }
            return highlight;
          } else {
            if (bankName) {
              return bankName;
            }
            return "";
          }
        },
      },
      {
        key: "glAccount",
        title: "GL ACCOUNT",
        dataIndex: "glAccount",
        align: "",
        // width: 350,
        options: dataGLDDL,
        inputType: "select",
        required: true,
        sorter: true,
        ...getColumnSearchProps(
          "glAccount",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (text) =>
          searchedColumn === "glAccount" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text : ""}
            />
          ) : text ? (
            text
          ) : (
            " "
          ),
      },
      {
        key: "startDate",
        title: "START DATE",
        dataIndex: "startDate",
        inputType: "date",
        align: "center",
        editable: true,
        sorter: true,
        required: true,
        // key: "startDate",
        ...getColumnSearchProps(
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "startDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[
                  searchText
                    ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                    : "",
                ]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || "";
          }
        },
      },
      {
        key: "endDate",
        title: "END DATE",
        // width: 160,
        sorter: true,
        align: "center",
        dataIndex: "endDate",
        inputType: "date",
        ...getColumnSearchProps(
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "endDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[
                  searchText
                    ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                    : "",
                ]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || "";
          }
        },
      },
    ];
  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const paginationTable = (typeData = "data") => {
    let result = [...tableData];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "bankAccountId") {
          const data = item[searchedColumn] || 0;
          const bankName = data_bank
            ?.filter((a) => a.id === data)
            .find((b) => b.name)?.name;
          return (bankName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "glAccount") {
          const data = item[searchedColumn] || 0;
          const glName = data_GLAccount?.filter((a) => a === data)?.[0]?.a;
          return (glName || "").toLowerCase().includes(fixSearchText);
        } else {
          switch (searchedColumn) {
            case "startDate":
            case "endDate":
              const date = item[searchedColumn]
                ? moment(item[searchedColumn]).format("DD MMM YYYY")
                : "";
              return date?.toLowerCase().includes(fixSearchText);
            default:
              return item[searchedColumn]
                ?.toLowerCase()
                .includes(fixSearchText);
          }
        }
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  return (
    // <BaseContainer header={"GL INFORMATION"}>
    <div className={"my-5"}>
      <DynamicTableInlinePaymentAll
        header={"GL INFORMATION"}
        disableDate={true}
        scrollTable={{ x: 1800, y: 525 }}
        usePagination={true}
        useSelect={true}
        // totalData={tableData.length}
        totalData={paginationTable("length")}
        pageSize={pageSize}
        current={page}
        onChangePage={handleChangePage}
        onSizeChanger={handleChangePage}
        // tableData={tableData}
        tableData={paginationTable("data")}
        onDataChange={onDataChange}
        cols={columnsGL(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        )}
        mode={type}
        showCreateButton={true}
        onSort={onSort}
        actionButton={["update", "delete"]}
        actionFix={true}
        // checkInputBy={"glAccount"}
        checkNameColumn={"glAccount"}
        startDateHeader={formValueHeader.startDate}
        endDateHeader={formValueHeader.endDate}
      />
    </div>
    // </BaseContainer>
  );
};

export default TableGlInformation;
