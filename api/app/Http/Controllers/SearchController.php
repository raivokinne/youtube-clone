<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function search(Request $request): JsonResponse
    {
        if ($request->has('query')) {
            $query = trim($request->query('query'));

            $videos = Video::whereHas('categories', function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%');
            })->get();

            return response()->json(['videos' => $videos]);
        }

        return response()->json(['message' => 'No query provided'], 400);
    }
}
