import React from 'react';
import {ActionIcon, Menu} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import classes from './ActionMenu.module.scss';

export interface MenuItem {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
    visible?: boolean;
}

export interface ActionMenuItemsGroup {
    label: string;
    items: MenuItem[];
    showDividerAbove?: boolean;
}

interface ActionMenuProps {
    itemsGroups: ActionMenuItemsGroup[];
    target?: React.ReactNode;
}

const DefaultTarget = () => (
    <ActionIcon variant="subtle" size="sm" radius="sm" className={classes.defaultTarget}>
        <IconDotsVertical size={16}/>
    </ActionIcon>
);

export const ActionMenu: React.FC<ActionMenuProps> = ({
                                                          itemsGroups,
                                                          target = <DefaultTarget/>
                                                      }) => {
    return (
        <>
            <Menu shadow="none" width={204} offset={6}>
                <Menu.Target>
                    <div className={classes.target}>
                        {target}
                    </div>
                </Menu.Target>

                <Menu.Dropdown className={classes.dropdown}>
                    {itemsGroups.map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            {group.showDividerAbove && <Menu.Divider/>}
                            {group.label && <Menu.Label className={classes.label}>{group.label}</Menu.Label>}
                            {group.items.map((item, itemIndex) => item.visible !== false && (
                                <Menu.Item
                                    key={itemIndex}
                                    color={item.color}
                                    className={classes.item}
                                    leftSection={item.icon}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </Menu.Item>
                            ))}
                        </React.Fragment>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </>
    );
};
