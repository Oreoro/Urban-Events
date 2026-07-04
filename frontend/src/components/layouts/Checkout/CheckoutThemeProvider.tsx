/* eslint-disable lingui/no-unlocalized-strings */
import {MantineProvider, MantineThemeOverride, CSSVariablesResolver, MantineColorsTuple, ButtonProps, CheckboxProps, MantineTheme} from "@mantine/core";
import {PropsWithChildren, useMemo} from "react";
import {getContrastColor, hexToRgb} from "../../../utilites/themeUtils";

interface CheckoutThemeProviderProps {
    accentColor: string;
    mode: 'light' | 'dark';
}

/**
 * Fixed color palettes for checkout - these ensure good contrast and readability.
 * Users can only customize accent color, not the base palette.
 */
const LIGHT_PALETTE = {
    surface: '#ffffff',
    background: '#FFF9EA',
    textPrimary: '#2F3440',
    textSecondary: '#4A5262',
    textTertiary: '#6B7280',
    border: 'rgba(74, 82, 98, 0.18)',
};

const DARK_PALETTE = {
    surface: '#252B35',
    background: '#171B22',
    textPrimary: '#ffffff',
    textSecondary: '#D5DEE2',
    textTertiary: '#A8B3BD',
    border: 'rgba(255, 255, 255, 0.14)',
};

/**
 * Creates a color palette that preserves the user's exact accent color.
 */
function createColorPalette(accentColor: string): MantineColorsTuple {
    const rgb = hexToRgb(accentColor);
    if (!rgb) {
        return ['#EEF1F4', '#D9DEE5', '#B8C0CC', '#94A0B0', '#728092', '#5E6472', '#4A5262', '#3F4756', '#343B48', '#2F3440'];
    }

    const {r, g, b} = rgb;

    const lighten = (factor: number) => {
        const lr = Math.round(r + (255 - r) * factor);
        const lg = Math.round(g + (255 - g) * factor);
        const lb = Math.round(b + (255 - b) * factor);
        return `rgb(${lr}, ${lg}, ${lb})`;
    };

    const darken = (factor: number) => {
        const dr = Math.round(r * (1 - factor));
        const dg = Math.round(g * (1 - factor));
        const db = Math.round(b * (1 - factor));
        return `rgb(${dr}, ${dg}, ${db})`;
    };

    return [
        lighten(0.9),
        lighten(0.8),
        lighten(0.6),
        lighten(0.4),
        lighten(0.2),
        accentColor,
        accentColor,
        accentColor,
        darken(0.15),
        darken(0.3),
    ];
}

/**
 * Creates a Mantine theme with the user's accent color.
 */
function createCheckoutTheme(accentColor: string, mode: 'light' | 'dark'): MantineThemeOverride {
    const primaryColors = createColorPalette(accentColor);
    const contrastColor = getContrastColor(accentColor);

    return {
        primaryColor: 'primary',
        colors: {
            primary: primaryColors,
        },
        fontFamily: "'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
        headings: {
            fontFamily: "'Space Grotesk', 'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
            fontWeight: '800',
        },
        primaryShade: mode === 'dark' ? 6 : 7,
        components: {
            Button: {
                defaultProps: {
                    color: 'primary',
                    radius: 'md',
                },
                vars: (_theme: MantineTheme, props: ButtonProps) => {
                    if (props.variant === 'filled' || props.variant === undefined) {
                        return {
                            root: {
                                '--button-color': contrastColor,
                            },
                        };
                    }
                    return { root: {} };
                },
            },
            Checkbox: {
                defaultProps: {
                    color: 'primary',
                },
                vars: (_theme: MantineTheme, _props: CheckboxProps) => ({
                    root: {
                        '--checkbox-icon-color': contrastColor,
                    },
                }),
            },
            Switch: {
                defaultProps: {
                    color: 'primary',
                },
            },
            SegmentedControl: {
                defaultProps: {
                    color: 'primary',
                },
            },
            Badge: {
                defaultProps: {
                    color: 'primary',
                },
            },
        },
    };
}

/**
 * Creates CSS variables for checkout theming.
 * Surface, text, and border colors are FIXED based on light/dark mode.
 * Only accent color is customizable.
 */
function createCSSVariablesResolver(accentColor: string, mode: 'light' | 'dark'): CSSVariablesResolver {
    return () => {
        const palette = mode === 'light' ? LIGHT_PALETTE : DARK_PALETTE;
        const accentContrast = getContrastColor(accentColor);
        const rgb = hexToRgb(accentColor);

        const accentSoft = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mode === 'light' ? 0.1 : 0.2})`
            : mode === 'light' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.2)';

        const accentMuted = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mode === 'light' ? 0.6 : 0.7})`
            : mode === 'light' ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.7)';

        return {
            variables: {
                // Accent colors (customizable)
                '--checkout-accent': accentColor,
                '--checkout-accent-contrast': accentContrast,
                '--checkout-accent-soft': accentSoft,
                '--checkout-accent-muted': accentMuted,

                // Fixed palette colors (not customizable - ensures readability)
                '--checkout-background': palette.background,
                '--checkout-surface': palette.surface,
                '--checkout-text-primary': palette.textPrimary,
                '--checkout-text-secondary': palette.textSecondary,
                '--checkout-text-tertiary': palette.textTertiary,
                '--checkout-border': palette.border,

                // Override global --hi-text (set to accent in global.scss) and
                // Mantine's default text color to use fixed palette instead
                '--hi-text': palette.textPrimary,
                '--mantine-color-text': palette.textPrimary,
            },
            light: {},
            dark: {},
        };
    };
}

/**
 * CheckoutThemeProvider wraps checkout with themed Mantine components.
 *
 * Design philosophy:
 * - Checkout uses FIXED light/dark palettes for surfaces, text, and borders
 * - Only the accent color (buttons, links, highlights) is customizable
 * - This ensures readability and accessibility regardless of user choices
 */
export const CheckoutThemeProvider = ({
    accentColor,
    mode,
    children,
}: PropsWithChildren<CheckoutThemeProviderProps>) => {
    const theme = useMemo(
        () => createCheckoutTheme(accentColor, mode),
        [accentColor, mode]
    );

    const cssVariablesResolver = useMemo(
        () => createCSSVariablesResolver(accentColor, mode),
        [accentColor, mode]
    );

    return (
        <MantineProvider
            theme={theme}
            cssVariablesResolver={cssVariablesResolver}
            forceColorScheme={mode}
        >
            {children}
        </MantineProvider>
    );
};

export default CheckoutThemeProvider;
