# TODO for Generate Invoice Page Enhancement

1. Create new page component `GenerateInvoicePage.js` in `src/app/pages/RatingBillingInvoice/Invoice/`

   - Implement form UI as per screenshots.
   - Slice Schedule Information section into subcomponents for each type: Immediate, Schedule, Recurring.
   - Use existing `SelectComponent` for billing select similar to modal.
   - Implement form state and validation as needed.

2. Modify `ViewInvoice.js`

   - Change "Generate Invoice" button to navigate to `/invoice/generate-invoice` route instead of opening modal.
   - Comment out ModalGenerateInvoice related code (modal state, modal component usage).

3. Add route for `GenerateInvoicePage` in main routes file if not already present.

   - Check `src/routes/routes.js` or relevant route config.
   - Add route path `/invoice/generate-invoice` mapped to `GenerateInvoicePage` component.

4. Test navigation and UI behavior.

   - Verify clicking "Generate Invoice" opens new page.
   - Verify Schedule Information section changes based on type selection.
   - Verify billing select works as expected.
   - Verify form submission or save behavior (if applicable).

5. Code cleanup and documentation.
   - Ensure clean, readable, maintainable code.
   - Add comments and documentation as needed.

# Notes

- Do not remove ModalGenerateInvoice code, only comment it out for future use.
- Follow existing code style and conventions.
