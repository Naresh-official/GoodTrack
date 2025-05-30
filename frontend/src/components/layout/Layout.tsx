import { Sidebar } from "@/components/Sidebar";

import { useEffect, useState } from "react";

import { Outlet, useNavigate } from "react-router";

interface User {
	email: string;
	role: string;
	name: string;
}

export function Layout() {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (!userData) {
			navigate("/login");
		} else {
			setUser(JSON.parse(userData));
		}
		setLoading(false);
	}, [navigate]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="h-screen flex overflow-hidden">
			<div className="h-screen">
				<Sidebar />
			</div>
			<main className="p-6 flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}
