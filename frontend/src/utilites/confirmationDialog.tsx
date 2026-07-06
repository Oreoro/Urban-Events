import {modals} from "@mantine/modals";
import {t} from "@lingui/macro";

interface ConfirmationDialogOptions {
    confirm?: string;
    cancel?: string;
    useCheckoutColors?: boolean;
}

export const confirmationDialog = (
    message: string,
    onConfirm: () => void,
    options?: ConfirmationDialogOptions,
) => {
    const labels = {
        confirm: options?.confirm || t`Confirm`,
        cancel: options?.cancel || t`Cancel`,
    };

    const checkoutStyles = options?.useCheckoutColors ? {
        header: {
            backgroundColor: 'var(--checkout-surface, #FFFFFF)',
        },
        title: {
            color: 'var(--checkout-text-primary, #1a1a1a)',
        },
        content: {
            backgroundColor: 'var(--checkout-surface, #FFFFFF)',
        },
        body: {
            color: 'var(--checkout-text-primary, #1a1a1a)',
        },
    } : undefined;

    modals.openConfirmModal({
        title: t`Confirm action`,
        children: message,
        labels,
        centered: true,
        radius: "md",
        size: "sm",
        overlayProps: {
            blur: 3,
            opacity: 0.28,
        },
        cancelProps: {
            variant: "default",
        },
        confirmProps: {
            variant: "filled",
        },
        groupProps: {
            gap: "xs",
        },
        styles: checkoutStyles,
        onConfirm: () => onConfirm(),
    });
}
