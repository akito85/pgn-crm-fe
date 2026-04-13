export const WARRANTY_TYPES = {
    CASH: 'CASH',
    BANK_GUARANTY: 'BANK_GUARANTY',
};

export const MUTATION_TYPES = [
    { name: 'IN', value: 'IN' },
    { name: 'OUT', value: 'OUT' },
];

export const MUTATION_SOURCES = [
    { name: 'Manual', value: 'Manual' },
    { name: 'Automated', value: 'Automated' },
];

export const WARRANTY_STATUS = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
};

export const WARRANTY_APPROVAL_STATUS = {
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    WAITING_APPROVAL: 'Waiting Approval',
    DRAFT: 'Draft',
};

export const CLAIM_PERIOD_TERM_TYPES = {
    DATE: 'DATE',
    AFTER: 'AFTER',
};

export const CLAIM_PERIOD_TERM_OPTIONS = [
    { name: 'Date', value: CLAIM_PERIOD_TERM_TYPES.DATE },
    { name: 'After', value: CLAIM_PERIOD_TERM_TYPES.AFTER },
];

