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
import ModalCustom from "../../../components/Modal/ModalCustom";
import ModalRemarkConfirmation from "../../../components/Modal/ModalRemarkConfirmation";
import { useNavigate } from "react-router-dom";
import { hasValue, renderDateConverter } from "../../../utils";
import ModalApproveOrReject from "../../../components/Modal/ModalApproveOrReject";

const CarouselListSelection = (props) => {
  const { data, type, remember, setBody = () => {} } = props;
  // const ref = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [record, setRecord] = useState(false);
  const { data_switch } = useSelector((state) => state?.auth);
  useEffect(() => {
    if (hasValue(data_switch?.token)) {
      navigate("/");
    }
  }, [data_switch, navigate]);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "red" }}
        onClick={onClick}
      />
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "green" }}
        onClick={onClick}
      />
    );
  };
  const clickPosition = (n) => {
    if (type === "position") {
      // dispatch(setRemember(remember))
      dispatch(choosePosition({ id: n, remember: remember }));
    } else {
      // dispatch(setRemember(remember))
      dispatch(changePosition({ positionId: n, remember }));
    }
  };
  const clickEntity = (n) => {
    if (type === "entity") {
      dispatch(chooseEntity({ id: n, remember: remember }));
    } else {
      dispatch(changeEntity({ entityId: n, remember }));
      // dispatch(getProfile());
      navigate("/");
      // window.location.reload()
    }
  };

  // handle take over
  const handleTakeOver = async (formvalue, handleCancel) => {
    try {
      const body = {
        ...formvalue,
        delegationId: record?.detail[0]?.delegationId,
        remember: record?.remember,
      };
      console.log(body, " body");
      setBody(body);
      dispatch(takeOverDelegation(body));
      handleCancel();
      handleCancelModals();
    } catch (error) {
      handleCancel();
      handleCancelModals();
    }
  };
  // slide button
  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const openTakeOver = (record) => {
    setOpenModal(true);
    setRecord({ ...record, remember: remember });
  };
  const handleCancelModals = () => {
    setOpenModal(false);
  };
  const handleDisplaySlide = (data) => {
    if (data <= 1) {
      return 1;
    } else if (data === 2) {
      return 2;
    } else {
      return 3;
    }
  };
  const sliderLeft = () => {
    const slider = document.getElementById("sliderTabAccount");
    slider.scrollLeft = slider.scrollLeft - 250;
  };

  const sliderRight = () => {
    const slider = document.getElementById("sliderTabAccount");
    slider.scrollLeft = slider.scrollLeft + 250;
  };

  // filter by type page
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

  // card component selection
  const RenderCards = ({ key, index, name, onClick = () => {} }) => {
    return (
      <div className="w-full" key={key}>
        <div
          className={`w-[420px] max-md:w-[280px] flex flex-col items-center border-[0.05rem] border-solid border-[#0075BF] rounded-md h-full justify-between py-5 `}
        >
          <div
            className={
              "text-center text-[#0075BF] text-[20px] font-medium max-md:text-base max-md:px-2 max-md:pb-1 px-5 w-full pb-5"
            }
          >
            <span className="whitespace-pre-wrap">{name}</span>
          </div>

          <SVGPosition
            name="IconSwapPosition"
            width={120}
            style={{
              //  color: "#0880AE",
              fontSize: 32,
              justifyItems: "center",
            }}
            className={" max-md:my-0 my-5"}
          />

          {index?.detail?.map((detail_index, key) => {
            return (
              <div className="my-5 w-full flex flex-col items-center">
                <div
                  className={
                    "w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0  border-gray-300 flex justify-between px-2"
                  }
                  key={key}
                >
                  <span> On delegation to </span>
                  <span>{detail_index?.on_delegation_to}</span>
                </div>
                <div
                  className={
                    "w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0  border-gray-300 flex justify-between px-2"
                  }
                >
                  <span> Start Date </span>
                  <span>
                    {hasValue(detail_index?.start_date) &&
                      renderDateConverter(detail_index?.start_date, "date")}
                  </span>
                </div>
                <div
                  className={
                    "w-5/6 border-solid border-b-[0.05rem] border-t-0 border-x-0  border-gray-300 flex justify-between px-2"
                  }
                >
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
                  type={"reject"}
                  border={false}
                  onClick={() => openTakeOver(index)}
                  fullButton
                >
                  Take Over
                </ButtonComponent>
              </div>
            )}
            <div className="max-md:w-1/2 w-1/3">
              <ButtonComponent type={"submit"} onClick={onClick} fullButton>
                Choose
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={"w-full flex items-center justify-between mt-10 px-8"}>
      <ButtonComponent
        onClick={sliderLeft}
        icon={<LeftOutlined />}
        border={false}
      />
      <div className="w-[90%] flex gap-2 justify-center">
        {/* <Carousel ref={ref} slidesToShow={handleDisplaySlide(data?.length)} dots={false}> */}
        <div className={`flex gap-2`}>
          {filterData?.map((index, key) => (
            <>
              <RenderCards
                name={index?.entityName}
                index={index}
                key={key}
                type={type}
                onClick={
                  type === "position" || type === "switch-position"
                    ? () => clickPosition(index?.entityId)
                    : () => clickEntity(index?.entityId)
                }
              />
            </>
          ))}
        </div>
        <div
          id="sliderTabAccount"
          className={`flex gap-2 max-h-max overflow-x-auto scroll whitespace-nowrap scroll-smooth no-scrollbar`}
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
                    <>
                      <RenderCards
                        name={index?.entityName}
                        index={index}
                        key={key}
                        onClick={() => clickEntity(index?.entityId)}
                      />
                    </>
                  );
                })}
        </div>
        {/* </Carousel> */}
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
        header={"Take Over"}
        customMessage={`Are you sure want to take over this named ${record?.positionName}?`}
        menu={"Take Over"}
        named={record?.positionName}
        width={800}
      />
    </div>
  );
};

export default CarouselListSelection;
