<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Video extends Model
{
    protected $fillable = [
        'video',
        'view_count',
        'playback_count',
        'name',
        'description',
        'video_url',
        'thumbnail',
        'length',
        'tags',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'view_count' => 'integer',
        'playback_count' => 'integer',
    ];
    /**
     * @return BelongsToMany<Catergory,Video>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_video');
    }


    /**
     * @return BelongsTo<User,Video>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    /**
     * @return HasMany<VideoFormat,Video>
     */
    public function formats(): HasMany
    {
        return $this->hasMany(VideoFormat::class);
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'likeable')->where('type', 'like');
    }

    public function dislikes(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'likeable')->where('type', 'dislike');
    }
    /**
     * @return MorphMany<Like,Video>
     */
    public function likeModel(): MorphMany
    {
        return $this->morphMany(Reaction::class, 'likeable');
    }
    /**
     * @param mixed $type
     */
    public function updateLikeStatus($type): void
    {
        $existingRating = $this->likeModel()->where('user_id', auth()->id())->first();

        if ($existingRating) {
            if ($existingRating->type === $type) {
                $existingRating->delete();
            } else {
                $existingRating->update([
                    'type' => $type
                ]);
            }
        } else {
            $this->likeModel()->create([
                'user_id' => auth()->id(),
                'type' => $type
            ]);
        }
    }
    /**
     * @param mixed $userData
     * @param mixed $videoData
     * @param mixed $metadata
     */
    public static function createFromRequest($userData, $videoData, $metadata): self
    {
        $lengthInSeconds = self::convertLengthToSeconds($metadata['length']);

        $video = self::create([
            'user_id' => $userData['user_id'],
            'video' => $videoData['video'],
            'name' => $metadata['name'],
            'description' => $metadata['description'],
            'video_url' => $videoData['video_url'],
            'thumbnail' => $videoData['thumbnail'],
            'length' => $lengthInSeconds,
            'tags' => $metadata['tags'],
            'view_count' => 0,
            'playback_count' => 0,
        ]);

        if (!empty($metadata['category'])) {
            $category = Category::firstOrCreate(
                ['name' => $metadata['category']],
                ['slug' => Str::slug($metadata['category'])]
            );
            $video->categories()->attach($category->id);
        }

        return $video;
    }

    private static function convertLengthToSeconds(string $length): int
    {
        $parts = explode(':', $length);
        return ($parts[0] * 60) + $parts[1];
    }

    public function formatLength(): string
    {
        $minutes = floor($this->length / 60);
        $seconds = $this->length % 60;
        return sprintf('%02d:%02d', $minutes, $seconds);
    }
}
