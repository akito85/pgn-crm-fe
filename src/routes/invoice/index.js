import { INVOICE_ELEMENTS } from "./invoice_elements";
import { INVOICE_ROUTES } from "./invoice_routes";

export const invoice = [
    {
        path: INVOICE_ROUTES.GENERATE_INVOICE_VIEW,
        element: INVOICE_ELEMENTS.GENERATE_INVOICE_VIEW_PAGE
    },
    {
        path: INVOICE_ROUTES.EFAKTUR_VIEW,
        element: INVOICE_ELEMENTS.EFAKTUR_VIEW_PAGE
    },
    {
        path: INVOICE_ROUTES.EFAKTUR_VIEW_DETAIL,
        element: INVOICE_ELEMENTS.EFAKTUR_DETAIL_PAGE,
    },
]