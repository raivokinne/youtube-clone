<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Jobs\ProcessVideoUpload;
use App\Jobs\GenerateThumbnail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Pion\Laravel\ChunkUpload\Handler\ContentRangeUploadHandler;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

class VideoController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $videos = Video::all();

        return response()->json(['videos' => $videos]);
    }

    public function handleChunk(Request $request): JsonResponse
    {
        try {
            $receiver = new FileReceiver(
                UploadedFile::fake()->createWithContent('file', $request->getContent()),
                $request,
                ContentRangeUploadHandler::class
            );

            $save = $receiver->receive();

            if ($save->isFinished()) {
                return response()->json([
                    'file' => $save->getFile()->getFilename(),
                    'path' => $save->getFile()->getPathname()
                ]);
            }

            $save->handler();

            return response()->json([
                'message' => 'Chunk processed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error processing chunk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function finalizeUpload(Request $request): JsonResponse
    {
        try {
            $file = new UploadedFile(
                storage_path('app/private/chunks/' . $request->path),
                $request->name
            );

            $videoPath = $this->handleVideoUpload($file);

            $thumbnail = $request->file('metadata.thumbnail');

            $thumbnailPath = null;
            if ($request->has('metadata.thumbnail')) {
                $thumbnailPath = $this->handleThumbnailUpload($thumbnail);
            }

            $userData = [
                'user_id' => auth()->id(),
            ];

            $metadata = [
                'name' => $request->metadata['name'] ?? $file->getClientOriginalName(),
                'description' => $request->metadata['description'] ?? '',
                'category' => $request->metadata['category'] ?? null,
                'tags' => $request->metadata['tags'] ?? [],
                'length' => $request->metadata['length'] ?? '00:00',
            ];

            $videoData = [
                'video_url' => "http://localhost:8000/storage/" . $videoPath,
                'thumbnail' => "http://localhost:8000/storage/" . $thumbnailPath,
                'video' => $request->name
            ];

            $video = Video::createFromRequest($userData, $videoData, $metadata);

            ProcessVideoUpload::dispatch($video);
            GenerateThumbnail::dispatch($video);

            @unlink(storage_path('app/private/chunks/' . $request->path));

            return response()->json([
                'message' => 'Video uploaded and processed successfully',
                'video' => $video->load('categories'),
            ], 201);
        } catch (\Exception $e) {
            if (isset($videoPath)) Storage::delete($videoPath);
            if (isset($thumbnailPath)) Storage::delete($thumbnailPath);

            return response()->json([
                'message' => 'Error processing video upload',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * @param mixed $videoFile
     */
    private function handleVideoUpload($videoFile): string
    {
        $filename = Str::uuid() . '.mp4';
        return $videoFile->storeAs('videos', $filename, 'public');
    }
    /**
     * @param mixed $thumbnail
     */
    private function handleThumbnailUpload($thumbnail): string
    {
        $path = $thumbnail->store('uploads/thumbnails', 'public');
        return $path;
    }
}
