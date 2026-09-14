export const rfcRegex = /^([A-ZÑ&]{3,4})([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])([A-Z0-9]{1,3})?$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F3C0}-\u{1F3FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|\u200D/u;

export const numerosRegex = /^\d+$/;

export const letraNumeroRegex = /^[a-zA-Z0-9]+$/;

export const letraRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/;