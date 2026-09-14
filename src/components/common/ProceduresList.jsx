import React from "react";
import { Col, Card, Typography, Button, Row, Pagination, Grid } from "antd";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const ProceduresList = ({
  procedures,
  serverTotal,
  serverPage,
  serverPageSize,
  handleServerPageChange,
  scrollListRef,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div
      className={`public-procedures-list ${isMobile ? "" : "public-procedures-list--desktop"}`}
      ref={scrollListRef}
    >
      {procedures.map((item) => (
        <Card key={item.id} className="public-procedures-card">
          <Text type="secondary" className="public-procedures-category">
            {item.tramiteServicio}
          </Text>

          <Title level={4} className="public-procedures-card-title">
            {item.titulo}
          </Title>

          <Paragraph className="public-procedures-card-desc">
            {item.descripcion}
          </Paragraph>

          <Text strong className="public-procedures-card-dep">
            Dependencia: {item.dependenciaNombre}
          </Text>

          {(item.iniciarTramite || item.url) && (
            <Button
              type="primary"
              className="public-procedures-more-btn"
              href={item.url}
              target="_blank"
            >
              Iniciar trámite
            </Button>
          )}
        </Card>
      ))}
      {procedures && procedures?.length !== 0 && (
        <Row justify="center">
          <Pagination
            current={serverPage}
            pageSize={serverPageSize}
            total={serverTotal}
            onChange={handleServerPageChange}
            className="public-procedures-pagination"
            simple={{ readOnly: true }}
            showSizeChanger={false}
          />
        </Row>
      )}
      {procedures && procedures?.length === 0 && (
        <Row justify="center">
          <Text type="secondary">No se encontraron trámites</Text>
        </Row>
      )}
    </div>
  );
};

export default ProceduresList;
