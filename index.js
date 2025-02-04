const { Client } = require('youtubei');

async function getVideoInfo(videoId) {
    const youtube = new Client();
    const video = await youtube.getVideo(videoId);

    console.log({
        title: video.title,
        description: video.description,
        duration: video.duration,
        views: video.viewCount,
        uploadDate: video.uploadDate,
        author: video.channel.name,
        thumbnail: video.thumbnails[0].url,
    });
}

// Example usage
const videoId = 'm4RnrPzo3hA'; // Replace with a valid YouTube video ID
getVideoInfo(videoId);