import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Package,
	LayoutDashboard,
	ShoppingCart,
	Plus,
	FileText,
	Users,
	LogOut,
	Menu,
	X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

interface User {
	email: string;
	role: string;
	name: string;
}

export function Sidebar() {
	const [user, setUser] = useState<User | null>(null);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const userData = localStorage.getItem("user");
		if (userData) {
			setUser(JSON.parse(userData));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		navigate("/login");
	};

	const navigation = [
		{
			name: "Dashboard",
			href: "/dashboard",
			icon: LayoutDashboard,
			roles: ["admin", "staff", "viewer"],
		},
		{
			name: "Goods List",
			href: "/goods",
			icon: ShoppingCart,
			roles: ["admin", "staff", "viewer"],
		},
		{
			name: "Add Good",
			href: "/goods/add",
			icon: Plus,
			roles: ["admin", "staff"],
		},
		{
			name: "Goods Logs",
			href: "/logs",
			icon: FileText,
			roles: ["admin", "staff"],
		},
		{
			name: "User Management",
			href: "/users",
			icon: Users,
			roles: ["admin"],
		},
	];

	const filteredNavigation = navigation.filter(
		(item) => user && item.roles.includes(user.role)
	);

	return (
		<>
			{/* Mobile menu button */}
			<div className="lg:hidden min-w-18rem min-h-screen fixed top-4 left-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setIsMobileOpen(!isMobileOpen)}
				>
					{isMobileOpen ? (
						<X className="h-4 w-4" />
					) : (
						<Menu className="h-4 w-4" />
					)}
				</Button>
			</div>

			{/* Mobile overlay */}
			{isMobileOpen && (
				<div
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={() => setIsMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
					isMobileOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<div className="flex flex-col justify-between min-h-screen pb-4">
					{/* Logo */}
					<div className="flex items-center px-6 py-4 border-b border-gray-200">
						<div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg mr-3">
							<Package className="w-5 h-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold text-gray-900">
							GoodTrack
						</span>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-2">
						{filteredNavigation.map((item) => {
							const Icon = item.icon;
							const isActive = location.pathname === item.href;

							return (
								<Link
									key={item.name}
									to={item.href || "#"}
									onClick={() => setIsMobileOpen(false)}
									className={cn(
										"flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
										isActive
											? "bg-primary text-primary-foreground"
											: "text-gray-700 hover:bg-gray-100"
									)}
								>
									<Icon className="w-5 h-5 mr-3" />
									{item.name}
								</Link>
							);
						})}
					</nav>

					{/* User info and logout */}
					<div className="px-4 py-4 border-t border-gray-200">
						{user && (
							<div className="mb-4">
								<p className="text-sm font-medium text-gray-900">
									{user.name}
								</p>
								<p className="text-xs text-gray-500 capitalize">
									{user.role}
								</p>
							</div>
						)}
						<Button
							variant="outline"
							className="w-full justify-start"
							onClick={handleLogout}
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
