<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('login', [SessionController::class, 'store']);
Route::post('register', [RegisterController::class, 'store']);
Route::get('/videos/search', [SearchController::class, 'search']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('videos', [VideoController::class, 'index']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::post('/upload/thumbnail', [UploadController::class, 'uploadThumbnail']);
    Route::post('/videos/upload/chunk', [VideoController::class, 'handleChunk']);
    Route::post('/videos/upload/finalize', [VideoController::class, 'finalizeUpload']);

    Route::get('logout', [SessionController::class, 'destroy']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
