import React from "react";
import DbHeader from "./DbHeader";
import { Route, Routes } from "react-router-dom";
import DBHome from "./DBHome";
import DBItems from "./DBItems";
import DBNewItems from "./DBNewItems";
import DBOrders from "./DBOrders";
import DBusers from "./DBusers";
import AllUsers from "./AllUsers";
import { useDispatch, useSelector } from "react-redux";
// import Alive from "./Alive";

const DbRightSection = () => {
  // const dispatch=useDispatch();
  const user = useSelector((state) => state.user);
  return (
    <div>
      {user?.user_id === process.env.ADMIN_ID ? (
        <>
          <div className=" w-full flex-col flex py-12">
            <DbHeader />

            <Routes>
              <Route path="/home" element={<DBHome />} />
              <Route path="/items" element={<DBItems />} />
              <Route path="/newItem" element={<DBNewItems />} />
              <Route path="/orders" element={<DBOrders />} />
              <Route path="/users" element={<DBusers />} />
              <Route path="/AllUsers" element={<AllUsers />} />
            </Routes>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="font-bold text-headingColor h-[72px]">
              YOU ARE NOT AN ADMIN
            </p>
          </div>
        </>
      )}
    </div>

    // <div className=" w-full flex-col flex py-12">
    //   <DbHeader />

    //   <Routes>
    //     <Route path="/home" element={<DBHome />} />
    //     <Route path="/items" element={<DBItems />} />
    //     <Route path="/newItem" element={<DBNewItems />} />
    //     <Route path="/orders" element={<DBOrders />} />
    //     <Route path="/users" element={<DBusers />} />
    //     <Route path="/AllUsers" element={<AllUsers />} />
    //   </Routes>
    // </div>
  );
};

export default DbRightSection;
