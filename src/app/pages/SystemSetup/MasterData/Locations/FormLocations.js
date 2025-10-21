import { Button, Form, Input, Select, Spin, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { LeftOutlined, PlusCircleOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../components/SelectComponent";
import { formMessageRequired, hasValue } from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import {
  createLocation,
  getDetailLocation,
  getLocationPaginate,
  getLocationParentType,
  getLocationReference,
  getLocationType,
  setClearLocationParent,
  updateLocation,
} from "../../../../../redux/slices/account_management/MasterData/location_slice";
import DetailText from "../../../../../components/DetailText";
import { useLocation, useNavigate } from "react-router-dom";
import { validateCreateUpdate } from "../../../../../redux/slices/general_slice";
import ModalBack from "../../../../../components/Modal/ModalBack";
import TablePagination from "../../../../../components/TablePagination";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import { onInputUpperCase } from "../../../AccountManagement/Utils";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
// const { Option } = Select;

const FormLocations = ({ type }) => {
  const {
    loading,
    data_location_reference,
    data_location_type,
    data_detail,
    data,
  } = useSelector((state) => state.location);
  const { bodyError, isLoading } = useSelector((state) => state?.general);
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // use state
  const [modalBack, setModalBack] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [body, setBody] = useState({});
  const [selectedParentType, setSelectedParentType] = useState();
  // const [modalError, setModalError] = useState(false);
  const [modalChoose, setModalChoose] = useState(false);
  const [chooseLocationParent, setChooseLocationParent] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [locationReferenceDdl, setLocationReferenceDdl] = useState([]);
  const [locationReferenceDdlTemp, setLocationReferenceDdlTemp] = useState([]);
  const searchInput = useRef(null);
  const dataLocation = data_location_type
    ?.filter((item) => item?.id !== 2346)
    ?.map((item) => ({ value: item?.id, name: item?.name }));

  // assert function
  const assert = useCallback(
    (data) => {
      if (data) {
        let setLocationParentType;
        switch (data?.locationType?.value) {
          case 103:
            setLocationParentType = undefined;
            break;
          case 104:
            setLocationParentType = 103;
            break;
          case 105:
            setLocationParentType = 104;
            break;
          case 106:
            setLocationParentType = 105;
            break;
          case 107:
            setLocationParentType = 106;
            break;

          default:
            setLocationParentType = 107;
            break;
        }
        setChooseLocationParent(data?.locationParent);
        setLocationReferenceDdl(locationReferenceDdlTemp);
        form.setFieldsValue({
          locationType: data?.locationType?.value,
          locationCode: data?.locationCode,
          locationName: data?.locationName,
          locationParentType: setLocationParentType,
          // locationParent: chooseLocationParent?.name,
          locationReference: data?.locationReference?.value,
        });
      }
    },
    [form],
  );

  // use effect
  useEffect(() => {
    if (type === "update") {
      dispatch(
        getDetailLocation({
          id: location?.state?.id,
          locationType: location?.state?.locationType,
        }),
      )
        .unwrap()
        .then((data) => {
          dispatch(getLocationReference({ id: data?.locationType?.value }))
            .unwrap()
            .then((data) => {
              setLocationReferenceDdl(data);
              setLocationReferenceDdlTemp(data);
            });
        })
        .catch((er) => {
          console.log(er);
        });
    }
    // dispatch(getLocationReference());
    dispatch(getLocationType());
    dispatch(getLocationParentType());
  }, [type, dispatch, location]);

  useEffect(() => {
    if (location?.state?.id && type === "update") {
      assert(data_detail);
    }
  }, [assert, data_detail, location, type]);

  useEffect(() => {
    if (chooseLocationParent) {
      form.setFieldsValue({
        locationParent: chooseLocationParent?.name,
      });
    }
  }, [chooseLocationParent]);

  useEffect(() => {
    if (form.getFieldsValue()?.locationType === 103) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getLocationPaginate({
          typeId: form.getFieldsValue()?.locationType,
          search: reqSearch,
          sort,
          page,
          pageSize,
        }),
      );
    }
    // else if (type === 'update' || hasValue(form.getFieldsValue()?.locationParentType) || hasValue(form?.getFieldsValue().locationParent)) {
    else if (modalChoose === true) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getLocationPaginate({
          typeId: form.getFieldsValue()?.locationParentType,
          search: reqSearch,
          sort,
          page,
          pageSize,
        }),
      );
    } else {
      dispatch(setClearLocationParent());
    }
  }, [
    selectedParentType,
    form,
    dispatch,
    page,
    pageSize,
    type,
    modalChoose,
    search,
    page,
    pageSize,
    sort,
  ]);

  // handle confirmation
  const handleFinish = async (formValue) => {
    try {
      let validateValueOBj;
      let body;
      body = {
        ...formValue,
        locationParent: chooseLocationParent?.value,
      };
      if (type === "update") {
        validateValueOBj = {
          body: body,
          services: accountManagementService,
          endPoint: `/v1/dbs/api/master/location/validate-update/${location?.state?.id}`,
          type,
        };
      } else {
        validateValueOBj = {
          body: body,
          services: accountManagementService,
          endPoint: "/v1/dbs/api/master/location/validate-create",
          type,
        };
      }
      await dispatch(validateCreateUpdate(validateValueOBj))?.unwrap();
      setOpenConfirmation(true);
      setBody({
        body: body,
        validateValue: validateValueOBj,
      });
    } catch (error) {
      setOpenConfirmation(false);
    }
  };

  // handle cancel confirmation
  const handleCancel = () => {
    setOpenConfirmation(false);
    setModalChoose(false);
  };

  // handle save
  const handleSave = async () => {
    handleCancel();
    if (type === "update") {
      await dispatch(
        updateLocation({ body: body?.body, id: location?.state?.id }),
      )?.unwrap();
    } else {
      await dispatch(createLocation(body?.body))?.unwrap();
    }
    await dispatch(setClearLocationParent())?.unwrap();
  };

  // handle reset
  const handleReset = () => {
    if (type === "create") {
      form.resetFields();
      setChooseLocationParent({});
    } else {
      assert(data_detail);
    }
  };

  // func condition location type
  const locationTypeChanged = (value) => {
    if (value === 103) {
      form.setFieldsValue({
        locationParentType: undefined,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    } else if (value === 104) {
      form.setFieldsValue({
        locationParentType: 103,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    } else if (value === 105) {
      form.setFieldsValue({
        locationParentType: 104,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    } else if (value === 106) {
      form.setFieldsValue({
        locationParentType: 105,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    } else if (value === 107) {
      form.setFieldsValue({
        locationParentType: 106,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    } else {
      form.setFieldsValue({
        locationParentType: 107,
      });
      setSelectedParentType(form.getFieldsValue()?.locationParentType);
    }
    setChooseLocationParent({});
  };

  // handleChangeLocationType
  const handleChangeLocationType = (e) => {
    if (hasValue(e)) {
      dispatch(getLocationReference({ id: e }))
        .unwrap()
        .then((data) => {
          setLocationReferenceDdl(data);
        })
        .catch((er) => {
          console.log(er);
        });
      locationTypeChanged(e);
    }
    form.resetFields(["locationReference"]);
  };

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
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_LOCATIONS,
      breadcrumbName: "Location",
    },
    {
      path: "",
      breadcrumbName: type === "update" ? "Update Location" : "Create Location",
    },
  ];

  // const handleScroll = (e) => {
  //     const target = e.target;
  //     if (target.scrollTop + target.clientHeight === target.scrollHeight && !loading) {
  //         setPage(page + 1);
  //     }
  // };

  // handle retry
  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "GET_DETAIL_LOCATION") {
      dispatch(
        getDetailLocation({
          id: location?.state?.id,
          locationType: location?.state?.locationType,
        }),
      );
    } else if (bodyError?.action === "CREATE_LOCATION") {
      dispatch(createLocation(body?.body));
    } else if (body?.action === "UPDATE_LOCATION") {
      dispatch(updateLocation({ body: body?.body, id: location?.state?.id }));
    } else {
      dispatch(getLocationType());
      dispatch(getLocationParentType());
    }
  };

  // handle search modal choose
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

  const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
  ) => {
    let arrayCols = [
      {
        title: "NO",
        width: 50,
        align: "center",
        dataIndex: "no",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CODE",
        dataIndex: "locationCode",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "locationCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "COUNTRY",
        dataIndex: "country",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "PROVICE",
        dataIndex: "province",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "province",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "CITY",
        dataIndex: "city",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "city",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // width:180
      },
      {
        title: "DISTRICT",
        dataIndex: "district",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "district",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        // width:180
      },
      {
        title: "SUB DISTRICT",
        dataIndex: "subdistrict",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "subDistrict",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "POSTAL CODE",
        dataIndex: "postalCode",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "postalCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 100,
      },
      {
        title: "LOCATION TYPE",
        dataIndex: "locationType",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "locationType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "LOCATION NAME",
        dataIndex: "locationName",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "locationName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "LOCATION PARENT",
        dataIndex: "locationParent",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "locationParent",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 180,
      },
      {
        title: "LOCATION REFERENCE",
        dataIndex: "locationReference",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "locationReference",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        width: 200,
      },
      {
        title: "ACTION",
        width: 80,
        dataIndex: "action",
        fixed: "right",
        render: (text, record, i) => {
          return (
            <div className="flex justify-center gap-2">
              <Tooltip title="Choose">
                <PlusCircleOutlined
                  disabled={record?.status === "INACTIVE"}
                  onClick={() => {
                    setChooseLocationParent({
                      value: record?.locationId,
                      name: record?.locationName,
                    });
                    setModalChoose(false);
                  }}
                  style={{
                    color: "#0075BF",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
    return arrayCols?.filter(
      (item) =>
        item?.dataIndex === "no" ||
        item.dataIndex === "locationName" ||
        item.dataIndex === "locationType" ||
        item?.dataIndex === "locationParent" ||
        item.dataIndex === "locationReference" ||
        item?.dataIndex === "locationCode" ||
        item?.dataIndex === "status" ||
        item?.dataIndex === "action",
    );
  };

  // handle change pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // handle on Sort
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading || isLoading}>
        <BreadCrumb routes={routes} />
        <Form form={form} layout={"vertical"} onFinish={handleFinish}>
          <BaseContainer header={"location information"}>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Location Type"}
                name={"locationType"}
                rules={formMessageRequired("Location Type")}
              >
                <SelectComponent onChange={handleChangeLocationType}>
                  {dataLocation?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Location Code"}
                name={"locationCode"}
                rules={formMessageRequired("Location Code")}
              >
                <InputComponent />
              </Form.Item>
              <Form.Item
                label={"Location Name"}
                name={"locationName"}
                rules={formMessageRequired("Location Name")}
              >
                <InputComponent onInput={onInputUpperCase} />
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              <Form.Item
                label={"Location Parent Type"}
                name={"locationParentType"}
                rules={
                  form?.getFieldsValue()?.locationType !== 103 &&
                  form?.getFieldsValue()?.locationType !== undefined &&
                  formMessageRequired("Location Parent Type")
                }
              >
                <SelectComponent disabled={true}>
                  {dataLocation?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
              <Form.Item
                label={"Location Parent"}
                name={"locationParent"}
                rules={
                  form?.getFieldsValue()?.locationType !== 103 &&
                  form?.getFieldsValue()?.locationType !== undefined &&
                  formMessageRequired("Location Parent")
                }
              >
                <div className="flex flex-row">
                  <Input.Group compact>
                    <InputComponent
                      disabled={true}
                      value={chooseLocationParent?.name}
                    />
                    <Button
                      disabled={
                        form?.getFieldsValue()?.locationType === 103 ||
                        hasValue(form?.getFieldsValue()?.locationType) === false
                      }
                      type="primary"
                      onClick={() => {
                        // setKeyModal(1);
                        setModalChoose(true);
                      }}
                    >
                      Choose
                    </Button>
                  </Input.Group>
                </div>
                {/* <SelectComponent onPopupScroll={handleScroll}>
                                    {data_location_parent?.map(item => (
                                        <Select.Option value={item?.value}>
                                            {item?.name}
                                        </Select.Option>
                                    ))}
                                </SelectComponent> */}
              </Form.Item>
              <Form.Item
                label={"Location Reference"}
                name={"locationReference"}
              >
                <SelectComponent>
                  {locationReferenceDdl?.map((item) => (
                    <Select.Option value={item?.value}>
                      {item?.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </div>
          </BaseContainer>
          <div className="w-full my-5 flex gap-5">
            <ButtonComponent
              icon={
                <LeftOutlined style={{ fontSize: "24px", color: "#fff" }} />
              }
              type="submit"
              onClick={() => setModalBack(true)}
            >
              Back
            </ButtonComponent>
            <div className={"w-full flex justify-end gap-2"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleReset}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent type="submit" htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>

      {/* modal confirmation */}
      <ModalCustom
        isOpen={openConfirmation}
        handleCancel={handleCancel}
        type={"confirmation"}
        width={900}
        header={"confirmation"}
        footer={[
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCancel} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={handleSave} type={"submit"}>
              Confirm
            </ButtonComponent>
          </div>,
        ]}
      >
        <div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            location information
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Location Type"}>
              {
                dataLocation?.filter(
                  (item) => item?.value === body?.body?.locationType,
                )[0]?.name
              }
            </DetailText>
            <DetailText label={"Location Code"}>
              {body?.body?.locationCode}
            </DetailText>
            <DetailText label={"Location Name"}>
              {body?.body?.locationName}
            </DetailText>
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Location Parent Type"}>
              {
                dataLocation?.filter(
                  (item) => item?.value === body?.body?.locationParentType,
                )[0]?.name
              }
            </DetailText>
            <DetailText label={"Location Parent"}>
              {chooseLocationParent?.name}
            </DetailText>
            <DetailText label={"Location Reference"}>
              {
                data_location_reference?.filter(
                  (item) => item?.value === body?.body?.locationReference,
                )[0]?.name
              }
            </DetailText>
          </div>
        </div>
      </ModalCustom>
      {/** Modal Retry */}
      {renderModal()}

      {/* Modal Back */}
      <ModalBack
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
      />

      <ModalCustom
        isOpen={modalChoose}
        type="confirmation"
        header={"Choose Location Parent"}
        width={1200}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <span className="text-primary uppercase font-bold">
          LOCATION PARENT INFORMATION
        </span>
        <div className="w-full">
          <TablePagination
            loading={loading}
            dataSource={data?.result}
            columns={columns(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            totalData={data?.page?.totalElements}
            tableScrolled={{
              x: 1700,
              y: 300,
            }}
          />
        </div>
      </ModalCustom>
    </LayoutMenu>
  );
};

export default FormLocations;
