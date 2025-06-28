import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { selectDownloads, deleteDownload } from '../src/redux/slice/downloadSlice';
import DownloadOptionsModal from '../components/DownloadOptionsModal';

const DownloadedVideos = ({ navigation }) => {
  const dispatch = useDispatch();
  const downloads = useSelector(selectDownloads);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    setModalVisible(true);
  };

  const handleDelete = () => {
    if (selectedVideo) {
      Alert.alert(
        'Delete Video',
        `Are you sure you want to delete "${selectedVideo.videoTitle}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deleteDownload({ videoId: selectedVideo.videoId }));
              setModalVisible(false);
              setSelectedVideo(null);
            },
          },
        ]
      );
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => handleVideoPress(item)}
    >
      <View style={styles.videoThumbnail}>
        <Image
          source={require('../assets/images/homeassets/avtar.png')}
          style={styles.thumbnailImage}
        />
        <View style={styles.playIcon}>
          <FontAwesome name="play" size={16} color="#fff" />
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.videoTitle}
        </Text>
        <Text style={styles.videoGenre} numberOfLines={1}>
          {item.videoGenre}
        </Text>
        <Text style={styles.downloadDate}>
          Downloaded: {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => handleVideoPress(item)}
      >
        <FontAwesome name="ellipsis-v" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="download" size={64} color="#666" />
      <Text style={styles.emptyTitle}>No Downloads Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your downloaded videos will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001122" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloaded Videos</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Video List */}
      <FlatList
        data={downloads}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.videoId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Options Modal */}
      <DownloadOptionsModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedVideo(null);
        }}
        onDelete={handleDelete}
        video={selectedVideo}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001122',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#1a2332',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 15,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoGenre: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
  },
  downloadDate: {
    color: '#888',
    fontSize: 12,
  },
  menuButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DownloadedVideos; 