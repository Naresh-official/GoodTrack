"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router";

// Mock data
const mockGood = {
	id: 1,
	name: "Laptop Pro",
	description:
		"High-performance laptop with 16GB RAM and 512GB SSD. Perfect for professional work and gaming.",
	quantity: 25,
	price: 1299.99,
	category: "Electronics",
	status: "High",
	createdAt: "2024-01-15",
	updatedAt: "2024-01-20",
};

interface User {
	role: string;
}

export default function GoodDetailsPage() {
	const [user, setUser] = useState<User | null>(null);
	const params = useParams();
	const goodId = params.id;

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

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
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link to="/goods">
						<Button variant="outline" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Goods
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							{mockGood.name}
						</h1>
						<p className="text-gray-600 mt-2">Good ID: {goodId}</p>
					</div>
				</div>

				<div className="flex gap-2">
					{canEdit && (
						<Link to={`/goods/${goodId}/edit`}>
							<Button variant="outline">
								<Edit className="w-4 h-4 mr-2" />
								Edit
							</Button>
						</Link>
					)}
					{canDelete && (
						<Button
							variant="outline"
							className="text-red-600 hover:text-red-700"
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Delete
						</Button>
					)}
				</div>
			</div>

			{/* Good Details */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Details */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Good Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="text-sm font-medium text-gray-500">
										Name
									</label>
									<p className="text-lg font-semibold text-gray-900 mt-1">
										{mockGood.name}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium text-gray-500">
										Category
									</label>
									<p className="text-lg text-gray-900 mt-1">
										{mockGood.category}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium text-gray-500">
										Quantity
									</label>
									<p className="text-lg font-semibold text-gray-900 mt-1">
										{mockGood.quantity} units
									</p>
								</div>

								<div>
									<label className="text-sm font-medium text-gray-500">
										Price
									</label>
									<p className="text-lg font-semibold text-gray-900 mt-1">
										${mockGood.price.toFixed(2)}
									</p>
								</div>

								<div>
									<label className="text-sm font-medium text-gray-500">
										Status
									</label>
									<div className="mt-1">
										<Badge
											className={getStatusColor(
												mockGood.status
											)}
										>
											{mockGood.status} Stock
										</Badge>
									</div>
								</div>

								<div>
									<label className="text-sm font-medium text-gray-500">
										Total Value
									</label>
									<p className="text-lg font-semibold text-gray-900 mt-1">
										$
										{(
											mockGood.quantity * mockGood.price
										).toFixed(2)}
									</p>
								</div>
							</div>

							<div>
								<label className="text-sm font-medium text-gray-500">
									Description
								</label>
								<p className="text-gray-900 mt-1 leading-relaxed">
									{mockGood.description}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar Info */}
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Quick Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">
									Stock Level
								</span>
								<Badge
									className={getStatusColor(mockGood.status)}
								>
									{mockGood.status}
								</Badge>
							</div>

							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">
									Created
								</span>
								<span className="text-sm font-medium">
									{mockGood.createdAt}
								</span>
							</div>

							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-500">
									Last Updated
								</span>
								<span className="text-sm font-medium">
									{mockGood.updatedAt}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{canEdit && (
								<Link
									to={`/goods/${goodId}/edit`}
									className="block"
								>
									<Button
										variant="outline"
										className="w-full justify-start"
									>
										<Edit className="w-4 h-4 mr-2" />
										Edit Good
									</Button>
								</Link>
							)}

							<Link to="/logs" className="block">
								<Button
									variant="outline"
									className="w-full justify-start"
								>
									View Logs
								</Button>
							</Link>

							{canDelete && (
								<Button
									variant="outline"
									className="w-full justify-start text-red-600 hover:text-red-700"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete Good
								</Button>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
