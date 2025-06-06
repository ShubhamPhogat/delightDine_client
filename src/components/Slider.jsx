import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import "../assesets/css/swiperStyles.css";
import { useSelector } from "react-redux";
import SliderRoll from "./SliderRoll";
const Slider = () => {
  const products = useSelector((state) => state.products);
  const [Fruits, setFruits] = useState(null);
  useEffect(() => {
    setFruits(products?.filter((data) => data.productCategory === "desert"));
    console.log("displaying fruits");
    console.log(Fruits);
  }, [products]);

  return <div className="w-full pt-24"></div>;
};

export default Slider;
