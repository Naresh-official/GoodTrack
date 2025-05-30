import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function AccessDeniedPage() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
							<ShieldX className="w-8 h-8 text-red-600" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900">
						Access Denied
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-gray-600">
						You do not have permission to view this page. Please
						contact your administrator if you believe this is an
						error.
					</p>
					<Link to="/dashboard">
						<Button className="w-full">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
