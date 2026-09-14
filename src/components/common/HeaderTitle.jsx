import React from "react";
import Button from "@/components/common/Button";
import SearchBar from "@/components/common/SearchBar";
import "@/assets/styles/components.css";
import { PlusOutlined } from "@ant-design/icons";

const HeaderTitle = (
    {
        headerTitle, 
        showModal, 
        textButton, 
        state, 
        setState, 
        hideButton = false, 
        hideSearch = false, 
        placeholderSearch = "", 
        urlSearch = "",
        noSpace = false
    }
) => {

    return (
        <>
            <div className={`header-title-bar${hideButton && hideSearch && !noSpace ? " header-title-bar--mb" : ""}`}>
                <h2 className="header-title-text">{headerTitle}</h2>
            </div>

            {
                !hideButton && (
                    <div className="header-title-btn-container">
                        <Button
                            action={showModal}
                            textButton={textButton}
                            icon={<PlusOutlined />}
                        />
                    </div>
                )
            }

            {
                !hideSearch && (
                    <div className="header-title-search-container">
                        <SearchBar placeholder={placeholderSearch} urlSearch={urlSearch} state={state} setState={setState} />
                    </div>
                )
            }
        </>
    );
};

export default HeaderTitle;
