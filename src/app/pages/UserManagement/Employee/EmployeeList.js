import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RadioTabs from "../../../../components/RadioTabs";

import EmployeeAssigmentList from "./EmployeeAssigmentList";
import EmployeeUploadList from "./EmployeeUploadList";
import { useEffect } from "react";
import {
  getListEmpType,
  getListJob,
  getListPosition,
} from "../../../../redux/slices/user_management/employee";

const EmployeeList = (props) => {
  const {
    employeeList,
    onChangeEmployeeList = () => {},
    assigmentEmployeeList,
    onChangeAssignmentEmployeeList = () => {},
  } = props;
  const { data_emp, data_post, data_job } = useSelector(
    (state) => state.employee
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const tabData = [{ value: "EMPLOYEE" }, { value: "EMPLOYEE ASSIGNMENT" }];
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  useEffect(() => {
    dispatch(getListEmpType());
    dispatch(getListJob());
    dispatch(getListPosition());
  }, [dispatch]);
  const dataEmployeeTypeMapped = data_emp?.data?.map((item) => {
    return {
      value: item?.empType,
      label: item?.name,
    };
  });

  const dataJobMapped = data_job?.data?.map((item) => {
    return {
      value: item?.jobId,
      label: item?.jobName,
    };
  });
  const dataPositionMapped = data_post?.data?.map((item) => {
    return {
      value: item?.positionId,
      label: item?.name,
    };
  });
  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  return (
    // <BaseContainer
    //   header={`${
    //     segmentedPage === tabData[0]?.value ? "EMPLOYEE" : "ASSIGMENT EMPLOYEE"
    //   } LIST`}
    //   type={"tabs"}
    //   element={<RadioTabs data={tabData} onChange={handleSegmentedPage} />}
    // >
    <div className="bg-white w-full mt-[30px] p-[20px]">
      <div className="p-4">
        <div className="text-primary text-xs font-bold uppercase">
          {` LIST UPLOAD ${
            segmentedPage === tabData[0]?.value
              ? "EMPLOYEE"
              : "ASSIGMENT EMPLOYEE"
          }`}
        </div>
      </div>

      <div className="p-4">
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />
      </div>
      <div className="p-4">
        {segmentedPage === "EMPLOYEE" ? (
          <EmployeeUploadList
            dataEmp={employeeList}
            dataEmployeeType={dataEmployeeTypeMapped}
            onChangeData={onChangeEmployeeList}
          />
        ) : (
          <EmployeeAssigmentList
            dataAss={assigmentEmployeeList}
            dataJob={dataJobMapped}
            dataPosition={dataPositionMapped}
            onChangeData={onChangeAssignmentEmployeeList}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
