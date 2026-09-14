import { Typography, Flex, Grid, Timeline } from 'antd';
import "@/assets/styles/views.css";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const TimelineHome = () => {
    const screens = useBreakpoint();

    const steps = [
        { title: "Registro en la Plataforma", desc: "Crea tu cuenta o inicia sesión con tu e.firma" },
        { title: "Selecciona el Trámite", desc: "Elige el servicio que necesitas de nuestro catálogo" },
        { title: "Completa la Información", desc: "Llena la información y adjunta la documentación requerida" },
        { title: "Seguimiento en Línea", desc: "Consulta el estatus de tu trámite en tiempo real" },
        { title: "Recibe tu Documento", desc: "Obtén tus permisos y licencias de forma digital" },
    ];

    const timelineItems = steps.map((step, index) => ({
        title: !screens.xs ? (
            <div className={index === 0 ? "timeline-step-title-wrapper" : "timeline-step-title-wrapper--continuation"}>
                <Title level={4} className="timeline-step-title">{step.title}</Title>
                <Text type="secondary" className="timeline-step-desc">{step.desc}</Text>
            </div>
        ) : null,
        icon: (
            <div
                className={[
                    "timeline-step-icon",
                    screens.xs
                        ? "timeline-step-icon--left"
                        : index % 2 === 0
                            ? "timeline-step-icon--even"
                            : "timeline-step-icon--odd"
                ].join(" ")}
            >
                {index + 1}
            </div>
        ),
        content: screens.xs ? (
            <div className="timeline-mobile-content">
                <Title level={4} className="timeline-mobile-title">{step.title}</Title>
                <Text type="secondary" className="timeline-step-desc">{step.desc}</Text>
            </div>
        ) : (
            <div className="timeline-desktop-spacer" />
        )
    }));

    return (
        <Flex vertical align="center">
            <Title level={2} className="timeline-home-title">
                ¿Cómo Funciona?
            </Title>
            <Text type="secondary" className="timeline-home-subtitle">
                Proceso simple y transparente para realizar tus trámites de inversión
            </Text>

            <div className="timeline-home-wrapper">
                <Timeline
                    mode={screens.xs ? "left" : "alternate"}
                    items={timelineItems}
                />
            </div>
        </Flex>
    );
};

export default TimelineHome;
