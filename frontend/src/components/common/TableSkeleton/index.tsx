import {Skeleton} from "@mantine/core";
import classes from "./TableSkeleton.module.scss";

interface TableSkeletonProps {
    isVisible: boolean,
    numRows?: number,  // numRows is optional
}

export const TableSkeleton = ({isVisible, numRows = 15}: TableSkeletonProps) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className={classes.skeletonTable} aria-hidden="true">
            <Skeleton className={classes.skeletonHeader}/>

            {[...Array(numRows)].map((_, index: number) => (
                <Skeleton key={index} className={classes.skeletonRow}/>
            ))}
        </div>
    )
}
