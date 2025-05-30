import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Mock authentication
		if (email === "admin@goodtrack.com" && password === "admin123") {
			localStorage.setItem(
				"user",
				JSON.stringify({
					email,
					role: "admin",
					name: "Admin User",
				})
			);
			navigate("/dashboard");
		} else if (email === "staff@goodtrack.com" && password === "staff123") {
			localStorage.setItem(
				"user",
				JSON.stringify({
					email,
					role: "staff",
					name: "Staff User",
				})
			);
			navigate("/dashboard");
		} else if (
			email === "viewer@goodtrack.com" &&
			password === "viewer123"
		) {
			localStorage.setItem(
				"user",
				JSON.stringify({
					email,
					role: "viewer",
					name: "Viewer User",
				})
			);
			navigate("/dashboard");
		} else {
			setError("Invalid email or password");
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
							<Package className="w-6 h-6 text-primary-foreground" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">
						Welcome to GoodTrack
					</CardTitle>
					<CardDescription>
						Sign in to your account to manage your inventory
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
					<div className="mt-6 text-sm text-muted-foreground">
						<p className="font-medium mb-2">Demo Accounts:</p>
						<div className="space-y-1 text-xs">
							<p>Admin: admin@goodtrack.com / admin123</p>
							<p>Staff: staff@goodtrack.com / staff123</p>
							<p>Viewer: viewer@goodtrack.com / viewer123</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
