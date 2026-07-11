/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const notionColors = {
    black: "#000000",
    white: "#FFFFFF",
    ink: "#171717",
    inkSoft: "#2F3437",
    gray50: "#F7F8FA",
    gray100: "#F1F3F5",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray500: "#64748B",
    gray600: "#475569",
    blue: "#097FE8",
    blueHover: "#006FD6",
    blueSoft: "#EEF6FF",
    red: "#F64932",
    orange: "#FF8A33",
    yellow: "#FFB110",
    green: "#1AAE39",
    teal: "#2A9D99",
    purple: "#AD6DED",
    pink: "#FF83DD",
} as const;

export const urbanEventsColors = {
    powderBlush: notionColors.gray50,
    eggshell: notionColors.white,
    icyAqua: notionColors.blueSoft,
    lightBlue: notionColors.blueSoft,
    blueSlate: notionColors.gray500,
    canvas: notionColors.white,
    canvasSoft: notionColors.gray50,
    surface: notionColors.white,
    ink: notionColors.ink,
    inkSoft: notionColors.inkSoft,
    muted: notionColors.gray500,
    border: notionColors.gray200,
    borderStrong: notionColors.gray300,
    navy: notionColors.ink,
    navyDeep: notionColors.black,
    teal: notionColors.blue,
    tealDeep: notionColors.blueHover,
    plum: notionColors.gray600,
    plumDeep: notionColors.ink,
    forest: notionColors.blue,
    forestDeep: notionColors.blueHover,
    coral: notionColors.red,
    coralDeep: "#D92D20",
    marigold: notionColors.yellow,
    mint: notionColors.blueSoft,
    sky: notionColors.blueSoft,
    success: notionColors.green,
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(urbanEventsColors.teal),
        secondary: generateColors(urbanEventsColors.teal),
        blush: generateColors(urbanEventsColors.coral),
        aqua: generateColors(urbanEventsColors.teal),
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: generateColors(urbanEventsColors.blueSlate),
        coral: generateColors(urbanEventsColors.coral),
        marigold: generateColors(urbanEventsColors.marigold),
        mint: generateColors(urbanEventsColors.mint),
        sky: generateColors(urbanEventsColors.sky),
    },
    primaryColor: "primary",
    primaryShade: 6,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: "700",
        sizes: {
            h1: {fontSize: "2rem", lineHeight: "1.18"},
            h2: {fontSize: "1.55rem", lineHeight: "1.22"},
            h3: {fontSize: "1.2rem", lineHeight: "1.28"},
        },
    },
    defaultRadius: "md",
    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "0.9375rem",
        lg: "1.0625rem",
        xl: "1.25rem",
    },
    lineHeights: {
        xs: "1.35",
        sm: "1.45",
        md: "1.5",
        lg: "1.55",
        xl: "1.6",
    },
    radius: {
        xs: "3px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
    },
    shadows: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.05)",
        sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
        md: "0 2px 8px rgba(15, 23, 42, 0.08)",
        lg: "0 8px 24px rgba(15, 23, 42, 0.10)",
        xl: "0 12px 32px rgba(15, 23, 42, 0.12)",
    },
    components: {
        ActionIcon: {
            defaultProps: {
                radius: "md",
                variant: "subtle",
            },
            styles: {
                root: {
                    transition: "background-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
                },
            },
        },
        Alert: {
            defaultProps: {
                radius: "md",
            },
        },
        Badge: {
            defaultProps: {
                radius: "sm",
                fw: 700,
            },
            styles: {
                root: {
                    letterSpacing: 0,
                    textTransform: "none",
                },
            },
        },
        Button: {
            defaultProps: {
                radius: "md",
            },
            styles: {
                root: {
                    fontWeight: 650,
                    letterSpacing: 0,
                    minHeight: "2.375rem",
                    lineHeight: 1,
                    paddingInline: "0.875rem",
                    transition: "background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
                },
                label: {
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                },
            },
        },
        Card: {
            defaultProps: {
                radius: "lg",
                shadow: "none",
                withBorder: true,
            },
            styles: {
                root: {
                    borderColor: "var(--hi-border)",
                },
            },
        },
        Checkbox: {
            defaultProps: {
                radius: "sm",
                color: "secondary",
            },
        },
        Input: {
            defaultProps: {
                radius: "md",
            },
            styles: {
                input: {
                    borderColor: "var(--hi-border-strong)",
                    color: "var(--hi-text)",
                    fontWeight: 500,
                    minHeight: "2.625rem",
                },
                label: {
                    color: "var(--hi-text)",
                    fontWeight: 650,
                },
                description: {
                    color: "var(--hi-text-muted)",
                },
            },
        },
        Menu: {
            defaultProps: {
                radius: "md",
                shadow: "md",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                },
                item: {
                    fontWeight: 600,
                },
            },
        },
        Modal: {
            defaultProps: {
                radius: "lg",
                overlayProps: {
                    blur: 4,
                    opacity: 0.45,
                },
            },
        },
        Paper: {
            defaultProps: {
                radius: "lg",
            },
        },
        SegmentedControl: {
            defaultProps: {
                radius: "md",
            },
            styles: {
                root: {
                    borderColor: "var(--hi-border)",
                },
                label: {
                    fontWeight: 700,
                },
            },
        },
        Tabs: {
            defaultProps: {
                radius: "md",
                color: "secondary",
            },
        },
        TextInput: {
            defaultProps: {
                radius: "md",
            },
        },
        Tooltip: {
            defaultProps: {
                radius: "sm",
                withArrow: true,
            },
        },
    },
});
