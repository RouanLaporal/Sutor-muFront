var stream = document.getElementById('stream')
stream.addEventListener('click', () => {
    fetch("http://localhost:3000")
        .then(response => {
            if (flvjs.isSupported()) {
                var videoElement = document.getElementById('videoElement');
                var flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: 'http://localhost:8000/live/STREAM_NAME.flv'
                });
                flvPlayer.attachMediaElement(videoElement);
                flvPlayer.load();
                flvPlayer.play();
            }
        })
})