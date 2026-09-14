export const WINE = "#3A0B1E";
export const LIGHTWINE = "#9B2247";
export const PINK = "#D78999";
export const LIGHTPINK = "#F8BECA";
export const DARKPINK = "#B0727F";
export const GRAY = "#AAA9AA";

export const getStatusColor = (status) => {
    const colors = {
        pendiente: "gold",
        terminado: "green",
        cancelado: "red"
    }

    return colors[status]
}