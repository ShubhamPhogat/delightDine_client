import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { useDispatch, useSelector } from "react-redux";
import { HiCurrencyRupee } from "../assesets/icnons";
import { createOrder, getAllCartItems } from "../api";
import { setCartItems } from "../context/actions/cartAction";
import {
  alertWarning,
  alertSuccess,
  alertNULL,
} from "../context/actions/alertActions";
import { useNavigate } from "react-router-dom";
import { setOrders } from "../context/actions/orederActions";

const Checkout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const [cartItems, setCartItemsState] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // Available payment methods
  const paymentMethods = [
    { id: "credit_card", name: "Credit Card" },
    { id: "debit_card", name: "Debit Card" },
    { id: "upi", name: "UPI" },
    { id: "cod", name: "Cash On Delivery" },
  ];

  // Available coupons
  const coupons = [
    {
      id: "PAYTM5",
      name: "5% off with Paytm Wallet",
      discount: 5,
      paymentMethod: "upi",
      bank: null,
    },
    {
      id: "AXIS10",
      name: "10% off with Axis Credit Card",
      discount: 10,
      paymentMethod: "credit_card",
      bank: "axis",
    },
    {
      id: "HDFC8",
      name: "8% off with HDFC Debit Card",
      discount: 8,
      paymentMethod: "debit_card",
      bank: "hdfc",
    },
    {
      id: "WELCOME15",
      name: "15% off for First Order (All Payment Methods)",
      discount: 15,
      paymentMethod: null,
      bank: null,
    },
  ];

  useEffect(() => {
    const fetchCartItems = async () => {
      const res = await getAllCartItems(user?._id);
      if (res) {
        dispatch(setCartItems(res));
        setCartItemsState(res);
        calculateTotal(res);
      }
    };

    if (!cart || cart.length === 0) {
      fetchCartItems();
    } else {
      setCartItemsState(cart);
      calculateTotal(cart);
    }
  }, [cart, dispatch, user]);

  const calculateTotal = (items) => {
    let tot = 0;
    if (items && items.length > 0) {
      items.forEach((data) => {
        tot += data.productId.productPrice * data.quantity;
      });
      setTotal(tot);
      setFinalAmount(tot);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPayment(method);

    // Check if the selected coupon is compatible with the payment method
    if (
      selectedCoupon &&
      selectedCoupon.paymentMethod &&
      selectedCoupon.paymentMethod !== method
    ) {
      dispatch(
        alertWarning(
          `Warning: Changing payment method will remove your "${selectedCoupon.name}" discount`
        )
      );
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      setSelectedCoupon(null);
      setDiscountAmount(0);
      setFinalAmount(total);
    }
  };

  const handleCouponSelect = (coupon) => {
    // Check if the coupon is compatible with the selected payment method
    if (coupon.paymentMethod && coupon.paymentMethod !== selectedPayment) {
      dispatch(
        alertWarning(
          `This coupon is only valid for ${getCouponRequirement(coupon)}`
        )
      );
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    // If coupon requires a specific bank, validate bank from card number
    // if (coupon.bank && coupon.paymentMethod.includes("card")) {
    //   const bankName = detectBankFromCardNumber(cardNumber);
    //   if (bankName !== coupon.bank) {
    //     dispatch(
    //       alertWarning(
    //         `This coupon is only valid for ${coupon.bank.toUpperCase()} cards`
    //       )
    //     );
    //     setTimeout(() => {
    //       dispatch(alertNULL());
    //     }, 3000);
    //     return;
    //   }
    // }

    setSelectedCoupon(coupon);
    const discount = (total * coupon.discount) / 100;
    setDiscountAmount(discount);
    setFinalAmount(total - discount);

    dispatch(alertSuccess(`Applied: ${coupon.name}`));
    setTimeout(() => {
      dispatch(alertNULL());
    }, 2000);
  };

  const detectBankFromCardNumber = (cardNum) => {
    // Simplified bank detection based on first digits
    // In a real application, you would use proper BIN ranges
    if (cardNum.startsWith("4")) return "visa";
    if (cardNum.startsWith("5")) return "mastercard";
    if (cardNum.startsWith("3")) return "amex";
    if (cardNum.startsWith("62")) return "axis";
    if (cardNum.startsWith("55")) return "hdfc";
    return "unknown";
  };

  const getCouponRequirement = (coupon) => {
    if (coupon.paymentMethod === "credit_card") return "Credit Card payments";
    if (coupon.paymentMethod === "debit_card") return "Debit Card payments";
    if (coupon.paymentMethod === "upi") return "UPI payments";
    return "specific payment methods";
  };
  const navigate = useNavigate();
  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      dispatch(alertWarning("Please enter your delivery address"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    if (!selectedPayment) {
      dispatch(alertWarning("Please select a payment method"));
      setTimeout(() => {
        dispatch(alertNULL());
      }, 3000);
      return;
    }

    // Validate payment details based on selected method
    if (selectedPayment === "credit_card" || selectedPayment === "debit_card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
        dispatch(alertWarning("Please complete all card details"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }
    } else if (selectedPayment === "upi") {
      if (!upiId) {
        dispatch(alertWarning("Please enter your UPI ID"));
        setTimeout(() => {
          dispatch(alertNULL());
        }, 3000);
        return;
      }
    }

    const payment = await createOrder(user?._id, total, cartItems);

    // Process payment and order (this would connect to your backend)
    if (payment) {
      dispatch(alertSuccess("Order placed successfully!"));
      setTimeout(() => {
        dispatch(alertNULL());
        // Redirect to order confirmation page
        // window.location.href = "/order-confirmation";
      }, 2000);
      setAddress("");
      setCardCvv("");
      setCardExpiry("");
      setCardName("");
      setCardNumber("");
      setDiscountAmount(0);
      setSelectedPayment("");
      dispatch(setCartItems([]));
      setCartItemsState([]);
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>

            {cartItems && cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center border-b pb-4">
                    <img
                      src={item.productId.productImage}
                      alt={item.productId.productName}
                      className="w-20 h-20 object-contain rounded-md"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.productId.productName}
                      </h3>
                      <p className="text-gray-500">
                        {item.productId.productCategory}
                      </p>
                      <div className="flex justify-between mt-2">
                        <p className="text-gray-700">Qty: {item.quantity}</p>
                        <p className="text-orange-500 font-semibold flex items-center">
                          <HiCurrencyRupee className="text-orange-500" />
                          {item.productId.productPrice * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Your cart is empty</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Delivery Address
            </h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows="3"
              placeholder="Enter your complete address"
            ></textarea>
          </div>
        </div>

        {/* Right Column - Payment Options */}
        <div className="lg:col-span-1">
          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Price Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Total MRP</p>
                <p className="text-gray-800 flex items-center">
                  <HiCurrencyRupee className="text-gray-800" />
                  {total}
                </p>
              </div>

              {selectedCoupon && (
                <div className="flex justify-between text-green-600">
                  <p>Discount ({selectedCoupon.discount}%)</p>
                  <p className="flex items-center">
                    - <HiCurrencyRupee className="text-green-600" />
                    {discountAmount.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <p className="text-gray-800">Total Amount</p>
                  <p className="text-orange-500 flex items-center text-xl">
                    <HiCurrencyRupee className="text-orange-500" />
                    {finalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Coupons */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Available Coupons
            </h2>
            <div className="space-y-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCoupon && selectedCoupon.id === coupon.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                  onClick={() => handleCouponSelect(coupon)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {coupon.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Use code: {coupon.id}
                      </p>
                    </div>
                    <div className="text-orange-500 font-bold">
                      {coupon.discount}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={method.id}
                      name="paymentMethod"
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      checked={selectedPayment === method.id}
                      onChange={() => handlePaymentMethodChange(method.id)}
                    />
                    <label
                      htmlFor={method.id}
                      className="ml-2 text-gray-700 font-medium"
                    >
                      {method.name}
                    </label>
                  </div>

                  {/* Conditional form fields based on payment method */}
                  {selectedPayment === method.id && (
                    <div className="ml-6 mt-3">
                      {method.id === "credit_card" ||
                      method.id === "debit_card" ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="Card Number"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            maxLength="16"
                          />
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name on Card"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                              maxLength="5"
                            />
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="CVV"
                              className="w-1/2 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                              maxLength="3"
                            />
                          </div>
                        </div>
                      ) : method.id === "upi" ? (
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="UPI ID (e.g., name@upi)"
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      ) : (
                        <p className="text-sm text-gray-500">
                          Pay with cash at the time of delivery
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Place Order Button */}
          <motion.button
            {...buttonClick}
            className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl text-xl hover:bg-orange-600 transition-all"
            onClick={handlePlaceOrder}
          >
            Place Order
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
