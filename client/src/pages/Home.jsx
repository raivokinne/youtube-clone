import { NavLayout } from "../layouts/NavLayout";
import { useVideo } from "../hooks/use-video";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/function";
import { VideoCard } from "../components/VideoCard";

export default function Home() {
	const { data, error, loading } = useVideo();
	const [user, setUser] = useState({});

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUser(user);
		}
		getUser();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}
	return (
		<>
			<NavLayout user={user ?? null}>
				<main className="pt-16">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
						{data && data.map((video) => (
							<VideoCard key={video.id} user={user} {...video} />
						))}
					</div>
				</main>
			</NavLayout>
		</>
	);
}
