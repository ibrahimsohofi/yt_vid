const express = require('express');
const { Client } = require('youtubei');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const youtube = new Client();

// Enable CORS for all routes
app.use(cors());

app.get('/info', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Please provide a YouTube video URL.' });
    }

    if (!isValidYouTubeUrl(videoUrl)) {
        return res.status(400).json({ error: 'Invalid YouTube video URL.' });
    }

    try {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube video URL.' });
        }

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
        console.error('Error fetching video info:', error); // Log full error object
        res.status(500).json({ error: 'Error fetching video info: ' + error.message });
    }
});

// Function to extract video ID from the URL
function extractVideoId(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
}

// Function to validate YouTube video URL format
function isValidYouTubeUrl(url) {
    const regex = /^(https?\:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|e\/|watch\?v%3D)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
