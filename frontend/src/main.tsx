import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardPage from "./components/pages/dashboard/Dashboard";
import LoginPage from "./components/pages/login/LoginPage";
import AccessDeniedPage from "./components/pages/access-denied/AccessDeniedPage";
import NotFound from "./components/pages/notFound/NotFoundPage";
import GoodDetailsPage from "./components/pages/goods/GoodDetailsPage";
import GoodsListPage from "./components/pages/goods/GoodsListPage";
import EditGoodPage from "./components/pages/goods/EditGoodPage";
import AddGoodPage from "./components/pages/goods/AddGoodPage";
import UsersPage from "./components/pages/users/UsersPage";
import { Layout } from "./components/layout/Layout";
import LogsPage from "./components/pages/log/logsPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
			{
				path: "access-denied",
				element: <AccessDeniedPage />,
			},
			{
				path: "goods",
				element: <GoodsListPage />,
			},
			{
				path: "goods/add",
				element: <AddGoodPage />,
			},
			{
				path: "goods/:id",
				element: <GoodDetailsPage />,
			},
			{
				path: "goods/:id/edit",
				element: <EditGoodPage />,
			},
			{
				path: "logs",
				element: <LogsPage />,
			},
			{
				path: "users",
				element: <UsersPage />,
			},
		],
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);
