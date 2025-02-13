<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function uploadThumbnail(Request $request): JsonResponse
    {
        $file = $request->file('file');
        $path = $file->store('uploads/thumbnails', 'public');
        return response()->json(['path' => $path]);
    }
}
