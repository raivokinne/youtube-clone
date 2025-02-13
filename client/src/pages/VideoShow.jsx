import { useParams } from "react-router"

export default function VideoShow() {
	const { id } = useParams()
	console.log(id)
	return (
		<div>VideoShow</div>
	)
}

