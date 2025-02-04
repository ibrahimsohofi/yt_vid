const scrapeYoutube = require('scrape-youtube');

async function getVideoInfo(videoUrl) {
    const videoId = videoUrl.split('v=')[1]; // Extract video ID from URL
    const results = await scrapeYoutube.search(videoId);

    if (results.videos.length > 0) {
        const video = results.videos[0];
        console.log({
            title: video.title,
            description: video.description,
            duration: video.duration,
            views: video.views,
            uploadDate: video.uploaded,
            author: video.channel.name,
            thumbnail: video.thumbnail,
            format:video.formats
        });
    } else {
        console.log('Video not found.');
    }
}

// Example usage
const videoUrl = 'https://www.youtube.com/watch?v=pwo4CgWt_lM';

getVideoInfo(videoUrl);
