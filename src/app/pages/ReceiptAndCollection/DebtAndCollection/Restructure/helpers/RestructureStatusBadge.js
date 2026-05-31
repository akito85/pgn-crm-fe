import React from 'react';
import StatusComponent from "../../../../../../components/StatusComponent";
import { getRestructureStatusColour } from './restructureStatusColour';

/**
 * Drop-in replacement for StatusComponent in the restructure module.
 * - Hex colors → inline style (StatusComponent can't handle arbitrary hex via its switch)
 * - Non-hex (named values) → delegates to StatusComponent as usual
 */
const RestructureStatusBadge = ({ status, size }) => {
    const colour = getRestructureStatusColour(status);

    if (colour && colour.startsWith('#')) {
        return (
            <div
                style={{ backgroundColor: colour, color: '#fff' }}
                className={`flex justify-center items-center rounded-3xl text-center w-fit ${size === 'small' ? 'px-2 py-0 text-xs' : 'px-3 py-0'}`}
            >
                {(status || '').replace(/_/g, ' ')}
            </div>
        );
    }

    return (
        <StatusComponent colour={colour} size={size}>
            {status || ''}
        </StatusComponent>
    );
};

export default RestructureStatusBadge;
