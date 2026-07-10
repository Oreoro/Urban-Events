import classes from "./StatBoxes.module.scss";
import {IconCash, IconCreditCardRefund, IconEye, IconReceipt, IconShoppingCart, IconUsers} from "@tabler/icons-react";
import {Card} from "../Card";
import {t} from "@lingui/macro";
import {formatCurrency} from "../../../utilites/currency.ts";
import {formatNumber} from "../../../utilites/helpers.ts";
import {CSSProperties, ReactNode} from "react";
import type {Event, EventStats} from "../../../types.ts";

interface StatBoxProps {
    number: string | number;
    description: string;
    icon: ReactNode;
    backgroundColor: string;
}

export const StatBox = ({number, description, icon, backgroundColor}: StatBoxProps) => {
    return (
        <Card className={classes.statistic} style={{'--stat-color': backgroundColor} as CSSProperties}>
            <div className={classes.leftPanel}>
                <div className={classes.description}>
                    <span className={classes.labelIcon}>
                        {icon}
                    </span>
                    <span>{description}</span>
                </div>
                <div className={classes.number}>{number}</div>
            </div>
        </Card>
    );
};

interface StatBoxesProps {
    event?: Event;
    eventStats?: EventStats;
}

const toFiniteNumber = (value: number | undefined | null): number => {
    return Number.isFinite(value) ? Number(value) : 0;
};

export const StatBoxes = ({event, eventStats}: StatBoxesProps = {}) => {
    const data = [
        {
            number: formatNumber(toFiniteNumber(eventStats?.total_attendees_registered)),
            description: t`Attendees`,
            icon: <IconUsers size={18}/>,
            backgroundColor: 'var(--ue-sticker-sky)'
        },
        {
            number: formatNumber(toFiniteNumber(eventStats?.total_products_sold)),
            description: t`Products sold`,
            icon: <IconShoppingCart size={18}/>,
            backgroundColor: 'var(--ue-sticker-purple)'
        },
        {
            number: formatCurrency(toFiniteNumber(eventStats?.total_refunded), event?.currency),
            description: t`Refunded`,
            icon: <IconCreditCardRefund size={18}/>,
            backgroundColor: 'var(--ue-sticker-orange)'
        },
        {
            number: formatCurrency(toFiniteNumber(eventStats?.total_gross_sales), event?.currency),
            description: t`Gross sales`,
            icon: <IconCash size={18}/>,
            backgroundColor: 'var(--ue-sticker-green)'
        },
        {
            number: formatNumber(toFiniteNumber(eventStats?.total_views)),
            description: t`Page views`,
            icon: <IconEye size={18}/>,
            backgroundColor: 'var(--notion-blue)'
        },
        {
            number: formatNumber(toFiniteNumber(eventStats?.total_orders)),
            description: t`Completed orders`,
            icon: <IconReceipt size={18}/>,
            backgroundColor: 'var(--ue-sticker-teal)'
        }
    ];

    return (
        <div className={classes.statistics}>
            {data.map((stat) => (
                <StatBox
                    key={stat.description}
                    number={stat.number}
                    description={stat.description}
                    icon={stat.icon}
                    backgroundColor={stat.backgroundColor}
                />
            ))}
        </div>
    );
};
