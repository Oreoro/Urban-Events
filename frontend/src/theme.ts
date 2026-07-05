/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#F6A49B",
    eggshell: "#FAF3DD",
    icyAqua: "#C8F3EA",
    lightBlue: "#C8E3E8",
    blueSlate: "#58606F",
    canvas: "#FFF8EA",
    canvasSoft: "#FFFCF3",
    surface: "#FFFFFF",
    ink: "#27313C",
    inkSoft: "#42505E",
    muted: "#6D7784",
    border: "#DED4BF",
    borderStrong: "#C7BBA3",
    plum: "#52334A",
    plumDeep: "#342333",
    forest: "#14665F",
    forestDeep: "#0E4F49",
    coral: "#D96B60",
    coralDeep: "#A94C45",
    marigold: "#D89B2B",
    mint: "#DFF8F1",
    sky: "#DCEFF3",
    success: "#0F7B5F",
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(urbanEventsColors.plum),
        secondary: generateColors(urbanEventsColors.forest),
        blush: generateColors(urbanEventsColors.coral),
        aqua: generateColors(urbanEventsColors.forest),
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: generateColors(urbanEventsColors.blueSlate),
        coral: generateColors(urbanEventsColors.coral),
        marigold: generateColors(urbanEventsColors.marigold),
        mint: generateColors(urbanEventsColors.mint),
        sky: generateColors(urbanEventsColors.sky),
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
    headings: {
        fontFamily: "'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
        fontWeight: "800",
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
        sm: "5px",
        md: "8px",
        lg: "10px",
        xl: "14px",
    },
    shadows: {
        xs: "0 1px 2px rgba(47, 52, 64, 0.08)",
        sm: "0 5px 16px rgba(47, 52, 64, 0.10)",
        md: "0 14px 34px rgba(47, 52, 64, 0.13)",
        lg: "0 22px 54px rgba(47, 52, 64, 0.16)",
        xl: "0 30px 72px rgba(47, 52, 64, 0.20)",
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
        },
        Button: {
            defaultProps: {
                radius: "md",
            },
            styles: {
                root: {
                    fontWeight: 800,
                    letterSpacing: 0,
                    minHeight: "2.5rem",
                    transition: "background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
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
                shadow: "xs",
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
                    fontWeight: 700,
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
