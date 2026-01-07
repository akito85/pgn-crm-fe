import { useEffect, useRef, useState } from "react";

import { Form, Button, Tooltip, Input, DatePicker } from "antd";
import SVGIcon from "../../../../../../../../../assets/Icon/index";

import InputComponent from "../../../../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";
import NxPanel from "../../../../../../../../../components/Nx/NxPanel";
import { dateFormatting, requiredMessage } from "../../../../../../../../../utils";

import moment from "moment";
import DateComponent from "../../../../../../../../../components/DateComponent";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { getMdAccountStandard } from "../../../../../../../../../redux/slices/account_management/detailAccount/MultiDestinationSlice";
import { useDispatch, useSelector } from "react-redux";
// import TablePaginationNew from "../../../../../../../../../components/TablePaginationNew";
import { TablePaginationNew } from "poc-table-dragandrop";

export default function InfoMultiDestination({
  accountId,
  setAccount,
  className,
}) {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [totalElement, setTotalElement] = useState(0);
  const searchInput = useRef(null);
                                                                                                                                                                                                                                                                                                                                      
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const [isOpen, setIsOpen] = useState(false);
  
  const { data_mdAccountStandard } = useSelector(
    (state) => state.multiDestination
  );
  
  const handleOk = () => {
    console.log("ok")
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY HH:mm:ss");
    }
    return "";
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

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

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
        text || ""
      ),
  });

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getMdAccountStandard({ page, pageSize, sort, search: reqSearch, id: accountId }));
  }, [page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_mdAccountStandard && 
      data_mdAccountStandard.result &&
      data_mdAccountStandard.result.length > 0
    ) {
      setTotalElement(data_mdAccountStandard?.page?.totalElements);
    }
  }, [data_mdAccountStandard]);

  // Sanitize pagination values to prevent NaN
  // Modify
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : (data_mdAccountStandard?.result?.length || 0);

  const columnMain = [
    {
      title: "NO",
      width: 80,
      align: "center",
      dataIndex: "no",
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "customerIdentificationType",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerIdentificationType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("customerIdentificationNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("customerType"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "CATEGORY",
      dataIndex: "accountCategory",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("accountCategory"),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("sor"),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("costCenter"),
    },
    {
      title: "METER READING CODES",
      dataIndex: "meterReadingCode",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("meterReadingCode"),
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerManagement"),
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("classificationType"),
    },
    {
      title: "SEGMENT",
      dataIndex: "accountSegment",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("accountSegment"),
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      title: "PREMISE ADDRESS",
      dataIndex: "premiseAddress",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("premiseAddress"),
    },
    {
      title: "SUBDISTRICT",
      dataIndex: "subDistrict",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("subDistrict"),
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("district"),
    },
    {
      title: "CITY",
      dataIndex: "city",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("city"),
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("country"),
    },
    {
      title: "LONGITUDE",
      dataIndex: "longitude",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("longitude"),
    },
    {
      title: "LATITUDE",
      dataIndex: "latitude",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("latitude"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("startDate"),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("endDate"),
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Select">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconActionCreate"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    setAccount({
                      objectId: r?.accountId,
                      accountNumber: r?.accountNumber,
                      accountName: r?.accountName,
                      accountSor: r?.sor,
                      accountCostCenter: r?.costCenter,
                      meterReadingCode: r?.meterReadingCode,
                      accountSegment: r?.accountSegment,
                      accountGroupType: r?.accountGroupType,
                      accountType: r?.accountType,
                      premiseAddress: r?.premiseAddress,
                      subDistrict: r?.subDistrict,
                      district: r?.district,
                      city: r?.city,
                      country: r?.country,
                      longitude: r?.longitude,
                      latitude: r?.latitude,
                    })
                    setIsOpen(false);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ]

  return(
    <div className={className}>
      <NxPanel title={"MULTI DESTINATION INFORMATION"} removeBottomMargin>
        <div className="w-full grid grid-cols-3 gap-4 mb-4">
          <div className="flex gap-2 items-end">
            <Form.Item name={"objectId"} hidden>
              <Input />
            </Form.Item>

            <Form.Item
              key="account"
              name={"account"}
              label={"Account"}
              className="no-margin-form"
              rules={[
                {
                  message: requiredMessage("Account"),
                  required: true,
                }
              ]}
            >
              <InputComponent disabled />
            </Form.Item>
            <Button
              type="primary"
              className="h-9 px-4 justify-center items-center"
              style={{
                backgroundColor: "#0075bf",
                borderColor: "#0075bf",
                borderRadius: "5px",
                minWidth: "112px",
              }}
              onClick={() => {
                // Add your select logic here
                setIsOpen(true)
              }}
            >
              Select
            </Button>
          </div>

          <Form.Item
            key="accountSor"
            name={"accountSor"}
            label={"Account SOR"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account SOR"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountCostCenter"
            name={"accountCostCenter"}
            label={"Account Cost Center"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Cost Center"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="meterReadingCode"
            name={"meterReadingCode"}
            label={"Meter Reading Code"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Meter Reading Code"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountSegment"
            name={"accountSegment"}
            label={"Account Segment"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Segment"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountGroupType"
            name={"accountGroupType"}
            label={"Account Group Type"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Group Type"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="accountType"
            name={"accountType"}
            label={"Account Type"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Account Type"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="premiseAddress"
            name={"premiseAddress"}
            label={"Premise Address"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Premise Address"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="subDistrict"
            name={"subDistrict"}
            label={"Subdistrict"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Subdistrict"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="district"
            name={"district"}
            label={"District"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("District"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="city"
            name={"city"}
            label={"City"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("City"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="country"
            name={"country"}
            label={"Country"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Country"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="longitude"
            name={"longitude"}
            label={"Longitude"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Longitude"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>

          <Form.Item
            key="latitude"
            name={"latitude"}
            label={"Latitude"}
            className="no-margin-form"
            rules={[
              {
                message: requiredMessage("Latitude"),
                required: true,
              }
            ]}
          >
            <InputComponent disabled />
          </Form.Item>
        </div>

        <div className="w-full grid grid-cols-3 gap-4">
          <Form.Item
            key="startDate"
            name={"startDate"}
            label={"Start Date"}
            rules={[
              {
                message: requiredMessage("Start Date"),
                required: true,
              },
            ]}
            className="no-margin-form"
            getValueFromEvent={(dateMoment) => dateMoment ? dateMoment.format(dateFormatting.f_date) : null}
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.f_date) : null
            })}
          >
            <DateComponent />
          </Form.Item>

          <Form.Item
            key="endDate"
            name={"endDate"}
            label={"End Date"}
            className="no-margin-form"
            getValueFromEvent={(dateMoment) => dateMoment ? dateMoment.format(dateFormatting.f_date) : null}
            getValueProps={(dateString) => ({
              value: dateString ? moment(dateString, dateFormatting.f_date) : null
            })}
          >
            <DateComponent />
          </Form.Item>
        </div>

        <div className="w-full my-5">
          <Form.Item
            key="description"
            name={"description"}
            label={"Description"}
            className="no-margin-form"
          >
            <InputComponent
              type={"textarea"}
              rows={4}
              placeholder="Asset meter baru PGN"
              maxLength={255}
            />
          </Form.Item>
        </div>
      </NxPanel>

      <ModalCustom
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        header={"CHOOSE ACCOUNT"}
        width={1100}
        type={"custom"}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        {/* <TablePaginationNew
          dataSource={data_mdAccountStandard?.result?.map((item, idx) => ({
            ...item,
            key: item.id || idx,
          }))}
          totalData={sanitizedTotalElement}
          current={sanitizedPage}
          pageSize={sanitizedPageSize}
          onSort={onSort}
          tableScrolled={{ y: 525, x: 3000 }}
          columns={columnMain}
          onChange={handleChangeSize}
        /> */}
        <TablePaginationNew
          dataSource={data_mdAccountStandard?.result?.map((item, index) => ({
            ...item,
            key: item.id || index,
            no: (sanitizedPage - 1) * sanitizedPageSize + index + 1,
          }))}
          totalData={sanitizedTotalElement}
          current={sanitizedPage}
          pageSize={sanitizedPageSize}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={columnMain}
          tableScrolled={{ y: 525, x: 3000 }}
          enableDragColumn={true}
        />
      </ModalCustom>
    </div>
  )
}
