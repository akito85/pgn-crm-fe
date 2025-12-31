import { Fragment, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Spin } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import RelationshipTable from "./RelationshipTable";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import NxFilter from "../../../../../../components/Nx/NxFilter";
import { getRelationshipColumnApi, getRelationshipConditionApi, getRelationshipOperatorApi, downloadRelationship } from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { CheckOutlined, DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import NotFound from "../../../../../NotFound";

const Relationship = ({ id = 0, type = "standard", idCustomer = null }) => {
  const dispatch = useDispatch();
  const relationshipState = useSelector((state) => state.relationship);
  const { loading } = relationshipState;
  const { access_account } = useSelector((state) => state.accountManagement);
  const [formQuery] = Form.useForm();
  const location = useLocation();
  const [isAccessChecked, setIsAccessChecked] = useState(false);

  // Check granted access when component mounts - must complete before data fetch
  useEffect(() => {
    setIsAccessChecked(false);
    const path = location?.pathname.includes('account-standard')
      ? '/account-management/account-standard/relationship'
      : '/account-management/account-onetime/relationship';

    dispatch(getGrantedAccessAccount(path))
      .unwrap()
      .then(() => setIsAccessChecked(true))
      .catch(() => setIsAccessChecked(true));
  }, [dispatch, location?.pathname]);

  const isAccessGranted = access_account?.isGranted === true;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [inputFields, setInputFields] = useState([]);
  const [tempInputFields, setTempInputFields] = useState([]);
  const [modalQuery, setModalQuery] = useState(false);
  const [approvalMode, setApprovalMode] = useState(false);
  const [listType, setListType] = useState("all");

  const handleOpenFilter = () => {
    setModalQuery(true);
  };

  const handleCancelQuery = () => {
    formQuery.resetFields();
    setModalQuery(false);
    setTempInputFields(inputFields);
  };

  const handleSaveQuery = () => {
    const queryValues = formQuery.getFieldValue("query");
    if (queryValues) {
      const formattedQuery = queryValues.map((item) => ({
        condition: item.condition,
        column: item.column,
        operator: item.operator,
        value: item.value,
      }));
      setInputFields(formattedQuery);
      setTempInputFields(formattedQuery);
    }
    setModalQuery(false);
    setPage(1);
  };

  const handleFirstQuery = () => {
    const queries = formQuery.getFieldValue("query");
    if (queries && queries.length > 0) {
      formQuery.setFieldsValue({
        query: queries.map((item, index) => ({
          ...item,
          condition: index === 0 ? 1311 : item.condition,
        })),
      });
    }
  };

  /**
   * Handle entering or exiting approval mode
   * When entering: set listType = "approval"
   * When exiting: set listType = "all"
   * @param {boolean} newApprovalMode
   */
  const handleIsApproval = (newApprovalMode) => {
    if (newApprovalMode) {
      // ENTERING APPROVAL MODE
      setPage(1);
      setListType("approval");
      setApprovalMode(true);
    } else {
      // EXITING APPROVAL MODE
      setSearchText("");
      setSearchedColumn("");
      setPage(1);
      setListType("all");
      setApprovalMode(false);
    }
  };

  const handleDownload = () => {
    const body = {
      page,
      size: pageSize,
      sort,
      inputFields: tempInputFields,
      searchs: search,
      listType: listType,
    };

    dispatch(downloadRelationship({ idAccount: id, body }));
  };

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      {
        !isAccessChecked ?
          <div className="w-full flex justify-center py-10">
            <Spin tip="Checking access..." />
          </div>
         : !isAccessGranted ?
          <NotFound type={"unauthorized"} />
         : 
        <BaseContainer header={"RELATIONSHIP LIST"}>
            <>
              {!approvalMode ? (
                <div className="w-full flex justify-between mb-[30px]">
                  <ButtonComponent
                    icon={
                      <FilterOutlined
                        style={{
                          color: "#fff",
                          fontSize: 20,
                        }}
                      />
                    }
                    type="submit"
                    onClick={handleOpenFilter}
                  >
                    Filters
                  </ButtonComponent>

                  <div className="flex gap-3">
                    <ButtonComponent
                      type={"submit"}
                      onClick={handleDownload}
                      icon={
                        <DownloadOutlined
                          style={{
                            color: "#fff",
                            fontSize: 20,
                          }}
                        />
                      }
                      style={{
                        backgroundColor: "#0075bf",
                        color: "#fff",
                        borderColor: "#0075bf",
                        border: "1px solid #0075bf",
                        borderRadius: "5px",
                        height: "48px"
                      }}
                    >
                      Download List
                    </ButtonComponent>
                    <ButtonComponent
                      type={"submit"}
                      onClick={() => handleIsApproval(true)}
                      icon={
                        <CheckOutlined
                          style={{
                            color: "#fff",
                            fontSize: 20,
                          }}
                        />
                      }
                      style={{
                        backgroundColor: "#0075bf",
                        color: "#fff",
                        borderColor: "#0075bf",
                        border: "1px solid #0075bf",
                        borderRadius: "5px",
                        height: "48px"
                      }}
                    >
                      Approval
                    </ButtonComponent>

                    <NavLink
                      to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP}
                      state={{ idAccount: id, idCustomer: idCustomer, type: type }}
                    >
                      <ButtonComponent
                        type={"submit"}
                        icon={<SVGIcon name="IconButtonCreate" width={24} />}
                      >
                        Create
                      </ButtonComponent>
                    </NavLink>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-end mb-[30px]">
                  <ButtonComponent
                    type="default"
                    onClick={() => handleIsApproval(false)}
                  >
                    Cancel Approval
                  </ButtonComponent>
                </div>
              )}

              <div className={"w-full mt-5"}>
                <RelationshipTable
                  idAccount={id}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  searchedColumn={searchedColumn}
                  setSearchedColumn={setSearchedColumn}
                  searchText={searchText}
                  setSearchText={setSearchText}
                  sort={sort}
                  setSort={setSort}
                  search={search}
                  setSearch={setSearch}
                  approvalMode={approvalMode}
                  handleIsApproval={handleIsApproval}
                  type={type}
                  idCustomer={idCustomer}
                  inputFields={inputFields}
                  tempInputFields={tempInputFields}
                  listType={listType}
                  isAccessGranted={isAccessGranted}
                />
              </div>
            </>
        </BaseContainer>
      }

      {/* Modal Filter */}
      <ModalCustom
        isOpen={modalQuery}
        type={"confirmation"}
        header={"QUERY"}
        width={1200}
        handleCancel={handleCancelQuery}
      >
        <Form form={formQuery} layout="vertical" onFinish={handleSaveQuery} id={"relationshipFilterForm"}>
          <NxFilter
            form={formQuery}
            onCancel={handleCancelQuery}
            dispatch={dispatch}
            getColumnApi={getRelationshipColumnApi}
            getConditionApi={getRelationshipConditionApi}
            getOperatorApi={getRelationshipOperatorApi}
            reduxState={relationshipState}
            maxFilters={5}
            loading={loading}
            formId="relationshipFilterForm"
          />
        </Form>
      </ModalCustom>
    </Fragment>
    // </Spin>
  );
};

export default Relationship;
