import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";

import {getConfig} from "./utilites/config.ts";

export const urbanEventsColors = {
    canvas: "#F7F7F2",
    canvasSoft: "#FFFAF0",
    plum: "#20342F",
    warmGrey: "#53615C",
    coral: "#C86D4C",
    marigold: "#D8A64B",
    mint: "#DBEADF",
    sky: "#DCEBF2",
} as const;

export const getUrbanEventsTheme = () => createTheme({
    colors: {
        primary: generateColors(getConfig("VITE_APP_PRIMARY_COLOR", urbanEventsColors.plum) as string),
        secondary: generateColors(getConfig("VITE_APP_SECONDARY_COLOR", urbanEventsColors.mint) as string),
    },
    primaryColor: "primary",
    primaryShade: 7,
    fontFamily: "'Plus Jakarta Sans', 'Figtree', Inter, ui-sans-serif, system-ui, sans-serif",
    headings: {
        fontFamily: "'Plus Jakarta Sans', 'Figtree', Inter, ui-sans-serif, system-ui, sans-serif",
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
        xs: "0 1px 2px rgba(32, 52, 47, 0.08)",
        sm: "0 4px 12px rgba(32, 52, 47, 0.10)",
        md: "0 12px 28px rgba(32, 52, 47, 0.12)",
        lg: "0 18px 44px rgba(32, 52, 47, 0.14)",
        xl: "0 26px 60px rgba(32, 52, 47, 0.18)",
    },
});
