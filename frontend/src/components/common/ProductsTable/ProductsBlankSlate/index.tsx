import {NoResultsSplash} from "../../NoResultsSplash";
import {Button} from "../../Button";
import {IconPlus, IconSearch, IconTicket} from "@tabler/icons-react";
import {t, Trans} from "@lingui/macro";

interface ProductsBlankSlateProps {
    openCreateModal: (categoryId?: string) => void;
    productCategories: any;
    searchTerm: string;
}

export const ProductsBlankSlate = ({openCreateModal, productCategories, searchTerm}: ProductsBlankSlateProps) => {
    const showLargeBlankSlate = productCategories
        .every((category: any) => category.products.length === 0) && productCategories.length === 1;

    if (searchTerm) {
        return (
            <NoResultsSplash
                icon={<IconSearch size={24} stroke={1.8}/>}
                heading={t`No Search Results`}
                subHeading={(
                    <>
                        <p>
                            <Trans>
                                We couldn't find any tickets matching {searchTerm ?
                                <strong>{searchTerm}</strong> : 'your search'}
                            </Trans>
                        </p>
                    </>
                )}
            />
        );
    }

    if (showLargeBlankSlate) {
        return (
            <NoResultsSplash
                icon={<IconTicket size={24} stroke={1.8}/>}
                heading={t`No Products Yet`}
                subHeading={(
                    <>
                        <p>
                            {t`You'll need at least one product to get started. Free, paid or let the user decide what to pay.`}
                        </p>
                        <Button
                            size={'sm'}
                            leftSection={<IconPlus size={16}/>}
                            onClick={() => openCreateModal()}
                        >
                            {t`Add Product to Category`}
                        </Button>
                    </>
                )}
            />
        );
    }

    return (
        <NoResultsSplash
            compact
            icon={<IconTicket size={22} stroke={1.8}/>}
            heading={t`No products in this category`}
            subHeading={(
                <>
                    <p>{t`This category doesn't have any products yet.`}</p>
                    <Button
                        size={'sm'}
                        leftSection={<IconPlus size={16}/>}
                        onClick={() => openCreateModal()}
                    >{t`Add Product`}
                    </Button>
                </>
            )}
        />
    )
}
