import {useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import "@/assets/styles/style.css";
import "@/assets/styles/components.css";
import { useLoaderStore } from "@/store";
import Header from "@/components/auth/Header";
import Footer from "@/components/auth/Footer";

const LayoutAuth = () => {
    /* const {showLoader, hideLoader} = useLoaderStore();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function validateToken() {
            if (localStorage.getItem("token")) {
                showLoader();
                try {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    if (location.pathname !== "/") {
                        navigate("/inicio", {replace: true});
                    }
                } catch {
                    localStorage.removeItem("token");
                    navigate("/");
                } finally {
                    hideLoader();
                }
            }
        };

        validateToken().then();
    }, [location.pathname, navigate, showLoader, hideLoader]); */

    return (
        <div className="layout-auth-root">
            <Header/>

            <main className="layout-auth-main">
                <Outlet/>
            </main>

            <footer
                id="contacto"
                className="layout-auth-footer"
            >
                <Footer/>
            </footer>
        </div>
    );
};

export default LayoutAuth;