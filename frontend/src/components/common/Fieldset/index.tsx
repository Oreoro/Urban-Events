import {Fieldset as MantineFieldset, FieldsetProps as MantineFieldsetProps} from "@mantine/core";
import classes from "./Fieldset.module.scss";

export interface FieldsetProps extends MantineFieldsetProps {
    children: React.ReactNode;
}

export const Fieldset = (props: FieldsetProps) => {
    const {className, legend, children, ...restProps} = props;

    return (
        <MantineFieldset
            {...restProps}
            className={`${classes.fieldset} ${className || ''}`}
            variant={'default'}
            legend={<span className={classes.legend}>{legend}</span>}
        >
            {children}
        </MantineFieldset>
    );
}
