import {Modal} from "antd";

let tokenModalInstance = null;

export const showTokenModal = (onConfirm) => {
    if (tokenModalInstance) return;

    tokenModalInstance = Modal.confirm({
        title: "Sesión expirada",
        content: "Tu sesión ha expirado. ¿Deseas renovar el token?",
        okText: "Renovar",
        cancelText: "Cerrar sesión",
        okButtonProps: { className: "colorButton" },
        onOk: () => {
            tokenModalInstance = null;
            onConfirm();
        },
        onCancel: () => {
            tokenModalInstance = null;
            localStorage.clear();
            globalThis.location.href = "/";
        },
    });
};
