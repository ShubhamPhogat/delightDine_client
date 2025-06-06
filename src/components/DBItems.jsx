import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material";
import MaterialTable from "material-table";
import { deleteAProduct, getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { alertNULL, alertSuccess } from "../context/actions/alertActions";
import { HiCurrencyRupee } from "react-icons/hi"; // Fixed icon import

const DBItems = () => {
  // const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const defaultMaterialTheme = createTheme();
  const [productData, setProducts] = useState([]);

  // Make sure products is an array before rendering

  useEffect(() => {
    const fetchAllproducts = async () => {
      const response = await getAllProduct();
      setProducts(response);
      dispatch(setAllProducts(response));
    };
    fetchAllproducts();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-6 h-800 9/12 object-contain">
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          className="h-800"
          columns={[
            {
              title: "Image",
              field: "productImage",
              render: (rowData) => (
                <img
                  src={rowData.productImage}
                  className="w-32 h-16 object-contain rounded-md"
                  alt={rowData.product_name}
                />
              ),
            },
            {
              title: "Name",
              field: "productName",
            },
            {
              title: "Category",
              field: "productCategory",
            },
            {
              title: "Price",
              field: "productPrice",
              render: (rowData) => (
                <p className="text-2xl font-semibold text-textColor flex items-center justify-center gap-2">
                  <HiCurrencyRupee className="text-red-400" />
                  {parseFloat(rowData.productPrice).toFixed(2)}
                </p>
              ),
            },
          ]}
          data={productData} // Pass the array directly
          title="List of Products"
          actions={[
            {
              icon: "edit",
              tooltip: "Edit Data",
              onClick: (event, rowData) => {
                alert("You want to edit " + rowData.productId);
              },
            },
            {
              icon: "delete",
              tooltip: "Delete Data",
              onClick: (event, rowData) => {
                if (
                  window.confirm("Do you want to permanently delete this item?")
                ) {
                  deleteAProduct(rowData.productId).then((res) => {
                    dispatch(alertSuccess("Product deleted"));
                    setTimeout(() => {
                      dispatch(alertNULL());
                    }, 3000);
                    getAllProduct().then((data) => {
                      dispatch(setAllProducts(data));
                    });
                  });
                }
              },
            },
          ]}
        />
      </ThemeProvider>
    </div>
  );
};

export default DBItems;
