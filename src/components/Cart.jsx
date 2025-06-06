import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonClick, slideIn, staggerFadeInOut } from "../animations";
import { setCartOff } from "../context/actions/displayCartAction";
import {
  BiChevronsRight,
  FcClearFilters,
  HiCurrencyRupee,
} from "../assesets/icnons";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewItemToCart,
  addNewProduct,
  baseURL,
  decrementItemQuant,
  getAllCartItems,
  incrementItemQuant,
} from "../api";
import { setCartItems } from "../context/actions/cartAction";
import { alertSuccess, alertNULL } from "../context/actions/alertActions";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [total, setTotal] = useState(0);

  const fetchedCartItems = async () => {
    const res = await getAllCartItems(user?._id);
    if (res) {
      dispatch(setCartItems(res));
      calculateTotal(res);
    }
  };

  const calculateTotal = (items) => {
    let tot = 0;
    if (items && items.length > 0) {
      items.forEach((data) => {
        tot += data.productId.productPrice * data.quantity;
      });
      setTotal(tot);
    } else {
      setTotal(0);
    }
  };

  useEffect(() => {
    if (!cart) {
      fetchedCartItems();
    } else {
      calculateTotal(cart);
    }
  }, [cart]);

  const closeCart = () => {
    dispatch(setCartOff());
  };
  const navigate = useNavigate();
  const handleCheckOut = () => {
    navigate("/checkout");
  };

  return (
    <motion.div
      {...slideIn}
      className="fixed z-[100] top-0 right-0 w-300 md:w-508 bg-lightOverlay backdrop-blur-md shadow-md h-screen flex flex-col"
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between py-4 px-6 border-b border-gray-300">
        <motion.i
          {...buttonClick}
          className="cursor-pointer"
          onClick={closeCart}
        >
          <BiChevronsRight className="text-4xl text-textColor" />
        </motion.i>
        <p className="text-2xl text-headingColor font-semibold">Your Cart</p>
        <motion.i {...buttonClick} className="cursor-pointer">
          <FcClearFilters className="text-2xl text-textColor" />
        </motion.i>
      </div>

      {/* Cart content */}
      <div className="flex-1 flex flex-col bg-zinc-800 overflow-hidden">
        {cart && cart.length > 0 ? (
          <>
            {/* Cart items container - scrollable */}
            <div className="flex-1 overflow-y-auto py-4 px-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
              <div className="flex flex-col gap-3">
                {cart.map((item, index) => (
                  <CartItemData
                    key={index}
                    index={index}
                    data={item.productId}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            </div>

            {/* Cart footer - fixed at bottom */}
            <div className="bg-zinc-900 py-6 px-6">
              <div className="w-full flex items-center justify-between mb-6">
                <p className="text-2xl text-zinc-400 font-semibold">Total</p>
                <p className="text-2xl text-orange-500 font-semibold flex items-center">
                  <HiCurrencyRupee className="text-primary" />
                  {total}
                </p>
              </div>

              <motion.button
                {...buttonClick}
                onClick={handleCheckOut}
                className="bg-orange-400 w-full py-3 text-xl text-white font-bold hover:bg-orange-600 transition-all duration-200 rounded-xl"
              >
                Check Out
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-3xl text-primary font-bold">Empty cart</h1>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const CartItemData = ({ index, data, quantity }) => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [itemTotal, setItemTotal] = useState(0);

  useEffect(() => {
    setItemTotal(data.productPrice * quantity);
  }, [data.productPrice, quantity]);

  const decrementCart = (userId, productId) => {
    decrementItemQuant(userId, productId, "decrement").then(() => {
      dispatch(alertSuccess("Item quantity decreased"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 2000);
      getAllCartItems(user?._id).then((items) => {
        dispatch(setCartItems(items));
      });
    });
  };

  const incrementCart = (userId, productId) => {
    addNewItemToCart(userId, productId).then(() => {
      dispatch(alertSuccess("Item quantity increased"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 2000);
      getAllCartItems(user?._id).then((items) => {
        dispatch(setCartItems(items));
      });
    });
  };

  return (
    <motion.div
      key={index}
      {...staggerFadeInOut(index)}
      className="w-full flex items-center bg-zinc-700 rounded-lg p-2 gap-2"
    >
      <img
        src={data?.productImage}
        alt={data?.productName}
        className="w-20 h-20 object-contain rounded-md"
      />

      <div className="flex flex-col flex-1">
        <p className="text-lg font-semibold text-primary">
          {data?.productName}
        </p>
        <span className="text-sm capitalize text-gray-400">
          {data?.productCategory}
        </span>
        <p className="text-sm font-semibold text-red-400 mt-1 flex items-center">
          <HiCurrencyRupee className="text-red-400" /> {itemTotal}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          {...buttonClick}
          onClick={() => decrementCart(user?._id, data?._id)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-900 text-primary"
        >
          -
        </motion.button>

        <p className="text-lg text-primary font-semibold w-6 text-center">
          {quantity}
        </p>

        <motion.button
          {...buttonClick}
          onClick={() => incrementCart(user?._id, data?._id)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-zinc-900 text-primary"
        >
          +
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Cart;
