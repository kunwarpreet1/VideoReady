import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { 
  startDownload, 
  completeDownload, 
  updateDownloadProgress,
  selectIsDownloaded,
  selectCurrentDownload 
} from '../src/redux/slice/downloadSlice';
import VideoPlayerHeader from '../components/VideoPlayerHeader';

const { width } = Dimensions.get('window');

// Video data with the provided URL for all videos
const VIDEOS = {
  'Morbius': {
    title: 'Morbius',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
    genre: 'Action | Thriller | Suspense',
    cast: 'Jared Leto, Matt Smith, Adria Arjona, Jared Harris',
    director: 'Daniel Espinosa'
  },
  'John Wick': {
    title: 'John Wick',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.',
    genre: 'Action | Crime | Thriller',
    cast: 'Keanu Reeves, Michael Nyqvist, Alfie Allen, Willem Dafoe',
    director: 'Chad Stahelski'
  },
  'Kabir Singh': {
    title: 'Kabir Singh',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'A brilliant yet alcoholic surgeon goes down a self-destructive path when the love of his life gets married to someone else.',
    genre: 'Drama | Romance',
    cast: 'Shahid Kapoor, Kiara Advani, Arjan Bajwa, Suresh Oberoi',
    director: 'Sandeep Reddy Vanga'
  }
};

const VideoPlayerScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const webViewRef = React.useRef();
  
  // Get video data from navigation params
  const { videoTitle = 'Morbius' } = route.params || {};
  const videoData = VIDEOS[videoTitle] || VIDEOS['Morbius'];
  
  const { title, video, description, genre, cast, director } = videoData;

  // Create unique ID for download tracking
  const videoId = `${title.replace(/\s+/g, '_')}_${Date.now()}`;
  
  // Check if video is downloaded
  const isDownloaded = useSelector(state => selectIsDownloaded(state, videoId));
  const currentDownload = useSelector(selectCurrentDownload);
  const isCurrentlyDownloading = currentDownload && currentDownload.videoId === videoId;

  // Enhanced HTML for video player with better fullscreen support
  const createVideoHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #000;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }
            video {
              width: 100%;
              height: 100%;
              object-fit: contain;
              background-color: #000;
            }
            .video-container {
              width: 100%;
              height: 100%;
              position: relative;
            }
            .fullscreen-controls {
              position: absolute;
              top: 10px;
              right: 10px;
              z-index: 1000;
              display: none;
            }
            .fullscreen-controls button {
              background: rgba(0,0,0,0.7);
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            .video-container:fullscreen .fullscreen-controls {
              display: block;
            }
            .video-container:-webkit-full-screen .fullscreen-controls {
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="video-container">
            <video 
              id="videoPlayer"
              controls 
              autoplay 
              playsinline
              webkit-playsinline
              x5-playsinline
              x5-video-player-type="h5"
              x5-video-player-fullscreen="true"
              x5-video-orientation="landscape"
              onwebkitbeginfullscreen="handleFullscreenChange(true)"
              onwebkitendfullscreen="handleFullscreenChange(false)"
              onfullscreenchange="handleFullscreenChange(!!document.fullscreenElement)"
              onwebkitfullscreenchange="handleFullscreenChange(!!document.webkitFullscreenElement)"
            >
              <source src="${video}" type="video/mp4">
              <p>Your browser does not support the video tag.</p>
            </video>
            <div class="fullscreen-controls">
              <button onclick="exitFullscreen()">Exit Fullscreen</button>
            </div>
          </div>
          
          <script>
            function handleFullscreenChange(isFullscreen) {
              window.ReactNativeWebView.postMessage('fullscreen:' + isFullscreen);
            }
            
            function exitFullscreen() {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
              }
            }
            
            function toggleFullscreen() {
              const video = document.getElementById('videoPlayer');
              if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                if (video.requestFullscreen) {
                  video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                  video.webkitRequestFullscreen();
                }
              } else {
                exitFullscreen();
              }
            }
            
            // Handle messages from React Native
            window.addEventListener('message', function(event) {
              if (event.data === 'toggleFullscreen') {
                toggleFullscreen();
              }
            });
            
            // Handle orientation changes
            window.addEventListener('orientationchange', function() {
              window.ReactNativeWebView.postMessage('orientation:' + window.orientation);
            });
            
            // Handle video events
            document.getElementById('videoPlayer').addEventListener('loadedmetadata', function() {
              window.ReactNativeWebView.postMessage('video:loaded');
            });
            
            document.getElementById('videoPlayer').addEventListener('error', function(e) {
              window.ReactNativeWebView.postMessage('video:error:' + e.target.error.message);
            });
          </script>
        </body>
      </html>
    `;
  };

  // Handle messages from WebView
  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    
    if (message.startsWith('fullscreen:')) {
      const isFull = message.includes('true');
      setIsFullScreen(isFull);
      
      if (isFull) {
        StatusBar.setHidden(true);
      } else {
        StatusBar.setHidden(false);
      }
    } else if (message.startsWith('orientation:')) {
      // Handle orientation changes
      const orientation = message.split(':')[1];
      console.log('Orientation changed to:', orientation);
    } else if (message.startsWith('video:error:')) {
      const error = message.split(':')[2];
      Alert.alert('Video Error', `Failed to load video: ${error}`);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    if (isFullScreen) {
      // Exit fullscreen first
      StatusBar.setHidden(false);
      setIsFullScreen(false);
    } else {
      navigation.goBack();
    }
  };

  // Handle download button press
  const handleDownload = () => {
    if (isDownloaded) {
      Alert.alert('Already Downloaded', 'This video is already downloaded.');
      return;
    }

    if (isCurrentlyDownloading) {
      Alert.alert('Downloading', 'This video is currently being downloaded.');
      return;
    }

    // Start download
    dispatch(startDownload({
      videoId,
      videoTitle: title,
      videoUrl: video,
      videoDescription: description,
      videoGenre: genre,
    }));

    // Simulate download progress
    let progress = 0;
    const downloadInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(downloadInterval);
        dispatch(completeDownload({ videoId }));
        Alert.alert('Download Complete', `${title} has been downloaded successfully!`);
      } else {
        dispatch(updateDownloadProgress({ videoId, progress }));
      }
    }, 500);
  };

  // Get download button text
  const getDownloadButtonText = () => {
    if (isDownloaded) return 'Downloaded';
    if (isCurrentlyDownloading) {
      const progress = currentDownload?.progress || 0;
      return `Downloading ${Math.round(progress)}%`;
    }
    return 'Download';
  };

  // Get download button icon
  const getDownloadButtonIcon = () => {
    if (isDownloaded) return 'check';
    if (isCurrentlyDownloading) return 'spinner';
    return 'download';
  };

  // Video player for both platforms
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001122" />
      
      <SafeAreaView style={styles.headerContainer}>
        <VideoPlayerHeader />
      </SafeAreaView>
      
      <View style={styles.videoContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: createVideoHTML() }}
          style={styles.video}
          onMessage={onMessage}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          allowsBackForwardNavigationGestures={false}
          allowsLinkPreview={false}
          onShouldStartLoadWithRequest={() => true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
          }}
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.fullscreenButton}
          onPress={() => {
            if (webViewRef.current) {
              webViewRef.current.postMessage('toggleFullscreen');
            }
          }}
        >
          <FontAwesome 
            name={isFullScreen ? "compress" : "expand"} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionHeader}>
          <Text style={styles.videoTitle}>{title}</Text>
          <TouchableOpacity style={styles.likeButton}>
            <FontAwesome name="heart-o" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.videoGenre}>{genre}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="play" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Watch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Add to Playlist</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              isDownloaded && styles.downloadedButton,
              isCurrentlyDownloading && styles.downloadingButton
            ]}
            onPress={handleDownload}
            disabled={isCurrentlyDownloading}
          >
            <FontAwesome 
              name={getDownloadButtonIcon()} 
              size={16} 
              color={isDownloaded ? "#4CAF50" : "#fff"} 
            />
            <Text style={[
              styles.actionButtonText,
              isDownloaded && styles.downloadedText
            ]}>
              {getDownloadButtonText()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome name="share" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        <View style={styles.castSection}>
          <Text style={styles.castTitle}>Cast</Text>
          <Text style={styles.castText}>{cast}</Text>
        </View>

        <View style={styles.directorSection}>
          <Text style={styles.directorTitle}>Director</Text>
          <Text style={styles.directorText}>{director}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001122',
  },
  headerContainer: {
    backgroundColor: '#001122',
  },
  videoContainer: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoGenre: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  downloadedButton: {
    opacity: 0.7,
  },
  downloadingButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  downloadedText: {
    color: '#4CAF50',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  castSection: {
    marginBottom: 20,
  },
  castTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  castText: {
    color: '#ccc',
    fontSize: 14,
  },
  directorSection: {
    marginBottom: 30,
  },
  directorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  directorText: {
    color: '#ccc',
    fontSize: 14,
  },
});

export default VideoPlayerScreen; 