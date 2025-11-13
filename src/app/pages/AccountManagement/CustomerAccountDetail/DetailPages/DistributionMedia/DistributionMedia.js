import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import DistributionMediaTable from "./DistributionMediaTable";
import { DatePicker, Form, Input, Spin } from "antd";
import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { dateFormatting, requiredMessage } from "../../../../../../utils";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../../assets/Icon/index";
import DistributionMediaCreate from "./DistributionMediaCreate";
import DistributionMediaConfirm from "./DistributionMediaConfirm";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import DateComponent from "../../../../../../components/DateComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  createDistributionMedia,
  getDistributionMedia,
  getProductDetail,
  inActiveDistributionMedia,
} from "../../../../../../redux/slices/account_management/detailAccount/DistributionMedia";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../../redux/slices/general_slice";

const DistributionMedia = ({ id = 0 }) => {
  const dispatch = useDispatch();
  const { data_distribution, data_product, loading } = useSelector(
    (state) => state.distributionMedia
    );
    const { access_account } = useSelector(
      (state) => state.accountManagement
      );

  //declare
  const searchInput = useRef(null);
  const [formCreate] = Form.useForm();
  const [formInactive] = Form.useForm();

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, updateSearch] = useState({});

  const [modalCreate, setModalCreate] = useState(false);
  const [type, setType] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const [dataInactive, setDataInactive] = useState({});
  const [modalError, setModalError] = useState(false);

  const [bodyError, setBodyError] = useState({});
  const [data, setData] = useState();
  const [modalInactive, setModalInactive] = useState(false);
  const [typeRetry, setTypeRetry] = useState(false);
  const [distributionName, setDistributionName] = useState('');

  const [dataProduct, setDataProduct] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/distribution-media'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/distribution-media'))
    }
  }, [dispatch])

  //useEffect
  useEffect(() => {
    if (id) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getDistributionMedia({ id, page, pageSize, sort, search: reqSearch })
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    dispatch(getProductDetail());
  }, [dispatch]);

  useEffect(() => {
    if (
      id &&
      data_distribution &&
      data_distribution.result &&
      data_distribution.result.length > 0
    ) {
      setTotalElement(data_distribution?.page?.totalElements);
      const temp = data_distribution?.result
        ?.filter(
          (item) =>
            item.status === "ACTIVE"
        )
        .map((item) => item.productId);
      setDataProduct(data_product
        ? data_product?.filter((item) => !temp.includes(item.productId)) 
        : []
      );
    }
  }, [data_distribution, data_product, id]);

  //handle
  const handleProduct = (value) => {
    const temp = data_product.filter((item) => item.productId === value).map((item) => ({
      ...item,
      productDetail: item.productDetail.map((item) => ({
        ...item,
        unitName: item.unit,
        description: item.detailDescription,
      })),
    }));
    formCreate.setFieldsValue({
      productDescription: temp[0]?.description,
      priceCode: temp[0]?.pricing,
    });
    setData(temp[0]?.productDetail);
  };

  const handleCreate = (e) => {
    const data = {
      accountId: id,
      productId: e?.productId,
      startDate: e?.startDate,
      description: e?.remark,
    };
    setModalCreate(false);
    dispatch(createDistributionMedia({ ...data }))
      .unwrap()
      .then(() => {
        formCreate.resetFields();
        setModalCreate(false);

        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDistributionMedia({ id, page, pageSize, sort, search: reqSearch })
        );
        // dispatch(getDistributionMedia({ id, page, pageSize }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setTypeRetry(true);
          setBodyError({ message, value: e });

          setModalError(true);
        }
      })
      .finally(() => {
        setType(false);
        setData([]);
      });
  };

  //handle on-changes listener
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    updateSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

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

  const handleChange = (page) => {
    setPage(page);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  //handle on-changes listener
  const handleRetry = () => {
    if (typeRetry) {
      handleCreate(bodyError?.value);
    } else {
      onFinishInactive(bodyError?.value, ()=>{});
    }
    setTypeRetry(false);
    setModalError(false);
    setBodyError({});
  };

  const onFinishCreate = async (e) => {
    let url;
    let bodyRequest;
    const temp = data_product.filter(
      (item) => item.productId === e?.productName
    );
    setDataConfirm({
      ...temp[0],
      startDate: moment(e?.startDate).format("DD MMM YYYY"),
      remark: e?.remark,
    });
    bodyRequest = {
      ...temp[0],
      startDate: moment(e?.startDate).format("DD MMM YYYY"),
      remark: e?.remark
    }
    url = "/v1/dbs/api/distribution-media/validate-create";
    await dispatch(validateCreateUpdate({ body: bodyRequest, services: accountManagementService, endPoint: url, type }))?.unwrap();
    setType(true);
  };

  const onFinishInactive = (e, handleClear) => {
    const data = {
      distributionMediaId: dataInactive?.id,
      endDate: moment(e?.endDate).format("DD MMM YYYY"),
      remark: e?.remark,
    };

    setModalInactive(false);
    dispatch(inActiveDistributionMedia({ ...data }))
      .unwrap()
      .then(() => {
        // formInactive.resetFields();
        handleClear()
        setData([]);
        setModalInactive(false);
        // dispatch(getDistributionMedia({ id, page, pageSize }));

        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getDistributionMedia({ id, page, pageSize, sort, search: reqSearch })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  const handleInactive = (value) => {
    setDataInactive(value);
    setModalInactive(true);
  };

  const handleCancel = () => {
    setModalInactive(false);
  }

  const itemActions = [
    //action toolbar
    {
      action: 'Create',
      render: (
        <ButtonComponent
          onClick={() => {
            setModalCreate(true);
          }}
          type={"submit"}
          border={false}
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
        >
          Create
        </ButtonComponent>

      )
    }
  ]

  return (
    <Spin spinning={loading} className={"w-full top-20"}>
      <Fragment>
        <BaseContainer header={"DISTRIBUTION MEDIA LIST"}>
          {/* <Toolbar items={itemActions} /> */}
          <div className={"w-full flex justify-end mb-5"}>
            <ToolbarAccount items={itemActions} advancedAccess={access_account}/>
          </div>
          
          {/* <div className={"w-full flex justify-end mb-5"}>
            <ButtonComponent
              onClick={() => {
                setModalCreate(true);
              }}
              type={"submit"}
              border={false}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create
            </ButtonComponent>
          </div> */}
          <div className={"w-full mt-5"}>
            <DistributionMediaTable
              search={search}
              searchInput={searchInput}
              data={data_distribution?.result}
              handleChangeSize={handleChangeSize}
              pageSize={pageSize}
              handleChange={handleChange}
              totalElement={totalElements}
              page={page}
              onSort={onSort}
              searchText={searchText}
              searchedColumn={searchedColumn}
              handleInactive={handleInactive}
              getColumnSearchProps={getColumnSearchProps}
              setDistributionName={setDistributionName}
              accessAccount={access_account}
              handleSearch={handleSearch}
            />
          </div>
        </BaseContainer>

        {/* create*/}
        <ModalCustom
          isOpen={modalCreate}
          type={"confirmation"}
          header={type ? "CONFIRMATION" : "CHOOSE DISTRIBUTION MEDIA"}
          width={1200}
          handleCancel={() => {
            setData([]);
            formCreate.resetFields();
            setType(false);
            setModalCreate(false);
          }}
          footer={
            <div className={"w-full flex justify-end"}>
              {type ? (
                <div className="w-full flex justify-end gap-5">
                  <ButtonComponent
                    type={"default"}
                    onClick={() => {
                      setType(false);
                      // setData([]);
                      // formCreate.resetFields();
                      // setModalCreate(false);
                    }}
                  >
                    Back
                  </ButtonComponent>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    onClick={() => {
                      handleCreate(dataConfirm);
                    }}
                  >
                    Confirm
                  </ButtonComponent>
                </div>
              ) : (
                <div className="w-full flex justify-end gap-5">
                  <ButtonComponent
                    type={"default"}
                    onClick={() => {
                      setType(false);
                      setData([]);
                      formCreate.resetFields();
                      setModalCreate(false);
                    }}
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    form={"formCreate"}
                    type={"submit"}
                    htmlType="submit"
                  >
                    Save
                  </ButtonComponent>
                </div>
              )}
            </div>
          }
        >
          <Form
            id="formCreate"
            layout="vertical"
            form={formCreate}
            onFinish={onFinishCreate}
          >
            {type ? (
              <DistributionMediaConfirm data={dataConfirm} />
            ) : (
              <DistributionMediaCreate
                optionsProduct={dataProduct}
                data={data}
                handleProduct={handleProduct}
              />
            )}
          </Form>
        </ModalCustom>

        {/* modal inactive */}
        <ModalApproveOrReject
          isOpen={modalInactive}
          handleCloseModal={handleCancel}
          onFinish={onFinishInactive}
          header={'Inactive'}
          approveOrReject={'Inactive'}
          menu={"Media Distribution"}
          named={distributionName}
          children={
            <Form.Item
            name={"endDate"}
            label={"End Date"}
            rules={[
              {
                message: requiredMessage("End Date"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <DateComponent mandatory />
          </Form.Item>
          }
        />
        
        {/* <ModalApproveOrReject
          isOpen={modalInactive}
          header="Inactive Information"
          handleCancel={() => {
            setModalInactive(false);
          }}
          message={`Are you sure you want to Inactive ${dataInactive?.productName} ?`}
          width={1000}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  setModalInactive(false);
                  setDataInactive({});
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                form={"formInactive"}
                htmlType={"submit"}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id={"formInactive"}
            layout={"vertical"}
            form={formInactive}
            onFinish={onFinishInactive}
          >
            <div className="flex flex-col gap-5">
              <Form.Item
                name={"endDate"}
                label={"End Date"}
                rules={[
                  {
                    message: requiredMessage("End Date"),
                    required: true,
                  },
                ]}
                className="no-margin-form"
              >
                <DateComponent mandatory />
              </Form.Item>
              <Form.Item 
                name={"remark"} 
                label={"Remark"} 
                rules={[
                  {
                    message: requiredMessage("Remark"),
                    required: true,
                  },
                ]}
                >
                <InputComponent
                  rows={1}
                  placeholder="Type your remark"
                  type="textarea"
                />
              </Form.Item>
            </div>
          </Form>
        </ModalApproveOrReject> */}

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not ${
              typeRetry ? "Created" : "Inactive"
            }`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Fragment>
    </Spin>
  );
};

export default DistributionMedia;
