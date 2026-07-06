import {PageTitle} from "../../../common/PageTitle";
import {t} from "@lingui/macro";
import {PageBody} from "../../../common/PageBody";
import {IconChartBar, IconChevronRight, IconReportMoney} from "@tabler/icons-react";
import classes from './Reports.module.scss';
import {Card} from "../../../common/Card";
import {UnstyledButton} from "@mantine/core";
import {Link, useParams} from "react-router";
import {ReportTypes} from "../../../../types.ts";

const Reports = () => {
    const {eventId} = useParams();

    const reports = [
        {
            id: ReportTypes.ProductSales,
            title: t`Product Sales`,
            description: t`Product sales, revenue, and tax breakdown`,
            icon: <IconReportMoney size={18}/>
        },
        {
            id: ReportTypes.DailySales,
            title: t`Daily Sales Report`,
            description: t`Daily sales, tax, and fee breakdown`,
            icon: <IconChartBar size={18}/>
        },
        {
            id: ReportTypes.PromoCodes,
            title: t`Promo Codes Report`,
            description: t`Promo code usage and discount breakdown`,
            icon: <IconReportMoney size={18}/>
        }
    ];

    return (
        <PageBody>
            <PageTitle
                subheading={t`Download sales, attendee, and financial reports for all completed orders.`}>
                {t`Reports`}
            </PageTitle>

            {reports.map((report) => (
                <UnstyledButton component={Link} key={report.id} to={`/manage/event/${eventId}/report/${report.id}`}>
                    <Card className={classes.reportType}>
                        <div className={classes.icon}>
                            {report.icon}
                        </div>
                        <div className={classes.content}>
                            <h3>{report.title}</h3>
                            <p>{report.description}</p>
                        </div>
                        <div className={classes.rightCaret}>
                            <IconChevronRight/>
                        </div>
                    </Card>
                </UnstyledButton>
            ))}
        </PageBody>
    )
}

export default Reports;
