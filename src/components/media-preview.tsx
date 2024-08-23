/**
 * Displays a list of media URLs as either an image or a video.
 * @param {{ urls: string[] }} props
 * @returns {JSX.Element}
 */
const MediaPreview: React.FC<{ urls: string[] }> = ({ urls }) => {
    return (
      <div>
        {urls.map((url, index) => {
          if (url.includes('image')) {
            return <img key={index} src={url} alt={`Uploaded media ${index}`} style={{ maxWidth: '100%', maxHeight: '300px' }} />;
          } else if (url.includes('video')) {
            return (
              <video key={index} controls style={{ maxWidth: '100%', maxHeight: '300px' }}>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
          return null;
        })}
      </div>
    );
  };
  
  export default MediaPreview;