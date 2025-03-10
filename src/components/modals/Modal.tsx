"use client";
import React, { useEffect } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { closeModal } from "@/redux/modalSlice";
import { AuthForm } from "./AuthForm";
import { ModalType } from "@/types/modal";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { VerifyCodeForm } from "./VerifyCodeForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { AddressForm } from "./AddressForm";

export const Modal = () => {
  const { isOpen, type } = useAppSelector((state: RootState) => state.modal);
  const dispatch = useAppDispatch();
  const renderContent = () => {
    switch (type) {
      case ModalType.ADDRESS:
        return <AddressForm />;
      case ModalType.LOGIN:
        return <AuthForm />;
      case ModalType.REGISTER:
        return <AuthForm />;
      case ModalType.FORGOT_PASSWORD:
        return <ForgotPasswordForm />;
      case ModalType.RESET_PASSWORD:
        return <ResetPasswordForm />;
      case ModalType.VERIFY_CODE:
        return <VerifyCodeForm />;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  if (!isOpen) return;
  return (
    <div
      onClick={() => dispatch(closeModal())}
      className="fixed inset-0 bg-[#00000080] z-50"
    >
      <div onClick={(e) => e.stopPropagation()}>{renderContent()}</div>
    </div>
  );
};
