import {message} from 'antd';

let currentMessage = null;

/**
 * Show a safe message (prevent duplicate stacking).
 * @param {'info'|'success'|'error'|'warning'|'loading'} type - Message type.
 * @param {string} content - Message content.
 * @param {number} duration - Duration in seconds.
 */
export const showSafeMessage = (type, content, duration = 3) => {
    if (currentMessage) return;

    currentMessage = message.open({
        type,
        content,
        duration,
        onClose: () => {
            currentMessage = null;
        },
    });
};