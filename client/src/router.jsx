import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoShow from "./pages/VideoShow";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <Register />
	},
	{
		path: "/videos/:id/play",
		element: <VideoShow />
	}
])
