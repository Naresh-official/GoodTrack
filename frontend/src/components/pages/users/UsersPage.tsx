"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router";

// Mock data
const mockUsers = [
	{
		id: 1,
		username: "admin",
		email: "admin@goodtrack.com",
		role: "admin",
		createdAt: "2024-01-01",
	},
	{
		id: 2,
		username: "staff1",
		email: "staff@goodtrack.com",
		role: "staff",
		createdAt: "2024-01-05",
	},
	{
		id: 3,
		username: "viewer1",
		email: "viewer@goodtrack.com",
		role: "viewer",
		createdAt: "2024-01-10",
	},
	{
		id: 4,
		username: "staff2",
		email: "staff2@goodtrack.com",
		role: "staff",
		createdAt: "2024-01-15",
	},
];

interface User {
	role: string;
}

export default function UsersPage() {
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState(mockUsers);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const [newUser, setNewUser] = useState({
		username: "",
		email: "",
		role: "viewer",
		password: "",
	});

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);

			// Check permissions - only admin can access
			if (parsedUser.role !== "admin") {
				navigate("/access-denied");
			}
		}
	}, [navigate]);

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validation
		if (!newUser.username || !newUser.email || !newUser.password) {
			setError("Please fill in all required fields");
			setLoading(false);
			return;
		}

		// Check if email already exists
		if (users.some((u) => u.email === newUser.email)) {
			setError("Email already exists");
			setLoading(false);
			return;
		}

		// Mock API call
		setTimeout(() => {
			const newUserData = {
				id: users.length + 1,
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
				createdAt: new Date().toISOString().split("T")[0],
			};

			setUsers([...users, newUserData]);
			setSuccess("User added successfully!");
			setNewUser({
				username: "",
				email: "",
				role: "viewer",
				password: "",
			});
			setIsAddDialogOpen(false);
			setLoading(false);

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(""), 3000);
		}, 1000);
	};

	const handleDeleteUser = (userId: number) => {
		if (confirm("Are you sure you want to delete this user?")) {
			setUsers(users.filter((u) => u.id !== userId));
			setSuccess("User deleted successfully!");
			setTimeout(() => setSuccess(""), 3000);
		}
	};

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-purple-100 text-purple-800";
			case "staff":
				return "bg-blue-100 text-blue-800";
			case "viewer":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Check permissions
	if (!user || user.role !== "admin") {
		return null;
	}

	return (
		<div className="space-y-6 w-full">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						User Management
					</h1>
					<p className="text-gray-600 mt-2">
						Manage system users and their permissions
					</p>
				</div>

				<Dialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
				>
					<DialogTrigger asChild>
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							Add User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New User</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleAddUser} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username *</Label>
								<Input
									id="username"
									placeholder="Enter username"
									value={newUser.username}
									onChange={(e) =>
										setNewUser({
											...newUser,
											username: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email *</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter email"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({
											...newUser,
											email: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password *</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter password"
									value={newUser.password}
									onChange={(e) =>
										setNewUser({
											...newUser,
											password: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="role">Role *</Label>
								<Select
									value={newUser.role}
									onValueChange={(value) =>
										setNewUser({
											...newUser,
											role: value,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">
											Admin
										</SelectItem>
										<SelectItem value="staff">
											Staff
										</SelectItem>
										<SelectItem value="viewer">
											Viewer
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="flex gap-2">
								<Button
									type="submit"
									disabled={loading}
									className="flex-1"
								>
									{loading ? "Adding..." : "Add User"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsAddDialogOpen(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{success && (
				<Alert className="border-green-200 bg-green-50">
					<AlertDescription className="text-green-800">
						{success}
					</AlertDescription>
				</Alert>
			)}

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Users
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{users.length}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Admins
						</CardTitle>
						<Users className="h-4 w-4 text-purple-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{users.filter((u) => u.role === "admin").length}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Staff
						</CardTitle>
						<Users className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{users.filter((u) => u.role === "staff").length}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Viewers
						</CardTitle>
						<Users className="h-4 w-4 text-gray-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-600">
							{users.filter((u) => u.role === "viewer").length}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Users Table */}
			<Card>
				<CardHeader>
					<CardTitle>Users List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Username</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Created At</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell className="font-medium">
											{user.id}
										</TableCell>
										<TableCell>{user.username}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<Badge
												className={getRoleBadgeColor(
													user.role
												)}
											>
												{user.role}
											</Badge>
										</TableCell>
										<TableCell>{user.createdAt}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
												>
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-700"
													onClick={() =>
														handleDeleteUser(
															user.id
														)
													}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
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
