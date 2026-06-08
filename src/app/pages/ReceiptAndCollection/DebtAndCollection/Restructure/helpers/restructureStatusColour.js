/**
 * Maps payment plan / restructure status values to explicit hex colors
 * so StatusComponent.js (global) does not need to be modified.
 *
 * Tokens (Figma):
 *  Draft          → #5A5A5A
 *  Closed         → Semantic/Background/dark/bg-disabled  → #757575
 *  Terminated     → Neutral/Info/dark/600                 → #1E4ED8
 *  Early Pay Off  → Semantic/Background/light/bg-info-solid → #2563EB
 */
export const getRestructureStatusColour = (status) => {
    if (!status) return 'none';
    switch (status.toLowerCase()) {
        case 'draft':         return '#5A5A5A';
        case 'submitted':     return '#28C76F';
        case 'active':        return '#388E3C';
        case 'closed':        return '#757575';
        case 'canceled':
        case 'cancelled':     return '#F57C00';
        case 'broken':        return '#D32F2F';
        case 'terminated':    return '#1E4ED8';
        case 'early pay off': return '#2563EB';
        default:              return status;
    }
};
