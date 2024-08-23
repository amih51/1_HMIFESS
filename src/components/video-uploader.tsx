import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';

/**
 * A component to upload a video to Cloudinary.
 *
 * @param {{ onUpload: (url: string) => void }} props
 * The props of the component.
 * @param {(url: string) => void} props.onUpload
 * The function to call when the video is uploaded.
 * @returns {JSX.Element} The component.
 */
const VideoUploader = ({ onUpload }: { onUpload: (url: string) => void }): JSX.Element => {
  const [uploading, setUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      options={{
        sources: ['local'],
        resourceType: 'video',
        maxFileSize: 15_000_000, // 15MB
      }}
      onUpload={(result, widget) => {
        setUploading(false);
        if (typeof result.info === 'object' && 'secure_url' in result.info) {
            onUpload(result.info.secure_url);
          } else {
            // handle the case where result.info is not an object with a secure_url property
            console.error('Error uploading video:', result.info);
          }
        widget.close();
      }}
    >
      {({ open }) => (
        <button 
          onClick={() => {
            setUploading(true);
            open();
          }}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      )}
    </CldUploadWidget>
  );
};

export default VideoUploader;