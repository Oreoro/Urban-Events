import {Modal as MantineModal, ModalProps as MantineModalProps} from "@mantine/core";
import React from "react";
import classes from "./Modal.module.scss";

interface ModalProps {
    heading?: string | React.ReactNode,
}

export const Modal = (props: MantineModalProps & ModalProps) => {
    return (
        <MantineModal
            {...props}
            overlayProps={{
                opacity: 0.34,
                blur: 1.5,
                ...props.overlayProps,
            }}
            size={props.size ?? 'xl'}
            withCloseButton={props.withCloseButton ?? true}
            title={props.heading}
            closeOnClickOutside={false}
            classNames={{
                content: classes.content,
                body: classes.body,
                title: classes.modalTitle,
                header: classes.header,
                close: classes.close,
                ...props.classNames
            }}
        >
            <div className={classes.inner}>
                {props.children}
            </div>
        </MantineModal>
    )
}
