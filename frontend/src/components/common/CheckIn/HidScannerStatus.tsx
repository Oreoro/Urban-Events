import {Button} from "@mantine/core";
import {IconScan, IconX} from "@tabler/icons-react";
import {t} from "@lingui/macro";
import {showSuccess} from "../../../utilites/notifications.tsx";

interface HidScannerStatusProps {
    isActive: boolean;
    pageHasFocus: boolean;
    onDisable: () => void;
}

export const HidScannerStatus = ({
    isActive,
    pageHasFocus,
    onDisable
}: HidScannerStatusProps) => {
    if (!isActive) return null;

    const statusStyle = pageHasFocus
        ? {
            backgroundColor: 'var(--hi-app-panel-bg)',
            color: 'var(--hi-text)',
            borderBottom: '1px solid var(--hi-app-panel-border)',
        }
        : {
            backgroundColor: 'var(--hi-status-warning-bg)',
            color: 'var(--hi-status-warning-text)',
            borderBottom: '1px solid var(--hi-status-warning-border)',
        };

    return (
        <div style={{
            ...statusStyle,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
            marginTop: '-1px',
            boxShadow: 'var(--hi-shadow-sm)',
        }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <IconScan size={18}/>
                <span>
                    {pageHasFocus
                        ? 'USB Scanner Active - Ready to Scan'
                        : 'USB Scanner Paused - Click anywhere to resume scanning'}
                </span>
            </div>
            <Button
                size="xs"
                variant="light"
                leftSection={<IconX size={14}/>}
                miw={95}
                onClick={() => {
                    onDisable();
                    showSuccess(t`USB Scanner mode deactivated`);
                }}
            >
                Disable
            </Button>
        </div>
    );
};
