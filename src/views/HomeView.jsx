import React from "react";
import { Button, Flex, Input, Layout, Row, Tooltip, Typography, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import logoCatedral from "@/assets/images/catedral-morelia.png";
import "@/assets/styles/views.css";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const InputSearch = React.memo(({ screens }) => {
    const [inputValue, setInputValue] = React.useState("");

    return (
        <Row
            justify="center"
            align="middle"
            className={`home-search-row ${screens.ms ? "home-search-row--full" : "home-search-row--partial"}`}
        >
            <Tooltip title="Al menos 4 caracteres" placement="top">
                <Search
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    variant="borderless"
                    className="gray-placeholder home-search-input"
                    placeholder="Realiza una búsqueda de cualquier trámite o servicio..."
                    size="medium"
                    onSearch={setInputValue}
                    enterButton={
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            className="home-search-btn"
                        >
                            Buscar
                        </Button>
                    }
                    styles={{
                        input: {
                            color: "#fff",
                            backgroundColor: "transparent",
                        },
                    }}
                />
            </Tooltip>
        </Row>
    );
});

InputSearch.displayName = "InputSearch";

const HomeView = () => {
    const screens = useBreakpoint();

    return (
        <Layout className="home-layout">
            <Content className="home-content home-template-content">
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    gap={24}
                    className="home-hero home-hero--main"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${logoCatedral})`,
                    }}
                >
                    <Title level={1} className="home-hero-title">
                        Ventanilla Digital de Michoacán
                    </Title>
                    <InputSearch screens={screens} />
                </Flex>

            </Content>
        </Layout>
    );
};

export default HomeView;
