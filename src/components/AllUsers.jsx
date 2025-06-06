import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsersDetails } from "../context/actions/allUsersActions";
import { getAllUsers } from "../api";
import { Avatar } from "../assesets";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

const AllUsers = () => {
  const allUsers = useSelector((state) => state.allUsers);
  const dispatch = useDispatch();
  const defalutMaterialTheme = createTheme();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        console.log(`user data : ${data}`);
        dispatch(setAllUsersDetails(data));
      });
    }
  }, []);

  return (
    <div>
      heelo
      <ThemeProvider theme={defalutMaterialTheme}>
        <MaterialTable
          className="h-full"
          columns={[
            {
              title: "Image",
              field: "photoURL",
              render: (rowData) => (
                <img
                  src={rowData.photoURL ? rowData.photoURL : Avatar}
                  className="w-32 h-16 object-contain rounded-md"
                />
              ),
            },
            {
              title: "Name",
              field: "displayName",
            },
            {
              title: "Email",
              field: "email",
            },
            {
              title: "Verified",
              field: "emailVerified",
              render: (rowData) => (
                <p
                  className={`px-2 py-1 text-center text-primary rounded-md ${
                    rowData.emailVerified ? "bg-emerald-400" : "bg-red-500"
                  }`}
                >
                  {rowData.emailVerified ? "Verified" : "Not Verified"}
                </p>
              ),
            },
          ]}
          data={allUsers}
          title="List of Users"
          // actions={[
          //   {
          //     icon: "edit",
          //     tooltip: "Edit Data",
          //     onClick: (event, rowData) => {
          //       alert("You want to edit" + rowData.productId);
          //     },
          //   },
          //   {
          //     icon: "delete",
          //     tooltip: "Delete Data",
          //     onClick: (event, rowData) => {
          //       if (window.confirm("want to permanently dele the item")) {
          //         alert("product deleted");

          //       }
          //     },
          //   },
          // ]}
        />
      </ThemeProvider>
    </div>
  );
};

export default AllUsers;
