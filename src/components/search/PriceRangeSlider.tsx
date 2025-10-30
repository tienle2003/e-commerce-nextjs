"use client";

import { Slider } from "@mui/material";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    onChange(newValue as [number, number]);
  };

  return (
    <div className="pb-4 border-y-[0.5px] border-[#e9e9e9]">
      <h2 className="font-semibold py-4 text-base">Khoảng giá</h2>
      <div className="px-2">
        <Slider
          value={value}
          onChange={handleChange}
          valueLabelDisplay="off"
          min={min}
          max={max}
          step={100}
          sx={{
            color: "#c4ab64",
            height: 2,
            "& .MuiSlider-thumb": {
              width: 20,
              height: 20,
              backgroundColor: "#fff",
              "&:hover, &.Mui-focusVisible, &:focus": {
                boxShadow: "0 0 0 8px rgba(211, 47, 47, 0.2)", // đỏ nhạt
              },
            },
            "& .MuiSlider-track": {
              border: "none",
            },
            "& .MuiSlider-rail": {
              opacity: 1,
            },
          }}
        />

        <div className="flex justify-between text-sm mt-2">
          <span>{value[0].toLocaleString("vi-VN")}</span>
          <span>{value[1].toLocaleString("vi-VN")}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
