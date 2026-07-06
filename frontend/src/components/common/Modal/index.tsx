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
                opacity: 0.55,
                blur: 3,
            }}
            size={'xl'}
            withCloseButton={true}
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
