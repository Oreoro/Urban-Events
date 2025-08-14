import {Container} from '@mantine/core';
import classes from './Header.module.scss';
import {NavLink} from "react-router";
import { getConfig } from '../../../utilites/config';

interface HeaderProps {
    rightContent?: React.ReactNode;
    fullWidth?: boolean;
}

export const Header = ({rightContent, fullWidth = false}: HeaderProps) => {
    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner} fluid={fullWidth}>
                <div className={classes.rightContent}>
                    {rightContent}
                </div>
            </Container>
        </header>
    );
}
