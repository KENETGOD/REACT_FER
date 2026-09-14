import {notification} from "antd";

export const showInvalidToken = error => {
    notification.destroy();
    notification.success({
        message: "Error",
        description: `${error}, redirigiendo al login`,
        duration: 3,
        placement: "bottomRight",
    });
    setTimeout(() => {
        localStorage.clear();
        globalThis.location.href = '/login';
    }, 1500)
}
