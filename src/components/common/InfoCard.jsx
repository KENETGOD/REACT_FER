import React from 'react';
import { Badge, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import "@/assets/styles/views.css";

const { Text } = Typography;

const InfoCard = ({ label, image, icon, path, addStyles = {}, cuenta, card }) => {

    const isExternal = (path && (path.startsWith('http://') || path.startsWith('https://'))) || (card && card.url);
    const targetUrl = isExternal ? (card ? card.url : path) : (path || '#');

    const cardContent = (
        <div className="info-card-content">
            {image && (
                <img 
                    src={image} 
                    alt={label} 
                    className="info-card-image"
                />
            )}
            
            {icon && (
                <div className="info-card-icon" style={{ color: addStyles.color || '#3A0B1E' }}>
                    {icon}
                </div>
            )}

            <Text strong className="info-card-label" style={{ color: addStyles.color || '#3A0B1E' }}>
                {label}
            </Text>
        </div>
    );

    const cardComponent = (
        cuenta ? (
            <Badge.Ribbon 
                text={cuenta} 
                color={addStyles.border || "#F8BECA"} 
                className="info-card-badge-ribbon"
            >
                <Card hoverable style={addStyles} className="info-card" styles={{ body: { padding: 0 } }}>
                    {cardContent}
                </Card>
            </Badge.Ribbon>
        ) : (
            <Card hoverable style={addStyles} className="info-card" styles={{ body: { padding: 10 } }}>
                {cardContent}
            </Card>
        )
    );

    if (isExternal) {
        return (
            <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="info-card-link">
                {cardComponent}
            </a>
        );
    }
   
    return (
        <Link to={targetUrl} className="info-card-link">
            {cardComponent}
        </Link>
    );
};

export default InfoCard;
