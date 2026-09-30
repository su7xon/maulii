import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { uploadStoreImage } from '../lib/cloudStore';
import { isCloudConfigured } from '../lib/firebase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Image', folder = 'mauli' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setErr('Sirf image file chuno (jpg/png/webp).');
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErr('File 4MB se chhoti rakho.');
      return;
    }
    setErr('');
    setUploading(true);
    try {
      const url = await uploadStoreImage(f, folder);
      onChange(url);
    } catch {
      setErr('Upload fail. Dobara try karo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.08em] mb-1.5 block">
        {label} {isCloudConfigured ? '' : '(local)'}
      </span>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ya file upload karo"
          className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#e42529] focus:ring-2 focus:ring-[#e42529]/15 bg-gray-50 focus:bg-white transition placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 bg-[#141414] hover:bg-black disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition active:scale-95"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? '...' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {err && <p className="text-[11px] text-red-600 font-medium mt-1">{err}</p>}
      {!isCloudConfigured && (
        <p className="text-[10px] text-amber-600 font-medium mt-1">
          Firebase keys nahi mili — upload sirf is browser me dikhega. Sabko dikhane ke liye .env me Firebase config + Storage enable karo.
        </p>
      )}
      {value && (
        <img src={value} alt="preview" className="mt-2 w-24 h-24 object-contain bg-gray-50 border border-gray-200 rounded-2xl" />
      )}
    </div>
  );
};
