import { WINE, LIGHTWINE, PINK } from "@/utils/getColors";

export const wineCardStyles = { 
    background: `linear-gradient(90deg, ${WINE} 0%, ${LIGHTWINE} 100%)`, 
    border: `1px solid ${PINK}`, 
    color: '#fff',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}