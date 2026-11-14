import { pgTable, text, varchar, numeric, integer, boolean, date, timestamp, uuid, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- ENUMS & STATUSES ---
export const bookingTypeEnum = pgEnum('booking_type', ['FLIGHT', 'HOTEL', 'TOUR', 'OTHERS']);
export const invoiceStatusEnum = pgEnum('invoice_status', [
	'DRAFT',
	'SUBMITTED',
	'WAITING',
	'CONFIRMED',
	'PAID',
	'PARTIAL',
	'VOID',
	'UNSETTLED'
]);
export const paymentTypeEnum = pgEnum('payment_type', ['CASH', 'TRANSFER', 'CREDIT', 'TOP']);
export const allocationStatusEnum = pgEnum('allocation_status', ['UNALLOCATED', 'PARTIALLY_ALLOCATED', 'FULLY_ALLOCATED']);

// ==========================================
// 1. CUSTOMERS B2B MODULE (CRM)
// ==========================================

export const businessProfiles = pgTable('customers_b2b_business_profile', {
	id: uuid('id').defaultRandom().primaryKey(),
	customerNo: varchar('customer_no', { length: 50 }).notNull().unique(),
	customerGroup: varchar('customer_group', { length: 50 }).notNull(), // CORPORATE, TRAVEL_AGENT, GOVERNMENT
	customerType: varchar('customer_type', { length: 50 }).notNull(), // FIT, MOU, TOUR
	customerName: varchar('customer_name', { length: 255 }).notNull(),
	businessType: varchar('business_type', { length: 100 }),
	customerLogoUrl: text('customer_logo_url'),
	joinDate: date('join_date').notNull(),
	status: varchar('status', { length: 20 }).default('ACTIVE').notNull(),
	handlerBranch: varchar('handler_branch', { length: 100 }),
	salesId: varchar('sales_id', { length: 50 }),
	handlerId: varchar('handler_id', { length: 50 }),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const invoiceAndPayments = pgTable('customers_b2b_invoice_and_payment', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull()
		.unique(),
	currencyCode: varchar('currency_code', { length: 3 }).default('IDR').notNull(),
	creditLimit: numeric('credit_limit', { precision: 18, scale: 2 }).default('0').notNull(),
	usedLimit: numeric('used_limit', { precision: 18, scale: 2 }).default('0').notNull(),
	deposit: numeric('deposit', { precision: 18, scale: 2 }).default('0').notNull(),
	dueDate: integer('due_date').default(30).notNull(), // TOP term in days
	isEnableGST: boolean('is_enable_gst').default(false).notNull(),
	isEnableStampDuty: boolean('is_enable_stamp_duty').default(false).notNull(),
	isShowGST: boolean('is_show_gst').default(false).notNull(),
	isShowServiceFee: boolean('is_show_service_fee').default(true).notNull(),
	isShowDiscount: boolean('is_show_discount').default(true).notNull(),
	gmaxDom: numeric('gmax_dom', { precision: 18, scale: 2 }).default('0'),
	gmaxInt: numeric('gmax_int', { precision: 18, scale: 2 }).default('0'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const contactInfos = pgTable('customers_b2b_contact_info', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	address: text('address'),
	city: varchar('city', { length: 100 }),
	emailAddress: varchar('email_address', { length: 150 }),
	phoneNo: varchar('phone_no', { length: 50 }),
	website: varchar('website', { length: 255 }),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const personInCharges = pgTable('customers_b2b_person_in_charges', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	name: varchar('name', { length: 150 }).notNull(),
	positionDivision: varchar('position_division', { length: 100 }),
	emailAddress: varchar('email_address', { length: 150 }),
	phoneNo: varchar('phone_no', { length: 50 }),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const taxInfos = pgTable('customers_b2b_tax_info', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	idType: varchar('id_type', { length: 50 }).notNull(), // NPWP, NIK
	idNo: varchar('id_no', { length: 50 }).notNull(),
	taxPayerName: varchar('tax_payer_name', { length: 200 }).notNull(),
	taxAddress: text('tax_address'),
	taxOn: varchar('tax_on', { length: 50 }),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const refundAccounts = pgTable('customers_b2b_refund_account', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	bankName: varchar('bank_name', { length: 100 }).notNull(),
	accountNo: varchar('account_no', { length: 50 }).notNull(),
	accountHolderName: varchar('account_holder_name', { length: 150 }).notNull(),
	swiftCodeOrBranchCode: varchar('swift_code_or_branch_code', { length: 50 }),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const docsTemplates = pgTable('customers_b2b_docs_template', {
	id: uuid('id').defaultRandom().primaryKey(),
	docCategory: varchar('doc_category', { length: 100 }).notNull(),
	optString: text('opt_string'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const customerAgreementDocs = pgTable('customer_agreement_doc', {
	id: uuid('id').defaultRandom().primaryKey(),
	customerId: uuid('customer_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	templateId: uuid('template_id').references(() => docsTemplates.id),
	file: text('file').notNull(),
	documentNo: varchar('document_no', { length: 100 }).notNull(),
	validFrom: date('valid_from').notNull(),
	validTo: date('valid_to').notNull(),
	status: varchar('status', { length: 50 }).default('ACTIVE').notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const addendumDocs = pgTable('customers_b2b_addendum_docs', {
	id: uuid('id').defaultRandom().primaryKey(),
	mouDocsId: uuid('mou_docs_id')
		.references(() => customerAgreementDocs.id, { onDelete: 'cascade' })
		.notNull(),
	docsTemplateId: uuid('docs_template_id').references(() => docsTemplates.id),
	agreementFile: text('agreement_file').notNull(),
	agreementNo: varchar('agreement_no', { length: 100 }).notNull(),
	validFrom: date('valid_from').notNull(),
	validTo: date('valid_to').notNull(),
	status: varchar('status', { length: 50 }).default('ACTIVE').notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const businessProfileLogs = pgTable('customers_b2b_business_profile_logs', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	logMessage: text('log_message').notNull(),
	user: varchar('user', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const customerRules = pgTable('customers_b2b_customer_rules', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id, { onDelete: 'cascade' })
		.notNull(),
	product: varchar('product', { length: 100 }).notNull(),
	productDetail: varchar('product_detail', { length: 255 }),
	rfCancelFee: numeric('rf_cancel_fee', { precision: 18, scale: 2 }).default('0'),
	rfAdminFee: numeric('rf_admin_fee', { precision: 18, scale: 2 }).default('0'),
	discount: numeric('discount', { precision: 5, scale: 2 }).default('0'),
	discountAmount: numeric('discount_amount', { precision: 18, scale: 2 }).default('0'),
	serviceFee: numeric('service_fee', { precision: 18, scale: 2 }).default('0'),
	serviceFeeFormula: text('service_fee_formula'),
	ppn: numeric('ppn', { precision: 5, scale: 2 }).default('0'),
	ppnFormula: text('ppn_formula'),
	taxType: varchar('tax_type', { length: 50 }),
	cnDisc: numeric('cn_disc', { precision: 18, scale: 2 }).default('0'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

// ==========================================
// 2. INVOICE MODULE (CORE)
// ==========================================

export const invoices = pgTable('invoices', {
	id: uuid('id').defaultRandom().primaryKey(),
	businessProfileId: uuid('business_profile_id')
		.references(() => businessProfiles.id)
		.notNull(),
	invoiceNo: varchar('invoice_no', { length: 100 }).notNull().unique(),
	bookingType: varchar('booking_type', { length: 50 }).default('FLIGHT').notNull(),
	overdueDays: integer('overdue_days').default(0).notNull(),
	overdueDate: date('overdue_date'),
	currencyCode: varchar('currency_code', { length: 3 }).default('IDR').notNull(),
	netFare: numeric('net_fare', { precision: 18, scale: 2 }).default('0').notNull(),
	serviceFee: numeric('service_fee', { precision: 18, scale: 2 }).default('0').notNull(),
	keepComm: numeric('keep_comm', { precision: 18, scale: 2 }).default('0').notNull(),
	discount: numeric('discount', { precision: 18, scale: 2 }).default('0').notNull(),
	gst: numeric('gst', { precision: 18, scale: 2 }).default('0').notNull(),
	customGST: numeric('custom_gst', { precision: 18, scale: 2 }).default('0').notNull(),
	billingAmount: numeric('billing_amount', { precision: 18, scale: 2 }).default('0').notNull(), // Total Sell
	paymentType: varchar('payment_type', { length: 50 }).default('TOP').notNull(),
	invoiceStatus: varchar('invoice_status', { length: 50 }).default('DRAFT').notNull(),
	submittedByUserNo: varchar('submitted_by_user_no', { length: 100 }),
	submittedDate: timestamp('submitted_date', { withTimezone: true }),
	confirmedByUserNo: varchar('confirmed_by_user_no', { length: 100 }),
	confirmedDate: timestamp('confirmed_date', { withTimezone: true }),
	isArchived: boolean('is_archived').default(false).notNull(),
	archivedDate: timestamp('archived_date', { withTimezone: true }),
	officeHandler: varchar('office_handler', { length: 100 }),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const invoiceFlightRsvs = pgTable('invoice_flight_rsv', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceId: uuid('invoice_id')
		.references(() => invoices.id, { onDelete: 'cascade' })
		.notNull(),
	pnrCode: varchar('pnr_code', { length: 50 }).notNull(),
	bookingSource: varchar('booking_source', { length: 100 }),
	origPNRCode: varchar('orig_pnr_code', { length: 50 }),
	routeType: varchar('route_type', { length: 50 }),
	flightType: varchar('flight_type', { length: 50 }),
	flightClass: varchar('flight_class', { length: 50 }),
	adult: integer('adult').default(1).notNull(),
	child: integer('child').default(0).notNull(),
	infant: integer('infant').default(0).notNull(),
	issued: boolean('issued').default(false).notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const invoiceFlightRsvRoutes = pgTable('invoice_flight_rsv_route', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceFlightRsvId: uuid('invoice_flight_rsv_id')
		.references(() => invoiceFlightRsvs.id, { onDelete: 'cascade' })
		.notNull(),
	airlineCode: varchar('airline_code', { length: 20 }),
	airlineName: varchar('airline_name', { length: 100 }),
	airlineNo: varchar('airline_no', { length: 50 }),
	airlineLogo: text('airline_logo'),
	aircraft: varchar('aircraft', { length: 100 }),
	operatingAirlineCode: varchar('operating_airline_code', { length: 20 }),
	operatingAirlineName: varchar('operating_airline_name', { length: 100 }),
	operatingAirlineNo: varchar('operating_airline_no', { length: 50 }),
	operatingAirlineLogo: text('operating_airline_logo'),
	flightNo: varchar('flight_no', { length: 50 }),
	flightClass: varchar('flight_class', { length: 50 }),
	flightCategory: varchar('flight_category', { length: 50 }),
	flightSubClass: varchar('flight_sub_class', { length: 20 }),
	originCode: varchar('origin_code', { length: 20 }),
	originName: varchar('origin_name', { length: 100 }),
	originTerminal: varchar('origin_terminal', { length: 50 }),
	originCityCode: varchar('origin_city_code', { length: 20 }),
	originCityName: varchar('origin_city_name', { length: 100 }),
	destinationCode: varchar('destination_code', { length: 20 }),
	destinationName: varchar('destination_name', { length: 100 }),
	destinationTerminal: varchar('destination_terminal', { length: 50 }),
	destinationCityCode: varchar('destination_city_code', { length: 20 }),
	destinationCityName: varchar('destination_city_name', { length: 100 }),
	departDate: timestamp('depart_date', { withTimezone: true }),
	arrivalDate: timestamp('arrival_date', { withTimezone: true }),
	flightDuration: varchar('flight_duration', { length: 50 }),
	totalTransit: integer('total_transit').default(0),
	routeType: varchar('route_type', { length: 50 }),
	sequenceNo: integer('sequence_no').default(1),
	transitSequence: integer('transit_sequence').default(0),
	vendorProductCode: varchar('vendor_product_code', { length: 100 }),
	vendorProductDescription: text('vendor_product_description'),
	vendorProductRemarks: text('vendor_product_remarks'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const invoiceFlightRsvPaxes = pgTable('invoice_flight_rsv_pax', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceFlightRsvId: uuid('invoice_flight_rsv_id')
		.references(() => invoiceFlightRsvs.id, { onDelete: 'cascade' })
		.notNull(),
	prefix: varchar('prefix', { length: 20 }),
	firstName: varchar('first_name', { length: 100 }),
	middleName: varchar('middle_name', { length: 100 }),
	lastName: varchar('last_name', { length: 100 }),
	fullName: varchar('full_name', { length: 255 }).notNull(),
	placeOfBirth: varchar('place_of_birth', { length: 100 }),
	dateOfBirth: date('date_of_birth'),
	gender: varchar('gender', { length: 20 }),
	travelerType: varchar('traveler_type', { length: 20 }).default('ADULT'),
	emailAddress: varchar('email_address', { length: 150 }),
	phoneNo: varchar('phone_no', { length: 50 }),
	address: text('address'),
	city: varchar('city', { length: 100 }),
	postalCode: varchar('postal_code', { length: 20 }),
	country: varchar('country', { length: 100 }),
	identityNo: varchar('identity_no', { length: 50 }), // KTP / NIK
	passportNo: varchar('passport_no', { length: 50 }),
	passportExpiry: date('passport_expiry'),
	passportCountry: varchar('passport_country', { length: 100 }),
	passportSsr: varchar('passport_ssr', { length: 100 }),
	frequentFlyerNo: varchar('frequent_flyer_no', { length: 100 }),
	travelerKey: varchar('traveler_key', { length: 100 }),
	nationality: varchar('nationality', { length: 100 }),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const invoiceHotelReservations = pgTable('invoice_hotel_reservation', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceId: uuid('invoice_id')
		.references(() => invoices.id, { onDelete: 'cascade' })
		.notNull(),
	hotelName: varchar('hotel_name', { length: 255 }).notNull(),
	address: text('address'),
	roomType: varchar('room_type', { length: 100 }),
	checkInDate: date('check_in_date').notNull(),
	checkOutDate: date('check_out_date').notNull(),
	duration: integer('duration').default(1).notNull(),
	numberOfRooms: integer('number_of_rooms').default(1).notNull(),
	adult: integer('adult').default(1).notNull(),
	child: integer('child').default(0).notNull(),
	infant: integer('infant').default(0).notNull(),
	phoneNoHotel: varchar('phone_no_hotel', { length: 50 }),
	emailHotel: varchar('email_hotel', { length: 150 }),
	status: varchar('status', { length: 50 }).default('CONFIRMED').notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const invoiceHotelReservationPassengers = pgTable('invoice_hotel_reservation_passenger', {
	id: uuid('id').defaultRandom().primaryKey(),
	hotelReservationId: uuid('hotel_reservation_id')
		.references(() => invoiceHotelReservations.id, { onDelete: 'cascade' })
		.notNull(),
	fullName: varchar('full_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 150 }),
	phone: varchar('phone', { length: 50 }),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const invoiceActions = pgTable('invoice_action', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceId: uuid('invoice_id')
		.references(() => invoices.id, { onDelete: 'cascade' })
		.notNull(),
	comment: text('comment'),
	actionAck: varchar('action_ack', { length: 50 }).notNull(), // APPROVE, REJECT, VOID_REQUEST, VOID_APPROVE
	actionAckRemarks: text('action_ack_remarks'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

export const invoiceLogs = pgTable('invoice_log', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceId: uuid('invoice_id')
		.references(() => invoices.id, { onDelete: 'cascade' })
		.notNull(),
	invoiceActionId: uuid('invoice_action_id').references(() => invoiceActions.id),
	isInternalLog: boolean('is_internal_log').default(true).notNull(),
	logActivity: varchar('log_activity', { length: 255 }).notNull(),
	log: text('log').notNull(),
	createdByUserId: varchar('created_by_user_id', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedDate: timestamp('modified_date', { withTimezone: true }),
	modifiedBy: varchar('modified_by', { length: 100 })
});

// ==========================================
// 3. PAYMENT & ALLOCATION MODULE
// ==========================================

export const payments = pgTable('payments', {
	id: uuid('id').defaultRandom().primaryKey(),
	paymentNo: varchar('payment_no', { length: 100 }).notNull().unique(),
	receivedAt: timestamp('received_at', { withTimezone: true }).notNull(),
	receivedAccount: varchar('received_account', { length: 100 }).notNull(),
	amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
	allocatedAmount: numeric('allocated_amount', { precision: 18, scale: 2 }).default('0').notNull(),
	unallocatedAmount: numeric('unallocated_amount', { precision: 18, scale: 2 }).default('0').notNull(),
	allocationStatus: varchar('allocation_status', { length: 50 }).default('UNALLOCATED').notNull(),
	totalInvoice: integer('total_invoice').default(0).notNull(),
	currencyCode: varchar('currency_code', { length: 3 }).default('IDR').notNull(),
	fullyPaidInvoice: integer('fully_paid_invoice').default(0).notNull(),
	partiallyPaidInvoice: integer('partially_paid_invoice').default(0).notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const receiptAllocations = pgTable(
	'payment_receipt_allocations',
	{
		paymentId: uuid('payment_id')
			.references(() => payments.id, { onDelete: 'cascade' })
			.notNull(),
		invoiceId: uuid('invoice_id')
			.references(() => invoices.id, { onDelete: 'cascade' })
			.notNull(),
		allocatedAmount: numeric('allocated_amount', { precision: 18, scale: 2 }).notNull()
	},
	(t) => [primaryKey({ columns: [t.paymentId, t.invoiceId] })]
);

export const invoicePayments = pgTable('invoice_payments', {
	id: uuid('id').defaultRandom().primaryKey(),
	invoiceId: uuid('invoice_id')
		.references(() => invoices.id, { onDelete: 'cascade' })
		.notNull(),
	paymentId: uuid('payment_id').references(() => payments.id),
	remaining: numeric('remaining', { precision: 18, scale: 2 }).default('0').notNull(),
	paymentType: varchar('payment_type', { length: 50 }).notNull(),
	paymentDate: date('payment_date').notNull(),
	closingDate: date('closing_date'),
	paymentNo: varchar('payment_no', { length: 100 }).notNull(),
	paidAmount: numeric('paid_amount', { precision: 18, scale: 2 }).notNull(),
	penalty: numeric('penalty', { precision: 18, scale: 2 }).default('0').notNull(),
	attachedBy: varchar('attached_by', { length: 100 }),
	status: varchar('status', { length: 50 }).notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

// ==========================================
// 4. CORE FILES & RECONCILIATION STAGING
// ==========================================

export const coreFiles = pgTable('core_files', {
	id: uuid('id').defaultRandom().primaryKey(),
	generalId: uuid('general_id'),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	filePath: text('file_path'),
	mimeType: varchar('mime_type', { length: 100 }),
	fileSize: integer('file_size'),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const interfaceFiles = pgTable('interface_file', {
	id: uuid('id').defaultRandom().primaryKey(),
	fileNo: varchar('file_no', { length: 100 }).notNull(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	optString: text('opt_string'),
	processStatus: varchar('process_status', { length: 50 }).default('PENDING').notNull(),
	startProcessingAt: timestamp('start_processing_at', { withTimezone: true }),
	finishProcessingAt: timestamp('finish_processing_at', { withTimezone: true }),
	totalLine: integer('total_line').default(0).notNull(),
	processedLine: integer('processed_line').default(0).notNull(),
	errorLine: integer('error_line').default(0).notNull(),
	succeedLine: integer('succeed_line').default(0).notNull(),
	status: varchar('status', { length: 50 }).default('NEW').notNull(),
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const tmpVendorBillings = pgTable('tmp_vendor_billing', {
	id: uuid('id').defaultRandom().primaryKey(),
	interfaceFileId: uuid('interface_file_id')
		.references(() => interfaceFiles.id, { onDelete: 'cascade' })
		.notNull(),
	invoiceId: uuid('invoice_id').references(() => invoices.id),
	pnrCode: varchar('pnr_code', { length: 50 }),
	amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
	invoiceNo: varchar('invoice_no', { length: 100 }),
	message: text('message'),
	status: varchar('status', { length: 50 }).default('PENDING').notNull(), // MATCHED, ERROR
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

export const tmpBankStatements = pgTable('tmp_bank_statement', {
	id: uuid('id').defaultRandom().primaryKey(),
	interfaceFileId: uuid('interface_file_id')
		.references(() => interfaceFiles.id, { onDelete: 'cascade' })
		.notNull(),
	paymentId: uuid('payment_id').references(() => payments.id),
	rcvAmount: numeric('rcv_amount', { precision: 18, scale: 2 }),
	amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
	invoiceNo: varchar('invoice_no', { length: 100 }),
	message: text('message'),
	status: varchar('status', { length: 50 }).default('PENDING').notNull(), // MATCHED, ERROR, PARTIAL
	createdBy: varchar('created_by', { length: 100 }).notNull(),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull(),
	modifiedBy: varchar('modified_by', { length: 100 }),
	modifiedDate: timestamp('modified_date', { withTimezone: true })
});

// ==========================================
// 6. USERS, ROLES & AUDIT LOGS (RBAC)
// ==========================================

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	userNo: varchar('user_no', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 150 }).notNull(),
	email: varchar('email', { length: 150 }).notNull().unique(),
	role: varchar('role', { length: 50 }).notNull(), // TICKETING, SUPERVISOR, ACCOUNTING_AR, ACCOUNTING_AP, ACCOUNTING_TAX, ADMIN
	branch: varchar('branch', { length: 100 }).default('JKT-HQ').notNull(),
	status: varchar('status', { length: 20 }).default('ACTIVE').notNull(),
	avatarUrl: text('avatar_url'),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull()
});

export const auditLogs = pgTable('audit_logs', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	userNo: varchar('user_no', { length: 50 }).notNull(),
	action: varchar('action', { length: 100 }).notNull(), // CREATE_INVOICE, APPROVE_INVOICE, REJECT_INVOICE, ALLOCATE_PAYMENT, VOID_REQUEST
	entityType: varchar('entity_type', { length: 50 }).notNull(), // INVOICE, PAYMENT, CUSTOMER, VENDOR_BILLING
	entityId: varchar('entity_id', { length: 100 }).notNull(),
	details: text('details'),
	ipAddress: varchar('ip_address', { length: 50 }),
	createdDate: timestamp('created_date', { withTimezone: true }).defaultNow().notNull()
});


export const businessProfileRelations = relations(businessProfiles, ({ one, many }) => ({
	invoiceAndPayment: one(invoiceAndPayments, {
		fields: [businessProfiles.id],
		references: [invoiceAndPayments.businessProfileId]
	}),
	contactInfos: many(contactInfos),
	personInCharges: many(personInCharges),
	taxInfos: many(taxInfos),
	refundAccounts: many(refundAccounts),
	agreementDocs: many(customerAgreementDocs),
	rules: many(customerRules),
	logs: many(businessProfileLogs),
	invoices: many(invoices)
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
	businessProfile: one(businessProfiles, {
		fields: [invoices.businessProfileId],
		references: [businessProfiles.id]
	}),
	flightReservations: many(invoiceFlightRsvs),
	hotelReservations: many(invoiceHotelReservations),
	actions: many(invoiceActions),
	logs: many(invoiceLogs),
	allocations: many(receiptAllocations),
	payments: many(invoicePayments)
}));

export const invoiceFlightRsvRelations = relations(invoiceFlightRsvs, ({ one, many }) => ({
	invoice: one(invoices, {
		fields: [invoiceFlightRsvs.invoiceId],
		references: [invoices.id]
	}),
	routes: many(invoiceFlightRsvRoutes),
	passengers: many(invoiceFlightRsvPaxes)
}));

export const paymentRelations = relations(payments, ({ many }) => ({
	allocations: many(receiptAllocations),
	invoicePayments: many(invoicePayments)
}));

export const receiptAllocationsRelations = relations(receiptAllocations, ({ one }) => ({
	payment: one(payments, {
		fields: [receiptAllocations.paymentId],
		references: [payments.id]
	}),
	invoice: one(invoices, {
		fields: [receiptAllocations.invoiceId],
		references: [invoices.id]
	})
}));
