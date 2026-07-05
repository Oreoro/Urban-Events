import React from "react";
import {Container} from "@mantine/core";
import classes from "./PageBody.module.scss";

interface PageBodyProps {
    children: React.ReactNode,
    isFluid?: boolean,
}

export const PageBody = ({children, isFluid = true}: PageBodyProps) => {
    return (
        <Container
            className={classes.pageBody}
            data-fluid={isFluid}
            style={{position: 'relative'}}
            fluid={isFluid}
            p={0}
        >
            {children}
        </Container>
    )
}
