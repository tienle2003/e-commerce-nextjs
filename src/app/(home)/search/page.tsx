"use client";
import BasicSelectInput from "@/components/inputs/BasicSelectInput";
import ProductItem from "@/components/product/ProductItem";
import { FilterColor } from "@/components/search/ColorFilter";
import PriceRangeSlider from "@/components/search/PriceRangeSlider";
import Pagination from "@/components/common/Pagination";
import { useProductsQuery } from "@/hooks/api/product.api";
import { Product } from "@/types/product";
import { sortOptions, SortType } from "@/types/sortType";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import NoSearchResult from "@/components/header/NoSearchResult";
import { useDebounce } from "@/hooks/useDebounce";
import { ITEMS_PER_PAGE } from "@/constants";
import { useUrlSync } from "@/hooks/useUrlSync";
import CustomButton from "@/components/layouts/CustomBtn";

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  const {
    sortType,
    setSortType,
    selectedColor,
    setSelectedColor,
    priceRange,
    setPriceRange,
    currentPage,
    setCurrentPage,
  } = useUrlSync(searchParams);

  const filters = useMemo(
    () => ({
      color: selectedColor || undefined,
      price: priceRange ? `${priceRange[0]}_${priceRange[1]}` : undefined,
      sort: sortType !== SortType.DEFAULT ? sortType : undefined,
    }),
    [selectedColor, priceRange, sortType],
  );

  const [pendingPriceRange, setPendingPriceRange] = useState<
    [number, number] | null
  >(priceRange);

  const debouncedSetPriceRange = useDebounce((range: [number, number]) => {
    setPriceRange(range);
  });

  const handleSliderChange = (range: [number, number]) => {
    setPendingPriceRange(range);
    debouncedSetPriceRange(range);
  };

  const handleSortChange = useCallback(
    (value: string | number) => {
      setSortType(value as SortType);
      setCurrentPage(1);
    },
    [setSortType, setCurrentPage],
  );

  const handleResetFilters = useCallback(() => {
    setSelectedColor(null);
    setPriceRange(null);
    setSortType(SortType.DEFAULT);
    setCurrentPage(1);
    setPendingPriceRange(null);
  }, [setSelectedColor, setPriceRange, setSortType, setCurrentPage]);

  useEffect(() => {
    setPendingPriceRange(priceRange);
  }, [priceRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedColor, priceRange, sortType, keyword]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (filters.price) params.set("price", filters.price);
    if (filters.color) params.set("color", filters.color);
    if (filters.sort) params.set("sort", filters.sort);
    if (currentPage > 1) params.set("page", String(currentPage));

    const newUrl = `/search?${params.toString()}`;
    if (newUrl !== `/search?${searchParams.toString()}`) {
      router.replace(newUrl);
    }
  }, [keyword, filters, currentPage]);

  const { data: searchResult, error } = useProductsQuery({
    page: currentPage,
    size: ITEMS_PER_PAGE,
    keyword: keyword!,
    color: filters.color,
    price: filters.price,
    sort: filters.sort,
  });
  const searchItems =
    searchResult?.data?.items.filter((p) => p.isActive === true) ?? [];
  const total = searchResult?.data?.totalItems || 0;
  const totalPages = searchResult?.data?.totalPages || 0;

  const showNoResults =
    searchItems.length === 0 &&
    !filters.color &&
    !filters.price &&
    !filters.sort;

  if (showNoResults) {
    return (
      <div className="mx-2 mt-4 sm:mx-5 md:mx-10 lg:mx-20 font-font-poppins py-6 sm:py-10 md:py-14">
        <NoSearchResult keyword={keyword!} />
      </div>
    );
  }

  return (
    <div className="mx-2 mt-4 sm:mx-5 md:mx-10 lg:mx-20 font-font-poppins py-6 sm:py-10 md:py-14">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <aside className="w-full md:max-w-[200px] mb-6 md:mb-0">
          <PriceRangeSlider
            min={0}
            max={priceRange?.[1] || 1500000}
            value={pendingPriceRange || [0, 1500000]}
            onChange={handleSliderChange}
          />
          <FilterColor
            selectedColor={selectedColor}
            onChange={(color) => setSelectedColor(color)}
          />
          <div className="border-t-[0.5px] border-[#e9e9e9]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold py-4 text-base">Cài lại</h2>
            </div>
            <CustomButton
              className="w-full"
              size="small"
              onClick={handleResetFilters}
            >
              Xóa bộ lọc
            </CustomButton>
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-lg sm:text-xl leading-6 font-light border-r border-gray-500 pr-4">
              Kết quả tìm kiếm: <b>{keyword}</b>
            </div>
            <div className="text-sm leading-[18px] font-light">
              {total} sản phẩm
            </div>
          </div>
          <hr className="border-dashed border border-gray-500 my-2 sm:my-4" />
          <div className="my-6 sm:my-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-11">
            <span className="text-base leading-[18px] text-[#555555]">
              Sắp xếp theo
            </span>
            <div className="w-full sm:w-[200px]">
              <BasicSelectInput
                size="small"
                value={sortType}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {searchItems.map((product: Product) => (
              <div key={product.id}>
                <ProductItem product={product} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
