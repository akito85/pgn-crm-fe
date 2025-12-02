# TODO: Create Content Management Routes and View

## Steps to Complete

1. **Create ContentManagementView.js** ✅

   - Create the file: `src/app/pages/RatingBillingInvoice/MasterData/ContentManagement/ContentManagementView.js`
   - Model it after `EFakturCodeView.js`: copy structure, replace EFakturCode references with ContentManagement, adjust breadcrumbs, titles, and localStorage key.

2. **Create TableContentManagement.js** ✅

   - Create the file: `src/app/pages/RatingBillingInvoice/MasterData/ContentManagement/Table/TableContentManagement.js`
   - Model it after `TableEFakturCode.js`: copy columns, adapt dataIndex and titles for content management (e.g., CODE, DESCRIPTION, STATUS, STATUS APPROVAL).

3. **Add Routes in rbi_routes.js** ✅

   - Add new routes: CONTENT_MANAGEMENT, CONTENT_MANAGEMENT_CREATE, CONTENT_MANAGEMENT_UPDATE, CONTENT_MANAGEMENT_DETAIL.
   - Use paths similar to EFAKTUR_CODE ones, e.g., "/system-setup/content-management".

4. **Update rbi_elements.js** ✅

   - Import ContentManagementView.
   - Add CONTENT_MANAGEMENT_VIEW_ELEMENT to RBI_ELEMENTS.

5. **Update src/routes/rating_billing/index.js** ✅

   - Add the new route entry for CONTENT_MANAGEMENT_VIEW using RBI_ROUTES.CONTENT_MANAGEMENT and RBI_ELEMENTS.CONTENT_MANAGEMENT_VIEW_ELEMENT.

6. **Test and Verify** ✅
   - Ensure the new route navigates correctly.
   - Verify the view renders with dummy data.
   - Check for any linting errors or missing dependencies.
