import {t} from "@lingui/macro";
import {IconAlertTriangle, IconLock} from "@tabler/icons-react";
import classes from './DangerZone.module.scss';

interface DangerZoneSectionProps {
    title: string;
    description: string;
    action: React.ReactNode;
}

export const DangerZoneSection = ({title, description, action}: DangerZoneSectionProps) => {
    return (
        <div className={classes.section}>
            <p className={classes.sectionTitle}>{title}</p>
            <p className={classes.sectionDescription}>{description}</p>
            {action}
        </div>
    );
};

interface DangerZoneProps {
    children: React.ReactNode;
}

export const DangerZone = ({children}: DangerZoneProps) => {
    return (
        <div className={classes.dangerZone}>
            <h3 className={classes.heading}>
                <IconAlertTriangle size={20}/>
                {t`Danger Zone`}
            </h3>
            {children}
        </div>
    );
};

interface DangerZoneNoticeProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export const DangerZoneNotice = ({title, description, icon}: DangerZoneNoticeProps) => {
    return (
        <div className={classes.notice}>
            <div className={classes.noticeIcon} aria-hidden="true">
                {icon || <IconLock size={18}/>}
            </div>
            <div>
                <p className={classes.noticeTitle}>{title}</p>
                <p className={classes.noticeDescription}>{description}</p>
            </div>
        </div>
    );
};
