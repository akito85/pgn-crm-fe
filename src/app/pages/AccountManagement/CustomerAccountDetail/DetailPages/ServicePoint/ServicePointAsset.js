import React, { useEffect, useRef } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import { Form } from "antd";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Link } from "react-router-dom";
import { useState } from "react";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ServicePointAssetTable from "./ServicePointAssetTable";
import DetailText from "../../../../../../components/DetailText";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { requiredMessage } from "../../../../../../utils";
import DateComponent from "../../../../../../components/DateComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import { useSelector } from "react-redux";
import { dateFormatting } from "../../../../../../utils";
import moment from "moment";
import {
  getAssetAssignment,
  inActiveAsset,
} from "../../../../../../redux/slices/account_management/detailAccount/ServicePoint";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";

const ServicePointAsset = ({
  dispatch = () => {},
  id = 0,
  idAccount = 0,
  idCustomer = 0,
  type = "",
  status,
  access,
}) => {
  const { data_assetAssignment, data_detailServicePoint } = useSelector(
    (state) => state.servicePoint,
  );
  //codeDetailUser

  //declare
  const [formInactive] = Form.useForm();
  const searchInput = useRef(null);

  //modal
  const [modalInactive, setModalInactive] = useState(false);
  const [dataInactive, setDataInactive] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [statusAsset, setStatusAsset] = useState(false);

  const [startDate, setStartDate] = useState();

  const [titleActiveOrInactive, setTitleActiveOrInactive] = useState("");
  const [assetName, setAssetName] = useState("");

  //useEffect
  useEffect(() => {
    if (id && id !== 0 && id !== undefined) {
      dispatch(
        getAssetAssignment({
          id,
          page,
          pageSize,
          sort,
          search: encodeURIComponent(JSON.stringify(search)),
        }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_assetAssignment &&
      data_assetAssignment.result &&
      data_assetAssignment.result.length > 0
    ) {
      setTotalElement(data_assetAssignment?.page?.totalElements);
    }
  }, [data_assetAssignment]);

  useEffect(() => {
    setStatusAsset(status === "INACTIVE" ? true : false);
  }, [status]);

  const renderDate = (date) => {
    if (date) {
      return moment(date).format(dateFormatting.dateTime);
    } else {
      return "";
    }
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  //handle
  const handleInactive = (value) => {
    setDataInactive(value);
    setStartDate(moment(value?.installDate));
    setTitleActiveOrInactive(
      value?.status === "ACTIVE" ? "Inactivate" : "Activate",
    );
    setModalInactive(true);
    setAssetName(value?.assetName);
  };

  const handleRetry = () => {
    //code
    onFinish(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };
  const onFinish = (e, handleClear) => {
    //code
    const data = {
      assetAssignmentId: dataInactive?.id,
      uninstallDate: moment(e?.uninstallDate).format("YYYY-MM-DD"),
      remarks: e?.remark,
    };

    setModalInactive(false);
    dispatch(inActiveAsset({ ...data }))
      .unwrap()
      .then(() => {
        formInactive.resetFields();
        setDataInactive({});
        setModalInactive(false);
        handleClear();
        // dispatch(getAssetAssignment({ id, page, pageSize, sort, search }));
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(
          getAssetAssignment({ id, page, pageSize, sort, search: tempSearch }),
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

  const handleCancel = () => {
    setModalInactive(false);
    formInactive.resetFields();
  };

  const itemActions = [
    //action toolbar
    {
      action: "Create",
      render: (
        <Link
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ASSET_POINT}
          state={{
            id: id,
            idAccount: idAccount,
            idCustomer: idCustomer,
            type: type,
          }}
        >
          <ButtonComponent
            type={"submit"}
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            disabled={statusAsset}
          >
            Assign Asset
          </ButtonComponent>
        </Link>
      ),
    },
  ];

  return (
    <Fragment>
      <BaseContainer header={"ASSET ASSIGNMENT"}>
        <div className={"w-full"}>
          <div className="w-full flex justify-end mb-[30px]">
            <ToolbarAccount items={itemActions} advancedAccess={access} />
          </div>

          <ServicePointAssetTable
            data={data_assetAssignment?.result}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            onSort={onSort}
            // getColumnSearchProps={getColumnSearchProps}
            handleInactive={handleInactive}
            searchText={searchText}
            searchedColumn={searchedColumn}
            status={statusAsset}
            access={access}
            handleSearch={handleSearch}
            search={search}
            searchInput={searchInput}
          />
        </div>
      </BaseContainer>

      <BaseContainer header={"History Log Information"}>
        <div className="w-full grid grid-cols-5 gap-5">
          <DetailText label="Record ID">
            {data_detailServicePoint?.recordId}
          </DetailText>
          <DetailText label="Created Date">
            {moment(data_detailServicePoint?.createdDate).format(
              dateFormatting.dateTime,
            )}
          </DetailText>
          <DetailText label="Created By">
            {data_detailServicePoint?.createdBy}
          </DetailText>
          <DetailText label="Updated Date">
            {renderDate(data_detailServicePoint?.updateDate)}
          </DetailText>
          <DetailText label="Updated By">
            {data_detailServicePoint?.updatedBy}
          </DetailText>
        </div>
      </BaseContainer>

      {/* modal inactive */}
      <ModalApproveOrReject
        isOpen={modalInactive}
        handleCloseModal={handleCancel}
        onFinish={onFinish}
        header={titleActiveOrInactive}
        approveOrReject={titleActiveOrInactive}
        menu={"Aseet"}
        named={assetName}
        children={
          <Form.Item
            name={"uninstallDate"}
            label="Uninstall Date"
            rules={[
              {
                validator: (_, value) =>
                  (value && moment(startDate) < moment(value)) || !value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Uninstall date must After Install date"),
                      ),
              },
              {
                message: requiredMessage("Uninstall Date"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <DateComponent dateDisable={handleDisableEndDate} />
          </Form.Item>
        }
      />

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
          <p className="pl-[70px]">{`Your data was not Inactive. ${bodyError?.message}`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default ServicePointAsset;
