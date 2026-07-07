import {Button, Checkbox, Menu} from '@mantine/core';
import {IconColumns} from '@tabler/icons-react';
import {Table} from '@tanstack/react-table';
import {t} from '@lingui/macro';
import classes from './ColumnVisibilityToggle.module.scss';

interface ColumnVisibilityToggleProps<TData> {
    table: Table<TData>;
}

export function ColumnVisibilityToggle<TData>({table}: ColumnVisibilityToggleProps<TData>) {
    const columns = table.getAllLeafColumns().filter((column) => column.getCanHide());

    if (columns.length === 0) {
        return null;
    }

    return (
        <Menu width={220} closeOnItemClick={false} shadow="none" offset={6} position="bottom-end">
            <Menu.Target>
                <Button size="xs" variant="default" leftSection={<IconColumns size={15}/>} className={classes.trigger}>
                    {t`Columns`}
                </Button>
            </Menu.Target>

            <Menu.Dropdown className={classes.dropdown}>
                <Menu.Label className={classes.label}>{t`Toggle columns`}</Menu.Label>
                {columns.map((column) => {
                    const columnDef = column.columnDef;
                    const label = typeof columnDef.header === 'string'
                        ? columnDef.header
                        : (columnDef.id || column.id);

                    return (
                        <Menu.Item key={column.id} className={classes.item}>
                            <Checkbox
                                size="xs"
                                className={classes.checkbox}
                                checked={column.getIsVisible()}
                                onChange={column.getToggleVisibilityHandler()}
                                label={label}
                            />
                        </Menu.Item>
                    );
                })}
            </Menu.Dropdown>
        </Menu>
    );
}
