import { useState } from 'react';
import { Typography } from 'antd';
import { PINK, DARKPINK } from '@/utils';
import "@/assets/styles/components.css";

const { Link } = Typography;

const StyledLink = (
    { 
        href, 
        target, 
        children, 
        addStyle
    }
) => {
    const [isHovered, setIsHovered] = useState(false);

    const linkStyle = {
        color: isHovered ? (addStyle?.colorHover || DARKPINK) : (addStyle?.color || PINK),
        textDecoration: 'underline',
        fontWeight: addStyle?.fontWeight || "",
    };

    return (
        <Link
            href={href}
            target={target}
            style={linkStyle}
            className="styled-link"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </Link>
    );
};

export default StyledLink;