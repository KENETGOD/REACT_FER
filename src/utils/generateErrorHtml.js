export function generateErrorHtml(error) {
    let errorHtml = "";
    const { data } = error.response ?? {};
    
    const errors = data?.errors ||  data?.errores;
    const message = data ? (data?.message || data?.mensaje || data?.error) : error;

    if (!errors && !message) {
        errorHtml += '<p>Error desconocido</p>';
        return errorHtml;
    }

    if (!errors && message) {
        message === "Unauthenticated." ? errorHtml += "Sesión Expirada." : errorHtml += `<p>${message}</p>`;
        return errorHtml;
    }

    if (typeof errors === 'string') {
        errorHtml += `<p>${errors}</p>`;
    } else if (Array.isArray(errors)) {
        errorHtml += `
            <ul>
                ${errors.map((error) => `<li>${error}</li>`).join('')}
            </ul>
        `;
    } else if (typeof errors === 'object') {
        errorHtml += `
            <ul>
            ${Object.entries(errors).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.map(v => `<li>${v}</li>`).join('');
                }
                return `<li>${value}</li>`;
            })
            .join('')}
            </ul>
        `;
    } else {
        errorHtml += '<p>Error no reconocido</p>';
    }

    return errorHtml;
}
