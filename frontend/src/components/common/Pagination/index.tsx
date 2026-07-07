import {Box, Pagination as MantinePagination, PaginationProps as MantinePaginationProps} from "@mantine/core";
import classes from './Pagination.module.scss';

interface PaginationProps extends Omit<MantinePaginationProps, 'hideWithOnePage'> {
    marginTop?: number;
}

export const Pagination = (props: PaginationProps) => {
    const {className, marginTop, ...rest} = props;

    return (
        <Box
            mt={marginTop === undefined ? 14 : marginTop}
            className={classes.wrapper}
        >
            <MantinePagination
                hideWithOnePage
                className={`${classes.pagination} ${className || ''}`}
                {...rest}
            />
        </Box>
    );
};
