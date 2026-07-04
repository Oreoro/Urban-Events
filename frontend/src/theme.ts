/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

import {getConfig} from "./utilites/config.ts";

export const urbanEventsColors = {
    powderBlush: "#FFA69E",
    eggshell: "#FAF3DD",
    icyAqua: "#B8F2E6",
    lightBlue: "#AED9E0",
    blueSlate: "#5E6472",
    canvas: "#FFF9EA",
    canvasSoft: "#FFFCF1",
    slate: "#4A5262",
    slateDeep: "#2F3440",
    slateSoft: "#EEF1F4",
    aqua: "#8DE4D8",
    aquaDeep: "#147C74",
    blush: "#FF8A80",
    blushDeep: "#B7524A",
    border: "#D8D1BC",
    success: "#0F8A65",
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(getConfig("VITE_APP_PRIMARY_COLOR", urbanEventsColors.slate) as string),
        secondary: generateColors(getConfig("VITE_APP_SECONDARY_COLOR", urbanEventsColors.aquaDeep) as string),
        blush: generateColors(urbanEventsColors.blushDeep),
        aqua: generateColors(urbanEventsColors.aquaDeep),
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: generateColors(urbanEventsColors.slate),
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
    headings: {
        fontFamily: "'Space Grotesk', 'Manrope', 'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif",
        fontWeight: "800",
    },
    defaultRadius: "md",
    radius: {
        xs: "3px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "16px",
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
