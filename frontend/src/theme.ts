/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme, type MantineColorsTuple} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#FFF2EE",
    eggshell: "#FFFFFF",
    icyAqua: "#EFF8F6",
    lightBlue: "#EDF6FF",
    blueSlate: "#6B6B66",
    canvas: "#FFFFFF",
    canvasSoft: "#F6F5F4",
    surface: "#FFFFFF",
    surfaceWarm: "#FBFAF8",
    ink: "#1F1F1F",
    inkSoft: "#31302E",
    muted: "#615D59",
    faint: "#A39E98",
    border: "#E6E6E6",
    borderStrong: "#D8D8D5",
    primaryBlue: "#0075DE",
    primaryBlueHover: "#005BAB",
    deepIndigo: "#213183",
    navy: "#213183",
    navyDeep: "#141D58",
    stickerSky: "#62AEF0",
    stickerPurple: "#D6B6F6",
    stickerPurpleDeep: "#391C57",
    stickerPink: "#FF64C8",
    stickerOrange: "#DD5B00",
    stickerOrangeDeep: "#B24700",
    stickerTeal: "#2A9D99",
    stickerGreen: "#1AAE39",
    teal: "#2A9D99",
    tealDeep: "#1E6F6C",
    plum: "#391C57",
    plumDeep: "#26103B",
    forest: "#1AAE39",
    forestDeep: "#137D2A",
    coral: "#FF64C8",
    coralDeep: "#9E2C78",
    marigold: "#DD5B00",
    mint: "#F7F7F5",
    sky: "#62AEF0",
    success: "#1AAE39",
} as const;

const workspaceGray: MantineColorsTuple = [
    "#FBFAF8",
    "#F6F5F4",
    "#EFEEEB",
    "#E6E6E6",
    "#D5D0C8",
    "#A39E98",
    "#615D59",
    "#31302E",
    "#1F1F1F",
    "#171614",
];

const actionBlue: MantineColorsTuple = [
    "#F6FBFF",
    "#E8F3FF",
    "#DCEBFF",
    "#B9D6FA",
    "#8BC1F5",
    "#62A9EF",
    "#2C8CE5",
    "#0075DE",
    "#005BAB",
    "#003F78",
];

const eventGreen: MantineColorsTuple = [
    "#F4FBF6",
    "#EDF7F0",
    "#D9EADF",
    "#BAD9C6",
    "#93C5A5",
    "#6FAC84",
    "#4E9870",
    "#2F8F62",
    "#2F5F46",
    "#254B39",
];

const eventYellow: MantineColorsTuple = [
    "#FFFAEC",
    "#FBF3DF",
    "#F3E4BF",
    "#EAD292",
    "#DCB861",
    "#D19D3D",
    "#CB912F",
    "#A9772A",
    "#8A6228",
    "#76561F",
];

const eventRed: MantineColorsTuple = [
    "#FFF7F6",
    "#FAEEEE",
    "#F2D8D5",
    "#E7B9B4",
    "#D9958E",
    "#CB6F66",
    "#C4554D",
    "#A84A43",
    "#8D403B",
    "#7A3B37",
];

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        gray: workspaceGray,
        dark: workspaceGray,
        blue: actionBlue,
        cyan: actionBlue,
        teal: eventGreen,
        green: eventGreen,
        lime: eventGreen,
        yellow: eventYellow,
        orange: eventYellow,
        red: eventRed,
        primary: generateColors(urbanEventsColors.primaryBlue),
        secondary: generateColors(urbanEventsColors.inkSoft),
        blush: generateColors(urbanEventsColors.powderBlush),
        aqua: generateColors(urbanEventsColors.icyAqua),
        eggshell: generateColors(urbanEventsColors.eggshell),
        slate: generateColors(urbanEventsColors.blueSlate),
        coral: generateColors(urbanEventsColors.coral),
        marigold: generateColors(urbanEventsColors.marigold),
        mint: generateColors(urbanEventsColors.canvasSoft),
        sky: generateColors(urbanEventsColors.sky),
        indigoNight: generateColors(urbanEventsColors.deepIndigo),
        stickerSky: generateColors(urbanEventsColors.stickerSky),
        stickerPurple: generateColors(urbanEventsColors.stickerPurple),
        stickerPink: generateColors(urbanEventsColors.stickerPink),
        stickerOrange: generateColors(urbanEventsColors.stickerOrange),
        stickerTeal: generateColors(urbanEventsColors.stickerTeal),
        stickerGreen: generateColors(urbanEventsColors.stickerGreen),
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headings: {
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "8px",
        xl: "8px",
    },
    shadows: {
        xs: "0 1px 1px rgba(15, 15, 15, 0.03)",
        sm: "0 1px 2px rgba(15, 15, 15, 0.035), 0 8px 18px rgba(15, 15, 15, 0.035)",
        md: "0 2px 6px rgba(15, 15, 15, 0.04), 0 18px 42px rgba(15, 15, 15, 0.055)",
        lg: "0 4px 14px rgba(15, 15, 15, 0.05), 0 26px 64px rgba(15, 15, 15, 0.065)",
        xl: "0 8px 28px rgba(15, 15, 15, 0.06), 0 38px 90px rgba(15, 15, 15, 0.075)",
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
            },
            styles: {
                root: {
                    fontWeight: 600,
                    letterSpacing: 0,
                    minHeight: "2rem",
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
            },
            styles: {
                input: {
                    borderColor: "var(--hi-border-strong)",
                    color: "var(--hi-text)",
                    fontWeight: 480,
                    minHeight: "2rem",
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
                    backgroundOpacity: 0.34,
                    blur: 0,
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
        MultiSelect: {
            defaultProps: {
                radius: "sm",
            },
        },
        NativeSelect: {
            defaultProps: {
                radius: "sm",
            },
        },
        PasswordInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        PinInput: {
            defaultProps: {
                radius: "sm",
            },
        },
        Select: {
            defaultProps: {
                radius: "sm",
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
