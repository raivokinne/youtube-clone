import { api } from "./axios";
import axios from "axios"

export const getCurrentUser = async () => {
	try {
		const response = await api.get("/user", { withCredentials: true });
		return response.data;
	} catch (error) {
		console.error("Failed to get current user:", error);
		return null;
	}
};

export const getCsrfToken = async () => {
	try {
		await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
			withCredentials: true,
		});
	} catch (error) {
		console.error("Failed to get CSRF token", error);
	}
};

export function formatTimeAgo(dateString) {
	const now = new Date();
	const past = new Date(dateString);
	const minutesAgo = Math.round((now - past) / 60000);

	if (minutesAgo === 0) return "just now";

	const rtf = new Intl.RelativeTimeFormat(navigator.language, { numeric: "auto" });
	return rtf.format(-minutesAgo, "minute"); // Negative because it’s in the past
}

