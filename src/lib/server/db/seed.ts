import { db } from './index.js';
import * as schema from './schema.js';
import { sql } from 'drizzle-orm';

export async function seedDatabase() {
	console.log('--- Starting WahanaTravel Database Seeding ---');

	// 1. Seed Roles & Users
	const existingUsers = await db.select().from(schema.users);
	if (existingUsers.length === 0) {
		await db.insert(schema.users).values([
			{
				userNo: 'USR-TCK-001',
				name: 'Sarah Ticketing',
				email: 'sarah.ticketing@wahanatravel.com',
				role: 'TICKETING',
				branch: 'JKT-HQ',
				status: 'ACTIVE'
			},
			{
				userNo: 'USR-SPV-001',
				name: 'Budi Supervisor',
				email: 'budi.spv@wahanatravel.com',
				role: 'SUPERVISOR',
				branch: 'JKT-HQ',
				status: 'ACTIVE'
			},
			{
				userNo: 'USR-AR-001',
				name: 'Linda Accounting AR',
				email: 'linda.ar@wahanatravel.com',
				role: 'ACCOUNTING_AR',
				branch: 'JKT-HQ',
				status: 'ACTIVE'
			},
			{
				userNo: 'USR-AP-001',
				name: 'Rudi Accounting AP',
				email: 'rudi.ap@wahanatravel.com',
				role: 'ACCOUNTING_AP',
				branch: 'JKT-HQ',
				status: 'ACTIVE'
			},
			{
				userNo: 'USR-ADM-001',
				name: 'Admin Wahana',
				email: 'admin@wahanatravel.com',
				role: 'ADMIN',
				branch: 'JKT-HQ',
				status: 'ACTIVE'
			}
		]);
		console.log('Users created.');
	}

	// 2. Seed B2B Customers
	const existingCustomers = await db.select().from(schema.businessProfiles);
	let cust1Id = '';
	let cust2Id = '';

	if (existingCustomers.length === 0) {
		const [c1] = await db
			.insert(schema.businessProfiles)
			.values({
				customerNo: 'CUST-B2B-001',
				customerGroup: 'CORPORATE',
				customerType: 'MOU',
				customerName: 'PT Astra International Tbk',
				businessType: 'Automotive & Conglomerate',
				joinDate: '2023-01-15',
				status: 'ACTIVE',
				handlerBranch: 'JKT-HQ',
				salesId: 'SALES-01',
				handlerId: 'HD-01',
				createdBy: 'ADMIN'
			})
			.returning();

		const [c2] = await db
			.insert(schema.businessProfiles)
			.values({
				customerNo: 'CUST-B2B-002',
				customerGroup: 'CORPORATE',
				customerType: 'FIT',
				customerName: 'PT Bank Central Asia Tbk',
				businessType: 'Banking & Financial Services',
				joinDate: '2023-05-10',
				status: 'ACTIVE',
				handlerBranch: 'JKT-HQ',
				salesId: 'SALES-02',
				handlerId: 'HD-02',
				createdBy: 'ADMIN'
			})
			.returning();

		cust1Id = c1.id;
		cust2Id = c2.id;

		// Customer 1 financial setup
		await db.insert(schema.invoiceAndPayments).values({
			businessProfileId: cust1Id,
			currencyCode: 'IDR',
			creditLimit: '500000000.00',
			usedLimit: '85000000.00',
			deposit: '50000000.00',
			dueDate: 30,
			isEnableGST: true,
			isEnableStampDuty: false,
			isShowGST: true,
			isShowServiceFee: true,
			isShowDiscount: true,
			createdBy: 'ADMIN'
		});

		await db.insert(schema.contactInfos).values({
			businessProfileId: cust1Id,
			address: 'Menara Astra Lt. 15, Jl. Jend. Sudirman Kav 5-6',
			city: 'Jakarta Pusat',
			emailAddress: 'travel.corp@astra.co.id',
			phoneNo: '+62-21-5082-5555',
			website: 'https://www.astra.co.id',
			createdBy: 'ADMIN'
		});

		await db.insert(schema.personInCharges).values({
			businessProfileId: cust1Id,
			name: 'Bambang Sudirman',
			positionDivision: 'Procurement & General Affairs Manager',
			emailAddress: 'bambang.s@astra.co.id',
			phoneNo: '+62-811-987-654',
			createdBy: 'ADMIN'
		});

		await db.insert(schema.taxInfos).values({
			businessProfileId: cust1Id,
			idType: 'NPWP',
			idNo: '01.000.013.1-093.000',
			taxPayerName: 'PT Astra International Tbk',
			taxAddress: 'Jl. Gaya Motor Raya No. 8, Sunter II, Jakarta Utara',
			taxOn: 'INVOICE',
			createdBy: 'ADMIN'
		});

		await db.insert(schema.refundAccounts).values({
			businessProfileId: cust1Id,
			bankName: 'Bank Mandiri',
			accountNo: '123-00-9876543-2',
			accountHolderName: 'PT Astra International Tbk',
			swiftCodeOrBranchCode: 'BMRIIDJA',
			createdBy: 'ADMIN'
		});

		// Customer 2 financial setup
		await db.insert(schema.invoiceAndPayments).values({
			businessProfileId: cust2Id,
			currencyCode: 'IDR',
			creditLimit: '250000000.00',
			usedLimit: '32000000.00',
			deposit: '25000000.00',
			dueDate: 14,
			isEnableGST: true,
			isEnableStampDuty: false,
			isShowGST: true,
			isShowServiceFee: true,
			isShowDiscount: true,
			createdBy: 'ADMIN'
		});

		console.log('Customers and financial rules created.');
	} else {
		cust1Id = existingCustomers[0].id;
		cust2Id = existingCustomers.length > 1 ? existingCustomers[1].id : cust1Id;
	}

	// 3. Seed Invoices
	const existingInvoices = await db.select().from(schema.invoices);
	if (existingInvoices.length === 0) {
		const [inv1] = await db
			.insert(schema.invoices)
			.values({
				businessProfileId: cust1Id,
				invoiceNo: 'INV/2026/11/0001',
				bookingType: 'FLIGHT',
				currencyCode: 'IDR',
				netFare: '12500000.00',
				serviceFee: '150000.00',
				keepComm: '50000.00',
				discount: '0.00',
				gst: '1375000.00',
				customGST: '0.00',
				billingAmount: '14025000.00',
				paymentType: 'TOP',
				invoiceStatus: 'SUBMITTED',
				submittedByUserNo: 'USR-TCK-001',
				submittedDate: new Date('2026-11-10T10:00:00Z'),
				officeHandler: 'JKT-HQ',
				createdBy: 'USR-TCK-001'
			})
			.returning();

		const [rsv1] = await db
			.insert(schema.invoiceFlightRsvs)
			.values({
				invoiceId: inv1.id,
				pnrCode: 'WT-GA901',
				bookingSource: 'GDS',
				origPNRCode: 'GA-78X9',
				routeType: 'ONE_WAY',
				flightType: 'DOMESTIC',
				flightClass: 'BUSINESS',
				adult: 2,
				child: 0,
				infant: 0,
				issued: true,
				createdBy: 'USR-TCK-001'
			})
			.returning();

		await db.insert(schema.invoiceFlightRsvRoutes).values({
			invoiceFlightRsvId: rsv1.id,
			airlineCode: 'GA',
			airlineName: 'Garuda Indonesia',
			airlineNo: 'GA-402',
			aircraft: 'Boeing 737-800NG',
			flightNo: 'GA-402',
			flightClass: 'BUSINESS',
			originCode: 'CGK',
			originName: 'Soekarno-Hatta Intl',
			destinationCode: 'DPS',
			destinationName: 'Ngurah Rai Bali Intl',
			departDate: new Date('2026-11-20T08:00:00Z'),
			arrivalDate: new Date('2026-11-20T10:55:00Z'),
			routeType: 'ONE_WAY',
			sequenceNo: 1,
			createdBy: 'USR-TCK-001'
		});

		await db.insert(schema.invoiceFlightRsvPaxes).values([
			{
				invoiceFlightRsvId: rsv1.id,
				prefix: 'MR',
				firstName: 'Agus',
				lastName: 'Pratama',
				fullName: 'Agus Pratama',
				gender: 'MALE',
				travelerType: 'ADULT',
				nationality: 'IDN',
				identityNo: '3171012304850001',
				emailAddress: 'agus.p@astra.co.id',
				phoneNo: '+62-812-3456-7890',
				createdBy: 'USR-TCK-001'
			},
			{
				invoiceFlightRsvId: rsv1.id,
				prefix: 'MRS',
				firstName: 'Dewi',
				lastName: 'Sartika',
				fullName: 'Dewi Sartika',
				gender: 'FEMALE',
				travelerType: 'ADULT',
				nationality: 'IDN',
				identityNo: '3171016508880002',
				emailAddress: 'dewi.s@astra.co.id',
				phoneNo: '+62-813-4567-8901',
				createdBy: 'USR-TCK-001'
			}
		]);

		// Invoice 2: Confirmed & Partially Paid
		const [inv2] = await db
			.insert(schema.invoices)
			.values({
				businessProfileId: cust1Id,
				invoiceNo: 'INV/2026/11/0002',
				bookingType: 'FLIGHT',
				currencyCode: 'IDR',
				netFare: '8400000.00',
				serviceFee: '100000.00',
				keepComm: '25000.00',
				discount: '0.00',
				gst: '924000.00',
				customGST: '0.00',
				billingAmount: '9424000.00',
				paymentType: 'TOP',
				invoiceStatus: 'CONFIRMED',
				submittedByUserNo: 'USR-TCK-001',
				submittedDate: new Date('2026-11-05T09:30:00Z'),
				confirmedByUserNo: 'USR-AR-001',
				confirmedDate: new Date('2026-11-05T14:00:00Z'),
				officeHandler: 'JKT-HQ',
				createdBy: 'USR-TCK-001'
			})
			.returning();

		// Invoice 3: Overdue
		await db.insert(schema.invoices).values({
			businessProfileId: cust2Id,
			invoiceNo: 'INV/2026/10/0045',
			bookingType: 'FLIGHT',
			overdueDays: 14,
			overdueDate: '2026-10-31',
			currencyCode: 'IDR',
			netFare: '18500000.00',
			serviceFee: '200000.00',
			keepComm: '50000.00',
			discount: '0.00',
			gst: '2035000.00',
			customGST: '0.00',
			billingAmount: '20735000.00',
			paymentType: 'TOP',
			invoiceStatus: 'CONFIRMED',
			submittedByUserNo: 'USR-TCK-001',
			submittedDate: new Date('2026-10-15T09:00:00Z'),
			confirmedByUserNo: 'USR-AR-001',
			confirmedDate: new Date('2026-10-15T11:00:00Z'),
			officeHandler: 'JKT-HQ',
			createdBy: 'USR-TCK-001'
		});

		console.log('Invoices and Flight details seeded.');
	}

	// 4. Seed Payments
	const existingPayments = await db.select().from(schema.payments);
	if (existingPayments.length === 0) {
		const [p1] = await db
			.insert(schema.payments)
			.values({
				paymentNo: 'PAY/2026/11/0088',
				receivedAt: new Date('2026-11-12T14:20:00Z'),
				receivedAccount: 'Bank Mandiri - 123-00-1122334 (WahanaTravel HQ)',
				amount: '50000000.00',
				allocatedAmount: '9424000.00',
				unallocatedAmount: '40576000.00',
				allocationStatus: 'PARTIALLY_ALLOCATED',
				totalInvoice: 1,
				currencyCode: 'IDR',
				fullyPaidInvoice: 1,
				partiallyPaidInvoice: 0,
				createdBy: 'USR-AR-001'
			})
			.returning();

		console.log('Payments seeded.');
	}

	console.log('--- Database seeding completed successfully ---');
}

