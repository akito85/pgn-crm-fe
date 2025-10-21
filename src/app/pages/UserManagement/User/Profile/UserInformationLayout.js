import React from "react";

const UserInformationLayout = (props) => {
  const { data, header } = props;
  return (
    <div className={"w-full flex justify-between h-[23rem]"}>
      <div className={"flex flex-col flex-wrap w-full justify-evenly"}>
        <span className={"text-primary text-xs font-bold my-3"}> {header}</span>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Username</span>
            <span>{data?.data?.username}</span>
          </div>
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Employee Id</span>
            <span>{data?.data?.employeeId ? data?.data?.employeeId : ""}</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Name</span>
            <span>
              {data?.data?.employeeName ? data?.data?.employeeName : ""}
            </span>
          </div>
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Primary Position</span>
            {data?.data?.primaryPosition?.length > 0
              ? data?.data?.primaryPosition?.map((index, key) => (
                  <span key={key}>{index?.positionName}</span>
                ))
              : ""}
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Email</span>
            <span>{data?.data?.email}</span>
          </div>
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Other Position</span>
            {data?.data?.otherPosition?.length > 0
              ? data?.data?.otherPosition?.map((index, key) => (
                  <span>{index?.positionName}</span>
                ))
              : ""}
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Mobile Phone</span>
            <span>{data?.data?.phoneNumber}</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2">
          <div className="w-full flex flex-col">
            <span className="font-semibold text-sm">Entity</span>
            <span>{data?.data?.entity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformationLayout;
