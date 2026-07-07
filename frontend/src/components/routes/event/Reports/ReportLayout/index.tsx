import {Link, useParams} from "react-router";
import {PageBody} from "../../../../common/PageBody";
import {Button} from "@mantine/core";
import {IconChevronLeft} from "@tabler/icons-react";
import ProductSalesReport from "../ProductSalesReport";
import {ReportTypes} from "../../../../../types.ts";
import {DailySalesReport} from "../DailySalesReport";
import PromoCodesReport from "../PromoCodesReport";
import classes from "../Reports.module.scss";

const renderReport = (reportType: string) => {
    switch (reportType) {
        case ReportTypes.ProductSales:
            return <ProductSalesReport/>;
        case ReportTypes.DailySales:
            return <DailySalesReport/>;
        case ReportTypes.PromoCodes:
            return <PromoCodesReport/>;
        default:
            return <div>Report not found</div>;
    }
};

const ReportLayout = () => {
    const {eventId, reportType} = useParams();

    return (
        <PageBody>
            <Button mb={14}
                    leftSection={<IconChevronLeft size={16}/>}
                    variant="default"
                    className={classes.backButton}
                    component={Link}
                    to={`/manage/event/${eventId}/reports`}
            >
                Back to Reports
            </Button>
            <div>
                {renderReport(reportType as string)}
            </div>
        </PageBody>
    );
}

export default ReportLayout;
