import logo from "./logo.svg";
import "./App.css";
import { useSocket } from "./Socket/useSocket";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Verification from "./Verification";
import jwt_decode from "jwt-decode";
import { ar_loginUser } from "./Redux/Actions/AuthActions";
import axios from "axios";
import { message } from "antd";
import { gr_setUsers } from "./Redux/Actions/GlobalActions";
import AppLayout from "./AppLayout/AppLayout";
import { FaDotCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

function App() {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();

  const authReducer = useSelector((state) => state.authReducer);
  const globalReducer = useSelector((state) => state.globalReducer);
  const validateToken = () => {
    console.log("re-rendering");
    setLoading(true);
    if (localStorage.JWT_TOKEN) {
      console.log("MEOWW");
      const token = localStorage.getItem("JWT_TOKEN");
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000; // to get in milliseconds
      console.log(currentTime <= decoded.exp);
      if (currentTime <= decoded.exp) {
        // Get Roles

        const data = {
          isAuthenticated: true,
          user: {
            username: decoded.username,
            user_id: decoded.user_id,
          },
        };
        console.log(data);
        dispatch(ar_loginUser(data));
      }
      axios
        .get(`/all-users`)
        .then((res) => {
          console.log(res.data.data);
          dispatch(gr_setUsers(res.data.data));
        })
        .catch((err) => {
          err.handleGlobally && err.handleGlobally("Users");
        });
    }
    setLoading(false);
  };
  useEffect(() => {
    validateToken();
  }, []);
  return (
    <div>
      {/* Status: {globalReducer.ws.connected ? "Connected" : "Disconnected"} <br />
      Your Unique ID: {socket.id} */}
      <Routes>
        <Route path="/validation" element={<Verification />} />
        {/*
					Validate the token first.
					Till the token is being validated, show the loading screen.
					After that loading will be false, hence check if the validation is successful or not.
					If successful, then move forward.
					Else, naviate to the login page.
				*/}
        <Route
          path="*"
          element={
            loading ? (
              <div>Loading...</div>
            ) : authReducer.isAuthenticated ? (
              //   {
              //     key: "forms",
              //     label: <Link to={`/forms`}>Forms</Link>,
              //     icon: <MdAllInclusive />,

              //     search: "forms",
              //     pathname: `/forms`,
              //     name: "forms",

              //     hidden: !authReducer.isAuthenticated,
              // },
              <AppLayout
                menuItems={[
                  ...globalReducer?.users?.map((x) => ({
                    key: x.user_id,
                    label: x.username,
                    icon: (
                      <FaDotCircle color={x?.is_active ? "green" : "red"} />
                    ),
                    search: x.username,
                    pathname: `/global/${x.user_id}`,
                    name: x.username,
                  })),
                  {
                    key: "logout",
                    label: "Logout",
                    icon: <MdLogout />,
                    search: "logout",
                    onClick: () => {
                      axios
                        .post(`/logout?user_id=${authReducer.user.user_id}`)
                        .then((res) => {
                          message.success("Logged out successfully !");
                          localStorage.removeItem("JWT_TOKEN");

                          window.location.href = "/login";
                        })
                        .catch((err) => {
                          message.error("Error logging out !");
                        });
                    },
                    name: "logout",
                    danger: true,
                  },
                ]}
              />
            ) : (
              <Navigate
                to="/validation?tab=login"
                state={{ from: location.pathname }}
              />
            )
          }
        >
          <Route
            path="global"
            element={<Message socket={socket} userDetails={authReducer.user} />}
          />
          <Route path="*" element={<Navigate to={"/global"} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
