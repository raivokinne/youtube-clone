<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SessionController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required'
        ]);

        $user = User::where('username', $validated['username'])->first();

        if ($user && Hash::check($validated['password'], $user['password'])) {
            Auth::login($user);
            $token = $user->createToken('access-token-12345')->plainTextToken;

            return response()->json(['success' => true, 'message' => 'Login successful', 'token' => $token]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid creadentials']);
    }
    /**
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Successfully logout']);
    }
}
