import { useState } from 'react';
import ImageUploader from './image-uploader';
import VideoUploader from './video-uploader';
import TextUploader from './text-uploader';

interface MediaUrl {
  url: string;
  type: 'image' | 'video';
}

/**
 * A component to create a new post.
 *
 * @param {{ onSubmit: (data: { content: string, mediaUrls: MediaUrl[] }) => void }} props
 * The props of the component.
 * @param {() => void} props.onSubmit
 * The function to call when the post is created.
 * @returns {JSX.Element} The component.
 */
const PostCreator = ({ onSubmit }: { onSubmit: (data: { content: string, mediaUrls: MediaUrl[] }) => void }): JSX.Element => {
  const [content, setContent] = useState<string>('');
  const [mediaUrls, setMediaUrls] = useState<MediaUrl[]>([]);

  /**
   * Handle the change of the text of the post.
   *
   * @param {string} text The new text of the post.
   */
  const handleTextChange = (text: string): void => {
    setContent(text);
  };

  /**
   * Handle the upload of a new image.
   *
   * @param {string} url The URL of the image.
   */
  const handleImageUpload = (url: string): void => {
    setMediaUrls([...mediaUrls, { url, type: 'image' }]);
  };

  /**
   * Handle the upload of a new video.
   *
   * @param {string} url The URL of the video.
   */
  const handleVideoUpload = (url: string): void => {
    setMediaUrls([...mediaUrls, { url, type: 'video' }]);
  };

  /**
   * Handle the submission of the post.
   */
  const handleSubmit = (): void => {
    onSubmit({
      content,
      mediaUrls,
    });
  };

  return (
    <div>
      <TextUploader onChange={handleTextChange} />
      <ImageUploader onUpload={handleImageUpload} />
      <VideoUploader onUpload={handleVideoUpload} />
      <button onClick={handleSubmit}>Create Post</button>
    </div>
  );
};

export default PostCreator;