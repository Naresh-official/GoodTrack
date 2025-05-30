"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";

interface User {
	role: string;
}

export default function AddGoodPage() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		quantity: "",
		price: "",
	});

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			const parsedUser = JSON.parse(userData);
			setUser(parsedUser);

			// Check permissions
			if (parsedUser.role === "viewer") {
				navigate("/access-denied");
			}
		}
	}, [navigate]);

	const categories = [
		"Electronics",
		"Furniture",
		"Stationery",
		"Appliances",
		"Clothing",
		"Books",
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validation
		if (
			!formData.name ||
			!formData.category ||
			!formData.quantity ||
			!formData.price
		) {
			setError("Please fill in all required fields");
			setLoading(false);
			return;
		}

		if (Number.parseFloat(formData.price) <= 0) {
			setError("Price must be greater than 0");
			setLoading(false);
			return;
		}

		if (Number.parseInt(formData.quantity) < 0) {
			setError("Quantity cannot be negative");
			setLoading(false);
			return;
		}

		// Mock API call
		setTimeout(() => {
			setSuccess(true);
			setLoading(false);

			// Reset form
			setFormData({
				name: "",
				description: "",
				category: "",
				quantity: "",
				price: "",
			});

			// Redirect after success
			setTimeout(() => {
				navigate("/goods");
			}, 2000);
		}, 1000);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	if (!user || user.role === "viewer") {
		return null;
	}

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link to="/goods">
					<Button variant="outline" size="sm">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Goods
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Add New Good
					</h1>
					<p className="text-gray-600 mt-2">
						Create a new inventory item
					</p>
				</div>
			</div>

			{/* Form */}
			<Card>
				<CardHeader>
					<CardTitle>Good Details</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									placeholder="Enter good name"
									value={formData.name}
									onChange={(e) =>
										handleInputChange(
											"name",
											e.target.value
										)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Category *</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										handleInputChange("category", value)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="quantity">Quantity *</Label>
								<Input
									id="quantity"
									type="number"
									min="0"
									placeholder="Enter quantity"
									value={formData.quantity}
									onChange={(e) =>
										handleInputChange(
											"quantity",
											e.target.value
										)
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="price">Price ($) *</Label>
								<Input
									id="price"
									type="number"
									step="0.01"
									min="0"
									placeholder="Enter price"
									value={formData.price}
									onChange={(e) =>
										handleInputChange(
											"price",
											e.target.value
										)
									}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								placeholder="Enter description (optional)"
								value={formData.description}
								onChange={(e) =>
									handleInputChange(
										"description",
										e.target.value
									)
								}
								rows={4}
							/>
						</div>

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{success && (
							<Alert className="border-green-200 bg-green-50">
								<AlertDescription className="text-green-800">
									Good added successfully! Redirecting to
									goods list...
								</AlertDescription>
							</Alert>
						)}

						<div className="flex gap-4">
							<Button
								type="submit"
								disabled={loading}
								className="flex-1"
							>
								{loading ? "Adding..." : "Add Good"}
							</Button>
							<Link to="/goods" className="flex-1">
								<Button
									type="button"
									variant="outline"
									className="w-full"
								>
									Cancel
								</Button>
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
