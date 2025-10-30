"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import ComponentCard from "@/components/admin/common/ComponentCard";
import CustomButton from "@/components/layouts/CustomBtn";
import TextInput from "@/components/inputs/TextInput";
import RadioInput from "@/components/inputs/RadioInput";
import RangeInput from "@/components/inputs/RangeInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Stack, TextField } from "@mui/material";
import CustomLabel from "@/components/layouts/CustomLabel";
import dayjs from "dayjs";
import { CouponType } from "@/types/coupon";
import { useCreateCouponMutation } from "@/hooks/api/coupon.api";
import useToastify from "@/hooks/useToastify";

const breadcrumbItems = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "Coupons", path: "/admin/coupons" },
];

const createCouponSchema = z
  .object({
    code: z.string().min(3, "Minimum 3 characters"),
    description: z.string().optional(),
    type: z.nativeEnum(CouponType),
    value: z
      .number({ invalid_type_error: "Invalid value" })
      .positive("Must be > 0"),
    minOrderAmout: z.number().nullable().optional(),
    maxDiscountAmount: z.number().nullable().optional(),
    startDate: z.string(),
    endDate: z.string(),
    usageLimit: z
      .number({ invalid_type_error: "Invalid limit" })
      .int()
      .nonnegative(),
  })
  .refine((data) => dayjs(data.startDate).isBefore(dayjs(data.endDate)), {
    message: "Start date must be before end date",
    path: ["endDate"],
  })
  .refine(
    (data) => (data.type === CouponType.PERCENTAGE ? data.value <= 100 : true),
    { message: "Percentage cannot exceed 100%", path: ["value"] },
  );

type CreateCouponFormValues = z.infer<typeof createCouponSchema>;

const defaultValues: CreateCouponFormValues = {
  code: "",
  description: "",
  type: CouponType.PERCENTAGE,
  value: 0,
  minOrderAmout: null,
  maxDiscountAmount: null,
  startDate: dayjs().toISOString(),
  endDate: dayjs().add(7, "day").toISOString(),
  usageLimit: 0,
};

const CouponCreatePage = () => {
  const { showSuccess, showError } = useToastify();
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCouponMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateCouponFormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(createCouponSchema),
  });

  const onSubmit: SubmitHandler<CreateCouponFormValues> = async (form) => {
    try {
      const payload = {
        ...form,
        // ensure backend receives ISO strings
        startDate: dayjs(form.startDate).toISOString(),
        endDate: dayjs(form.endDate).toISOString(),
      };
      const res = await mutateAsync(payload);
      showSuccess(res.message || "Coupon created successfully");
      router.push("/admin/coupons");
    } catch (err) {
      showError("Failed to create coupon");
    }
  };

  const type = watch("type");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageBreadcrumb pageTitle="Create" breadcrumbs={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ComponentCard title="General Information" className="col-span-2">
          <TextInput
            isRequired
            label="Coupon Code"
            name="code"
            control={control}
            errMsg={errors.code?.message}
            isError={!!errors.code}
            placeHolder="e.g. SALE10"
          />

          <TextInput
            label="description"
            name="description"
            control={control}
            errMsg={errors.description?.message}
            type="textarea"
            isError={!!errors.description}
            placeHolder="Brief description"
          />

          <RadioInput
            name="type"
            control={control}
            label="Discount Type"
            isError={!!errors.type}
            errMsg={errors.type?.message}
            options={[
              { id: CouponType.PERCENTAGE, name: "Percentage" },
              { id: CouponType.FIXED, name: "Fixed Amount" },
            ]}
            isRequired
          />

          {type === CouponType.PERCENTAGE ? (
            <div className="py-2">
              <RangeInput
                name="value"
                control={control}
                label="Set Discount Percentage"
                isRequired
                min={0}
                max={100}
                step={5}
                isError={!!errors.value}
                errMsg={errors.value?.message}
              />
            </div>
          ) : (
            <TextInput
              isRequired
              label="Amount (VND)"
              name="value"
              type="number"
              control={control}
              errMsg={errors.value?.message}
              isError={!!errors.value}
              placeHolder="Enter amount"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Minimum Order Amount (VND)"
              name="minOrderAmout"
              type="number"
              control={control}
              errMsg={errors.minOrderAmout?.message}
              isError={!!errors.minOrderAmout}
              placeHolder="Optional"
            />
            <TextInput
              label="Maximum Discount Amount (VND)"
              name="maxDiscountAmount"
              type="number"
              control={control}
              errMsg={errors.maxDiscountAmount?.message}
              isError={!!errors.maxDiscountAmount}
              placeHolder="Optional"
            />
          </div>
        </ComponentCard>

        <ComponentCard title="Time & Limits" className="h-fit">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Stack spacing={0.5}>
                <CustomLabel label="Start Date" isRequired={true} />
                <TextField
                  type="datetime-local"
                  size="small"
                  value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    field.onChange(dayjs(e.target.value).toISOString())
                  }
                />
              </Stack>
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Stack spacing={0.5}>
                <CustomLabel label="End Date" isRequired={true} />
                <TextField
                  type="datetime-local"
                  size="small"
                  value={dayjs(field.value).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    field.onChange(dayjs(e.target.value).toISOString())
                  }
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              </Stack>
            )}
          />

          <TextInput
            isRequired
            label="Usage Limit"
            name="usageLimit"
            type="number"
            control={control}
            errMsg={errors.usageLimit?.message}
            isError={!!errors.usageLimit}
            placeHolder="0 = unlimited"
          />
        </ComponentCard>
      </div>

      <CustomButton
        type="submit"
        disabled={isPending}
        className="mt-6 text-white rounded-2xl"
      >
        Create Coupon
      </CustomButton>
    </form>
  );
};

export default CouponCreatePage;
