/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme, type MantineColorsTuple} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#F7F6F3",
    eggshell: "#FFFFFF",
    icyAqua: "#DDEBF1",
    lightBlue: "#DDEBF1",
    blueSlate: "#787774",
    canvas: "#F7F6F3",
    canvasSoft: "#F1F1EF",
    surface: "#FFFFFF",
    surfaceWarm: "#FBFAF8",
    ink: "#37352F",
    inkSoft: "#5F5E5B",
    muted: "#787774",
    faint: "#9B9A97",
    border: "#E4E4E1",
    borderStrong: "#D9D9D6",
    primaryBlue: "#37352F",
    primaryBlueHover: "#2F2E2B",
    deepIndigo: "#191919",
    navy: "#37352F",
    navyDeep: "#191919",
    stickerSky: "#0B6E99",
    stickerPurple: "#EAE4F2",
    stickerPurpleDeep: "#6940A5",
    stickerPink: "#AD1A72",
    stickerOrange: "#D9730D",
    stickerOrangeDeep: "#B95C00",
    stickerTeal: "#0F7B6C",
    stickerGreen: "#0F7B6C",
    teal: "#0F7B6C",
    tealDeep: "#0C6258",
    plum: "#6940A5",
    plumDeep: "#56358A",
    forest: "#0F7B6C",
    forestDeep: "#0C6258",
    coral: "#E03E3E",
    coralDeep: "#C73535",
    marigold: "#DFAB01",
    mint: "#DDEDEA",
    sky: "#DDEBF1",
    success: "#0F7B6C",
} as const;

const workspaceGray: MantineColorsTuple = [
    "#FFFFFF",
    "#FBFAF8",
    "#F7F6F3",
    "#F1F1EF",
    "#E9E9E7",
    "#DEDEDB",
    "#9B9A97",
    "#787774",
    "#37352F",
    "#191919",
];

const notionInk: MantineColorsTuple = [
    "#FFFFFF",
    "#FBFAF8",
    "#F7F6F3",
    "#E9E9E7",
    "#D9D9D6",
    "#B8B8B4",
    "#787774",
    "#37352F",
    "#2F2E2B",
    "#191919",
];

const workspaceDark: MantineColorsTuple = [
    "#F4F4F2",
    "#E8E8E6",
    "#CFCFCA",
    "#A8A7A1",
    "#787774",
    "#5F5E5B",
    "#37352F",
    "#252525",
    "#202020",
    "#191919",
];

const actionBlue: MantineColorsTuple = [
    "#F4FAFC",
    "#DDEBF1",
    "#C9E0E9",
    "#A8CDD9",
    "#75AEC2",
    "#3F8FAE",
    "#0B6E99",
    "#095E83",
    "#074D6B",
    "#05384E",
];

const eventGreen: MantineColorsTuple = [
    "#F4FAF8",
    "#DDEDEA",
    "#C9E3DE",
    "#A9D2CA",
    "#76B6AA",
    "#3E9A8A",
    "#0F7B6C",
    "#0C6258",
    "#094D45",
    "#063B35",
];

const eventCyan: MantineColorsTuple = [
    "#F4FAFC",
    "#DDEBF1",
    "#C9E0E9",
    "#A8CDD9",
    "#75AEC2",
    "#3F8FAE",
    "#0B6E99",
    "#095E83",
    "#074D6B",
    "#05384E",
];

const eventViolet: MantineColorsTuple = [
    "#FBF8FE",
    "#EAE4F2",
    "#DDD3EA",
    "#C4B0DC",
    "#A78ACB",
    "#8865B9",
    "#6940A5",
    "#56358A",
    "#422B68",
    "#31204F",
];

const eventYellow: MantineColorsTuple = [
    "#FFFDF5",
    "#FBF3DB",
    "#F6E8B8",
    "#EDD483",
    "#E6C353",
    "#DFAB01",
    "#B58B00",
    "#8A6A00",
    "#604900",
    "#3E3000",
];

const eventRed: MantineColorsTuple = [
    "#FFF8F8",
    "#FBE4E4",
    "#F7CECE",
    "#F0AAAA",
    "#E98282",
    "#E65E5E",
    "#E03E3E",
    "#C73535",
    "#982A2A",
    "#6F1F1F",
];

const eventOrange: MantineColorsTuple = [
    "#FFF9F3",
    "#FAEBDD",
    "#F4D8BD",
    "#EAB783",
    "#E19A50",
    "#D9730D",
    "#B95C00",
    "#944900",
    "#6E3600",
    "#4A2400",
];

const eventPink: MantineColorsTuple = [
    "#FEF8FB",
    "#F4DFEB",
    "#EEC8DC",
    "#DE9BC1",
    "#CC6EA5",
    "#BD408A",
    "#AD1A72",
    "#8F155E",
    "#6E1048",
    "#510C35",
];

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        gray: workspaceGray,
        dark: workspaceDark,
        blue: actionBlue,
        cyan: eventCyan,
        teal: eventGreen,
        green: eventGreen,
        lime: eventGreen,
        yellow: eventYellow,
        orange: eventOrange,
        red: eventRed,
        pink: eventPink,
        grape: eventViolet,
        violet: eventViolet,
        primary: notionInk,
        secondary: workspaceGray,
        blush: workspaceGray,
        aqua: actionBlue,
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: workspaceGray,
        coral: eventRed,
        marigold: eventYellow,
        mint: eventGreen,
        sky: actionBlue,
        indigoNight: notionInk,
        stickerSky: actionBlue,
        stickerPurple: eventViolet,
        stickerPink: eventPink,
        stickerOrange: eventOrange,
        stickerTeal: eventGreen,
        stickerGreen: eventGreen,
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: "650",
        sizes: {
            h1: {fontSize: "1.75rem", lineHeight: "1.16"},
            h2: {fontSize: "1.35rem", lineHeight: "1.2"},
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
        xs: "2px",
        sm: "3px",
        md: "4px",
        lg: "6px",
        xl: "8px",
    },
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
    },
    shadows: {
        xs: "0 1px 2px rgba(15, 15, 15, 0.04)",
        sm: "0 2px 6px rgba(15, 15, 15, 0.06)",
        md: "0 8px 24px rgba(15, 15, 15, 0.08)",
        lg: "0 16px 48px rgba(15, 15, 15, 0.12)",
        xl: "0 24px 80px rgba(15, 15, 15, 0.16)",
    },
    components: {
        ActionIcon: {
            defaultProps: {
                radius: "sm",
                variant: "subtle",
                size: "sm",
            },
            styles: {
                root: {
                    borderWidth: "1px",
                    transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
                },
            },
        },
        Alert: {
            defaultProps: {
                radius: "sm",
                variant: "light",
            },
        },
        Anchor: {
            defaultProps: {
                underline: "never",
            },
            styles: {
                root: {
                    color: "var(--hi-link-color)",
                    fontWeight: 560,
                },
            },
        },
        Avatar: {
            defaultProps: {
                radius: "sm",
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
                size: "sm",
            },
            styles: {
                root: {
                    fontWeight: 560,
                    letterSpacing: 0,
                    minHeight: "2.125rem",
                    paddingInline: "0.8125rem",
                    transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
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
                color: "primary",
            },
        },
        ColorInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        DatePickerInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        FileInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        Input: {
            defaultProps: {
                radius: "sm",
                size: "sm",
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
                    fontWeight: 560,
                },
                description: {
                    color: "var(--hi-text-muted)",
                },
            },
        },
        Menu: {
            defaultProps: {
                radius: "sm",
                shadow: "md",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                    boxShadow: "var(--hi-shadow-md)",
                },
                item: {
                    fontWeight: 560,
                },
            },
        },
        Modal: {
            defaultProps: {
                radius: "lg",
                overlayProps: {
                    backgroundOpacity: 0.34,
                    blur: 0,
                },
            },
        },
        Paper: {
            defaultProps: {
                radius: "sm",
                shadow: "xs",
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
                shadow: "md",
            },
            styles: {
                dropdown: {
                    borderColor: "var(--hi-border)",
                    boxShadow: "var(--hi-shadow-md)",
                },
            },
        },
        Progress: {
            defaultProps: {
                color: "primary",
                radius: "sm",
            },
        },
        Radio: {
            defaultProps: {
                color: "primary",
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
                color: "primary",
                variant: "default",
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
                size: "sm",
            },
        },
        NumberInput: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        MultiSelect: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        NativeSelect: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        PinInput: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        Select: {
            defaultProps: {
                radius: "sm",
                size: "sm",
            },
        },
        Switch: {
            defaultProps: {
                color: "primary",
            },
        },
        ThemeIcon: {
            defaultProps: {
                color: "primary",
                radius: "sm",
                variant: "light",
            },
        },
        Textarea: {
            defaultProps: {
                radius: "sm",
                size: "sm",
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
                    color: "var(--hi-color-white)",
                    fontWeight: 500,
                },
            },
        },
    },
});
