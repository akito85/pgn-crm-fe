import React from "react";
import { Steps, Row, Col, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";

export const FormStepper = ({ steps, current, onPrev, onNext }) => {
    return (
        <div className="bg-white rounded-lg border border-[#D6E1F0] p-6 mb-6">
            <div className="flex flex-row items-center justify-between w-full">
                <div
                    style={{
                        width: "36px",
                        height: "36px",
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
                    <LeftOutlined style={{ fontSize: "14px", color: current > 0 ? "#0075BF" : "#BDBDBD" }} />
                </div>
                <div className="flex-1 px-10">
                    <Row justify="center">
                        <Col xs={24} md={18} lg={16}>
                            <Steps
                                current={current}
                                labelPlacement="vertical"
                                items={steps.map((s, i) => ({
                                    title: s.title,
                                    icon: (
                                        <div
                                            style={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: "50%",
                                                background: i <= current ? "#0075BF" : "#9E9E9E",
                                                color: "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: 600,
                                                fontSize: "12px",
                                                zIndex: 2,
                                                position: "relative",
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                    ),
                                }))}
                            />
                        </Col>
                    </Row>
                </div>
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: current < steps.length - 1 ? "transparent" : "#E0E0E0",
                        border: current < steps.length - 1 ? "1px solid #0075BF" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: current < steps.length - 1 ? "pointer" : "not-allowed",
                    }}
                    onClick={() => current < steps.length - 1 && onNext && onNext()}
                >
                    <RightOutlined style={{ fontSize: "14px", color: current < steps.length - 1 ? "#0075BF" : "#BDBDBD" }} />
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
                    <Button
                        icon={
                            <SVGIcon
                                name={type === "update" ? `IconButtonReset` : `IconButtonClear`}
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
                    <Button
                        onClick={onSaveDraft}
                        style={{
                            backgroundColor: "#E6F1F9",
                            borderColor: "#E6F1F9",
                            color: "#0075BF",
                            borderRadius: "6px",
                            height: "32px",
                            fontSize: "12px",
                        }}
                    >
                        Save as Draft
                    </Button>
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
                    {current < totalSteps - 1 ? (
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
                            style={{
                                backgroundColor: "#388E3C",
                                borderColor: "#388E3C",
                                color: "#fff",
                                borderRadius: "6px",
                                height: "32px",
                                fontSize: "12px",
                            }}
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
