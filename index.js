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

    const videoId = extractVideoId(videoUrl);
    console.log('Received video URL:', videoUrl); // Log the URL
    console.log('Extracted video ID:', videoId); // Log the extracted video ID

    if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube video URL.' });
    }

    try {
        const video = await youtube.getVideo(videoId); // Ensure that videoId is correctly passed

        // Ensure the video object exists before accessing its properties
        if (!video) {
            return res.status(500).json({ error: 'Failed to fetch video info.' });
        }

        res.json({
            title: video.title,
            description: video.description,
            duration: video.duration,
            views: video.viewCount,
            uploadDate: video.uploadDate,
            author: video.channel.name,
            thumbnail: video.thumbnails[0]?.url,  // Use optional chaining for safety
        });
    } catch (error) {
        console.error('Error fetching video info:', error); // Log the full error object
        res.status(500).json({ error: 'Error fetching video info: ' + error.message });
    }
});



// Function to extract video ID from the URL
function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        // Check for valid YouTube URL structure
        const videoId = urlObj.searchParams.get('v');
        console.log(videoId)
        if (videoId) {
            return videoId;
        } else {
            // Try extracting the video ID from the URL path
            const pathParts = urlObj.pathname.split('/');
            const videoIdFromPath = pathParts[pathParts.length - 1];
            return videoIdFromPath.length === 11 ? videoIdFromPath : null;
        }
    } catch (error) {
        return null;
    }
}


// Function to validate YouTube video URL format
function isValidYouTubeUrl(url) {
    const regex = /^(https?\:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|e\/|watch\?v%3D)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
