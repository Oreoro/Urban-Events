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
                opacity: 0.55,
                blur: 3,
            }}
            position="right"
            size={'xl'}
            withCloseButton={true}
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
