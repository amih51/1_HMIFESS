import { CldUploadWidget } from 'next-cloudinary';

/**
 * A component to upload an image to Cloudinary.
 *
 * @param {{ onUpload: (url: string) => void }} props
 * The props of the component.
 * @param {(url: string) => void} props.onUpload
 * The function to call when the image is uploaded.
 * @returns {JSX.Element} The component.
 */
const ImageUploader: React.FC<{ onUpload: (url: string) => void }> = ({ onUpload }) => {
  return (
    <CldUploadWidget
      uploadPreset="ml_default"
      onUpload={(result, widget) => {
        onUpload(result.info.secure_url);
        widget.close();
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>
          Upload Image
        </button>
      )}
    </CldUploadWidget>
  );
};

export default ImageUploader;