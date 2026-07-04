import {
    DefaultMantineColor,
    MantineColorsTuple,
} from '@mantine/core';

type ExtendedCustomColors =
    | 'primary'
    | 'secondary'
    | 'blush'
    | 'aqua'
    | 'eggshell'
    | 'slate'
    | DefaultMantineColor;

declare module '@mantine/core' {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }
}
