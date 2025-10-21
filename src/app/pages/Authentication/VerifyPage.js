import { Image, Spin } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { pgnLogo } from "../../../assets/img";
import ButtonComponent from "../../../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkValidateLink,
  verifyChangeEmail,
  verifyChangeEmailPhone,
  verifyChangePassword,
  verifyChangePhone,
} from "../../../redux/slices/user_management/auth";
import {
  clearBodyMessage,
  hideModalError,
} from "../../../redux/slices/general_slice";

const VerifyPage = ({ type }) => {
  const dispatch = useDispatch();
  const { loading, data } = useSelector((state) => state.auth);
  const { bodyError } = useSelector((state) => state?.general);
  const params = useParams();
  const navigate = useNavigate();
  const urlDecrypt = useMemo(() => Object.values(params)[0], [params]);
  const [titlePage, setTitlePage] = useState("");

  const typePage = useMemo(() => type, [type]);

  const setNamePage = useCallback(
    async (name) => {
      try {
        await dispatch(checkValidateLink(urlDecrypt))?.unwrap();
        if (name === "email") {
          setTitlePage("Profile Data Changes");
          await dispatch(
            verifyChangeEmail(encodeURIComponent(urlDecrypt)),
          )?.unwrap();
        } else if (name === "phone") {
          setTitlePage("Profile Data Changes");
          await dispatch(
            verifyChangePhone(encodeURIComponent(urlDecrypt)),
          )?.unwrap();
        } else if (name === "email-phone") {
          setTitlePage("Profile Data Changes");
          await dispatch(
            verifyChangeEmailPhone(encodeURIComponent(urlDecrypt)),
          )?.unwrap();
        } else {
          setTitlePage("Profile Data Changes");
          await dispatch(
            verifyChangePassword(encodeURIComponent(urlDecrypt)),
          )?.unwrap();
        }
      } catch (error) {
        console.log(error, " error");
        setTitlePage(bodyError?.title);
      }
    },
    [bodyError?.title, dispatch, urlDecrypt],
  );

  useEffect(() => {
    localStorage.clear() && sessionStorage.clear();
    setNamePage(typePage);
  }, [setNamePage, typePage]);

  return (
    <Spin spinning={loading}>
      <div
        className={`min-h-screen flex w-screen bg-blue-200 justify-center items-center`}
      >
        <div className="bg-white rounded-md  my-auto w-1/4 h-[500px] flex justify-center items-center flex-col shadow-xl">
          <Image
            src={pgnLogo}
            preview={false}
            wrapperClassName={"w-[200px]"}
            className="mb-5"
          />
          <span
            className={`mt-5 text-xl font-bold ${titlePage?.toLowerCase() === "failed" && "text-[#E50406]"}`}
          >
            {titlePage}
          </span>
          <div className={"my-10 grid grid-rows-2 place-items-center gap-3"}>
            {titlePage?.toLowerCase() === "failed" ? (
              <span className={" text-gray-400"}>{bodyError?.description}</span>
            ) : (
              <>
                <span className={"font-semibold  text-gray-400"}>
                  Hello, {data?.name}
                </span>
                <span className={" text-gray-400"}>{data?.message}</span>
              </>
            )}
          </div>
          <ButtonComponent
            type={"submit"}
            className={`mb-14`}
            onClick={() => {
              if (titlePage?.toLowerCase() === "failed") {
                dispatch(hideModalError());
                dispatch(clearBodyMessage());
              }
              navigate("/");
            }}
          >
            Back to Application
          </ButtonComponent>
        </div>
      </div>
    </Spin>
  );
};

export default VerifyPage;
