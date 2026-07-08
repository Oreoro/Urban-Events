/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#FBF2F0",
    eggshell: "#F9F9F7",
    icyAqua: "#F1F9F7",
    lightBlue: "#EDF5FF",
    blueSlate: "#6F6E69",
    canvas: "#F9F9F7",
    canvasSoft: "#F3F3F1",
    surface: "#FFFFFF",
    surfaceWarm: "#F6F5F2",
    ink: "#2F2D27",
    inkSoft: "#504D47",
    muted: "#74706A",
    border: "#DFDDD7",
    borderStrong: "#D1CEC7",
    navy: "#2F2D27",
    navyDeep: "#191918",
    teal: "#37352F",
    tealDeep: "#4F4D49",
    plum: "#37352F",
    plumDeep: "#191918",
    forest: "#2F2D27",
    forestDeep: "#504D47",
    coral: "#2F2D27",
    coralDeep: "#7A3B37",
    marigold: "#74706A",
    mint: "#F3F3F1",
    sky: "#F3F3F1",
    success: "#2F8F62",
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(urbanEventsColors.ink),
        secondary: generateColors(urbanEventsColors.inkSoft),
        blush: generateColors(urbanEventsColors.ink),
        aqua: generateColors(urbanEventsColors.ink),
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: generateColors(urbanEventsColors.blueSlate),
        coral: generateColors(urbanEventsColors.ink),
        marigold: generateColors(urbanEventsColors.muted),
        mint: generateColors(urbanEventsColors.canvasSoft),
        sky: generateColors(urbanEventsColors.canvasSoft),
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: "650",
        sizes: {
            h1: {fontSize: "1.875rem", lineHeight: "1.16"},
            h2: {fontSize: "1.45rem", lineHeight: "1.2"},
            h3: {fontSize: "1.12rem", lineHeight: "1.25"},
        },
    },
    defaultRadius: "sm",
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
        sm: "5px",
        md: "6px",
        lg: "6px",
        xl: "6px",
    },
    shadows: {
        xs: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
    },
    components: {
        ActionIcon: {
            defaultProps: {
                radius: "sm",
                variant: "subtle",
            },
            styles: {
                root: {
                    borderWidth: "1px",
                    transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease",
                },
            },
        },
        Alert: {
            defaultProps: {
                radius: "sm",
                variant: "light",
            },
        },
        Badge: {
            defaultProps: {
                radius: "sm",
                fw: 600,
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
                radius: "sm",
            },
            styles: {
                root: {
                    fontWeight: 600,
                    letterSpacing: 0,
                    minHeight: "2.125rem",
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
                radius: "sm",
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
                color: "slate",
            },
        },
        Input: {
            defaultProps: {
                radius: "sm",
            },
            styles: {
                input: {
                    borderColor: "var(--hi-border-strong)",
                    color: "var(--hi-text)",
                    fontWeight: 500,
                    minHeight: "2.125rem",
                    backgroundColor: "var(--hi-control-bg)",
                },
                label: {
                    color: "var(--hi-text)",
                    fontWeight: 600,
                },
                description: {
                    color: "var(--hi-text-muted)",
                },
            },
        },
        Menu: {
            defaultProps: {
                radius: "sm",
                shadow: "none",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                    boxShadow: "none",
                },
                item: {
                    fontWeight: 600,
                },
            },
        },
        Modal: {
            defaultProps: {
                radius: "sm",
                overlayProps: {
                    blur: 4,
                    opacity: 0.45,
                },
            },
        },
        Paper: {
            defaultProps: {
                radius: "sm",
                shadow: "none",
                withBorder: true,
            },
            styles: {
                root: {
                    borderColor: "var(--hi-border)",
                },
            },
        },
        Popover: {
            defaultProps: {
                radius: "sm",
                shadow: "none",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                    boxShadow: "none",
                },
            },
        },
        Progress: {
            defaultProps: {
                color: "slate",
                radius: "sm",
            },
        },
        Radio: {
            defaultProps: {
                color: "slate",
            },
        },
        SegmentedControl: {
            defaultProps: {
                radius: "sm",
            },
            styles: {
                root: {
                    borderColor: "var(--hi-border)",
                },
                label: {
                    fontWeight: 600,
                },
            },
        },
        Tabs: {
            defaultProps: {
                radius: "sm",
                color: "slate",
            },
        },
        Table: {
            styles: {
                table: {
                    color: "var(--hi-text)",
                },
                th: {
                    fontWeight: 600,
                    color: "var(--hi-text-muted)",
                },
                td: {
                    color: "var(--hi-text)",
                },
            },
        },
        TextInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        NumberInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        Select: {
            defaultProps: {
                radius: "sm",
            },
        },
        Textarea: {
            defaultProps: {
                radius: "sm",
            },
        },
        Tooltip: {
            defaultProps: {
                radius: "sm",
                withArrow: true,
            },
            styles: {
                tooltip: {
                    backgroundColor: "var(--hi-text)",
                    color: "#fff",
                    fontWeight: 500,
                },
            },
        },
    },
});
