import { useEffect, useState } from "react"
import { api } from "../utils/axios"

export function useCategories() {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		setLoading(true)
		async function fetchData() {
			try {
				const res = await api.get("/categories");
				setData(res.data.categories)
			} catch (error) {
				setError(error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return {
		data,
		loading,
		error
	}
}

