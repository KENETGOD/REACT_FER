import React from "react";
import { Button } from "antd";
import "@/assets/styles/components.css";

const ButtonComponent = (
    {
        textButton = '', 
        action = null, 
        disabled = false,
        icon = null
    }
) => {

    return (
        <div className="btn-component-container">
            <div className="btn-component-wrapper">
                <Button
                    htmlType="submit"
                    type="primary"
                    block
                    onClick={action}
                    disabled={disabled}
                    icon={icon}
                >
                    {textButton}
                </Button>
            </div>
        </div>
    )
}

export default ButtonComponent;
