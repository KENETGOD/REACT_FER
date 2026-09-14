export const getArrayData = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
};