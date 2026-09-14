import { Input, Tooltip } from "antd";
import { useCallback, useMemo, useEffect } from "react";
import { get } from "@/service";
import { getArrayData } from "@/utils";
import "@/assets/styles/components.css";

const { Search } = Input;

const debounce = (callback, delay) => {
    let timeoutId;

    const debounced = (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };

    debounced.cancel = () => clearTimeout(timeoutId);

    return debounced;
};

const SearchBar = (
    {
        urlSearch, 
        placeholder, 
        setState
    }
) => {

    const executeSearch = useCallback(async (value) => {
        if (!value || value.trim().length === 0) {
            setState(prev => ({
                ...prev,
                searchValue: undefined,
                data:         undefined,
                originalData: undefined,
                totalPage:    undefined,
                loadingTable: false
            }));
            return;
        }

        if (value.length < 4) {
            setState(prev => ({
                ...prev,
                searchValue: value,
                loadingTable: false
            }));
            return;
        }

        setState((prev) => ({...prev, loadingTable: true, searchValue: value}));

        const queryValue = value || '';

        const finalUrl = `${urlSearch}?page=1&page_size=${10}&busqueda=${queryValue}`;

        try {
            const response = await get(finalUrl);
            const { data } = response || {};
            
            const payload = data || response || [];

            const searchData = getArrayData(payload);

            setState((prev) => ({
                ...prev,
                data: searchData,
                originalData: searchData,
                totalPage: payload?.total ?? (payload?.lastPage ? payload.lastPage * (payload.pageSize || 10) : 0),
                loadingTable: false,
                currentPage: payload?.currentPage ?? payload?.current_page ?? 1,
                lastPage: payload?.lastPage ?? payload?.last_page,
                pageSize: payload?.pageSize ?? payload?.page_size ?? 10
            }));
        } catch {
            setState((prev) => ({
                ...prev,
                data: [],
                originalData: [],
                totalPage: 0,
                loadingTable: false,
                currentPage: 1
            }));
        }
    }, [setState, urlSearch]);

    const debouncedSearch = useMemo(
        () => debounce(executeSearch, 500),
        [executeSearch]
    );

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        debouncedSearch(value);
    }, [debouncedSearch]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <Tooltip title="Escribe al menos 4 caracteres">
            <Search
                placeholder={placeholder}
                allowClear
                onChange={handleSearchChange}
                className="search-bar-input"
            />
        </Tooltip>
    );
}

export default SearchBar;
