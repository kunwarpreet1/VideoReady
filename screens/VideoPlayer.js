import React, { useState, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // 🎬 WHERE TO ADD YOUR MOVIE URLS - Change this section
  const { videoTitle, videoUrl, videoDescription, videoGenre } = route.params || {
    videoTitle: 'Morbius',
    // 🔗 REPLACE THIS URL WITH YOUR MOVIE URL
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoDescription: 'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
    videoGenre: 'Action | Thriller | Suspense'
  };

  // Generate a unique video ID
  const videoId = `${videoTitle.replace(/\s+/g, '_')}_${Date.now()}`;
  
  const isDownloaded = useSelector(state => selectIsDownloaded(state, videoId));
  const currentDownload = useSelector(selectCurrentDownload);
  const isCurrentlyDownloading = currentDownload && currentDownload.videoId === videoId;

  // Create HTML content for video player
  const createVideoHTML = (videoUrl) => {
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
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              overflow: hidden;
            }
            video {
              width: 100%;
              height: 100%;
              object-fit: contain;
              background-color: #000;
            }
            .controls {
              position: absolute;
              bottom: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.7);
              padding: 10px;
              border-radius: 5px;
              display: flex;
              gap: 10px;
            }
            .control-btn {
              background: none;
              border: none;
              color: white;
              font-size: 16px;
              cursor: pointer;
              padding: 5px 10px;
            }
          </style>
        </head>
        <body>
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
          >
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <script>
            const video = document.getElementById('videoPlayer');
            
            // Handle fullscreen changes
            video.addEventListener('webkitbeginfullscreen', function() {
              window.ReactNativeWebView.postMessage('fullscreen:true');
            });
            
            video.addEventListener('webkitendfullscreen', function() {
              window.ReactNativeWebView.postMessage('fullscreen:false');
            });
            
            // Handle video events
            video.addEventListener('error', function(e) {
              window.ReactNativeWebView.postMessage('error:' + e.message);
            });
            
            video.addEventListener('loadeddata', function() {
              window.ReactNativeWebView.postMessage('loaded');
            });
            
            // Enable fullscreen on double tap
            let lastTap = 0;
            video.addEventListener('touchend', function(e) {
              const currentTime = new Date().getTime();
              const tapLength = currentTime - lastTap;
              if (tapLength < 500 && tapLength > 0) {
                if (video.webkitSupportsFullscreen) {
                  video.webkitEnterFullscreen();
                }
              }
              lastTap = currentTime;
            });
          </script>
        </body>
      </html>
    `;
  };

  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    
    if (message.startsWith('fullscreen:')) {
      const isFull = message.includes('true');
      setIsFullScreen(isFull);
      
      if (isFull) {
        // Hide status bar and navigation elements in fullscreen
        StatusBar.setHidden(true);
      } else {
        // Show status bar when exiting fullscreen
        StatusBar.setHidden(false);
      }
    } else if (message.startsWith('error:')) {
      Alert.alert('Video Error', 'Failed to load video. Please try again.');
    } else if (message === 'loaded') {
      console.log('Video loaded successfully');
    }
  };

  const handleBackPress = () => {
    if (isFullScreen) {
      // Exit fullscreen first
      webViewRef.current?.postMessage('exitFullscreen');
    } else {
      navigation.goBack();
    }
  };

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
      videoTitle,
      videoUrl,
      videoDescription,
      videoGenre,
    }));

    // Simulate download progress
    let progress = 0;
    const downloadInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(downloadInterval);
        dispatch(completeDownload({ videoId }));
        Alert.alert('Download Complete', `${videoTitle} has been downloaded successfully!`);
      } else {
        dispatch(updateDownloadProgress({ videoId, progress }));
      }
    }, 500);
  };

  const getDownloadButtonText = () => {
    if (isDownloaded) return 'Downloaded';
    if (isCurrentlyDownloading) {
      const progress = currentDownload?.progress || 0;
      return `Downloading ${Math.round(progress)}%`;
    }
    return 'Download';
  };

  const getDownloadButtonIcon = () => {
    if (isDownloaded) return 'check';
    if (isCurrentlyDownloading) return 'spinner';
    return 'download';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001122" />
      
      {/* Back Button above Video Player */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
      
      {/* Video Player Section - WebView */}
      <View style={styles.videoContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: createVideoHTML(videoUrl) }}
          style={styles.video}
          onMessage={onMessage}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Description Section */}
      <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionHeader}>
          <Text style={styles.videoTitle}>{videoTitle}</Text>
          <TouchableOpacity style={styles.likeButton}>
            <FontAwesome name="heart-o" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.videoGenre}>{videoGenre}</Text>
        
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
          <Text style={styles.descriptionText}>{videoDescription}</Text>
        </View>

        <View style={styles.castSection}>
          <Text style={styles.castTitle}>Cast</Text>
          <Text style={styles.castText}>Jared Leto, Matt Smith, Adria Arjona, Jared Harris</Text>
        </View>

        <View style={styles.directorSection}>
          <Text style={styles.directorTitle}>Director</Text>
          <Text style={styles.directorText}>Daniel Espinosa</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001122',
  },
  videoContainer: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: '#001122',
    marginTop: 0,
  },
  video: {
    flex: 1,
    backgroundColor: '#001122',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
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