import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useWatch } from "../hooks/use-watch";
import { formatTimeAgo } from "../utils/function";

export function VideoCard({ user, name, created_at, view_count, video_url, thumbnail }) {
	const [show, setShow] = useState(false);
	const video = useRef(null);
	const [showVideo, setShowVideo] = useState(false);
	const [width, setWidth] = useState(document.documentElement.clientWidth);

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useWatch(() => {
		if (show) {
			setShowVideo(true);
			if (video.current) {
				video.current.play().catch((err) => {
					console.log("Video play error:", err);
				});
			}
		} else {
			setShowVideo(false);
			if (video.current) {
				video.current.pause();
			}
		}
	}, [show]);

	return (
		<div className="relative group border-2 border-white rounded-xl overflow-hidden">
			<div
				className={`rounded-xl transition-all duration-200 ${show && width > 639 ? 'transform z-10' : ''
					}`}
			>
				<div
					onMouseOver={() => setShow(true)}
					onMouseLeave={() => {
						setShow(false);
						setShowVideo(false);
					}}
					className="relative aspect-video"
				>
					{thumbnail && (
						<img
							src={thumbnail}
							alt="Video thumbnail"
							className={`w-full h-full object-cover ${showVideo ? 'hidden' : ''}`}
						/>
					)}
					{video_url && (
						<div className={`absolute inset-0 ${showVideo ? '' : 'hidden'}`}>
							<video
								ref={video}
								src={video_url}
								className="w-full h-full object-cover"
								muted
							/>
						</div>
					)}
				</div>
				<div className="p-3 bg-black">
					<div className="flex gap-3">
						<img
							className="rounded-full w-9 h-9 mt-1"
							src={thumbnail}
							alt="Channel avatar"
						/>
						<div className="flex-1">
							<h3 className="text-white font-medium line-clamp-2 text-sm">
								{name}
							</h3>
							<div className="flex items-center gap-1 text-[13px] text-gray-400 mt-1">
								<span>{user.username}</span>
								<Check className="w-[14px] h-[14px]" />
							</div>
							<div className="text-[13px] text-gray-400">
								{formatTimeAgo(created_at)} • {view_count} views
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
