# WahanaTravel CRM & Back Office System

A complete, production-oriented WahanaTravel CRM and Back Office Management System reverse-engineered from authoritative business diagrams:
- **DB Diagram** (24 core business entities)
- **Flowchart - Ex System** (TOP, MYOB, Tax, external invoicing)
- **FlowChart AI** (New Invoice, Approval, VOID, Archive, Overdue, Tracking, Reconciliation, Payments, Reports)
- **Sequence Diagram & Use Case Diagram**

---

## Tech Stack
- **Framework**: SvelteKit (Svelte 5 with Runes)
- **Runtime & Package Manager**: Bun
- **Database**: PostgreSQL (Neon Singapore `sin1`)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS (Dark Enterprise Palette with `#EF233C` Red Brand Accent)
- **Icons**: Lucide Svelte
- **Validation**: Zod
- **Deployment**: Vercel (`sin1`)

---

## Database Architecture
Reverse-engineered all 24 entities:
1. `invoices`
2. `invoice_flight_rsv`
3. `invoice_flight_rsv_route`
4. `invoice_flight_rsv_pax`
5. `invoice_hotel_reservation`
6. `invoice_hotel_reservation_passenger`
7. `invoice_action`
8. `invoice_log`
9. `invoice_payments`
10. `payments`
11. `payment_receipt_allocations`
12. `customers_b2b_business_profile`
13. `customers_b2b_invoice_and_payment`
14. `customers_b2b_contact_info`
15. `customers_b2b_person_in_charges`
16. `customers_b2b_tax_info`
17. `customers_b2b_refund_account`
18. `customer_agreement_doc`
19. `customers_b2b_addendum_docs`
20. `customers_b2b_docs_template`
21. `customers_b2b_business_profile_logs`
22. `customers_b2b_customer_rules`
23. `core_files`
24. `interface_file`
25. `tmp_vendor_billing`
26. `tmp_bank_statement`

---

## Getting Started
```bash
bun install
bun run dev
```

### Database Push
```bash
bun run db:push
```
