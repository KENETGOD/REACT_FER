import { useNavigate } from "react-router-dom";
import { useAuthStore, useMenuStore } from "@/store";

export const useHeader = () => {
    const navigate = useNavigate();
    const { user, token } = useAuthStore();
    const { setShowMenu } = useMenuStore();

    // Mock data for purely visual purposes
    const mockUser = user || { nombre: "Ciudadano Ventanilla", rol: "Ciudadano" };
    const mockToken = token || "mock-token";

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.split(" ");
        return parts.map((p) => p[0]).join("").toUpperCase().substring(0, 2);
    };

    const items = [
        {
            key: 'profile',
            label: 'Mi Perfil',
            onClick: () => navigate('/perfil'),
        },
        {
            key: 'logout',
            label: 'Cerrar Sesión',
            onClick: () => {
                console.log("Mock Logout");
            },
        },
    ];

    const navItemStyle = {
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "15px",
        textDecoration: "none",
        whiteSpace: "nowrap",
        opacity: 0.9,
        cursor: "pointer",
    };

    const showMenu = () => {
        setShowMenu(true);
    };

    return {
        user: mockUser,
        token: mockToken,
        title: "Ventanilla Digital de Michoacán",
        getInitials,
        items,
        navItemStyle,
        showMenu,
        navigate
    };
};
