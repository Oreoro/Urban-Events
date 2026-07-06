import React from 'react';
import {Popover as MantinePopover, PopoverProps as MantinePopoverProps} from "@mantine/core";
import classes from "./Popover.module.scss";


interface PopoverProps extends MantinePopoverProps {
    children: React.ReactNode;
    title: React.ReactNode;
}

export const Popover = ({children, title, shadow = 'none', offset = 8, ...props}: PopoverProps) => {
    return (
        <MantinePopover {...props} shadow={shadow} offset={offset}>
            <MantinePopover.Target>
                <div className={classes.target}>
                    {children}
                </div>
            </MantinePopover.Target>
            <MantinePopover.Dropdown className={classes.dropdown}>
                {title}
            </MantinePopover.Dropdown>
        </MantinePopover>
    );
}
