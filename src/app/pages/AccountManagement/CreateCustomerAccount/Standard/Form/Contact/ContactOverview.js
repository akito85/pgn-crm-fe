import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tooltip, Input, DatePicker, Spin } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { dateFormatting } from "../../../../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../../../components/BaseContainer";
import TablePagination from "../../../../../../../components/TablePagination";
import {
  getContactType,
  getCountryCode,
  getInputType,
  getJob,
  getPosition,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";

const ContactOverview = ({
  contactTable = [],
  setContactTable,
  dataAddress = [],
  form,
  type,
  prefix1,
  prefix2,
  suffix,
  value,
  keyModal,
  setContactObj,
}) => {
  // Selector
  const {
    loading,
    data_job,
    data_position,
    data_contactType,
    data_countryZone,
    data_countryCode,
  } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const dataSource = contactTable;
  const dispatch = useDispatch();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
    }
  }, [dataSource]);

  useEffect(() => {
    dispatch(getJob());
    dispatch(getPosition());
    dispatch(getContactType());
    dispatch(getInputType());
    dispatch(getCountryCode());
    // dispatch(getCountryZone());
  }, []);

  // Search Column
  const getColumnSearchProps = (dataIndex, type) => ({
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
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
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
          )}
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
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    // {
    //   title: "OVERVIEW",
    //   dataIndex: "overview",
    //   sorter: true,
    //   ...getColumnSearchProps("overview"),
    // },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      sorter: true,
      width: 250,
      ...getColumnSearchProps("contactName"),
    },
    {
      title: "JOB",
      dataIndex: "jobId",
      sorter: true,
      width: 250,
      align: "center",
      ...getColumnSearchProps("jobId"),
      render: (jobId) => {
        if (typeof jobId !== "string") {
          const name = data_job
            ?.filter((a) => a.id === jobId)
            ?.find((b) => b.name)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{jobId}</span>;
        }
      },
    },
    {
      title: "POSITION",
      dataIndex: "positionId",
      align: "center",
      sorter: true,
      width: 200,
      ...getColumnSearchProps("positionId"),
      render: (positionId) => {
        if (typeof positionId !== "string") {
          const name = data_position
            ?.filter((a) => a.id === positionId)
            ?.find((b) => b.name)?.name;

          if (name) {
            return <span>{name}</span>;
          }
        } else {
          return <span>{positionId}</span>;
        }
      },
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      sorter: true,
      width: 700,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("contactAddress"),
      render: (contactAddress) => {
        if (isNaN(contactAddress)) {
          //is not a number
          const name = dataAddress
            ?.filter((a) => a.tempId === contactAddress)
            ?.find((b) => b.fullAddress)?.fullAddress;

          if (name) {
            return (
              <Tooltip placement="topLeft" title={name || ""}>
                {name || ""}
              </Tooltip>
            );
          }
        } else {
          const name = dataAddress
            ?.filter((a) => a.addressId === parseInt(contactAddress))
            ?.find((b) => b.fullAddress)?.fullAddress;
          if (name) {
            return (
              <Tooltip placement="topLeft" title={name || ""}>
                {name || ""}
              </Tooltip>
            );
          }
        }
      },
    },
    {
      title: "ADDITIONAL NOTE",
      dataIndex: "additionalNote",
      sorter: true,
      ...getColumnSearchProps("additionalNote"),
      render: (additionalNote) => <span>{additionalNote || ""}</span>,
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("description"),
      render: (description) => (
        <Tooltip placement="topLeft" title={description || ""}>
          {description || ""}
        </Tooltip>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      fixed: "right",
      width: 100,
      dataIndex: "key",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => handleDelete(r)}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  // console.log("contactTable", contactTable)
  // Column Contact Expand
  const expandedRowRender = (record) => {
    const columns = (
      searchInput,
      searchedColumn,
      searchText,
      handleSearch = () => {},
    ) => {
      return [
        {
          title: "NO",
          width: 60,
          align: "center",
          render: (text, object, index) => index + 1,
        },
        {
          title: "TYPE",
          dataIndex: "type",
          sorter: true,
          align: "center",
          ...getColumnSearchProps(
            "type",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
          render: (type) => {
            if (typeof type !== "string") {
              const name = data_contactType
                ?.filter((a) => a.id === type)
                ?.find((b) => b.name)?.name;

              if (name) {
                return <span>{name}</span>;
              }
            } else {
              return <span>{type}</span>;
            }
          },
        },
        {
          title: "VALUE",
          dataIndex: "value",
          sorter: true,
          ...getColumnSearchProps(
            "value",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
          ),
          render: (v, record, i) => {
            // console.log(value,"value")
            const prefixName1 =
              data_countryCode &&
              data_countryCode
                ?.filter(
                  (a) =>
                    a.id ===
                    // prefix1[`${record.row}~${record.key}`]
                    record?.prefix1,
                )
                .find((b) => b.name)?.name;

            const prefixName2 =
              data_countryZone &&
              data_countryZone
                ?.filter(
                  (a) => a.id === record?.prefix2,
                  // prefix2[`${record.row}~${record.key}`]
                )
                .find((b) => b.text)?.text;

            // console.log(`index ${record.row} valueOverview ${value[`${record.row}~${record.key}`]} prefixName1 ${prefixName1} prefixName2 ${prefixName2} suffix ${suffix[`${keyModal}~${record.key}`]} record ${record.type} record ${record.inputType} hasValue ${hasValue(prefixName1)}`);
            const tempValue = record?.value;
            // value[`${record.row}~${record.key}`] ||

            if (
              prefixName1 !== undefined &&
              prefixName1 !== null &&
              prefixName1 !== ""
            ) {
              if (record.type === 741) {
                if (record.inputType === 748) {
                  return (
                    <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue}
                    ${
                      record.suffix === null || record.suffix === 0
                        ? ""
                        : "Ext. " + record.suffix
                      // suffix[`${record.row}~${record.key}`] ? suffix[`${record.row}~${record.key}`] : ""
                    }
                    `}</span>
                  );
                } else {
                  return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
                }
              }
              if (record.type === 746) {
                return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
              }
              if (record.type === 747) {
                return <span>{`(${prefixName1}) - ${tempValue}`}</span>;
              }
              if (record.type === 745) {
                return (
                  <span>{`(${prefixName1}) (${prefixName2}) - ${tempValue} ${record.suffix === null || record.suffix === 0 ? "" : "Ext. " + record.suffix}`}</span>
                );
              } else {
                return <span>{tempValue}</span>;
              }
            } else {
              return <span>{tempValue}</span>;
            }
          },
        },
      ];
    };
    return (
      <div>
        <p className="text-primary text-xs font-bold uppercase pt-4">
          CONTACT DETAIL INFORMATION
        </p>
        <TablePagination
          useSelect={false}
          usePagination={false}
          dataSource={record?.contactDetail}
          columns={columns()}
          className={"mb-4"}
        />
      </div>
    );
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

  const filterDataByPage = () => {
    let result = [...(dataSource || [])];
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
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
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

  const handleDelete = useCallback(
    (r) => {
      setContactTable((prevState) => prevState.filter((e) => e.key !== r.key));
      const resetField = contactTable.filter((a) => a.key === r.key);

      for (let i = 1; i <= 4; i++) {
        if (resetField[0].key === i) {
          setContactTable((prevState) => {
            let tempTable = prevState.filter((e) => e.key !== r.key);
            const updatedObj = {};

            tempTable.forEach((item, index) => {
              updatedObj[`contactAddress${index + 1}`] = isNaN(
                item.contactAddress,
              )
                ? item.contactAddress
                : parseInt(item.contactAddress);
              updatedObj[`additionalNote${index + 1}`] = item.additionalNote;
              updatedObj[`description${index + 1}`] = item.description;
            });
            form.setFieldsValue({
              ...updatedObj,
            });
            // console.log("updatedObj", updatedObj);
            // const fieldsToReset = [
            //   `contactAddress${i}`,
            //   `additionalNote${i}`,
            //   `description${i}`,
            // ];
            // const resetObj = {};
            // fieldsToReset.forEach((fieldName) => {
            //   form.resetFields([fieldName]);
            //   resetObj[fieldName] = null;
            // });

            // delete updatedObj[`contactAddress${tempTable.length+1}`];
            // delete updatedObj[`additionalNote${tempTable.length+1}`];
            // delete updatedObj[`description${tempTable.length+1}`];
            setContactObj((prevState) => ({
              // ...prevState,
              ...updatedObj,
            }));

            form.resetFields([
              `contactAddress${tempTable.length + 1}`,
              `additionalNote${tempTable.length + 1}`,
              `description${tempTable.length + 1}`,
            ]);

            return tempTable.map((item, index) => {
              return {
                ...item,
                overview: `Contact ${index + 1}`,
                key: index + 1,
              };
            });
          });
          // const fieldsToReset = [
          //   `contactAddress${i}`,
          //   `additionalNote${i}`,
          //   `description${i}`,
          // ];
          // const resetObj = {};
          // fieldsToReset.forEach((fieldName) => {
          //   form.resetFields([fieldName]);
          //   resetObj[fieldName] = null;
          // });
          // setContactObj((prevState) => ({
          //   ...prevState,
          //   ...resetObj,
          // }));
          break;
        }
      }
    },
    [contactTable],
  );

  return (
    <>
      {type === "confirmation" ? (
        <div className="w-full">
          <TablePagination
            dataSource={filterDataByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columns.filter((a) => a.dataIndex !== "key")}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 2000 }}
            expandable={{
              expandedRowRender,
            }}
          />
        </div>
      ) : (
        <Spin spinning={loading}>
          <BaseContainer header={"Account Contact Overview"}>
            <div className="w-full">
              <TablePagination
                dataSource={filterDataByPage()}
                totalData={totalElements}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                columns={columns}
                onSort={onSort}
                tableScrolled={{ y: 525, x: 3000 }}
                expandable={{
                  expandedRowRender,
                }}
              />
            </div>
          </BaseContainer>
        </Spin>
      )}
    </>
  );
};

export default ContactOverview;
