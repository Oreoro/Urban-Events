/* eslint-disable lingui/no-unlocalized-strings */
import {MantineProvider, MantineThemeOverride, CSSVariablesResolver, MantineColorsTuple, ButtonProps, MantineTheme, v8CssVariablesResolver} from "@mantine/core";
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
    background: '#F6F8FA',
    textPrimary: '#111827',
    textSecondary: '#344054',
    textTertiary: '#667085',
    border: 'rgba(51, 65, 85, 0.18)',
};

const DARK_PALETTE = {
    surface: '#253044',
    background: '#101828',
    textPrimary: '#F8FAFC',
    textSecondary: '#DDE7F2',
    textTertiary: '#B7C3D0',
    border: 'rgba(248, 250, 252, 0.16)',
};

const NOTION_BLUE = '#097FE8';
const NOTION_BLUE_DARK = '#58A9F6';

function isWeakOrWarmAccent(accentColor: string): boolean {
    const rgb = hexToRgb(accentColor);
    if (!rgb) {
        return true;
    }

    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    const isWashedOut = luminance > 226 || saturation < 0.08;
    const isBrownish = rgb.r > rgb.b * 1.18 && rgb.g > rgb.b * 0.72 && rgb.g < rgb.r * 1.04;

    return isWashedOut || isBrownish;
}

function getCheckoutAccent(accentColor: string, mode: 'light' | 'dark'): string {
    if (isWeakOrWarmAccent(accentColor)) {
        return mode === 'dark' ? NOTION_BLUE_DARK : NOTION_BLUE;
    }

    return accentColor;
}

/**
 * Creates a color palette from the resolved checkout accent color.
 */
function createColorPalette(accentColor: string): MantineColorsTuple {
    const rgb = hexToRgb(accentColor);
    if (!rgb) {
        return ['#EEF2F6', '#D7DEE8', '#B8C2CC', '#98A5B3', '#667085', '#475467', '#344054', '#253044', '#101828', '#0B1220'];
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
 * Creates a Mantine theme with a readable checkout accent color.
 */
function createCheckoutTheme(accentColor: string, mode: 'light' | 'dark'): MantineThemeOverride {
    const resolvedAccent = getCheckoutAccent(accentColor, mode);
    const primaryColors = createColorPalette(resolvedAccent);
    const contrastColor = getContrastColor(resolvedAccent);

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
                    radius: 'sm',
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
                vars: () => ({
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
 * Accent color is sanitized when event settings are too light or too warm.
 */
function createCSSVariablesResolver(accentColor: string, mode: 'light' | 'dark'): CSSVariablesResolver {
    return (theme) => {
        const v8 = v8CssVariablesResolver(theme);
        const palette = mode === 'light' ? LIGHT_PALETTE : DARK_PALETTE;
        const resolvedAccent = getCheckoutAccent(accentColor, mode);
        const accentContrast = getContrastColor(resolvedAccent);
        const rgb = hexToRgb(resolvedAccent);

        const accentSoft = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mode === 'light' ? 0.1 : 0.2})`
            : mode === 'light' ? 'rgba(9, 127, 232, 0.1)' : 'rgba(88, 169, 246, 0.2)';

        const accentMuted = rgb
            ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${mode === 'light' ? 0.6 : 0.7})`
            : mode === 'light' ? 'rgba(9, 127, 232, 0.6)' : 'rgba(88, 169, 246, 0.7)';

        return {
            variables: {
                ...v8.variables,
                // Accent colors
                '--checkout-accent': resolvedAccent,
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
            light: v8.light,
            dark: v8.dark,
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
