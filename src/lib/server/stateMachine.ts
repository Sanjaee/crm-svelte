import { db } from './db/index.js';
import * as schema from './db/schema.js';
import { eq } from 'drizzle-orm';
import type { UserRole } from '#lib/auth.js';

export type InvoiceTransitionAction =
	| 'SUBMIT'
	| 'APPROVE'
	| 'REJECT'
	| 'REQUEST_VOID'
	| 'CONFIRM_VOID'
	| 'ALLOCATE_PAYMENT';

export interface TransitionContext {
	invoiceId: string;
	userNo: string;
	userRole: UserRole;
	action: InvoiceTransitionAction;
	comment?: string;
	allocatedAmount?: number;
}

export async function transitionInvoice(ctx: TransitionContext) {
	const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, ctx.invoiceId));
	if (!invoice) throw new Error('Invoice not found');

	const currentStatus = invoice.invoiceStatus;
	let newStatus = currentStatus;

	switch (ctx.action) {
		case 'SUBMIT':
			if (currentStatus !== 'DRAFT') {
				throw new Error(`Cannot submit invoice in status ${currentStatus}`);
			}
			newStatus = 'SUBMITTED';
			break;

		case 'APPROVE':
			if (currentStatus !== 'SUBMITTED') {
				throw new Error(`Cannot approve invoice in status ${currentStatus}. Must be SUBMITTED.`);
			}
			if (ctx.userRole !== 'SUPERVISOR' && ctx.userRole !== 'ACCOUNTING_AR' && ctx.userRole !== 'ADMIN') {
				throw new Error('Only Supervisor, Accounting AR, or Admin can approve invoices');
			}
			newStatus = 'CONFIRMED';
			break;

		case 'REJECT':
			if (currentStatus !== 'SUBMITTED') {
				throw new Error(`Cannot reject invoice in status ${currentStatus}`);
			}
			if (!ctx.comment || ctx.comment.trim() === '') {
				throw new Error('Mandatory error comment is required to reject an invoice');
			}
			// Status returns to DRAFT with correction notes
			newStatus = 'DRAFT';
			break;

		case 'REQUEST_VOID':
			if (currentStatus !== 'CONFIRMED' && currentStatus !== 'SUBMITTED') {
				throw new Error(`Cannot request void for invoice in status ${currentStatus}`);
			}
			newStatus = 'WAITING'; // WAITING VOID APPROVAL
			break;

		case 'CONFIRM_VOID':
			if (ctx.userRole !== 'SUPERVISOR' && ctx.userRole !== 'ACCOUNTING_AR' && ctx.userRole !== 'ADMIN') {
				throw new Error('Only Supervisor, AR, or Admin can confirm void');
			}
			newStatus = 'VOID';
			break;

		default:
			throw new Error(`Unhandled action: ${ctx.action}`);
	}

	// 1. Update Invoice Status
	const [updatedInvoice] = await db
		.update(schema.invoices)
		.set({
			invoiceStatus: newStatus,
			modifiedBy: ctx.userNo,
			modifiedDate: new Date(),
			...(ctx.action === 'APPROVE'
				? { confirmedByUserNo: ctx.userNo, confirmedDate: new Date() }
				: {}),
			...(ctx.action === 'SUBMIT'
				? { submittedByUserNo: ctx.userNo, submittedDate: new Date() }
				: {})
		})
		.where(eq(schema.invoices.id, ctx.invoiceId))
		.returning();

	// 2. Insert Invoice Action Record
	const [actionRecord] = await db
		.insert(schema.invoiceActions)
		.values({
			invoiceId: ctx.invoiceId,
			actionAck: ctx.action,
			comment: ctx.comment || `Transition to ${newStatus}`,
			createdBy: ctx.userNo
		})
		.returning();

	// 3. Insert Invoice Log
	await db.insert(schema.invoiceLogs).values({
		invoiceId: ctx.invoiceId,
		invoiceActionId: actionRecord.id,
		logActivity: ctx.action,
		log: `Invoice status changed from ${currentStatus} to ${newStatus}. Actor: ${ctx.userNo}. Note: ${ctx.comment || '-'}`,
		createdByUserId: ctx.userNo
	});

	// 4. Insert Global Audit Log
	await db.insert(schema.auditLogs).values({
		userNo: ctx.userNo,
		action: ctx.action,
		entityType: 'INVOICE',
		entityId: ctx.invoiceId,
		details: `Transition from ${currentStatus} to ${newStatus}`
	});

	return updatedInvoice;
}

