<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $videos = [
            [
                'view_count' => random_int(100, 10000),
                'playback_count' => random_int(100, 5000),
                'name' => 'Big Buck Bunny',
                'description' => 'Official Blender Foundation movie (Creative Commons license)',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'thumbnail' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/800px-Big_Buck_Bunny_thumbnail_vlc.png',
                'length' => '10:34',
                'tags' => json_encode(['animation', '3D', 'open movie']),
                'user_id' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'view_count' => random_int(50, 8000),
                'playback_count' => random_int(50, 4000),
                'name' => 'Sintel',
                'description' => 'Third official Blender Foundation movie',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                'thumbnail' => 'https://upload.wikimedia.org/wikipedia/en/9/90/Sintel_poster.jpg',
                'length' => '14:48',
                'tags' => json_encode(['fantasy', 'adventure', '3D']),
                'user_id' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'view_count' => random_int(200, 15000),
                'playback_count' => random_int(300, 7000),
                'name' => 'Tears of Steel',
                'description' => 'Blender Foundation live action film',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                'thumbnail' => 'https://mango.blender.org/wp-content/uploads/2013/05/01_thom_celia_bridge.jpg',
                'length' => '12:14',
                'tags' => json_encode(['sci-fi', 'action', 'CGI']),
                'user_id' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'view_count' => random_int(500, 20000),
                'playback_count' => random_int(400, 10000),
                'name' => 'Elephants Dream',
                'description' => 'First open movie by Blender Foundation',
                'video_url' => 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
                'thumbnail' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Elephants_Dream_3_1.jpg/640px-Elephants_Dream_3_1.jpg',
                'length' => '10:54',
                'tags' => json_encode(['animation', 'surreal', 'short film']),
                'user_id' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'view_count' => random_int(300, 12000),
                'playback_count' => random_int(200, 6000),
                'name' => 'Nature Beauty',
                'description' => 'Beautiful nature scenes in 4K resolution',
                'video_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'thumbnail' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Lake_mapourika_NZ.jpeg/640px-Lake_mapourika_NZ.jpeg',
                'length' => '8:24',
                'tags' => json_encode(['nature', '4K', 'landscape']),
                'user_id' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'view_count' => random_int(400, 18000),
                'playback_count' => random_int(300, 9000),
                'name' => 'Caminandes: Llama Drama',
                'description' => 'A short animated film about a llama',
                'video_url' => 'https://download.blender.org/demo/movies/caminandes_grandillama_1080p.mp4',
                'thumbnail' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Caminandes_-_Llamigos.jpg/640px-Caminandes_-_Llamigos.jpg',
                'length' => '2:34',
                'tags' => json_encode(['animation', 'comedy', 'short film']),
                'user_id' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ];

        DB::table('videos')->insert($videos);
    }
}
