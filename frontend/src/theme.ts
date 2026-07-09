/* eslint-disable lingui/no-unlocalized-strings */
import {createTheme, type MantineColorsTuple} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

export const urbanEventsColors = {
    powderBlush: "#F7F7F5",
    eggshell: "#FFFFFF",
    icyAqua: "#F1F8FF",
    lightBlue: "#EAF4FF",
    blueSlate: "#6B7280",
    canvas: "#FFFFFF",
    canvasSoft: "#F7F7F5",
    surface: "#FFFFFF",
    surfaceWarm: "#FFFFFF",
    ink: "#111111",
    inkSoft: "#2F3437",
    muted: "#6B7280",
    faint: "#9CA3AF",
    border: "#E5E7EB",
    borderStrong: "#D1D5DB",
    primaryBlue: "#1A6BC4",
    primaryBlueHover: "#155AA8",
    deepIndigo: "#111111",
    navy: "#111111",
    navyDeep: "#000000",
    stickerSky: "#1A6BC4",
    stickerPurple: "#EDEDED",
    stickerPurpleDeep: "#2F3437",
    stickerPink: "#6B7280",
    stickerOrange: "#4B5563",
    stickerOrangeDeep: "#111111",
    stickerTeal: "#2563EB",
    stickerGreen: "#16A34A",
    teal: "#2563EB",
    tealDeep: "#1D4ED8",
    plum: "#2F3437",
    plumDeep: "#111111",
    forest: "#16A34A",
    forestDeep: "#166534",
    coral: "#D92D20",
    coralDeep: "#B42318",
    marigold: "#1A6BC4",
    mint: "#F7F7F5",
    sky: "#EAF4FF",
    success: "#16A34A",
} as const;

const workspaceGray: MantineColorsTuple = [
    "#FFFFFF",
    "#F7F7F5",
    "#F1F1EF",
    "#EDEDED",
    "#E5E7EB",
    "#D1D5DB",
    "#6B7280",
    "#2F3437",
    "#111111",
    "#000000",
];

const actionBlue: MantineColorsTuple = [
    "#F1F8FF",
    "#E7F3FF",
    "#D7EBFF",
    "#B9D9FF",
    "#8EC2FF",
    "#63A3F0",
    "#347FD6",
    "#1A6BC4",
    "#155AA8",
    "#124A8F",
];

const eventGreen: MantineColorsTuple = [
    "#F0FDF4",
    "#DCFCE7",
    "#BBF7D0",
    "#86EFAC",
    "#4ADE80",
    "#22C55E",
    "#16A34A",
    "#15803D",
    "#166534",
    "#14532D",
];

const eventYellow: MantineColorsTuple = [
    "#FFFBEB",
    "#FEF3C7",
    "#FDE68A",
    "#FCD34D",
    "#FBBF24",
    "#EAB308",
    "#A3A3A3",
    "#6B7280",
    "#2F3437",
    "#111111",
];

const eventRed: MantineColorsTuple = [
    "#FEF3F2",
    "#FEE4E2",
    "#FECDCA",
    "#FDA29B",
    "#F97066",
    "#F04438",
    "#D92D20",
    "#B42318",
    "#912018",
    "#7F1D1D",
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
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "8px",
        xl: "8px",
    },
    shadows: {
        xs: "none",
        sm: "none",
        md: "0 8px 24px rgba(15, 15, 15, 0.06)",
        lg: "0 16px 48px rgba(15, 15, 15, 0.08)",
        xl: "0 24px 80px rgba(15, 15, 15, 0.10)",
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
                    minHeight: "2.125rem",
                    paddingInline: "0.875rem",
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
