import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
							<FileQuestion className="w-8 h-8 text-gray-600" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						404 - Page Not Found
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-gray-600">
						The page you're looking for doesn't exist. It might have
						been moved, deleted, or you entered the wrong URL.
					</p>
					<div className="flex flex-col gap-4">
						<Link to="/dashboard">
							<Button className="w-full">
								<Home className="w-4 h-4 mr-2" />
								Go to Dashboard
							</Button>
						</Link>
						<Link to="/login">
							<Button variant="outline" className="w-full">
								Back to Login
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
