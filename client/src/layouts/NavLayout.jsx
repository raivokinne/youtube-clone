import { MenuIcon, Plus, Search, X, Youtube } from "lucide-react";
import { SideNav } from "../components/SideNav";
import { useState, useCallback } from "react";
import { useWatch } from "../hooks/use-watch";
import { useCategories } from "../hooks/use-category";
import { api } from "../utils/axios";
import { useNavigate } from "react-router";
import { SearchBar } from "../components/SearchBar";

export function NavLayout({ user, children }) {
	const [openSideNav, setOpenSideNav] = useState(false);
	const [open, setOpen] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [thumbnail, setThumbnail] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);
	const { data } = useCategories()
	const navigate = useNavigate()

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setThumbnail(file);
				setThumbnailUrl(reader.result);
			};

			reader.readAsDataURL(file);
		}
	};

	const handleVideoUpload = useCallback(async (file) => {
		const CHUNK_SIZE = 1024 * 1024 * 2;
		const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
		setIsUploading(true);

		try {
			for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
				const start = chunkIndex * CHUNK_SIZE;
				const end = Math.min(start + CHUNK_SIZE, file.size);
				const chunk = file.slice(start, end);

				const headers = {
					'Content-Type': 'application/octet-stream',
					'Content-Range': `bytes ${start}-${end - 1}/${file.size}`,
				};

				const response = await api.post('/videos/upload/chunk', chunk, { headers });

				const progress = Math.round((chunkIndex + 1) / totalChunks * 100);
				setUploadProgress(progress);

				if (chunkIndex === totalChunks - 1) {
					return response.data;
				}
			}
		} catch (error) {
			console.error('Upload error:', error);
			toast.error('Error uploading video');
			throw error;
		}
	}, []);

	const handleSubmit = async (ev) => {
		ev.preventDefault();

		try {
			const form = ev.target;
			const videoFile = form.video.files[0];

			if (!videoFile) {
				toast.error('Please select a video file');
				return;
			}

			const uploadResult = await handleVideoUpload(videoFile);

			const formData = new FormData(form);
			const metadata = {
				name: formData.get('name'),
				description: formData.get('description'),
				category: formData.get('category'),
				thumbnail: thumbnail,
				tags: ['idk', '2'],
				length: videoFile.length
			};

			const response = await api.post('/videos/upload/finalize', {
				path: uploadResult.file,
				name: videoFile.name,
				metadata: metadata,
			}, {
				headers: { "Content-Type": "multipart/form-data" }
			});

			if (response.data.video) {
				toast.success('Video uploaded successfully');
				navigate('/');
			}
		} catch (error) {
			console.error('Submission error:', error);
			toast.error('Error processing video');
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	useWatch(() => {
		if (!thumbnail) return;
		async function uploadThumbnail() {
			try {
				const formData = new FormData();
				formData.append('file', thumbnail);
				const response = await api.post("/upload/thumbnail", formData, {
					headers: { "Content-Type": "multipart/form-data" }
				})
				setThumbnailUrl(response.data.path)
			} catch (error) {
				console.error(error)
			}
		}

		uploadThumbnail()
	}, [thumbnail])

	const handleOpen = () => setOpen(!open);

	const handleToggle = () => {
		setOpenSideNav(!openSideNav);
	};
	return (
		<>
			<div className="relative">
				<div
					id="TopNav"
					className="w-full h-[60px] fixed bg-black z-20 flex items-center justify-between"
				>
					<div className="flex items-center">
						<button
							onClick={handleToggle}
							className="p-2 ml-3 rounded-full hover:bg-gray-800 inline-block cursor-pointer"
						>
							<MenuIcon color="#ffffff" className="w-[26px]" />
						</button>
						<div className="mx-2"></div>
						<div className="flex gap-2 items-center justify-center mr-10 cursor-pointer">
							<Youtube color="red" />
							<p className="text-white font-bold">YouTube</p>
						</div>
					</div>

					<SearchBar />

					<div className="flex gap-4 justify-center items-center">
						<button
							onClick={handleOpen}
							className="flex items-center rounded-full gap-2  mx-10 bg-[#212121] text-white px-4 py-1"
						>
							<Plus color="#ffffff" size="30" />
							<p>Create</p>
						</button>
						<div
							className={`${open
								? "grid opacity-100 pointer-events-auto"
								: "hidden opacity-0 pointer-events-none"
								} fixed inset-0 z-[999] grid h-screen w-screen place-items-center backdrop-blur-sm transition-opacity duration-300`}
						>
							<div className="relative mx-auto w-full max-w-[26rem] rounded-lg overflow-hidden shadow-sm">
								<div className="relative flex flex-col bg-[#1e1f1e] h-[400px] overflow-scroll">
									<button
										onClick={handleOpen}
										className="absolute top-3 right-3 text-white text-lg"
									>
										<X color="#ffffff" size="10" />
									</button>
									<form className="flex flex-col gap-4 p-6" onSubmit={handleSubmit} encType="multipart/form-data">
										<h1 className="text-lg text-white font-bold text-center">Upload video</h1>
										<div id="preview">
											{thumbnail ? (
												<img src={"http://localhost:8000/storage/" + thumbnailUrl} alt="" />
											) : (
												<div className="bg-gray-300 p-6 grid z-0 place-items-center w-full h-[200px]">
													<h1 className="text-lg font-bold z-10 transform rotate-45">Preview</h1>
												</div>
											)}
										</div>
										<input type="hidden" name="user_id" value={user.id || ''} />
										<div className="w-full">
											<div className="w-full">
												<label htmlFor="video" className="text-white font-bold">Video</label>
												<input
													type="file"
													name="video"
													accept="video/*"
													className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
													disabled={isUploading}
												/>
												{isUploading && (
													<div className="mt-2">
														<div className="w-full bg-gray-200 rounded-full h-2.5">
															<div
																className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
																style={{ width: `${uploadProgress}%` }}
															></div>
														</div>
														<p className="text-white text-sm mt-1">Uploading: {uploadProgress}%</p>
													</div>
												)}
											</div>
											<div className="w-full">
												<label className="text-white font-bold">Thumbnail</label>
												<input
													type="file"
													name="thumbnail"
													onChange={handleFileChange}
													className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
													placeholder="File"
												/>
											</div>
										</div>
										<div className="w-full">
											<label htmlFor="name" className="text-white font-bold">Name</label>
											<input
												type="text"
												name="name"
												className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
												placeholder="Name"
											/>
										</div>
										<div className="w-full">
											<label htmlFor="description" className="text-white font-bold">Description</label>
											<textarea
												name="description"
												className="w-full bg-white h-[100px] placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
											></textarea>
										</div>
										<div className="w-full">
											<label htmlFor="category" className="text-white font-bold">Category</label>
											<select
												name="category"
												className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
											>
												{data.map((category) => (
													<>
														<option value={category.name}>{category.name}</option>
													</>
												))}
											</select>
										</div>
										<div className="">
											<button
												className="w-full rounded-md bg-white py-2 px-4 border border-transparent text-center text-sm text-black transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-gray-100 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
												type="submit"
												disabled={isUploading}
											>
												{isUploading ? 'Uploading...' : 'Upload'}
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>

						<button onClick={() => setOpenDialog(!openDialog)}>
							<img
								className="rounded-full mx-8"
								width="35"
								src="https://yt3.ggpht.com/WkifiDaxgb31Ah7h49MZpeMttSyMK9LLlVdTW5k2WMdusL0bBvBWEVa_IlLkoeHCqWQ7zVG-=s88-c-k-c0x00ffffff-no-rj"
							/>
							<div
								className={`${openDialog
									? "grid opacity-100 pointer-events-auto"
									: "hidden opacity-0 pointer-events-none"
									} fixed top-12 right-5 z-[999] transition-opacity duration-300`}
							>
								<div className="relative mx-auto p-6 w-full max-w-[24rem] rounded-lg overflow-hidden shadow-sm">
									<div className="relative flex flex-col bg-[white] rounded-lg">
										<div className="p-6 pt-6">
											<button
												className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
												type="button"
											>
												<a href="/login">Login</a>
											</button>
											<p className="flex justify-center mt-6 text-sm text-slate-600">
												<a
													href="/register"
													className="ml-1 text-sm font-semibold text-slate-700 underline"
												>
													Register
												</a>
											</p>
										</div>
									</div>
								</div>
							</div>
						</button>
					</div>
				</div>
				<div
					id="SideNav"
					className={`h-full fixed z-0 bg-black ${!openSideNav ? "w-[70px]" : "w-[240px]"
						}`}
				>
					<ul
						className={`mt-[60px] w-full ${!openSideNav ? "p-2" : "px-5 pb-2 pt-[7px]"
							}`}
					>
						<SideNav openSideNav={openSideNav} iconString="Home" />
						<div className="border-b border-b-gray-700 my-2.5"></div>
						<SideNav openSideNav={openSideNav} iconString="Subscriptions" />
						<SideNav openSideNav={openSideNav} iconString="Library" />
						<SideNav openSideNav={openSideNav} iconString="Like" />
						<SideNav openSideNav={openSideNav} iconString="History" />
						<SideNav openSideNav={openSideNav} iconString="Watch Later" />
					</ul>
				</div>
				<div
					className={`${!openSideNav ? "pl-20" : "pl-64"} w-full h-[calc(100vh-60px)] absolute right-0 top-[60%]`}
				>
					{children}
				</div>
			</div>
		</>
	)
}
