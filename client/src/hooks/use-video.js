import { useEffect, useState } from "react"
import { api } from "../utils/axios"

export function useVideo() {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		setLoading(true)
		async function fetchData() {
			try {
				const res = await api.get("/videos");
				setData(res.data.videos)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
		const interval = setInterval(() => {
			getChargersData()
		}, 15 * 1000);
		return () => clearInterval(interval);
	}, [])

	return {
		data,
		loading,
		error
	}
}
