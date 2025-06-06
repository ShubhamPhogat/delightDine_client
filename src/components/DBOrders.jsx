import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders } from "../api";
import { setOrders } from "../context/actions/orederActions";
import OrderData from "./OrderData";
const DBOrders = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);
  const [order, setOrderData] = useState([]);
  console.log(orders);
  useEffect(() => {
    if (!orders) {
      getAllOrders(user ? user._id : "").then((data) => {
        console.log("order we het", data);
        dispatch(setOrders(data));
        setOrderData(data);
      });
    } else {
      getAllOrders(user ? user._id : "").then((data) => {
        console.log("order we het", data);
        dispatch(setOrders(data));
        setOrderData(data);
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full gap-4">
      {order ? (
        <>
          {order.map((item, i) => (
            <OrderData key={i} index={i} data={item} admin={true} />
          ))}
        </>
      ) : (
        <>
          <h1 className="text-headingColor font-bold text-[72px]"></h1>
        </>
      )}
    </div>
  );
};

export default DBOrders;
