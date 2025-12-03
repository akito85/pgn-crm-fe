import React, { useCallback, useEffect, useMemo, useState } from "react";
import SVGPosition from "../../../assets/Icon/index";
import ButtonComponent from "../../../components/ButtonComponent";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  changeEntity,
  changePosition,
  chooseEntity,
  choosePosition,
  takeOverDelegation,
} from "../../../redux/slices/user_management/auth";
import { useNavigate } from "react-router-dom";
import { hasValue, renderDateConverter } from "../../../utils";
import ModalApproveOrReject from "../../../components/Modal/ModalApproveOrReject";

const CarouselListSelection = (props) => {
  const { data, type, remember, setBody = () => {} } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [record, setRecord] = useState(false);
  const { data_switch } = useSelector((state) => state?.auth);

  // Fungsi untuk handle click position dengan async/await
  const clickPosition = async (n) => {
    try {
      if (type === "position") {
        await dispatch(choosePosition({ id: n, remember: remember })).unwrap();
      } else {
        await dispatch(changePosition({ positionId: n, remember })).unwrap();
      }
      // Navigate setelah dispatch berhasil
      navigate("/");
    } catch (error) {
      console.error("Error choosing position:", error);
      // Bisa tambahkan notification error di sini jika perlu
    }
  };

  // Fungsi untuk handle click entity dengan async/await
  const clickEntity = async (n) => {
    try {
      if (type === "entity") {
        await dispatch(chooseEntity({ id: n, remember: remember })).unwrap();
      } else {
        await dispatch(changeEntity({ entityId: n, remember })).unwrap();
      }
      // Navigate setelah dispatch berhasil
      navigate("/");
    } catch (error) {
      console.error("Error choosing entity:", error);
      // Bisa tambahkan notification error di sini jika perlu
    }
  };

  // Handle take over
  const handleTakeOver = async (formvalue, handleCancel) => {
    try {
      const body = {
        ...formvalue,
        delegationId: record?.detail[0]?.delegationId,
        remember: record?.remember,
      };
      console.log(body, " body");
      setBody(body);
      await dispatch(takeOverDelegation(body)).unwrap();
      handleCancel();
      handleCancelModals();
      // Navigate setelah take over berhasil
      navigate("/");
    } catch (error) {
      console.error("Error taking over delegation:", error);
      handleCancel();
      handleCancelModals();
    }
  };

  const openTakeOver = (record) => {
    setOpenModal(true);
    setRecord({ ...record, remember: remember });
  };

  const handleCancelModals = () => {
    setOpenModal(false);
  };

  const sliderLeft = () => {
    const slider = document.getElementById("sliderTabAccount");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft - 250;
    }
  };

  const sliderRight = () => {
    const slider = document.getElementById("sliderTabAccount");
    if (slider) {
      slider.scrollLeft = slider.scrollLeft + 250;
    }
  };

  // Filter by type page
  const filterByTypePage = useCallback(
    (type) => {
      let array = [];
      if (
        (type === "position" || type === "switch-position") &&
        data?.length > 1
      ) {
        array = data.slice(0, 1);
        return array.map((item) => ({
          entityName: item?.positionName,
          entityId: item?.positionId,
          isDelegated: item?.isDelegated,
          ...item,
        }));
      } else {
        array = data?.filter((item) => item?.entityName === "ALL");
        return array;
      }
    },
    [data],
  );

  const filterData = useMemo(
    () => filterByTypePage(type),
    [filterByTypePage, type],
  );

  // Card component selection
  const RenderCards = ({ index, name, onClick = () => {} }) => {
    return (
      <div className="w-full">
        <div className="w-[420px] max-md:w-[280px] flex flex-col items-center border-[0.05rem] border-solid border-[#0075BF] rounded-md h-full justify-between py-5">
          <div className="text-center text-[#0075BF] text-[20px] font-medium max-md:text-base max-md:px-2 max-md:pb-1 px-5 w-full pb-5">
            <span className="whitespace-pre-wrap">{name}</span>
          </div>

          <SVGPosition
            name="IconSwapPosition"
            width={120}
            style={{
              fontSize: 32,
              justifyItems: "center",
            }}
            className="max-md:my-0 my-5"
          />

          {index?.detail?.map((detail_index, key) => {
            return (
              <div key={key} className="my-5 w-full flex flex-col items-center">
                <div className="w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0 border-gray-300 flex justify-between px-2">
                  <span> On delegation to </span>
                  <span>{detail_index?.on_delegation_to}</span>
                </div>
                <div className="w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0 border-gray-300 flex justify-between px-2">
                  <span> Start Date </span>
                  <span>
                    {hasValue(detail_index?.start_date) &&
                      renderDateConverter(detail_index?.start_date, "date")}
                  </span>
                </div>
                <div className="w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0 border-gray-300 flex justify-between px-2">
                  <span> End Date</span>
                  <span>
                    {hasValue(detail_index?.end_date) &&
                      renderDateConverter(detail_index?.end_date, "date")}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="mt-5 flex flex-col w-full justify-center gap-3 items-center max-md:flex-row max-md:mt-0 max-md:px-3">
            {index?.isDelegated === true && (
              <div className="max-md:w-1/2 w-1/3">
                <ButtonComponent
                  type="reject"
                  border={false}
                  onClick={() => openTakeOver(index)}
                  fullButton
                >
                  Take Over
                </ButtonComponent>
              </div>
            )}
            <div className="max-md:w-1/2 w-1/3">
              <ButtonComponent type="submit" onClick={onClick} fullButton>
                Choose
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex items-center justify-between mt-10 px-8">
      <ButtonComponent
        onClick={sliderLeft}
        icon={<LeftOutlined />}
        border={false}
      />
      <div className="w-[90%] flex gap-2 justify-center">
        <div className="flex gap-2">
          {filterData?.map((index, key) => (
            <RenderCards
              name={index?.entityName}
              index={index}
              key={key}
              onClick={
                type === "position" || type === "switch-position"
                  ? () => clickPosition(index?.entityId)
                  : () => clickEntity(index?.entityId)
              }
            />
          ))}
        </div>
        <div
          id="sliderTabAccount"
          className="flex gap-2 max-h-max overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar"
        >
          {type === "position" || type === "switch-position"
            ? data?.length > 1
              ? data?.slice(1)?.map((index, key) => {
                  return (
                    <RenderCards
                      key={key}
                      index={index}
                      name={index?.positionName}
                      onClick={() => clickPosition(index?.positionId)}
                    />
                  );
                })
              : data?.map((index, key) => {
                  return (
                    <RenderCards
                      key={key}
                      name={index?.positionName}
                      index={index}
                      onClick={() => clickPosition(index?.positionId)}
                    />
                  );
                })
            : data
                ?.filter((item) => !(item?.entityName === "ALL"))
                ?.map((index, key) => {
                  return (
                    <RenderCards
                      name={index?.entityName}
                      index={index}
                      key={key}
                      onClick={() => clickEntity(index?.entityId)}
                    />
                  );
                })}
        </div>
      </div>
      <ButtonComponent
        onClick={sliderRight}
        icon={<RightOutlined />}
        border={false}
      />

      <ModalApproveOrReject
        isOpen={openModal}
        handleCloseModal={handleCancelModals}
        onFinish={handleTakeOver}
        header="Take Over"
        customMessage={`Are you sure want to take over this named ${record?.positionName}?`}
        menu="Take Over"
        named={record?.positionName}
        width={800}
      />
    </div>
  );
};

export default CarouselListSelection;
