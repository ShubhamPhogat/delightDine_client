import axios from "axios";
export const baseURL = process.env.REACT_APP_BACKEND_URL;
export const validateUserJwtToken = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/user/jwtVerification`, {
      headers: { Authorization: "Bearer " + token },
    });
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const addNewProduct = async (data) => {
  try {
    const res = await axios.post(`${baseURL}/api/product/create`, data);
    console.log(res.data);
    return res.data.data;
  } catch (error) {
    return null;
  }
};
// get all the products

export const getAllProduct = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/product/all`);
    console.log("products fetched", res.data.allProducts);
    return res.data.allProducts;
  } catch (error) {
    return null;
  }
};
export const deleteAProduct = async (productId) => {
  try {
    const res = await axios.delete(
      `${baseURL}/api/product/delete/${productId}`
    );
    console.log(res.data);
    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/user/all`);
    // console.log(res.data.data);
    return res.data.data;
  } catch (err) {
    return null;
  }
};
export const addNewItemToCart = async (user_id, productId) => {
  try {
    const res = await axios.post(`${baseURL}/api/product/addToCart`, {
      userId: user_id,
      productId,
    });
    console.log(res.data);
    return res.data.wishlist;
  } catch (error) {
    console.log(`error in adding item to cart `, error);
  }
};
export const getAllCartItems = async (user_id) => {
  try {
    console.log("fetching the cart itnems ....");
    const res = await axios.get(`${baseURL}/api/product/getCart/${user_id}`);
    console.log("cart items", res.data);
    return res.data.wishlist;
  } catch (error) {
    console.log(` error nin colllecting user data :${error}`);
  }
};
export const incrementItemQuant = async (user_id, productId, type) => {
  console.log(user_id);
  console.log(productId);
  console.log(type);
  try {
    const res = axios.post(`${baseURL}/api/product/addToCart`, {
      productId: productId,
      userId: user_id,
    });
    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const decrementItemQuant = async (user_id, productId, type) => {
  console.log(user_id);
  console.log(productId);
  console.log(type);
  try {
    const res = axios.post(`${baseURL}/api/product/removeToCart`, {
      productId: productId,
      userId: user_id,
    });
    return res.data.data;
  } catch (error) {
    return null;
  }
};
export const getAllOrders = async (userID) => {
  try {
    console.log("fetching order");
    const res = await axios.get(`${baseURL}/api/order/get/${userID}`);
    console.log("your orders", res.data);
    return res.data;
  } catch (error) {
    console.log(` error nin colllecting order data :${error}`);
  }
};
export const updateOrederSts = async (order_id, sts) => {
  try {
    const res = await axios.post(
      `${baseURL}/api/products/updateOrder/${order_id}`,
      null,
      { params: { sts: sts } }
    );
    return res.data.data;
  } catch (error) {
    console.log("error in updating item", error);
  }
};
export const createOrder = async (userId, orderTotal, orderItems) => {
  try {
    console.log("checkout orders", orderItems);
    const res = await axios.post(`${baseURL}/api/order/create`, {
      userId,
      orderTotal,
      orderItems,
    });
    if (res) {
      console.log("order added", res.data);
      return res.data;
    }
  } catch (error) {
    console.log("error in creating the order", error);
  }
};
