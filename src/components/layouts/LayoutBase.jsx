import {useEffect} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {Grid, Card} from 'antd';
import MenuComponent from '@/components/menu/MenuComponent';
import Sidebar from '@/components/menu/Sidebar';
import Header from '@/components/auth/Header';
import '@/assets/styles/layout.css';
import '@/assets/styles/components.css';

const {useBreakpoint} = Grid;

const Layout = () => {
    const screens = useBreakpoint();
    const location = useLocation();
    const isInicioView = location.pathname === '/inicio';

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const elementMain = {
        body: (
            <main className="layout-base-main">
                <Card className={`layout-base-card ${isInicioView ? 'layout-base-card--inicio' : ''}`}>
                    <Outlet/>
                </Card>
            </main>
        )
    }

    return (
        <div className="layout-base-container">
            <Header/>
            <div className="layout-base-inner">
                {!screens.md ? (
                    <>
                        <Sidebar/>
                        {elementMain.body}
                    </>
                ) : (
                    <MenuComponent main={elementMain} />
                )}
            </div>
        </div>
    );
};

export default Layout;
