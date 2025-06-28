# Redux Setup for VideoReady App

## Overview
This document explains the Redux setup for managing video downloads in the VideoReady app.

## File Structure
```
src/
├── redux/
│   ├── slice/
│   │   └── downloadSlice.js
│   └── store/
│       └── store.js
screens/
├── DownloadedVideos.js
└── VideoPlayer.js
components/
└── DownloadOptionsModal.js
```

## Redux Store Configuration

### Store Setup (`src/redux/store/store.js`)
- Configured with Redux Toolkit
- Includes the download slice
- Configured middleware to handle serializable state

### Download Slice (`src/redux/slice/downloadSlice.js`)
The download slice manages the state for video downloads with the following features:

#### State Structure
```javascript
{
  downloads: [], // Array of completed downloads
  downloading: false, // Boolean indicating if a download is in progress
  currentDownload: null // Current download object with progress
}
```

#### Actions
- `startDownload`: Initiates a new download
- `updateDownloadProgress`: Updates download progress
- `completeDownload`: Marks download as complete
- `deleteDownload`: Removes a download from the list
- `reDownload`: Removes and re-downloads a video
- `cancelDownload`: Cancels current download
- `downloadFailed`: Handles download failures
- `clearAllDownloads`: Clears all downloads

#### Selectors
- `selectDownloads`: Get all downloads
- `selectDownloading`: Check if downloading
- `selectCurrentDownload`: Get current download
- `selectDownloadById`: Get specific download by ID
- `selectIsDownloaded`: Check if video is downloaded

## Screens

### VideoPlayer Screen
- Displays video with download button
- Shows download progress in real-time
- Prevents duplicate downloads
- Updates button state based on download status

### DownloadedVideos Screen (Screen 31)
- Lists all downloaded videos
- Shows video thumbnails, titles, genres, and download dates
- Provides menu options for each video
- Empty state when no downloads exist

### DownloadOptionsModal (Screen 32)
- Custom popup modal with video options
- Re-download option with confirmation
- Delete option with confirmation
- Displays video information

## Usage

### Starting a Download
```javascript
dispatch(startDownload({
  videoId: 'unique_id',
  videoTitle: 'Video Title',
  videoUrl: 'video_url',
  videoDescription: 'Description',
  videoGenre: 'Genre'
}));
```

### Checking Download Status
```javascript
const isDownloaded = useSelector(state => selectIsDownloaded(state, videoId));
const currentDownload = useSelector(selectCurrentDownload);
```

### Deleting a Download
```javascript
dispatch(deleteDownload({ videoId: 'unique_id' }));
```

### Re-downloading
```javascript
dispatch(reDownload({ videoId: 'unique_id' }));
```

## Navigation
- Access downloads via drawer menu: "Downloaded Videos"
- Download button available in VideoPlayer screen
- Modal options accessible from DownloadedVideos screen

## Features
- ✅ Real-time download progress
- ✅ Duplicate download prevention
- ✅ Download status indicators
- ✅ Delete functionality
- ✅ Re-download functionality
- ✅ Persistent state management
- ✅ Clean UI with dark theme
- ✅ Confirmation dialogs
- ✅ Empty state handling

## Dependencies
- `@reduxjs/toolkit`: Redux Toolkit for simplified Redux setup
- `react-redux`: React bindings for Redux

## Installation
```bash
npm install @reduxjs/toolkit react-redux
```

The Redux store is automatically provided at the app level through the AppNavigator component. 