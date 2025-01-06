class AudioPlayer {
    constructor() {
        this.isPlaying = false;
        try {
            this.audio = new Audio('周杰伦 - 反方向的钟.mp3');
            console.log('Audio file loaded successfully');
            this.init();
        } catch (error) {
            console.error('Failed to load audio file:', error);
            alert('无法加载音频文件，请检查文件路径');
        }
    }

    init() {
        try {
            const musicButton = document.getElementById('music-button');
            if (!musicButton) {
                throw new Error('Music button not found');
            }
            
            musicButton.addEventListener('click', () => this.toggleMusic());
        } catch (error) {
            console.error('Audio player initialization failed:', error);
        }
    }

    toggleMusic() {
        try {
            const musicButton = document.getElementById('music-button');
            if (!musicButton) {
                throw new Error('Music button not found');
            }

            if (this.isPlaying) {
                this.audio.pause();
                musicButton.innerHTML = '<i class="fas fa-music"></i>';
            } else {
                this.audio.play().catch(error => {
                    console.error('Audio playback failed:', error);
                    alert('音频播放失败，请检查文件路径');
                });
                musicButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            this.isPlaying = !this.isPlaying;
        } catch (error) {
            console.error('Error toggling music:', error);
        }
    }
}

// Initialize audio player
document.addEventListener('DOMContentLoaded', () => {
    new AudioPlayer();
});
