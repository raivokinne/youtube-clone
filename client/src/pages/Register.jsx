import { useNavigate } from "react-router";
import { api } from "../utils/axios";
import { getCsrfToken } from "../utils/function";
import toast from "react-hot-toast";

export default function Register() {
	const navigate = useNavigate()
	const handleSubmit = async (ev) => {
		ev.preventDefault();

		const form = ev.target
		const formData = new FormData(form)
		const formObj = Object.fromEntries(formData)
		await getCsrfToken()
		const res = await api.post('/register', formObj)
		const data = res.data

		if (data.success) {
			const token = data.token
			localStorage.setItem('token', token)
			toast.success(data.message)
			navigate("/login")
		} else {
			toast.error(data.message)
		}

	};

	return (
		<main className="flex items-center justify-center min-h-screen bg-black">
			<section className="bg-gray-black rounded-2xl p-8 w-[400px]">
				<h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label htmlFor="firstname" className="block text-sm font-medium text-white">
							First Name
						</label>
						<input
							type="text"
							id="firstname"
							name="firstname"
							className="w-full text-white mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="lastname" className="block text-sm font-medium text-white">
							Last Name
						</label>
						<input
							type="text"
							id="lastname"
							name="lastname"
							className="w-full text-white mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="username" className="block text-sm font-medium text-white">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							className="w-full text-white mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-white">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							className="w-full text-white mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2 rounded-lg transition"
					>
						Register
					</button>

					<p className="text-center text-white">
						Already have an account?{" "}
						<a href="/login" className="text-blue-300 hover:underline">
							Login here
						</a>
					</p>
				</form>
			</section>
		</main>
	);
}

