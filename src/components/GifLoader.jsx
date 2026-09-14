import Gif from "@/assets/images/Logo.gif";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useLoaderStore } from "@/store";

const InternalLoader = () => (
    <div style={styles.container}>
        <img src={Gif} alt="Loading..." style={styles.img}/>
    </div>
);

const GifLoader = ({ showStatus = false }) => {
    const isFetching = useIsFetching({
        predicate: (query) => query.meta?.showLoader !== false,
    });

    const isMutating = useIsMutating({
        predicate: (mutation) => mutation.meta?.showLoader !== false,
    });

    const { loader } = useLoaderStore();

    const isActive = isFetching > 0 || isMutating > 0 || loader || showStatus;

    return isActive ? <InternalLoader /> : null;
};

const styles = {
    container: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    img: { width: 300, height: 300 }
}

export default GifLoader;