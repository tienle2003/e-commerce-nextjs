"use client";
import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import YoutubeSearchedForOutlinedIcon from "@mui/icons-material/YoutubeSearchedForOutlined";
import { CustomTitle } from "@/components/CustomTitle";
import CustomButton from "@/components/CustomBtn";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { openModal } from "@/redux/modalSlice";
import { AuthModalType } from "@/types/authModal";

export const HeaderProfile = () => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const { firstName } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  const [authModal, setAuthModal] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  useEffect(() => {
    if (isAuthenticated) {
      setAuthModal(false);
      setShowDropdown(false);
    }
  }, [isAuthenticated]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      {isAuthenticated ? (
        <Avatar alt={firstName} src="/static/images/avatar/1.jpg" />
      ) : (
        <AccountCircleOutlinedIcon />
      )}
      <div className="absolute top-full left-0 w-full h-3 bg-transparent"></div>
      <div
        className={`absolute cursor-pointer right-0 rounded-sm bg-white top-full mt-3 z-20 shadow-custom min-w-[290px] font-normal ${
          showDropdown && !authModal ? "block" : "hidden"
        }`}
      >
        {isAuthenticated ? (
          <>
            <div className="mx-4 p-5 pb-2 flex border-b border-[#e9e9e9] gap-2">
              <Avatar alt={firstName} src="/static/images/avatar/1.jpg" />
              <div className="text-xs leading-4">
                <div className="font-extrabold  ">Le Minh Tien</div>
                <div className="mt-[5px] font-medium"> Điểm thưởng: 0</div>
              </div>
            </div>
            <div className="mt-4 mb-9">
              <div className="flex gap-[10px] py-2 pl-6 text-sm font-medium leading-[18px] hover:bg-secondary">
                <LibraryBooksOutlinedIcon fontSize="small" />
                <span>Đơn hàng</span>
              </div>
              <div className="flex gap-[10px] py-2 pl-6 text-sm font-medium leading-[18px] hover:bg-secondary">
                <YoutubeSearchedForOutlinedIcon fontSize="small" />
                <span>Sản phẩm đã xem</span>
              </div>
              <div
                onClick={handleLogout}
                className="flex text-primary gap-[10px] py-2 pl-6 text-sm font-medium leading-[18px] hover:bg-secondary"
              >
                <LogoutOutlinedIcon fontSize="small" />
                <span>Đăng xuất</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="pb-6 border-b border-[#e9e9e9]">
              <div className="uppercase mb-6">
                <CustomTitle content="Chào mừng quý khách" />
                <CustomTitle content="Đến với TOKYOLIFE" />
              </div>
              <h3 className="text-xs mb-4">
                Đăng nhập tài khoản của Quý Khách
              </h3>
              <CustomButton
                onClick={() => dispatch(openModal(AuthModalType.LOGIN))}
                size="small"
                className="rounded text-secondary"
              >
                Đăng nhập
              </CustomButton>
            </div>
            <div className="pt-6">
              <CustomTitle className="mb-6" content="Đăng ký thành viên" />
              <CustomButton
                size="small"
                onClick={() => dispatch(openModal(AuthModalType.REGISTER))}
                className="rounded bg-inherit border border-[#eeeeee] ease-in duration-150 text-black bg-white hover:bg-primary hover:text-secondary"
              >
                Đăng ký
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
