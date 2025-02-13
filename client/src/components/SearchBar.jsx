import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "../utils/axios";

export function SearchBar() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [isOpen, setIsOpen] = useState(false);
	const searchRef = useRef(null);

	useEffect(() => {
		if (!query) {
			setResults([]);
			setIsOpen(false);
			return;
		}

		const timeoutId = setTimeout(async () => {
			try {
				const res = await api.get(`/videos/search?query=${query}`);
				setResults(res.data.videos);
				setIsOpen(res.data.videos.length > 0);
			} catch (error) {
				console.error("Search error:", error);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query]);

	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
		} else if (e.key === "ArrowUp") {
			setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
		} else if (e.key === "Enter" && selectedIndex >= 0) {
			window.location.href = `/watch/${results[selectedIndex].id}`;
		}
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative w-[600px] md:block hidden" ref={searchRef}>
			<div className="flex items-center bg-[#222222] rounded-lg">
				<input
					type="search"
					className="w-full px-5 py-1.5 text-base text-gray-200 bg-black border border-gray-700 rounded-lg focus:ring-0 focus:outline-none"
					placeholder="Search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Search className="mx-6 w-[23px]" color="#FFFFFF" />
			</div>
			{isOpen && (
				<div className="absolute w-full bg-[#222222] rounded-lg mt-2 shadow-lg border border-gray-600">
					{results.map((result, index) => (
						<div
							key={result.id}
							className={`flex items-center px-4 py-2 cursor-pointer ${selectedIndex === index ? "bg-gray-600" : "hover:bg-gray-700"
								}`}
							onMouseEnter={() => setSelectedIndex(index)}
							onClick={() => (window.location.href = `/watch/${result.id}`)}
						>
							<Search className="w-5 mr-2" color="#FFFFFF" />
							<p className="text-white">{result.name}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

