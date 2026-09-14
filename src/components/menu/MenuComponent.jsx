import React from 'react';
import {Layout, Menu} from 'antd';
import {LoginOutlined} from "@ant-design/icons";
import {useMenuComponent} from "@/hooks";
import Sider from "antd/es/layout/Sider";
import "@/assets/styles/components.css";

const MenuComponent = ({main}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.rol;
    const {handleMenuClick, collapsed, setCollapsed, currentPath, menuItems} = useMenuComponent(role);
    const closeItem = [
        {
            key: '/logout',
            label: 'Cerrar sesión',
            icon: <LoginOutlined/>,
        },
    ];

    return (
        <Layout className="menu-layout">
            <Sider
                breakpoint="lg"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={256}
                collapsedWidth={80}
                className="menu-sider"
            >
                <div className="menu-sider-inner">
                    <div className="menu-sider-scroll">
                        <Menu
                            selectedKeys={[currentPath]}
                            mode="inline"
                            theme="light"
                            inlineCollapsed={collapsed}
                            onClick={handleMenuClick}
                            className="container-menu"
                            items={menuItems || []}
                        />
                    </div>

                    <div className="menu-logout-wrapper">
                        <Menu
                            theme="light"
                            mode="inline"
                            onClick={handleMenuClick}
                            items={closeItem || []}
                            selectable={false}
                        />
                    </div>
                </div>
            </Sider>

            <Layout>
                <div className="menu-sider-overflow">
                    {main.body}
                </div>
            </Layout>
        </Layout>
    );
};

export default MenuComponent;
