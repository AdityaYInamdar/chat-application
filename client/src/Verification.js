import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message, Card, Typography, Tabs } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TabPane from "antd/es/tabs/TabPane";

const { Title } = Typography;

export default function Verification() {
    const location = useLocation();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'register');
    const changeActiveTab = (key) => {
        setActiveTab(key);
        searchParams.set('tab', key);
        setSearchParams(searchParams, {replace: true});
    }   
    const onFinish = (values) => {
        // console.log("Received values of form: ", values);
        if (activeTab === "register") {
            if (values.password !== values["confirm-password"]) {
                message.error("Passwords do not match");
                return;
            }
            axios
            .post(`/register`, {
                username: values.username,
                password: values.password,
            })
            .then((res) => {
                // console.log(res.data);
                message.success("Registered Successfully")
                changeActiveTab('login')
            })
            .catch((err) => {
                err.handleGlobally && err.handleGlobally("Register");
                // console.log(err);
                // message.error(err.response.data.message);
            });
        } else if (activeTab === "login") {
            axios
            .post(`/login`, {
                username: values.username,
                password: values.password,
            })
            .then((res) => {
                // console.log(res.data);
                console.log(res.data);
                localStorage.setItem("JWT_TOKEN", res.data.data.token);
                window.location.href = location?.state?.from || "/";
            })
            .catch((err) => {
                err.handleGlobally && err.handleGlobally("Login");
            });
        }
        
    };
    return (
        <div className="login">
            <div className="appAside">{/* <img src="loginpage.jpg" height="50%" width="50%"></img> */}</div>

            {/* <div className="appForm"> */}
            <div
                style={{
                    height: "100vh",
                    // backgroundImage: `url("/Loginpage.jpg")`,
                    backgroundColor: "white",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "bottom",
                    backgroundSize: "cover",
                    textAlign: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        minWidth: "100%",
                        minHeight: "100%",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Tabs
                    activeKey={activeTab}
                    onChange={changeActiveTab}
                >
                    <TabPane tab="Register" key="register">
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{
                            // margin: "Auto",
                            width: "min(400px, 90%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                            padding: "10px 0px 0px 0px",
                            boxShadow: "5px 5px 50px 10px lightgrey",
                        }}
                    >
                        {/* <img src="/logo.png" style={{ height: "13rem" }} /> */}
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                style={{ color: "black" }}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your username!",
                                    },
                                ]}
                            >
                                <Input size="large" autoFocus placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password size="large" placeholder="Password" />
                            </Form.Item>
                            <Form.Item
                                name="confirm-password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please re-enter your password!",
                                    },
                                ]}
                            >
                                <Input.Password size="large" placeholder="Password" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        backgroundColor: "#263552",
                                        color: "White",
                                        borderRadius: "5px",
                                        width: "16rem",
                                        height: "2.5rem",
                                    }}
                                >
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    </TabPane>
                    <TabPane tab="Login" key="login">
                    <Card
                        bordered={true}
                        hoverable={true}
                        style={{
                            // margin: "Auto",
                            width: "min(400px, 90%)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "10px",
                            padding: "10px 0px 0px 0px",
                            boxShadow: "5px 5px 50px 10px lightgrey",
                        }}
                    >
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                style={{ color: "black" }}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your username!",
                                    },
                                ]}
                            >
                                <Input size="large" autoFocus placeholder="Username" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                ]}
                            >
                                <Input.Password size="large" placeholder="Password" />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        backgroundColor: "#263552",
                                        color: "White",
                                        borderRadius: "5px",
                                        width: "16rem",
                                        height: "2.5rem",
                                    }}
                                >
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
