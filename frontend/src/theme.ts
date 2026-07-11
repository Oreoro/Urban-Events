/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#E9897E",
    eggshell: "#F6F8FA",
    icyAqua: "#E3F8F3",
    lightBlue: "#EAF4FF",
    blueSlate: "#475467",
    canvas: "#F6F8FA",
    canvasSoft: "#EEF2F6",
    surface: "#FFFFFF",
    ink: "#111827",
    inkSoft: "#344054",
    muted: "#667085",
    border: "#D7DEE8",
    borderStrong: "#B8C2CC",
    navy: "#253044",
    navyDeep: "#101828",
    teal: "#0E7C70",
    tealDeep: "#0B5F58",
    plum: "#253044",
    plumDeep: "#101828",
    forest: "#0E7C70",
    forestDeep: "#0B5F58",
    coral: "#D9705F",
    coralDeep: "#B9564A",
    marigold: "#B7791F",
    mint: "#E6F7F2",
    sky: "#EAF4FF",
    success: "#0F7B5F",
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
        xs: "0 1px 2px rgba(16, 24, 40, 0.06)",
        sm: "0 1px 3px rgba(16, 24, 40, 0.08), 0 8px 18px rgba(16, 24, 40, 0.06)",
        md: "0 4px 10px rgba(16, 24, 40, 0.08), 0 14px 30px rgba(16, 24, 40, 0.08)",
        lg: "0 10px 22px rgba(16, 24, 40, 0.10), 0 24px 48px rgba(16, 24, 40, 0.10)",
        xl: "0 18px 36px rgba(16, 24, 40, 0.12), 0 32px 70px rgba(16, 24, 40, 0.12)",
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
