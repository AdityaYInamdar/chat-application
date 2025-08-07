import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from "@reduxjs/toolkit";
import combinedReducer from './Redux/Reducers/CombinedReducer';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = configureStore({
  reducer: combinedReducer,
});
const errorComposer = (error, prefixMessage) => {
  const statusCode = error.response ? error.response.status : null;
  const m = error.response ? error.response.data.detail : null;
  const errorMessage = m ? m : error.message;

  if (statusCode === 401) {
      message.error(prefixMessage + " : Unauthorized");
      localStorage.removeItem("JWT_TOKEN");
      window.location.href = "/login";
  }

  if (!statusCode) {
      message.error(prefixMessage + " : Network Error");
      return;
  } else if (statusCode === 422) {
      message.error(prefixMessage + " : Error with Pydantic Schema");
  } else if (errorMessage) {
      message.error(prefixMessage + " : " + errorMessage);
  } else if (statusCode === 404) {
      message.error(prefixMessage + " : Not Found");
  } else {
      message.error(prefixMessage + " : Error Occured");
  }

};
axios.defaults.baseURL = 'http://10.129.2.27:8098';
// apiName comes as a when handling error globally
axios.interceptors.response.use(undefined, error => {
  console.log(error);
  error.handleGlobally = prefixMessage => {
      console.log("ERROR " + prefixMessage, error);
      errorComposer(error, prefixMessage);
  };

  return Promise.reject(error);
});
root.render(
  <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
