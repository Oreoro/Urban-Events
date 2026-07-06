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
    background: '#F7F7F5',
    textPrimary: '#37352F',
    textSecondary: '#4F4D48',
    textTertiary: '#787774',
    border: '#E6E4DF',
};

const DARK_PALETTE = {
    surface: '#22211F',
    background: '#191918',
    textPrimary: '#F7F7F5',
    textSecondary: '#D9D7D2',
    textTertiary: '#A7A5A0',
    border: 'rgba(247, 247, 245, 0.16)',
};

/**
 * Creates a color palette that preserves the user's exact accent color.
 */
function createColorPalette(accentColor: string): MantineColorsTuple {
    const rgb = hexToRgb(accentColor);
    if (!rgb) {
        return ['#F7F7F5', '#F1F1EF', '#E6E4DF', '#D9D7D2', '#A7A5A0', '#787774', '#4F4D48', '#37352F', '#22211F', '#191918'];
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
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headings: {
            fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: '700',
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
            : mode === 'light' ? 'rgba(55, 53, 47, 0.1)' : 'rgba(247, 247, 245, 0.18)';

        const accentMuted = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mode === 'light' ? 0.6 : 0.7})`
            : mode === 'light' ? 'rgba(55, 53, 47, 0.62)' : 'rgba(247, 247, 245, 0.72)';

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
