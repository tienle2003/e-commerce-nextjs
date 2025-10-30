"use client";
import { SectionTitle } from "@/components/inputs/SectionTitle";
import ProductItem from "@/components/product/ProductItem";
import { useProductsQuery } from "@/hooks/api/product.api";
import { useCouponsQuery } from "@/hooks/api/coupon.api";
import VoucherCard from "@/components/common/VoucherCard";
import { CouponType } from "@/types/coupon";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/timeFormat";

export default function Home() {
  const { data } = useProductsQuery({ page: 1, size: 50 });
  const productList = data?.data.items || [];
  const { data: couponData } = useCouponsQuery();
  const coupons = couponData?.data || [];
  return (
    <div className="mx-5 mt-10 sm:mx-10 md:mx-20 lg:mx-40 font-font-poppins">
      <SectionTitle title="Mã giảm giá" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {coupons.map((c) => (
          <VoucherCard
            key={c.id}
            headline={
              c.type === CouponType.PERCENTAGE
                ? `GIẢM ${c.value}%`
                : `GIẢM ĐẾN ${new Intl.NumberFormat("vi-VN").format(c.value)}đ`
            }
            code={c.code}
            minOrderText={
              c.minOrderAmout
                ? `Cho đơn hàng từ ${formatCurrency(c.minOrderAmout)}`
                : undefined
            }
            expiresAtText={`Hết hạn: ${formatDate(c.endDate)}`}
          />
        ))}
      </div>
      <SectionTitle title="Trang Phục Thể Thao" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4 p-4">
        {productList.length > 0 &&
          productList
            ?.filter((p) => p.isActive === true)
            .map((item) => <ProductItem key={item.slug} product={item} />)}
      </div>
    </div>
  );
}
