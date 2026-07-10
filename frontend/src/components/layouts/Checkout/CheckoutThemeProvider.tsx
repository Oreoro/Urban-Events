/* eslint-disable lingui/no-unlocalized-strings */
import {MantineProvider, MantineThemeOverride, CSSVariablesResolver, MantineColorsTuple, ButtonProps, MantineTheme} from "@mantine/core";
import {PropsWithChildren, useMemo} from "react";
import {
    getAccentMuted,
    getAccentSoft,
    getContrastColor,
    getThemeModePalette,
    hexToRgb,
} from "../../../utilites/themeUtils";

interface CheckoutThemeProviderProps {
    accentColor: string;
    mode: 'light' | 'dark';
}

/**
 * Creates a color palette that preserves the user's exact accent color.
 */
function createColorPalette(accentColor: string): MantineColorsTuple {
    const rgb = hexToRgb(accentColor);
    if (!rgb) {
        return ['#FFFFFF', '#FBFAF8', '#F7F6F3', '#E9E9E7', '#D9D9D6', '#B8B8B4', '#787774', '#37352F', '#2F2E2B', '#191919'];
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
            fontWeight: '650',
        },
        defaultRadius: 'sm',
        radius: {
            xs: '2px',
            sm: '3px',
            md: '4px',
            lg: '6px',
            xl: '8px',
        },
        shadows: {
            xs: '0 1px 2px rgba(15, 15, 15, 0.04)',
            sm: '0 2px 6px rgba(15, 15, 15, 0.06)',
            md: '0 8px 24px rgba(15, 15, 15, 0.08)',
            lg: '0 16px 48px rgba(15, 15, 15, 0.12)',
            xl: '0 24px 80px rgba(15, 15, 15, 0.16)',
        },
        primaryShade: mode === 'dark' ? 6 : 7,
        components: {
            Button: {
                defaultProps: {
                    color: 'primary',
                    radius: 'sm',
                    size: 'sm',
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
 * Only accent color is customizable.
 */
function createCSSVariablesResolver(accentColor: string, mode: 'light' | 'dark'): CSSVariablesResolver {
    return () => {
        const palette = getThemeModePalette(mode);
        const accentContrast = getContrastColor(accentColor);
        const accentSoft = getAccentSoft(accentColor, mode);
        const accentMuted = getAccentMuted(accentColor, mode);

        return {
            variables: {
                // Accent colors (customizable)
                '--checkout-accent': accentColor,
                '--checkout-accent-contrast': accentContrast,
                '--checkout-accent-hover': `color-mix(in srgb, ${accentColor} 88%, ${palette.textPrimary})`,
                '--checkout-accent-soft': accentSoft,
                '--checkout-accent-muted': accentMuted,
                '--hi-primary': accentColor,
                '--hi-primary-hover': `color-mix(in srgb, ${accentColor} 88%, ${palette.textPrimary})`,
                '--hi-link-color': accentColor,

                // Fixed palette colors (not customizable - ensures readability)
                '--checkout-background': palette.background,
                '--checkout-surface': palette.surface,
                '--checkout-surface-strong': palette.surfaceStrong,
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
