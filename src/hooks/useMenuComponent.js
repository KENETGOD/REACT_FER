import { useLocation, useNavigate } from "react-router-dom";
import { useMenuStore } from "@/store";
import { getMenuItems } from "@/utils/menuItems";

export const useMenuComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { collapsed, setCollapsed } = useMenuStore();

    const menuItems = getMenuItems();

    const handleMenuClick = async (e) => {
        if (e.key === '/logout') {
            localStorage.clear();
            navigate('/');
        } else {
            navigate(e.key);
        }
    };

    return {
        handleMenuClick,
        menuItems,
        collapsed,
        setCollapsed,
        currentPath: location.pathname,
    };
};

export default useMenuComponent;
