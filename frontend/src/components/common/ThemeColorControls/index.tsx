import {
    ActionIcon,
    ColorInput,
    ColorSwatch,
    Group,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Text,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import {t} from "@lingui/macro";
import {HomepageThemeSettings} from "../../../types.ts";
import {
    checkContrast,
    computeThemeVariables,
    detectMode,
    getDefaultThemeSettings,
    hasContrastIssues,
    validateThemeSettings,
} from "../../../utilites/themeUtils.ts";
import {urbanEventsColors} from "../../../theme.ts";
import {
    IconCheck,
    IconEyeCheck,
    IconEyeExclamation,
    IconMoon,
    IconRefresh,
    IconSun,
} from "@tabler/icons-react";
import {useMemo} from "react";
import type {CSSProperties} from "react";
import classes from "./ThemeColorControls.module.scss";

interface ThemeColorControlsProps {
    values: Partial<HomepageThemeSettings>;
    onChange: (values: Partial<HomepageThemeSettings>) => void;
    disabled?: boolean;
}

type ThemePreset = Pick<HomepageThemeSettings, 'accent' | 'background' | 'mode'> & {
    label: string;
    description: string;
};

export const ThemeColorControls = ({
    values,
    onChange,
    disabled = false,
}: ThemeColorControlsProps) => {
    const defaults = useMemo(() => getDefaultThemeSettings(), []);
    const currentTheme = useMemo(() => validateThemeSettings(values), [
        values.accent,
        values.background,
        values.background_type,
        values.font_family,
        values.mode,
    ]);

    const themeVariables = useMemo(() => computeThemeVariables(currentTheme), [currentTheme]);
    const hasIssues = useMemo(() => hasContrastIssues(currentTheme), [currentTheme]);
    const buttonContrast = useMemo(
        () => checkContrast(themeVariables['--theme-accent-contrast'], currentTheme.accent),
        [currentTheme.accent, themeVariables],
    );
    const accentContrast = useMemo(
        () => checkContrast(currentTheme.accent, themeVariables['--theme-surface']),
        [currentTheme.accent, themeVariables],
    );

    const presets: ThemePreset[] = [
        {
            label: t`Workspace`,
            description: t`Ink actions on a clean white workspace`,
            accent: urbanEventsColors.ink,
            background: urbanEventsColors.canvas,
            mode: 'light',
        },
        {
            label: t`Graphite`,
            description: t`Executive graphite with quiet panels`,
            accent: urbanEventsColors.ink,
            background: urbanEventsColors.canvasSoft,
            mode: 'light',
        },
        {
            label: t`Notebook`,
            description: t`Dark ink with a soft paper surface`,
            accent: urbanEventsColors.inkSoft,
            background: urbanEventsColors.eggshell,
            mode: 'light',
        },
        {
            label: t`Slate`,
            description: t`Muted slate accent with white canvas`,
            accent: urbanEventsColors.inkSoft,
            background: urbanEventsColors.surface,
            mode: 'light',
        },
        {
            label: t`Ledger`,
            description: t`Warm neutral canvas with ink controls`,
            accent: urbanEventsColors.ink,
            background: urbanEventsColors.surfaceWarm,
            mode: 'light',
        },
    ];

    const emitChange = (next: Partial<HomepageThemeSettings>) => {
        onChange({
            ...values,
            ...next,
        });
    };

    const handleAccentChange = (accent: string) => {
        emitChange({accent});
    };

    const handleBackgroundChange = (background: string) => {
        const newMode = detectMode(background);
        emitChange({background, mode: newMode});
    };

    const handleModeChange = (mode: string) => {
        emitChange({mode: mode as 'light' | 'dark'});
    };

    const handlePresetChange = (preset: ThemePreset) => {
        emitChange({
            accent: preset.accent,
            background: preset.background,
            mode: preset.mode,
        });
    };

    const handleReset = () => {
        emitChange({
            accent: defaults.accent,
            background: defaults.background,
            mode: defaults.mode,
        });
    };

    const previewStyle = {
        ...themeVariables,
        backgroundColor: currentTheme.background,
        color: themeVariables['--theme-text-primary'],
        fontFamily: themeVariables['--theme-font-family'],
    } as CSSProperties;

    return (
        <Stack gap="md" className={classes.root}>
            <div className={classes.section}>
                <Group justify="space-between" align="center" mb="xs" wrap="nowrap">
                    <div>
                        <Text size="sm" fw={700}>{t`Palette`}</Text>
                        <Text size="xs" c="dimmed">{t`Professional SaaS presets`}</Text>
                    </div>
                    <Tooltip label={t`Reset palette`}>
                        <ActionIcon
                            aria-label={t`Reset palette`}
                            variant="subtle"
                            color="gray"
                            size="sm"
                            onClick={handleReset}
                            disabled={disabled}
                        >
                            <IconRefresh size={16}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <SimpleGrid cols={2} spacing="xs">
                    {presets.map((preset) => {
                        const isSelected = currentTheme.accent.toLowerCase() === preset.accent.toLowerCase()
                            && currentTheme.background.toLowerCase() === preset.background.toLowerCase()
                            && currentTheme.mode === preset.mode;

                        return (
                            <Tooltip key={preset.label} label={preset.description}>
                                <UnstyledButton
                                    type="button"
                                    className={classes.presetButton}
                                    data-active={isSelected || undefined}
                                    disabled={disabled}
                                    onClick={() => handlePresetChange(preset)}
                                >
                                    <div className={classes.presetSwatches} aria-hidden="true">
                                        <ColorSwatch
                                            color={preset.background}
                                            size={32}
                                            withShadow={false}
                                            className={classes.backgroundSwatch}
                                        />
                                        <ColorSwatch
                                            color={preset.accent}
                                            size={22}
                                            withShadow={false}
                                            className={classes.accentSwatch}
                                        />
                                    </div>
                                    <Text size="xs" fw={700} truncate className={classes.presetLabel}>
                                        {preset.label}
                                    </Text>
                                    {isSelected && (
                                        <span className={classes.selectedIcon} aria-hidden="true">
                                            <IconCheck size={12}/>
                                        </span>
                                    )}
                                </UnstyledButton>
                            </Tooltip>
                        );
                    })}
                </SimpleGrid>
            </div>

            <div className={classes.section}>
                <Text size="sm" fw={700} mb="xs">{t`Custom Colors`}</Text>
                <Stack gap="sm">
                    <ColorInput
                        format="hexa"
                        label={t`Accent`}
                        size="sm"
                        value={currentTheme.accent}
                        onChange={handleAccentChange}
                        disabled={disabled}
                    />

                    <ColorInput
                        format="hexa"
                        label={t`Background`}
                        size="sm"
                        value={currentTheme.background}
                        onChange={handleBackgroundChange}
                        disabled={disabled}
                    />
                </Stack>
            </div>

            <div className={classes.section}>
                <Text size="sm" fw={700} mb="xs">{t`Mode`}</Text>
                <SegmentedControl
                    fullWidth
                    value={currentTheme.mode}
                    onChange={handleModeChange}
                    disabled={disabled}
                    data={[
                        {
                            label: (
                                <Group gap={6} justify="center">
                                    <IconSun size={16}/>
                                    <span>{t`Light`}</span>
                                </Group>
                            ),
                            value: 'light',
                        },
                        {
                            label: (
                                <Group gap={6} justify="center">
                                    <IconMoon size={16}/>
                                    <span>{t`Dark`}</span>
                                </Group>
                            ),
                            value: 'dark',
                        },
                    ]}
                />
            </div>

            <div className={classes.previewShell} style={previewStyle}>
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                        <span
                            className={classes.previewMark}
                            style={{backgroundColor: currentTheme.accent}}
                            aria-hidden="true"
                        />
                        <div>
                            <Text size="sm" fw={800} className={classes.previewTitle}>
                                {t`Urban Events`}
                            </Text>
                            <Text size="xs" className={classes.previewMuted}>
                                {currentTheme.mode === 'dark' ? t`Dark theme` : t`Light theme`}
                            </Text>
                        </div>
                    </Group>
                    <span
                        className={classes.previewBadge}
                        style={{
                            backgroundColor: themeVariables['--theme-accent-soft'],
                            color: currentTheme.accent,
                        }}
                    >
                        {t`Live`}
                    </span>
                </Group>

                <div
                    className={classes.previewCard}
                    style={{
                        backgroundColor: themeVariables['--theme-surface'],
                        borderColor: themeVariables['--theme-border'],
                    }}
                >
                    <Text size="xs" fw={800} className={classes.previewMuted}>
                        {t`Event card`}
                    </Text>
                    <Text size="sm" fw={800} className={classes.previewTitle}>
                        {t`Focus Lab`}
                    </Text>
                    <Text size="xs" className={classes.previewMuted}>
                        {t`12 Aug - Lahore`}
                    </Text>
                    <Group justify="space-between" mt="sm" wrap="nowrap">
                        <span
                            className={classes.previewPill}
                            style={{
                                backgroundColor: themeVariables['--theme-accent-soft'],
                                color: currentTheme.accent,
                            }}
                        >
                            {t`Featured`}
                        </span>
                        <span
                            className={classes.previewButton}
                            style={{
                                backgroundColor: currentTheme.accent,
                                color: themeVariables['--theme-accent-contrast'],
                            }}
                        >
                            {t`Get Tickets`}
                        </span>
                    </Group>
                </div>
            </div>

            <Group gap={8} className={classes.readability} wrap="nowrap">
                {hasIssues ? (
                    <Tooltip label={t`Use a stronger accent or calmer background for better readability`} multiline w={230}>
                        <Group gap={6} style={{cursor: 'help'}} wrap="nowrap">
                            <IconEyeExclamation size={22} color="var(--hi-status-warning-text)" />
                            <Text size="xs" c="var(--hi-status-warning-text)">{t`Needs contrast review`}</Text>
                        </Group>
                    </Tooltip>
                ) : (
                    <Group gap={6} wrap="nowrap">
                        <IconEyeCheck size={22} color="var(--hi-status-success-text)" />
                        <Text size="xs" c="dimmed">{t`Readable colors`}</Text>
                    </Group>
                )}
                <Text size="xs" c="dimmed" ml="auto" className={classes.ratioText}>
                    {t`Button`} {buttonContrast.ratio}:1 / {t`Accent`} {accentContrast.ratio}:1
                </Text>
            </Group>
        </Stack>
    );
};

export default ThemeColorControls;
