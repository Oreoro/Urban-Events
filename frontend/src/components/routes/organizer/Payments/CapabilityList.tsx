import {Badge, Group, Stack, Text} from "@mantine/core";
import {t} from "@lingui/macro";

interface CapabilityListProps {
    capabilities: Record<string, string>;
}

const humanize = (key: string): string =>
    key
        .replace(/_payments?$/i, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const statusBadge = (status: string) => {
    if (status === "active") {
        return <Badge color="green" variant="light">{t`Active`}</Badge>;
    }
    if (status === "pending") {
        return <Badge color="yellow" variant="light">{t`Pending`}</Badge>;
    }
    return <Badge color="gray" variant="light">{t`Inactive`}</Badge>;
};

export const CapabilityList = ({capabilities}: CapabilityListProps) => {
    const capabilityLabels: Record<string, string> = {
        card_payments: t`Card payments`,
        transfers: t`Transfers`,
        link_payments: t`Link`,
        klarna_payments: t`Klarna`,
        afterpay_clearpay_payments: t`Afterpay / Clearpay`,
        affirm_payments: t`Affirm`,
        bancontact_payments: t`Bancontact`,
        eps_payments: t`EPS`,
        ideal_payments: t`iDEAL`,
        sofort_payments: t`SOFORT`,
        sepa_debit_payments: t`SEPA Direct Debit`,
        p24_payments: t`Przelewy24`,
        blik_payments: t`BLIK`,
        mb_way_payments: t`MB Way`,
        revolut_pay_payments: t`Revolut Pay`,
        pix_payments: t`Pix`,
        boleto_payments: t`Boleto`,
        apple_pay: t`Apple Pay`,
        google_pay: t`Google Pay`,
        cashapp_payments: t`Cash App Pay`,
        amazon_pay_payments: t`Amazon Pay`,
        samsung_pay_payments: t`Samsung Pay`,
        payco_payments: t`Payco`,
        kakao_pay_payments: t`Kakao Pay`,
        naver_pay_payments: t`Naver Pay`,
        cartes_bancaires_payments: t`Cartes Bancaires`,
        grabpay_payments: t`GrabPay`,
        fpx_payments: t`FPX`,
        promptpay_payments: t`PromptPay`,
        konbini_payments: t`Konbini`,
        oxxo_payments: t`OXXO`,
        us_bank_account_ach_payments: t`ACH Direct Debit`,
        bacs_debit_payments: t`Bacs Direct Debit`,
        au_becs_debit_payments: t`BECS Direct Debit`,
        acss_debit_payments: t`Pre-authorized debit (Canada)`,
        multibanco_payments: t`Multibanco`,
    };
    const labelFor = (key: string): string => capabilityLabels[key] ?? humanize(key);
    const entries = Object.entries(capabilities ?? {}).sort(([a], [b]) => labelFor(a).localeCompare(labelFor(b)));

    if (entries.length === 0) {
        return <Text c="dimmed" size="sm">{t`No capabilities reported by Stripe yet.`}</Text>;
    }

    return (
        <Stack gap={6}>
            {entries.map(([key, status]) => (
                <Group key={key} justify="space-between" wrap="nowrap">
                    <Text size="sm">{labelFor(key)}</Text>
                    {statusBadge(status)}
                </Group>
            ))}
        </Stack>
    );
};
