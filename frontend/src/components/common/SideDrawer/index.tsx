import {Drawer, DrawerProps} from "@mantine/core";
import React from "react";
import classes from "./SideDrawer.module.scss";

interface SideDrawerProps {
    heading?: string | React.ReactNode,
}

export const SideDrawer = (props: DrawerProps & SideDrawerProps) => {
    return (
        <Drawer
            {...props}
            overlayProps={{
                opacity: 0.42,
                blur: 2,
            }}
            position="right"
            size={props.size ?? 'xl'}
            withCloseButton={props.withCloseButton ?? true}
            title={props.heading}
            closeOnClickOutside={false}
            classNames={{
                content: classes.content,
                header: classes.header,
                body: classes.body,
                title: classes.sideDrawerTitle,
                close: classes.close,
            }}
        >
            <div className={classes.inner}>
                {props.children}
            </div>
        </Drawer>
    )
}
