import { useState } from 'react';
import { FiUploadCloud, FiUser } from 'react-icons/fi';
import { authTypography } from '../ui/authStyles';

function ProfileUpload({ preview, onChange }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      onChange({ target: { files: [file] } });
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`group flex flex-col items-center gap-4 rounded-3xl border border-dashed p-6 text-center transition duration-300 ${
        isDragging
          ? 'border-primary bg-rose-50 shadow-[0_0_0_4px_rgba(229,57,53,0.10)]'
          : 'border-rose-200 bg-white/70 hover:border-primary/50 hover:bg-white'
      }`}
    >
      {preview ? (
        <img src={preview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover shadow-soft ring-4 ring-white" />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 text-primary ring-4 ring-white">
          <FiUser size={32} />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-text">
          <FiUploadCloud className="text-primary" size={18} />
          Upload profile image
        </div>
        <p className={authTypography.helper}>Drag and drop an image, or choose one from your device.</p>
      </div>

      <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-within:ring-4 focus-within:ring-primary/10">
        Choose Image
        <input type="file" accept="image/*" className="sr-only" onChange={onChange} />
      </label>

      <p className={authTypography.caption}>JPG, PNG or WEBP. Preview only.</p>
    </div>
  );
}

export default ProfileUpload;
