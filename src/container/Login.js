import React, { useEffect } from "react";
import { LoginBg, Logo } from "../assesets";
import LoginInput from "../components/LoginInput";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../config/firebase.config";
import { validateUserJwtToken } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../context/actions/userAction";
import {
  alertInfo,
  alertNULL,
  alertSuccess,
  alertWarning,
} from "../context/actions/alertActions";
import { BsDisplay } from "react-icons/bs";
import axios from "axios";
const Login = () => {
  const [useremail, setuserEmail] = useState("");
  const [userPassword, setuserPasssword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setuserName] = useState("");
  const [userConfirmPassword, setuserConfirmPasssword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const alert = useSelector((state) => state.alert);
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const signInWithGoogle = async () => {
    console.log("clicked");
    // await signInWithPopup(firebaseAuth, provider).then((userCard) => {
    //   firebaseAuth.onAuthStateChanged((cred) => {
    //     if (cred) {
    //       cred.getIdToken().then((token) => {
    //         validateUserJwtToken(token).then((data) => {
    //           dispatch(setUserDetails(data));
    //         });
    //       });
    //     }
    //   });
    // });
    // import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(token);
        console.log(user);
        if (token) {
          validateUserJwtToken(token).then((data) => {
            dispatch(setUserDetails(user));
          });
        }

        // The signed-in user info.

        // IdP data available using getAdditionalUserInfo(result)

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  const signUpWithEmailPass = async () => {
    console.log("cliclked");
    if (
      useremail === "" ||
      userPassword === "" ||
      userConfirmPassword === "" ||
      userName === "" ||
      phone === ""
    ) {
      dispatch(alertInfo("Rquired fields should no be empty"));
    } else {
      if (userPassword === userConfirmPassword) {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
          {
            userName,
            password: userPassword,
            email: useremail,
            firstName,
            phone,
          }
        );
        if (response) {
          dispatch(
            alertSuccess(
              "Account created successfully ! please continue signing in"
            )
          );
          setTimeout(() => {
            dispatch(alertNULL(""));
          }, 1000);
        }
      } else {
        dispatch(alertWarning("Password doesn't match"));
      }
    }
  };
  const signInWithEmailPass = async () => {
    if (useremail !== "" && userPassword !== "") {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
          { email: useremail, password: userPassword }
        );
        if (response) {
          console.log("his is user", response.data.data.user);
          const token = response.data.data.refreshToken;
          localStorage.setItem("authToken", token);
          dispatch(setUserDetails(response.data.data.user));
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      className="w-screen h-screen relative overflow-hidden flex
    "
    >
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute"
        alt=""
      />

      <div className="flex flex-col items-center  bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6 ">
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="" />
          <p className="text-slate-400 fint-semibold text-3xl">city</p>
        </div>

        <p className="text-3xl font-semibold text-slate-400">Welcome Back</p>
        <p className="text-xl text-slate-400 -mt-6">
          {" "}
          {isSignUp
            ? "Register up with following"
            : "Sign up with the following"}
        </p>

        <div className=" w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
          <LoginInput
            placeholder={`  Email Here`}
            inputState={useremail}
            inputStateFunction={setuserEmail}
            type="email"
            icons={<FaEnvelope className="text-xl text-textColor" />}
          />
          <LoginInput
            placeholder={`  Paasword Here`}
            inputState={userPassword}
            inputStateFunction={setuserPasssword}
            type="password"
            icons={<FaLock className="text-xl text-textColor" />}
          />
          {isSignUp && (
            <LoginInput
              placeholder={` Confirm Paasword Here`}
              inputState={userConfirmPassword}
              inputStateFunction={setuserConfirmPasssword}
              type="password"
              icons={<FaLock className="text-xl text-textColor" />}
            />
          )}

          {isSignUp && (
            <LoginInput
              placeholder={`userName`}
              inputState={userName}
              inputStateFunction={setuserName}
              type="text"
            />
          )}
          {isSignUp && (
            <LoginInput
              placeholder={`phone`}
              inputState={phone}
              inputStateFunction={setPhone}
              type="text"
            />
          )}
          {isSignUp && (
            <LoginInput
              placeholder={`Name`}
              inputState={firstName}
              inputStateFunction={setFirstName}
              type="text"
            />
          )}
          {!isSignUp ? (
            <p className="text-slate-400 mx-1">
              {" "}
              Doesn't have an account:
              <motion.button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-red-400 underline cursor-pointer bg-transparent"
                {...buttonClick}
              >
                create one
              </motion.button>
            </p>
          ) : (
            <p className="text-slate-400 mx-1">
              {" "}
              Already have an account:
              <motion.button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-red-400 underline cursor-pointer bg-transparent"
                {...buttonClick}
              >
                sign up
              </motion.button>
            </p>
          )}
          {!isSignUp ? (
            <motion.button
              {...buttonClick}
              onClick={signInWithEmailPass}
              className=" w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-teal-50 text-xl capitalize hover:bg-red-600 transition-all duration-150"
            >
              {" "}
              sign up
            </motion.button>
          ) : (
            <motion.button
              onClick={signUpWithEmailPass}
              {...buttonClick}
              className=" w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-teal-50 text-xl capitalize hover:bg-red-600 transition-all duration-150"
            >
              {" "}
              sign in
            </motion.button>
          )}
        </div>
        <div className=" flex items-center justify-between  gap-16">
          <div className="w-24 h-[1px] rounded-md bg-white ">
            <p className="text-white mx-9">or</p>
            {/* <div className="w-24 h-[1px] rounded-md bg-white "></div> */}
          </div>
        </div>
        <motion.div
          onClick={signInWithGoogle}
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 my-4 bg-white backdrop-blur-md cursor-pointer rounded-3xl gap-4"
        >
          <FcGoogle className="text-3xl" />
          <p className=" capitalize text-base text-headingColor">
            {" "}
            sign in with Google
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
