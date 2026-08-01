import {Box, Pagination as MantinePagination, PaginationProps as MantinePaginationProps} from "@mantine/core";

interface PaginationProps extends Omit<MantinePaginationProps, 'hideWithOnePage'> {
    marginTop?: number;
}

export const Pagination = (props: PaginationProps) => {
    const {marginTop, ...rest} = props;
    return (
        <Box mt={marginTop === undefined ? 20 : marginTop}>
            <MantinePagination hideWithOnePage {...rest} />
        </Box>
    );
};
