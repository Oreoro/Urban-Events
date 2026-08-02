import {ActionIcon, TextInput, TextInputProps} from '@mantine/core';
import {IconSearch, IconX} from '@tabler/icons-react';
import classes from './SearchBar.module.scss';
import {useEffect, useState} from "react";
import {SortSelector, SortSelectorProps} from "../SortSelector";
import {t} from "@lingui/macro";
import classNames from "classnames";
import {QueryFilters} from "../../../types.ts";

interface SearchBarProps extends TextInputProps {
    onClear: () => void;
    sortProps?: SortSelectorProps | undefined,
}

interface SearchBarWrapperProps {
    placeholder?: string,
    setSearchParams: (updates: Partial<QueryFilters>) => void,
    searchParams: Partial<QueryFilters>,
}

export const SearchBarWrapper = ({setSearchParams, searchParams, placeholder}: SearchBarWrapperProps) => {
    return (
        <SearchBar
            value={searchParams.query}
            onChange={(event) => {
                setSearchParams({
                    query: event.target.value,
                    pageNumber: 1,
                });
            }}
            onClear={() => setSearchParams({
                query: '',
                pageNumber: 1,
            })}
            placeholder={placeholder || t`Search...`}
            aria-label={placeholder || t`Search`}
        />
    );
}

export const SearchBar = ({sortProps, onClear, value, onChange, ...props}: SearchBarProps) => {
    const [searchValue, setSearchValue] = useState<typeof value>(value);

    useEffect(() => {
        setSearchValue(value);
    }, [value])

    return (
        <div className={classNames(classes.searchBarWrapper, props.className)}>
            <TextInput
                className={classes.searchBar}
                leftSection={<IconSearch size="1.1rem" stroke={1.5}/>}
                radius="sm"
                size="sm"
                value={searchValue}
                {...props}
                onChange={(event) => {
                    setSearchValue(event.currentTarget.value);
                    if (onChange) {
                        onChange(event);
                    }
                }}
                rightSectionPointerEvents="all"
                rightSection={value ? (
                    <ActionIcon
                        aria-label={t`Clear search text`}
                        variant="subtle"
                        color="gray"
                        size="md"
                        onClick={onClear}
                    >
                        <IconX size="1rem" stroke={1.8}/>
                    </ActionIcon>
                ) : null}
            />

            {sortProps
                && <SortSelector
                    selected={sortProps.selected}
                    options={sortProps.options}
                    onSortSelect={sortProps.onSortSelect}/>
            }
        </div>
    );
};
