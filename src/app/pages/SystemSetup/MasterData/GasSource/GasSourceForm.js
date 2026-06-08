import { Form, Spin, Select, Input, DatePicker, Tooltip } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  LeftOutlined,
  WarningOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm, ModalError } from "../../../../../components/Modal/ModalPopUp";
import moment from "moment";
import ConfirmationLayout from "./Modal/ConfirmationLayout";
import {
  createGasSource,
  getCostCenter,
  getDetailGasSource,
  getUOM,
  updateGasSource,
} from "../../../../../redux/slices/account_management/MasterData/gasSourceSlice";
import { dateFormatting, formMessageRequired, hasValue } from "../../../../../utils";
import Highlighter from "react-highlight-words";
import { clearBodyMessage, showModalError, validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import TableInlinegasSource from "./TableInlineGasSource";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";

const CreateGasSource = ({ type }) => {
  // Selector
  const { loading, data_uom, data_cost_center, data_detail } = useSelector(
    (state) => state.gasSource
  );
  const { bodyError, isLoading} = useSelector(state => state?.general);

  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState({});
  const [description, setDescription] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [totalElements, setTotalElement] = useState(0);
  const [filteredCostCenter, setFilteredCostCenter] = useState([]);
  const [isInsertedValue, setIsInsertedValue] = useState(false);
  const dataCostCenter = data_cost_center?.map((item) => {
    return {
      value: item.costCenterId,
      label: item.costCenterName,
    };
  });
  const [modalError, setModalError] = useState(false);
  const [doubleCostCenter, setDoubleCostCenter] = useState(false);

  const criteria = data_detail?.criteria?.map((item, index) => {
    return {
      key: (index + 1).toString(),
      gasSourceCriteriaId: item?.gasSourceCriteriaId,
      costCenterId: item?.costCenterId,
      startDate: moment(item?.startDate).clone(),
      endDate: hasValue(item?.endDate) ? moment(item?.endDate).clone() : null,
      description: item?.description,
    };
  });

  // Use Effect
  useEffect(() => {
    setTotalElement(tableData?.length);
  }, [tableData]);

  useEffect(() => {
    if (id) {
      dispatch(getDetailGasSource(id));
      dispatch(getUOM());
      dispatch(getCostCenter());
    }
    dispatch(getUOM());
    dispatch(getCostCenter());
  }, []);

  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        calorieCode: data_detail?.calorieCode,
        name: data_detail?.name,
        uom: data_detail?.uomId,
        description: data_detail?.description,
      });
      setTableData(criteria);
    }
  }, [id, form, data_detail]);

  useEffect(() => {
    if (tableData?.length > 0) {
      setFilteredCostCenter(data_cost_center?.filter((item) => {
        return !tableData?.some(tableItem => tableItem?.costCenterId === item?.costCenterId)
      })?.map((item) => {
        return {
          value: item.costCenterId,
          label: item.costCenterName,
        };
      }));
    } else {
      setFilteredCostCenter(data_cost_center?.map((item) => {
        return {
          value: item.costCenterId,
          label: item.costCenterName,
        };
      }));
    }
  }, [data_cost_center, tableData]);
  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true)
    }
  }, [bodyError]);

  // trigger modal duplicate cost center
  useEffect(() => {
    if (doubleCostCenter === true) {
      const errorBody = {
        title: "Attention",
        description: `Cost center already used, please choose another`,
      };
      dispatch(showModalError(errorBody));
      setDoubleCostCenter(false)
    }
  }, [doubleCostCenter, dispatch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_SOURCE,
      breadcrumbName: "Gas Source",
    },
    {
      path:
        type !== "update"
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_SOURCE
          : ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_GAS_SOURCE,
      breadcrumbName:
        type !== "update" ? "Create Gas Source" : "Update Gas Source",
    },
  ];

  // Search Column Table
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

  const renderRules = (doubleValue, dataIndex) => {
    if (doubleValue) {
      return [
        {
          message: `Double cost center selected, please choose another!`,
          // required: true,
        }
      ]
    } else {
      return [
        ...formMessageRequired(dataIndex)
      ]
    }
  }
  const column = [
    {
      title: "NO",
      dataIndex: "no",
      align: "center",
      width: 90,
      render: (t, r, i) => i + 1,
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenterId",
      editable: true,
      sorter: true,
      inputType: "select",
      options: dataCostCenter,
      rules: formMessageRequired('Cost Center'),
      ...getColumnSearchProps("costCenterId"),
      render: (costCenterId) => (
        <span>
          {dataCostCenter &&
            dataCostCenter
              .filter((a) => a.value === costCenterId)
              .find((b) => b.label)?.label}
        </span>
      ),
    },

    {
      title: "START DATE",
      dataIndex: "startDate",
      editable: true,
      sorter: true,
      inputType: "date",
      align: "center",
      rules: formMessageRequired('Start Date'),
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => hasValue(startDate) && moment(startDate).format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      editable: true,
      sorter: true,
      inputType: "date",
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => hasValue(endDate) && moment(endDate).format(dateFormatting.date),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      inputType: "description",
      editable: true,
      sorter: true,
      ellipsis: {
        showTitle: false
      },
      ...getColumnSearchProps("description"),
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      )
    },
  ];

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

  const filterDataByPage = () => {
    let result = [...(tableData || [])];
    if (searchedColumn) {
      result = result.filter((item) => {
        // console.log(searchText, "searchText");
        // console.log(searchedColumn, "searchedColumn");
        // console.log(item[searchedColumn], "item[searchedColumn]");
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

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const handleDisableDate = (current) => {
    return moment() >= current;
  };

  // Handle Confirmation
  const handleSave = async (formValue) => {
    try {
      let body;
      let validateValueObj;

      if (tableData.length === 0) {
        const errorBody = {
          title: "Attention",
          description: `Your data was not created. Please input your gas quality criteria. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const modifiedArray = tableData.map((obj) => {
          return {
            gasSourceCriteriaId:
              type !== "create" ? obj?.gasSourceCriteriaId || null : undefined,
            costCenterId: obj.costCenterId,
            startDate: moment(obj.startDate).format(dateFormatting.date),
            endDate: hasValue(obj.endDate) ? moment(obj.endDate).format(dateFormatting.date) : null,
            description: obj.description,
          };
        });

        if (type === 'update') {
          body = {
            ...formValue,
            criteria: modifiedArray,
            gasSourceId: id,
          }
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: '/v1/dbs/api/gas-source/validate-update',
            type
          }
        } else {
          body = {
            ...formValue,
            criteria: modifiedArray,
          }
          validateValueObj = {
            body: body,
            services: accountManagementService,
            endPoint: '/v1/dbs/api/gas-source/validate-create',
            type
          }
        }
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap(0)
        setData({
          body: body,
          validateValue: validateValueObj
        });
        setModalConfirm(true);
      }
    } catch (error) {
        setModalConfirm(false);
    }
    
  };

  // handle Confirm
  const handleConfirm = async () => {
    if (type === "create") {
      await dispatch(createGasSource({ body: data?.body }))
        .unwrap()
        .then(() => {
          form.resetFields();
          setTableData([])
          setModalConfirm(false);
        })
        .catch(() => {
          setModalConfirm(false);
        });
    } else {
      await dispatch(updateGasSource({ body: data?.body }))
        .unwrap()
        .then(() => {
          form.resetFields();
          setModalConfirm(false);
        })
        .catch(() => {
          setModalConfirm(false);
        });
    }
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleResetAndClear = () => {
    if (type === "create") {
      form.resetFields()
      setTableData([])
    } else {
      dispatch(getDetailGasSource(id));
    }
  };

  // handle confirm
  const handleConfirmRetry = () => {
    if (bodyError?.action === "UPDATE_GAS_SOURCE" || bodyError?.action === "CREATE_GAS_SOURCE") {
      handleConfirm();
    } else if (bodyError?.action === "GET_COST_CENTER") {
      dispatch(getCostCenter());
    } else if (bodyError?.action === "GET_UOM") {
      dispatch(getUOM())
    } else {
      dispatch(getDetailGasSource(id));
    }

    dispatch(clearBodyMessage());
  }
  // handle retry
  const handleRetry = () => {
    handleConfirmRetry()
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
    // setBodyError({});
  };
  return (
    <>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={form} onFinish={handleSave}>
          <BaseContainer header={"GAS SOURCE INFORMATION"}>
            <div className="w-full grid grid-cols-3 gap-2">
              <Form.Item
                label={"Calorie Code"}
                name={"calorieCode"}
                rules={[
                  {
                    required: true,
                    message: "Please input your Calorie Code!",
                  },
                ]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Name"}
                name={"name"}
                rules={[{ required: true, message: "Please input your Name!" }]}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"UOM"}
                name={"uom"}
                rules={[{ required: true, message: "Please input your UOM!" }]}
              >
                <SelectComponent disabled={type === 'update'}>
                  {data_uom &&
                    data_uom?.map((ta, index) => (
                      <Select.Option value={ta.uomId} key={index}>
                        {ta.uomName}
                      </Select.Option>
                    ))}
                </SelectComponent>
              </Form.Item>

              <div className="col-span-3">
                <Form.Item
                  label={"Description"}
                  name={"description"}
                  className={"w-full"}
                >
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </BaseContainer>

          <TableInlinegasSource
            header={"Gas Quality Criteria"}
            tableData={filterDataByPage()}
            onDataChange={setTableData}
            cols={column}
            mode={type}
            disableDate={handleDisableDate}
            scrollTable={{ x: 2000, y: 500 }}
            usePagination={true}
            useSelect={true}
            totalData={totalElements}
            pageSize={pageSize}
            current={page}
            onChangePage={handleChange}
            actionButton={["update", "delete"]}
            onSort={onSort}
            setInserted={setIsInsertedValue}
            setDoubleCostCenter={setDoubleCostCenter}
          />

          <div className="mt-[30px] flex">
            <ButtonComponent
              type={"submit"}
              onClick={handleBack}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>

            <div className={"w-full flex justify-end gap-5"}>
              <Form.Item>
                <ButtonComponent
                  icon={<SVGIcon name={type === "create" ? "IconButtonClear" : "IconButtonReset"} width={24} />}
                  type="submit"
                  onClick={handleResetAndClear}
                  disabled={isInsertedValue}
                >
                  {type === "create" ? " Clear" : "Reset"}
                </ButtonComponent>
              </Form.Item>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"} disabled={isInsertedValue}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* Modal Back*/}
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

        {/* Modal Confirmation*/}
        <ConfirmationLayout
          data={data?.body}
          modalConfirm={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={handleConfirm}
          column={column}
          apiUOM={data_uom}
        />
      </Spin>
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{bodyError?.response?.data?.message?.toString()}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </>
  );
};

export default CreateGasSource;
