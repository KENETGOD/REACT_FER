import React, { useState } from "react";
import { Row, Col, Typography, Space, Image, Button, Layout, Grid } from "antd";
import { FacebookFilled, InstagramOutlined, XOutlined } from "@ant-design/icons";
import logoMich from '@/assets/images/EscudoMich.png';
import StyledLink from "@/components/common/StyledLink";
import "@/assets/styles/components.css";

const { Footer: AntFooter } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const Footer = () => {
    const screens = useBreakpoint();
    const [iconState, setIconState] = useState({ x: false, fb: false, ig: false });

    return (
        <AntFooter className="footer-container">
            <div className="footer-content-wrapper">
                <Row justify={screens.sm ? "space-evenly" : "center"} align="middle" className="footer-main-row">
                    <Col
                        xs={24}
                        sm={10}
                        md={10}
                        className="footer-logo-info-col"
                    >
                        <Space orientation={screens.sm ? "horizontal" : "vertical"} align={screens.sm ? "start" : "center"} size={20}>
                            {logoMich && (
                                <Image
                                    src={logoMich}
                                    alt="Escudo Institucional"
                                    preview={false}
                                    width={100}
                                    className={screens.sm ? "" : "footer-image-center"}
                                />
                            )}
                            <div className={screens.sm ? "footer-text-left" : "footer-text-center"}>
                                <Title level={3} className="footer-heading">
                                    Información y trámites
                                </Title>
                                <StyledLink href="https://ejemplo.com/aviso-de-privacidad/" target="_blank" addStyle={{ color: "gray", colorHover: "#B5B3B3", fontWeight: "600" }}>Aviso de protección de datos institucional</StyledLink>
                            </div>
                        </Space>
                    </Col>

                    <Col
                        xs={24}
                        sm={6}
                        md={5}
                        className="footer-social-col"
                    >
                        <Space size={10}>
                            <Button
                                type="link"
                                icon={<XOutlined className={iconState.x ? "footer-social-icon-hover" : "footer-social-icon"} />}
                                onMouseEnter={() => setIconState((prev) => ({ ...prev, x: true }))}
                                onMouseLeave={() => setIconState((prev) => ({ ...prev, x: false }))}
                                onClick={() => window.open("https://twitter.com/", "_blank")}
                                aria-label="Twitter (X)"
                            />
                            <Button
                                type="link"
                                icon={<FacebookFilled className={iconState.fb ? "footer-social-icon-hover" : "footer-social-icon"} />}
                                onMouseEnter={() => setIconState((prev) => ({ ...prev, fb: true }))}
                                onMouseLeave={() => setIconState((prev) => ({ ...prev, fb: false }))}
                                onClick={() => window.open("https://www.facebook.com/", "_blank")}
                                aria-label="Facebook"
                            />
                            <Button
                                type="link"
                                icon={<InstagramOutlined className={iconState.ig ? "footer-social-icon-hover" : "footer-social-icon"} />}
                                onMouseEnter={() => setIconState((prev) => ({ ...prev, ig: true }))}
                                onMouseLeave={() => setIconState((prev) => ({ ...prev, ig: false }))}
                                onClick={() => window.open("https://www.instagram.com/", "_blank")}
                                aria-label="Instagram"
                            />
                        </Space>
                    </Col>
                </Row>

                <div className="footer-copyright-div">
                    <Text strong className="footer-copyright-text">
                        © Desarrollado por el Equipo |{" "}
                        <StyledLink href="https://ejemplo.com/" target="_blank" addStyle={{ color: "#BD9868", fontWeight: "bold" }}>Proyecto Base {new Date().getFullYear()}</StyledLink>
                        
                    </Text>
                    <p>Versión 1.0.0</p>
                </div>
            </div>
        </AntFooter>
    );
};

export default Footer;