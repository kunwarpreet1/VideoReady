import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  downloads: [],
  downloading: false,
  currentDownload: null,
};

const downloadSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    // Start downloading a video
    startDownload: (state, action) => {
      const { videoId, videoTitle, videoUrl, videoDescription, videoGenre } = action.payload;
      
      // Check if video is already downloaded
      const existingDownload = state.downloads.find(download => download.videoId === videoId);
      if (existingDownload) {
        return; // Don't start download if already exists
      }

      state.downloading = true;
      state.currentDownload = {
        videoId,
        videoTitle,
        videoUrl,
        videoDescription,
        videoGenre,
        progress: 0,
        status: 'downloading',
        timestamp: new Date().toISOString(),
      };
    },

    // Update download progress
    updateDownloadProgress: (state, action) => {
      const { videoId, progress } = action.payload;
      if (state.currentDownload && state.currentDownload.videoId === videoId) {
        state.currentDownload.progress = progress;
      }
    },

    // Complete download
    completeDownload: (state, action) => {
      const { videoId } = action.payload;
      
      if (state.currentDownload && state.currentDownload.videoId === videoId) {
        // Add to downloads list
        state.downloads.push({
          ...state.currentDownload,
          status: 'completed',
          progress: 100,
        });
        
        // Reset current download
        state.downloading = false;
        state.currentDownload = null;
      }
    },

    // Delete download
    deleteDownload: (state, action) => {
      const { videoId } = action.payload;
      state.downloads = state.downloads.filter(download => download.videoId !== videoId);
    },

    // Re-download (remove and start fresh)
    reDownload: (state, action) => {
      const { videoId } = action.payload;
      // Find the download to re-download before removing it
      const downloadToRedownload = state.downloads.find(download => download.videoId === videoId);
      if (downloadToRedownload) {
        // Remove existing download
        state.downloads = state.downloads.filter(download => download.videoId !== videoId);
        
        // Start re-download
        state.downloading = true;
        state.currentDownload = {
          ...downloadToRedownload,
          progress: 0,
          status: 'downloading',
          timestamp: new Date().toISOString(),
        };
      }
    },

    // Cancel download
    cancelDownload: (state) => {
      state.downloading = false;
      state.currentDownload = null;
    },

    // Download failed
    downloadFailed: (state, action) => {
      const { videoId, error } = action.payload;
      if (state.currentDownload && state.currentDownload.videoId === videoId) {
        state.currentDownload.status = 'failed';
        state.currentDownload.error = error;
      }
      state.downloading = false;
    },

    // Clear all downloads
    clearAllDownloads: (state) => {
      state.downloads = [];
      state.downloading = false;
      state.currentDownload = null;
    },
  },
});

export const {
  startDownload,
  updateDownloadProgress,
  completeDownload,
  deleteDownload,
  reDownload,
  cancelDownload,
  downloadFailed,
  clearAllDownloads,
} = downloadSlice.actions;

// Selectors
export const selectDownloads = (state) => state.downloads.downloads;
export const selectDownloading = (state) => state.downloads.downloading;
export const selectCurrentDownload = (state) => state.downloads.currentDownload;
export const selectDownloadById = (state, videoId) => 
  state.downloads.downloads.find(download => download.videoId === videoId);
export const selectIsDownloaded = (state, videoId) => 
  state.downloads.downloads.some(download => download.videoId === videoId);

export default downloadSlice.reducer; 