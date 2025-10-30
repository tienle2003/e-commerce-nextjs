"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from "next/navigation";

import { CategoryList } from "@/components/layouts/category/CategoryList";
import { HeaderProfile } from "./HeaderProfile";
import { CartBlackIcon } from "@/components/icons/CartBlackIcon";
import { useProductsQuery } from "@/hooks/api/product.api";
import { useDebounce } from "@/hooks/useDebounce";
import { useCarts } from "@/hooks/api/cart.api";
import SearchPanel from "./SearchPanel";
import { RootState, useAppSelector } from "@/redux/store";

export const Header = () => {
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const debouncedSetKeyword = useDebounce((value: string) => {
    setKeyword(value);
    setIsLoading(false);
  }, 500);

  const userId = useAppSelector((state: RootState) => state.user.id);

  const { data: searchResult } = useProductsQuery({
    page: 1,
    size: 5,
    keyword,
    enabled: Boolean(keyword),
  });
  const { data: carts } = useCarts({
    enabled: !!userId,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlKeyword = searchParams.get("keyword") || "";

  useEffect(() => {
    setSearchValue(urlKeyword);
  }, [urlKeyword]);

  // Handler: click outside search panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    }
    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  // Handler: search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true);
      setSearchValue(e.target.value);
      debouncedSetKeyword(e.target.value);
    },
    [debouncedSetKeyword],
  );

  // Handler: focus search input
  const handleSearchFocus = useCallback(() => {
    setIsSearchActive(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.replace(
        `/search?keyword=${encodeURIComponent(searchValue.trim())}`,
      );
      setIsSearchActive(false);
    }
  };
  const cartCount = carts?.data?.items?.length ?? 0;
  const searchItems =
    searchResult?.data?.items.filter((p) => p.isActive === true) ?? [];
  const totalRemaining = (searchResult?.data?.totalItems ?? 0) - 5;

  return (
    <div className="top-0 sticky w-full z-40">
      <div className="flex relative flex-col md:flex-row bg-secondary items-center justify-between py-3 px-4 md:px-8 lg:px-20 xl:px-36 gap-3 md:gap-0 z-50">
        <Link
          href="/"
          className="flex-shrink-0 flex items-center gap-2 order-1 md:order-none"
        >
          <Image
            src="/logo_2.jpg"
            alt="logo"
            width={48}
            height={48}
            sizes="(max-width: 768px) 64px, 300px"
            className="rounded-full"
          />
          <span className="text-lg font-semibold tracking-widest">
            RICONSPORT
          </span>
        </Link>
        <form
          className="relative w-full md:w-1/2 order-2 md:order-none mt-2 md:mt-0"
          onSubmit={handleSearchSubmit}
        >
          <input
            ref={inputRef}
            type="search"
            id="location-search"
            className="focus:border-gray-500 border border-gray-300 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md outline-none"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            autoComplete="off"
          />
          <button
            type="submit"
            className="flex items-center justify-center absolute top-0 end-0 h-full px-4 text-sm font-medium text-white bg-primary rounded-e-md"
          >
            <CiSearch size={20} />
          </button>
        </form>
        <div className="flex gap-3 items-center order-3 md:order-none w-full md:w-auto justify-end">
          <Link href="/cart" className="relative">
            <CartBlackIcon />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-6 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
          <HeaderProfile />
        </div>
      </div>
      {isSearchActive && (
        <SearchPanel
          isLoading={isLoading}
          searchItems={searchItems}
          totalRemaining={totalRemaining}
          keyword={keyword}
          onClose={() => setIsSearchActive(false)}
          panelRef={panelRef}
        />
      )}
      {!isSearchActive && (
        <div className="hidden md:block">
          <CategoryList />
        </div>
      )}
    </div>
  );
};
