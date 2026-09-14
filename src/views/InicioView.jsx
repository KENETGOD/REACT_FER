import { Image, Typography, theme } from "antd";
import logo from "@/assets/images/llave-michoacan-fondo.png";
import "@/assets/styles/views.css";

const { Title, Text } = Typography;

const welcomeText = "Bienvenido a Proyecto Base";

const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 4,
    x: Math.random() * 100,
    drift: Math.random() * 60 - 30,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.18 + 0.06,
}));

const InicioView = () => {
    const { token } = theme.useToken();
    const guinda = token.guinda || token.colorPrimary || "#4D0621";

    return (
        <div className="home-welcome-view" style={{ "--home-guinda": guinda }}>
            {particles.map((particle) => (
                <span
                    key={particle.id}
                    className="home-welcome-particle"
                    style={{
                        left: `${particle.x}%`,
                        width: particle.size,
                        height: particle.size,
                        opacity: particle.opacity,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                        "--particle-drift": `${particle.drift}px`,
                    }}
                />
            ))}

            <div className="home-welcome-logo-wrapper">
                <Image
                    preview={false}
                    src={logo}
                    alt="Proyecto Base"
                    className="home-welcome-logo"
                />
            </div>

            <Title level={2} className="home-welcome-title">
                {welcomeText.split("").map((char, index) => (
                    <span
                        key={`${char}-${index}`}
                        className="home-welcome-title-char"
                        style={{ animationDelay: `${0.3 + index * 0.03}s` }}
                    >
                        {char}
                    </span>
                ))}
            </Title>

            <Text type="secondary" className="home-welcome-subtitle">
                Selecciona una opción del menú para continuar
            </Text>
        </div>
    );
};

export default InicioView;
