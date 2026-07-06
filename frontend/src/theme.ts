/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#F4EEEE",
    eggshell: "#FBFBFA",
    icyAqua: "#EEF6FF",
    lightBlue: "#EDF5FF",
    blueSlate: "#787774",
    canvas: "#FFFFFF",
    canvasSoft: "#F7F7F5",
    surface: "#FFFFFF",
    ink: "#37352F",
    inkSoft: "#4F4D48",
    muted: "#787774",
    border: "#E6E4DF",
    borderStrong: "#D9D7D2",
    navy: "#37352F",
    navyDeep: "#191918",
    teal: "#2383E2",
    tealDeep: "#0B6BCB",
    plum: "#37352F",
    plumDeep: "#191918",
    forest: "#2383E2",
    forestDeep: "#0B6BCB",
    coral: "#D97367",
    coralDeep: "#B6534B",
    marigold: "#CB912F",
    mint: "#EEF6FF",
    sky: "#EDF5FF",
    success: "#2F8F62",
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(urbanEventsColors.navy),
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
    primaryShade: 7,
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
        xs: "0 1px 2px rgba(55, 53, 47, 0.05)",
        sm: "0 1px 2px rgba(55, 53, 47, 0.06)",
        md: "0 2px 8px rgba(55, 53, 47, 0.08)",
        lg: "0 8px 24px rgba(55, 53, 47, 0.10)",
        xl: "0 12px 32px rgba(55, 53, 47, 0.12)",
    },
    components: {
        ActionIcon: {
            defaultProps: {
                radius: "md",
                variant: "subtle",
            },
            styles: {
                root: {
                    transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease",
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
                    minHeight: "2.25rem",
                    transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease",
                },
                label: {
                    whiteSpace: "normal",
                },
                section: {
                    marginInlineEnd: "0.5rem",
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
                    backgroundColor: "var(--hi-control-bg)",
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
                shadow: "xs",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                    boxShadow: "var(--hi-shadow-sm)",
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
                shadow: "none",
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
        Table: {
            styles: {
                table: {
                    color: "var(--hi-text)",
                },
                th: {
                    fontWeight: 700,
                    color: "var(--hi-text-muted)",
                },
                td: {
                    color: "var(--hi-text)",
                },
            },
        },
        TextInput: {
            defaultProps: {
                radius: "md",
            },
        },
        NumberInput: {
            defaultProps: {
                radius: "md",
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: "md",
            },
        },
        Select: {
            defaultProps: {
                radius: "md",
            },
        },
        Textarea: {
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
