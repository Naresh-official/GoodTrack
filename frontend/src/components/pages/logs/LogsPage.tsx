import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown } from "lucide-react";

// Mock data
const mockLogs = [
	{
		id: 1,
		goodId: 1,
		goodName: "Laptop Pro",
		oldQuantity: 30,
		newQuantity: 25,
		changeType: "decrease",
		changedAt: "2024-01-20 14:30:00",
		reason: "Sale",
	},
	{
		id: 2,
		goodId: 2,
		goodName: "Wireless Mouse",
		oldQuantity: 5,
		newQuantity: 8,
		changeType: "increase",
		changedAt: "2024-01-20 10:15:00",
		reason: "Restock",
	},
	{
		id: 3,
		goodId: 3,
		goodName: "Office Chair",
		oldQuantity: 20,
		newQuantity: 15,
		changeType: "decrease",
		changedAt: "2024-01-19 16:45:00",
		reason: "Sale",
	},
	{
		id: 4,
		goodId: 1,
		goodName: "Laptop Pro",
		oldQuantity: 20,
		newQuantity: 30,
		changeType: "increase",
		changedAt: "2024-01-19 09:00:00",
		reason: "Restock",
	},
	{
		id: 5,
		goodId: 4,
		goodName: "Notebook Set",
		oldQuantity: 45,
		newQuantity: 50,
		changeType: "increase",
		changedAt: "2024-01-18 11:20:00",
		reason: "Restock",
	},
	{
		id: 6,
		goodId: 5,
		goodName: "Coffee Maker",
		oldQuantity: 8,
		newQuantity: 3,
		changeType: "decrease",
		changedAt: "2024-01-18 15:30:00",
		reason: "Sale",
	},
];

interface User {
	role: string;
}

export default function LogsPage() {
	const [user, setUser] = useState<User | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [logs] = useState(mockLogs);

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	const filteredLogs = logs.filter(
		(log) =>
			log.goodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.goodId.toString().includes(searchTerm)
	);

	const getChangeIcon = (changeType: string) => {
		return changeType === "increase" ? (
			<TrendingUp className="w-4 h-4 text-green-600" />
		) : (
			<TrendingDown className="w-4 h-4 text-red-600" />
		);
	};

	const getChangeBadge = (changeType: string) => {
		return changeType === "increase" ? (
			<Badge className="bg-green-100 text-green-800">Increase</Badge>
		) : (
			<Badge className="bg-red-100 text-red-800">Decrease</Badge>
		);
	};

	// Check permissions
	if (user?.role === "viewer") {
		return (
			<div className="flex items-center justify-center min-h-[400px] w-full">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Access Denied
					</h2>
					<p className="text-gray-600">
						You do not have permission to view this page.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 w-full">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Goods Logs</h1>
				<p className="text-gray-600 mt-2">
					Track quantity changes and inventory movements
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Changes
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{logs.length}</div>
						<p className="text-xs text-muted-foreground">
							All time records
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Increases
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{
								logs.filter(
									(log) => log.changeType === "increase"
								).length
							}
						</div>
						<p className="text-xs text-muted-foreground">
							Stock additions
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Decreases
						</CardTitle>
						<TrendingDown className="h-4 w-4 text-red-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600">
							{
								logs.filter(
									(log) => log.changeType === "decrease"
								).length
							}
						</div>
						<p className="text-xs text-muted-foreground">
							Stock reductions
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<Card>
				<CardHeader>
					<CardTitle>Search Logs</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="Search by good name or ID..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Logs Table */}
			<Card>
				<CardHeader>
					<CardTitle>
						Change History ({filteredLogs.length} records)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Good ID</TableHead>
									<TableHead>Good Name</TableHead>
									<TableHead>Old Quantity</TableHead>
									<TableHead>New Quantity</TableHead>
									<TableHead>Change</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Reason</TableHead>
									<TableHead>Changed At</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredLogs.map((log) => (
									<TableRow key={log.id}>
										<TableCell className="font-medium">
											{log.goodId}
										</TableCell>
										<TableCell>{log.goodName}</TableCell>
										<TableCell>{log.oldQuantity}</TableCell>
										<TableCell>{log.newQuantity}</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getChangeIcon(log.changeType)}
												<span
													className={
														log.changeType ===
														"increase"
															? "text-green-600"
															: "text-red-600"
													}
												>
													{log.changeType ===
													"increase"
														? "+"
														: ""}
													{log.newQuantity -
														log.oldQuantity}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{getChangeBadge(log.changeType)}
										</TableCell>
										<TableCell>{log.reason}</TableCell>
										<TableCell className="text-sm text-gray-500">
											{new Date(
												log.changedAt
											).toLocaleString()}
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
