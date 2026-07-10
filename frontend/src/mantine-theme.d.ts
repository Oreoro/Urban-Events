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
    | 'coral'
    | 'marigold'
    | 'mint'
    | 'sky'
    | 'indigoNight'
    | 'stickerSky'
    | 'stickerPurple'
    | 'stickerPink'
    | 'stickerOrange'
    | 'stickerTeal'
    | 'stickerGreen'
    | DefaultMantineColor;

declare module '@mantine/core' {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }
}
