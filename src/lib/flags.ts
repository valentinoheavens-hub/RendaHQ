// Feature flags — deliberate scope control.
//
// SHOW_LABS gates the wide-but-shallow pages (mock/local data, not yet
// production-deep). They stay routable by URL for development, but are hidden
// from navigation so real users only ever see flows that work end-to-end:
// dashboard, clients/portals, projects, proposals, contracts, invoices,
// payments, billing.
//
// Flip to true to bring the experimental pages back into the sidebar.
export const SHOW_LABS = false;
