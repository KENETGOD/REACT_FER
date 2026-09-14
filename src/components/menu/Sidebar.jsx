import React, {useState} from "react";
import {Drawer, Menu, Image} from "antd";
import {
    DownOutlined,
    UpOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import { useMenuStore } from "@/store";
import { useMenuComponent } from "@/hooks";
import logo from "@/assets/images/VDI.png";
import "@/assets/styles/components.css";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.["rol"];
    const {handleMenuClick, menuItems} = useMenuComponent(role);
    const {mobileOpen, hideMenu} = useMenuStore();
    const [openKeys, setOpenKeys] = useState([]);
    const closeItem = [
        {
            key: '/logout',
            label: 'Cerrar sesión',
            icon: <LoginOutlined/>,
        },
    ];

    const closeSession = async (e) => {
        await handleMenuClick(e);
    };

    return (
        <Drawer
            title={
                <div className="sidebar-logo-container">
                    <Image
                        src={logo || undefined}
                        alt="Logo Institucional"
                        width={110}
                        preview={false}
                    />
                </div>
            }
            placement="left"
            closable={false}
            onClose={hideMenu}
            open={mobileOpen}
            size={330}
            styles={{
                body: {
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                },
            }}
        >
            <Menu
                mode="inline"
                theme="light"
                items={menuItems || []}
                onClick={(e) => {
                    hideMenu();
                    handleMenuClick(e).then();
                }}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                expandIcon={({isOpen}) => (isOpen ? <UpOutlined/> : <DownOutlined/>)}
            />
            
            {role && 
                <div className="sidebar-logout-section">
                    <Menu
                        mode="inline"
                        theme="light"
                        onClick={() => {
                            hideMenu();
                            closeSession({key: '/logout'}).then();
                        }}
                        className="sidebar-logout-item"
                        items={closeItem || []}
                    />
                </div>
            }
        </Drawer>
    );
};

export default Sidebar;
