import React from "react";
// Import original AccountContact from CustomerAccountDetail (no copy needed)
import AccountContact from "../../../../AccountContact/AccountContact";

/**
 * Wrapper component for AccountContact in Service Request Step 2
 * Bridges the gap between wizard step and full AccountContact component
 *
 * Uses the original AccountContact component directly - no duplication
 *
 * @param {object} form - Parent form instance (for future persistence if needed)
 * @param {number} idAccount - Account ID
 * @param {number} idCustomer - Customer ID
 * @param {string} accountType - Account type ("standard" or "onetime")
 */
const ContactFormStep = ({ form, idAccount, idCustomer, accountType }) => {
  return (
    <AccountContact
      id={idAccount}
      idCustomer={idCustomer}
      type={accountType}
    />
  );
};

export default ContactFormStep;
