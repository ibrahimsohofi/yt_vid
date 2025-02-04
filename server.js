const { exec } = require('child_process');

function getVideoInfo(videoUrl) {
    exec(`python3 -c "from pytube import YouTube; yt = YouTube('${videoUrl}'); print(yt.title)"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Video Title: ${stdout}`);
    });
}

// Example usage
const videoUrl = 'https://www.youtube.com/watch?v=pwo4CgWt_lM';
getVideoInfo(videoUrl);