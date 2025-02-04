const express = require('express');
const { Client } = require('youtubei');

const app = express();
const port = process.env.PORT || 3000;

const youtube = new Client();

app.use(express.json());

app.post('/get-video-info', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Please provide a YouTube video URL.' });
    }

    try {
        const videoId = extractVideoId(videoUrl);
        const video = await youtube.getVideo(videoId);

        res.json({
            title: video.title,
            description: video.description,
            duration: video.duration,
            views: video.viewCount,
            uploadDate: video.uploadDate,
            author: video.channel.name,
            thumbnail: video.thumbnails[0].url,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching video info: ' + error.message });
    }
});

function extractVideoId(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
}

// Example usage (comment this out before deploying if you don't want automatic call)
// app.get('/', (req, res) => {
//     const videoId = 'm4RnrPzo3hA'; // Replace with a valid YouTube video ID
//     getVideoInfo(videoId).catch(error => console.error('Unhandled promise rejection:', error));
//     res.send('Fetching video info...');
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
 