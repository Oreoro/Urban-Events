import {useCallback, useEffect, useMemo, useState} from 'react';
import {useSearchParams} from 'react-router';
import {QueryFilterOperator, QueryFilters} from "../types";
import debounce from 'lodash/debounce';

const queryFilterOperators = new Set<string>(Object.values(QueryFilterOperator));

export const useFilterQueryParamSync = (): [
    Partial<QueryFilters>,
    (updates: Partial<QueryFilters>, replace?: boolean) => void
] => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState<Partial<QueryFilters>>({});

    useEffect(() => {
        const parsedParams: Partial<QueryFilters> = {};

        searchParams.forEach((value, key) => {
            if (key.startsWith('filterFields[')) {
                const match = key.match(/^filterFields\[(.+)\]\[(.+)\]$/);
                if (match) {
                    const [, fieldName, operator] = match;
                    if (queryFilterOperators.has(operator)) {
                        parsedParams.filterFields ??= {};
                        parsedParams.filterFields[fieldName] = {
                            operator: operator as QueryFilterOperator,
                            value: value.includes(',') ? value.split(',') : value,
                        };
                    }
                }
            } else if (key === 'pageNumber' || key === 'perPage') {
                const numericValue = Number(value);
                if (Number.isFinite(numericValue)) {
                    parsedParams[key] = numericValue;
                }
            } else if (key === 'query' || key === 'sortBy' || key === 'sortDirection') {
                parsedParams[key] = value;
            } else {
                parsedParams.additionalParams ??= {};
                parsedParams.additionalParams[key] = value;
            }
        });

        setQueryParams(parsedParams);
    }, [searchParams]);

    const debouncedSetSearchParams = useMemo(
        () => debounce((params: URLSearchParams) => {
            setSearchParams(params);
        }, 300),
        [setSearchParams]
    );

    useEffect(() => () => debouncedSetSearchParams.cancel(), [debouncedSetSearchParams]);

    const updateSearchParams = useCallback(
        (updates: Partial<QueryFilters>, replace = false) => {
            const newParams = replace ? new URLSearchParams() : new URLSearchParams(searchParams);

            // Clear existing filter fields if replacing
            if (replace) {
                searchParams.forEach((_, key) => {
                    if (key.startsWith('filterFields[')) {
                        newParams.delete(key);
                    }
                });
            }

            // Update params
            Object.entries(updates).forEach(([key, value]) => {
                if (key === 'filterFields' && value) {
                    Object.entries(value).forEach(([field, condition]) => {
                        const conditions = Array.isArray(condition) ? condition : [condition];
                        conditions.forEach((currentCondition) => {
                            if (currentCondition) {
                                const paramKey = `filterFields[${field}][${currentCondition.operator}]`;
                                const paramValue = Array.isArray(currentCondition.value)
                                    ? currentCondition.value.join(',')
                                    : String(currentCondition.value);
                                newParams.set(paramKey, paramValue);
                            }
                        });
                    });
                } else if (key === 'additionalParams' && value) {
                    Object.entries(value).forEach(([additionalKey, additionalValue]) => {
                        if (additionalValue !== undefined && additionalValue !== null) {
                            newParams.set(additionalKey, String(additionalValue));
                        }
                    });
                } else if (value !== undefined) {
                    newParams.set(key, String(value));
                }
            });

            debouncedSetSearchParams(newParams);
        },
        [searchParams, debouncedSetSearchParams]
    );

    return [queryParams, updateSearchParams];
};
