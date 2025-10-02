export type DonationStatus = 'Pending' | 'Withdrawn' | 'Sent';

export interface Donation {
	id: string;
	tx_hash: string;
	from_wallet: string | null;
	to_wallet: string | null;
	amount: number;
	datetime: string; // ISO string from Postgres
	bank_reference: string | null;
	recipient_org: string | null;
	status: DonationStatus;
}


