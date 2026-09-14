import React from "react";
import {Carousel, Image} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import "@/assets/styles/components.css";

export const CustomPrevArrow = ({onClick}) => (
    <div
        onClick={onClick}
        className="carousel-prev-arrow"
    >
        <LeftOutlined className="carousel-arrow-icon"/>
    </div>
);

export const CustomNextArrow = ({onClick}) => (
    <div
        onClick={onClick}
        className="carousel-next-arrow"
    >
        <RightOutlined className="carousel-arrow-icon"/>
    </div>
);

const CarouselComponent = ({ children, ...props }) => {

    return (
        <>
            <Carousel
                arrows
                autoplay
                autoplaySpeed={5000}
                dots={true}
                dotPlacement="bottom"
                className="custom-carousel"
                prevArrow={<CustomPrevArrow/>}
                nextArrow={<CustomNextArrow/>}
                {...props}
            >
                {children}
            </Carousel>
        </>
    );
};

export default CarouselComponent;
