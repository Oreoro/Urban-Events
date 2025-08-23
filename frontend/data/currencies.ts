export const currencies = {
    "Pakistani Rupee": "PKR"
};

export const currenciesMap = Object.entries(currencies).map(([k, v]) => ({
    value: v,
    label: k,
}));