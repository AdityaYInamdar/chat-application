import { Button, Layout, Menu, Spin } from "antd";
import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, Route, Routes } from "react-router-dom";
// import OrgSelector from "../Components/OrgSelector";
import { useSelector } from "react-redux";
import { SiSocketdotio } from "react-icons/si";
import { RxCross1 } from "react-icons/rx";
import { socket } from "../Socket/useSocket";

export default function MyNavbar({ collapsed, setCollapse, globalSearchItems }) {
    const authReducer = useSelector((state) => state.authReducer);
    const globalReducer = useSelector((state) => state.globalReducer);


    return (
        <Layout>
            <Layout.Header>
                <div className="navbar-component">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: '0px'}}>
                        <span style={{ cursor: "pointer", fontSize: "22px", marginLeft: '5px', color:"white"}} onClick={() => setCollapse(!collapsed)}>
                            {collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )}
                        </span>
                    {/* logo */}
                    </span>
                    <div id="navbar-portal">

                    </div>
                    <div
                        style={{
                            height: 'calc(var(--navbarHeight) - 15px)',
                            width: 'calc(var(--navbarHeight) - 15px)',
                            fontWeight: "bolder",
                            color: '#fff',
                            background: socket?.connected ? 'var(--successTextColor)' : 'var(--errorTextColor)',
                            marginRight: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'blink-2-sec 3s infinite',
                            fontSize: '20px'
                        }}
                    >
                        {globalReducer.wsConnected ? <SiSocketdotio title="Connected to socket" /> : <RxCross1 title="Socket Disconnected !" />}
                    </div>

                    {
                        !authReducer?.isAuthenticated && (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: '10px'}}>
                                <Button type="primary" onClick={() => {window.location.href = '/login'}}>Login</Button>
                            </div>
                        )
                    }
                    {/* {
                        authReducer.isAuthenticated && */}
                        {/* <ClientSelector /> */}
                    {/* } */}
                </div>
            </Layout.Header>
            <Layout.Content className="main-content-div">
                {globalReducer?.clientsLoading || !globalReducer?.selectedClient?.clientId === null ? (
                    <div className="App" style={{textAlign: 'center'}}>
                        <Spin size="large" style={{marginTop: '50px'}} />
                    </div>
                ) : (
                    <Outlet />
                )}
            </Layout.Content>
        </Layout>
    );
}


