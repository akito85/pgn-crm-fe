import React, { useRef, useEffect } from "react";
import { Steps, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";

export const FormStepper = ({ steps, current, onPrev, onNext }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current && steps.length >= 5) {
      const container = scrollContainerRef.current;
      const stepWidth = container.scrollWidth / steps.length;
      const scrollPosition =
        stepWidth * current - container.clientWidth / 2 + stepWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }, [current, steps.length]);

  return (
    <div className="bg-white rounded-lg border border-[#D6E1F0] p-3 mb-4">
      <div className="flex flex-row items-center justify-between w-full">
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: current > 0 ? "transparent" : "#E0E0E0",
            border: current > 0 ? "1px solid #0075BF" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current > 0 ? "pointer" : "not-allowed",
          }}
          onClick={() => current > 0 && onPrev && onPrev()}
        >
          <LeftOutlined
            style={{
              fontSize: "12px",
              color: current > 0 ? "#0075BF" : "#BDBDBD",
            }}
          />
        </div>
        <div
          ref={scrollContainerRef}
          className="flex-1 px-4 overflow-x-auto"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          <div
            style={{
              minWidth: steps.length >= 5 ? `${steps.length * 100}px` : "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Steps
              current={current}
              labelPlacement="vertical"
              size="small"
              style={{
                width: steps.length < 5 ? `${steps.length * 180}px` : "100%",
              }}
              items={steps.map((s, i) => ({
                title: (
                  <span style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                    {s.title}
                  </span>
                ),
                icon: (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: i <= current ? "#0075BF" : "#9E9E9E",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "11px",
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    {i + 1}
                  </div>
                ),
              }))}
            />
          </div>
        </div>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor:
              current < steps.length - 1 ? "transparent" : "#E0E0E0",
            border: current < steps.length - 1 ? "1px solid #0075BF" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current < steps.length - 1 ? "pointer" : "not-allowed",
          }}
          onClick={() => current < steps.length - 1 && onNext && onNext()}
        >
          <RightOutlined
            style={{
              fontSize: "12px",
              color: current < steps.length - 1 ? "#0075BF" : "#BDBDBD",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const FormFooter = ({
  current,
  totalSteps,
  onPrev,
  onNext,
  onCancel,
  onClear,
  onSaveDraft,
  type,
  onSubmit,
  useClearData = true,
  useSaveDraft = true,
  isLoading = false,
  isApprover = false,
  useNavigation = true,
  saveDraftLabel = "Save as Draft",
  saveDraftStyle = {},
  disableSubmit = false,
  disableSaveDraft = false,
  usePrevious = true,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
      <div className="flex w-full justify-between items-center">
        <ButtonComponent
          onClick={onCancel}
          className="!border-[#0075BF] !text-[#0075BF]"
        >
          Cancel
        </ButtonComponent>
        <div className="flex items-center gap-3">
          {!isApprover && useClearData && (
            <Button
              icon={
                <SVGIcon
                  name={
                    type === "update" ? `IconButtonReset` : `IconButtonClear`
                  }
                  width={18}
                />
              }
              onClick={onClear}
              style={{
                backgroundColor: "#BE3036",
                borderColor: "#BE3036",
                color: "#fff",
                borderRadius: "6px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              {type === "update" ? "Reset Data" : "Clear Data"}
            </Button>
          )}
          {!isApprover && useSaveDraft && (
            <Button
              onClick={onSaveDraft}
              disabled={disableSaveDraft || isLoading}
              style={{
                backgroundColor: disableSaveDraft || isLoading ? "#E0E3E9" : "#E6F1F9",
                borderColor: disableSaveDraft || isLoading ? "#E0E3E9" : "#E6F1F9",
                color: disableSaveDraft || isLoading ? "#BFC4D0" : "#0075BF",
                borderRadius: "6px",
                height: "32px",
                fontSize: "12px",
                ...saveDraftStyle,
              }}
            >
              {saveDraftLabel}
            </Button>
          )}
          
          {useNavigation && (
            <>
              {usePrevious && (
                <Button
                  disabled={current === 0}
                  onClick={onPrev}
                  style={{
                    backgroundColor: current === 0 ? "#E0E3E9" : "#fff",
                    borderColor: current === 0 ? "#E0E3E9" : "#DADDE5",
                    color: current === 0 ? "#BFC4D0" : "#4B465C",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                    border: "1px solid #DADDE5",
                  }}
                >
                  Previous
                </Button>
              )}
              {!isApprover &&
                (current < totalSteps - 1 ? (
                  <Button
                    key="btn-next"
                    htmlType="button"
                    onClick={onNext}
                    type="primary"
                    style={{
                      backgroundColor: "#0075BF",
                      borderColor: "#0075BF",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    key="btn-submit"
                    htmlType="button"
                    onClick={onSubmit}
                    type="primary"
                    loading={isLoading}
                    disabled={disableSubmit || isLoading}
                    style={{
                      backgroundColor: disableSubmit || isLoading ? "#E0E3E9" : "#388E3C",
                      borderColor: disableSubmit || isLoading ? "#E0E3E9" : "#388E3C",
                      color: disableSubmit || isLoading ? "#BFC4D0" : "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                    }}
                  >
                    Submit
                  </Button>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
