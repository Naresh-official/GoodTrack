"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router";

// Mock data

interface Good {
	id: number;
	name: string;
	quantity: number;
	price: number;
	category: string;
	status: "High" | "Medium" | "Low";
}

const mockGoods: Good[] = [
	{
		id: 1,
		name: "Laptop Pro",
		quantity: 25,
		price: 1299.99,
		category: "Electronics",
		status: "High",
	},
	{
		id: 2,
		name: "Wireless Mouse",
		quantity: 8,
		price: 29.99,
		category: "Electronics",
		status: "Low",
	},
	{
		id: 3,
		name: "Office Chair",
		quantity: 15,
		price: 199.99,
		category: "Furniture",
		status: "Medium",
	},
	{
		id: 4,
		name: "Notebook Set",
		quantity: 50,
		price: 12.99,
		category: "Stationery",
		status: "High",
	},
	{
		id: 5,
		name: "Coffee Maker",
		quantity: 3,
		price: 89.99,
		category: "Appliances",
		status: "Low",
	},
	{
		id: 6,
		name: "Desk Lamp",
		quantity: 20,
		price: 45.99,
		category: "Furniture",
		status: "Medium",
	},
];

interface User {
	role: string;
}

export default function GoodsListPage() {
	const [user, setUser] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [goods, setGoods] = useState<Good[] | null>(null);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
		setGoods(mockGoods); // Set mock data initially
	}, []);

	const filteredGoods = goods?.filter((good) => {
		const matchesSearch = good.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || good.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	const categories = Array.from(new Set(goods?.map((good) => good.category)));

	const getStatusColor = (status: string) => {
		switch (status) {
			case "High":
				return "bg-green-100 text-green-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Low":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const canEdit = user?.role === "admin" || user?.role === "staff";
	const canDelete = user?.role === "admin";

	return (
		<div className="space-y-6 w-full">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Goods Management
					</h1>
					<p className="text-gray-600 mt-2">
						Manage your inventory items
					</p>
				</div>
				{canEdit && (
					<Link to="/goods/add">
						<Button>
							<Plus className="w-4 h-4 mr-2" />
							Add Good
						</Button>
					</Link>
				)}
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
								<Input
									placeholder="Search goods..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-10"
								/>
							</div>
						</div>
						<Select
							value={categoryFilter}
							onValueChange={setCategoryFilter}
						>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Categories
								</SelectItem>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Goods Table */}
			<Card>
				<CardHeader>
					<CardTitle>
						Goods List ({filteredGoods?.length} items)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Price</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredGoods?.map((good) => (
									<TableRow key={good.id}>
										<TableCell className="font-medium">
											{good.id}
										</TableCell>
										<TableCell>{good.name}</TableCell>
										<TableCell>{good.quantity}</TableCell>
										<TableCell>
											${good.price.toFixed(2)}
										</TableCell>
										<TableCell>{good.category}</TableCell>
										<TableCell>
											<Badge
												className={getStatusColor(
													good.status
												)}
											>
												{good.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Link to={`/goods/${good.id}`}>
													<Button
														variant="outline"
														size="sm"
													>
														<Eye className="w-4 h-4" />
													</Button>
												</Link>
												{canEdit && (
													<Link
														to={`/goods/${good.id}/edit`}
													>
														<Button
															variant="outline"
															size="sm"
														>
															<Edit className="w-4 h-4" />
														</Button>
													</Link>
												)}
												{canDelete && (
													<Button
														variant="outline"
														size="sm"
														className="text-red-600 hover:text-red-700"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												)}
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
