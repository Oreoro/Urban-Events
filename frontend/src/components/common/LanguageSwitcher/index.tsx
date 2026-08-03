import {Select} from "@mantine/core";
import {dynamicActivateLocale, getClientLocale, getLocaleName, localeToNameMap, SupportedLocales} from "../../../locales.ts";
import {t} from "@lingui/macro";
import {IconWorld} from "@tabler/icons-react";
import {useLingui} from "@lingui/react";
import classes from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher = () => {
    useLingui();

    return (
        <>
            <Select
                leftSection={<IconWorld size={15} color="var(--hi-text-muted)"/>}
                w={132}
                size={'sm'}
                classNames={{input: classes.input}}
                required
                aria-label={t`Language`}
                data={Object.keys(localeToNameMap).map(locale => ({
                    value: locale,
                    label: getLocaleName(locale as SupportedLocales),
                }))}
                defaultValue={getClientLocale()}
                placeholder={t`English`}
                onChange={(value) => {
                    if (!value) return;
                    document.cookie = `locale=${value};path=/;max-age=31536000`;
                    dynamicActivateLocale(value).finally(() => {
                        window.location.href = window.location.pathname + window.location.search;
                    });
                }}
            />
        </>
    )
}
