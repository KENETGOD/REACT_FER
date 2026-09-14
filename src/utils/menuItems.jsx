import {
    DatabaseOutlined,
    HomeOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";

export const getMenuItems = () => [
    {   
        key: "/inicio", 
        label: "Inicio", 
        icon: <HomeOutlined /> 
    },
    {
        key: "/informacion",
        label: "Información Trámites",
        icon: <InfoCircleOutlined />,
    },
    {
        key: "/ejemplo-crud",
        label: "Ejemplo CRUD",
        icon: <DatabaseOutlined />,
    },
];
