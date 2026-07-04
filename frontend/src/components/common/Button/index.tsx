import {Button as MantineButton, ButtonProps} from '@mantine/core'
import classes from './Button.module.scss';
import React from "react";
import classNames from "classnames";

export const Button = (props:  React.HTMLProps<HTMLButtonElement> | ButtonProps) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <MantineButton {...props} className={classNames(classes.button, props.className)}/>
}
