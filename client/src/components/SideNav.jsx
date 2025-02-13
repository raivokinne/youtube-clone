import { Home, UserPlus, Library, ThumbsUp, History, Clock, Video, Trash2 } from "lucide-react";

export function SideNav({ openSideNav, iconString }) {
	const iconsMap = {
		Home: Home,
		Subscriptions: UserPlus,
		Library: Library,
		Like: ThumbsUp,
		History: History,
		"Watch Later": Clock,
		"Add Video": Video,
		"Delete Video": Trash2,
	};

	const IconComponent = iconsMap[iconString] || Home;

	return (
		<li className={`p-2 ${openSideNav ? "flex items-center" : ""} text-white text-sm font-semibold text-center hover:bg-gray-700 rounded-lg cursor-pointer`}>
			<div className={!openSideNav ? "w-full flex justify-center" : ""}>
				<IconComponent size={20} />
			</div>
			<div className={openSideNav ? "mt-1 ml-4" : ""}>
				<span>{openSideNav && iconString}</span>
			</div>
		</li>
	);
}

