"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import type { Donation, DonationStatus } from "@/types/donation";

function useSupabase() { return null as any }

export default function AdminPage() {
    const supabase = useSupabase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<Donation[]>([]);

    useEffect(() => {
        // Check our own admin cookie
        fetch('/api/me').then(async (r) => {
            const ok = r.ok;
            setSession(ok ? ({} as any) : null);
        }).catch(() => setSession(null));
    }, []);

	useEffect(() => {
		if (!session) return;
		refreshDonations();
	}, [session]);

    async function signInWithPassword(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        setLoading(false);
        if (!res.ok) {
            const j = await res.json();
            toast.error(j.error ?? 'Failed to sign in');
        } else {
            setSession({} as any);
        }
    }

	async function refreshDonations() {
		const res = await fetch("/api/donations?limit=200");
		const data = await res.json();
		setDonations(data);
	}

	async function validateTxOnSolscan(tx: string) {
		try {
			const resp = await fetch(`https://api.solscan.io/transaction?tx=${encodeURIComponent(tx)}`);
			return resp.ok;
		} catch {
			return false;
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = {
			tx_hash: String(form.get('tx_hash') || ''),
			from_wallet: String(form.get('from_wallet') || ''),
			to_wallet: String(form.get('to_wallet') || ''),
			amount: Number(form.get('amount') || 0),
			datetime: String(form.get('datetime') || ''),
			bank_reference: String(form.get('bank_reference') || ''),
			recipient_org: String(form.get('recipient_org') || ''),
		};
		if (!(await validateTxOnSolscan(payload.tx_hash))) {
			toast.error("Tx hash invalid or not found on Solscan");
			return;
		}
		const res = await fetch('/api/donations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
		if (!res.ok) {
			const err = await res.json();
			toast.error(err.error?.message ?? 'Failed to add donation');
			return;
		}
		toast.success('Donation added');
		(e.currentTarget as HTMLFormElement).reset();
		refreshDonations();
	}

	async function updateStatus(id: string, status: DonationStatus) {
		const res = await fetch(`/api/donations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
		if (!res.ok) toast.error('Failed to update'); else {
			toast.success('Status updated');
			refreshDonations();
		}
	}

    if (!session) {
		return (
			<div className="container mx-auto max-w-2xl p-6">
				<Card>
					<CardHeader>
						<CardTitle>Admin Login</CardTitle>
					</CardHeader>
					<CardContent>
                        <form onSubmit={signInWithPassword} className="space-y-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
							</div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                            </div>
                            <Button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">Manage donations and project configuration</p>
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline">
						<Link href="/admin/config">Project Config</Link>
					</Button>
					<Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Add Donation</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="md:col-span-2">
							<Label htmlFor="tx_hash">Tx Hash</Label>
							<Input id="tx_hash" name="tx_hash" required placeholder="Transaction hash" />
						</div>
						<div>
							<Label htmlFor="from_wallet">From Wallet</Label>
							<Input id="from_wallet" name="from_wallet" placeholder="Sender wallet" />
						</div>
						<div>
							<Label htmlFor="to_wallet">To Wallet</Label>
							<Input id="to_wallet" name="to_wallet" placeholder="Recipient wallet" />
						</div>
						<div>
							<Label htmlFor="amount">Amount</Label>
							<Input id="amount" name="amount" type="number" step="0.000001" min="0" required />
						</div>
						<div>
							<Label htmlFor="datetime">Date/Time</Label>
							<Input id="datetime" name="datetime" type="datetime-local" />
						</div>
						<div>
							<Label htmlFor="bank_reference">Bank Reference</Label>
							<Input id="bank_reference" name="bank_reference" placeholder="Bank reference" />
						</div>
						<div>
							<Label htmlFor="recipient_org">Recipient Org</Label>
							<Input id="recipient_org" name="recipient_org" placeholder="Organization" />
						</div>
						<div className="md:col-span-2">
							<Button type="submit">Add Donation</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Donation History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tx Hash</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Bank Ref</TableHead>
									<TableHead>Recipient</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{donations.map((d) => (
									<TableRow key={d.id}>
										<TableCell>
											<a className="text-blue-600 underline" href={`https://solscan.io/tx/${d.tx_hash}`} target="_blank" rel="noreferrer">{d.tx_hash.slice(0, 12)}…</a>
										</TableCell>
										<TableCell>{d.amount}</TableCell>
										<TableCell>{d.bank_reference ?? '-'}</TableCell>
										<TableCell>{d.recipient_org ?? '-'}</TableCell>
										<TableCell>{new Date(d.datetime).toLocaleString()}</TableCell>
										<TableCell>
											<Select defaultValue={d.status} onValueChange={(v) => updateStatus(d.id, v as DonationStatus)}>
												<SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
												<SelectContent>
													<SelectItem value="Pending">Pending</SelectItem>
													<SelectItem value="Withdrawn">Withdrawn</SelectItem>
													<SelectItem value="Sent">Sent</SelectItem>
												</SelectContent>
											</Select>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}


