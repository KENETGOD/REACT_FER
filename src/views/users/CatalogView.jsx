import React from 'react';
import { Row, Col, Typography, Tabs, Button } from 'antd';
import { ArrowLeftOutlined, GlobalOutlined, } from '@ant-design/icons';
import HeaderTitle from '@/components/common/HeaderTitle';
import ProceduresList from '@/components/common/ProceduresList';
import { useCatalog } from '@/hooks';
import "@/assets/styles/views.css";

const { Title, Text } = Typography;

const CatalogView = () => {
    const {
        catalogState,
        handleTabChange,
        handleSectorClick,
        procedures,
        serverTotal,
        serverPage,
        serverPageSize,
        handleServerPageChange,
        scrollListRef,
        sectoresData,
        sectorIcons,
    } = useCatalog();

    const tabItems = [
            { 
            key: 'tramites',
            label: 'Trámites',
        },
        { 
            key: 'sectores',
            label: 'Sectores',
        },
    ];

    return (
        <>
            <HeaderTitle
                headerTitle="Trámites"
                hideButton={true}
                hideSearch={true}
                noSpace={true}
            />

            <Tabs
                activeKey={catalogState.activeTab}
                items={tabItems}
                tabBarStyle={{ fontWeight: 500 }}
                onChange={handleTabChange}
            />

            {catalogState.activeTab === 'tramites' && (
                <>
                    <Row align="middle" justify="center">
                        <Text type="secondary">Seleccione el tipo de trámite que quiere realizar</Text>
                    </Row>
                    <ProceduresList
                        procedures={procedures}
                        serverTotal={serverTotal}
                        serverPage={serverPage}
                        serverPageSize={serverPageSize}
                        handleServerPageChange={handleServerPageChange}
                        scrollListRef={scrollListRef}
                    />
                </>
            )}

            {catalogState.activeTab === 'sectores' && (
                <>
                    {!catalogState.selectedSector ? (
                        <Row gutter={[24, 24]} className="full-width catalog-cards-row" justify="center">
                            {sectoresData.map((item) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={item.idsector}>
                                    <div 
                                        className="catalog-sector-card"
                                        onClick={() => handleSectorClick(item)}
                                    >
                                        <div className="catalog-sector-card-icon-wrapper">
                                            {(() => {
                                                const IconComponent = sectorIcons[item.nombre] || GlobalOutlined;
                                                return <IconComponent className="catalog-sector-card-icon" />;
                                            })()}
                                        </div>
                                        <Text className="catalog-sector-card-text">{item.nombre}</Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <>
                            <Row justify="start" className='back-arrow-button'>
                                <Button 
                                    type="primary" 
                                    size='medium'
                                    icon={<ArrowLeftOutlined />} 
                                    onClick={() => handleTabChange('sectores')}
                                />
                                <Title level={4} >{catalogState.selectedSector?.nombre || 'Sector'}</Title>
                            </Row>
                            <ProceduresList
                                procedures={procedures}
                                serverTotal={serverTotal}
                                serverPage={serverPage}
                                serverPageSize={serverPageSize}
                                handleServerPageChange={handleServerPageChange}
                                scrollListRef={scrollListRef}
                            />
                        </>
                    )}
                </>
            )}

        </>
    );
};

export default CatalogView;
