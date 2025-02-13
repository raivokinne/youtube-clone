<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lastname' => 'required|string|min:3|max:255',
            'firstname' => 'required|string|min:3|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'lastname' => $validated['lastname'],
            'firstname' => $validated['firstname'],
            'password' => Hash::make($validated['password'])
        ]);

        event(new Registered($user));

        Auth::login($user);

        $token = $user->createToken('access-token-12345')->plainTextToken;

        return response()->json([
            'succes' => true,
            'message' => 'User registerd and logged in successfully',
            'user_id' => $user->id,
            'token' => $token
        ]);
    }
}
