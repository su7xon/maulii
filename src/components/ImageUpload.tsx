import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X, CheckCircle2, AlertCircle as AlertCircleIcon } from 'lucide-react';
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
  const [pendingFile, setPendingFile] = useState<File | null>(null); // File waiting for confirmation

  const pick = (f: File | undefined) => {
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
    // Upload directly — confirmation shown in this same component UI below
    setPendingFile(f);
  };

  const confirmUpload = async () => {
    const f = pendingFile;
    if (!f) return;
    setPendingFile(null);
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

  const cancelUpload = () => {
    setPendingFile(null);
    setErr('');
  };

  return (
    <div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">
        {label} {isCloudConfigured ? '' : '(local)'}
      </span>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ya file upload karo"
          className="flex-1 min-w-0 text-[16px] sm:text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#e42529] bg-white transition placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || pendingFile !== null}
          className="shrink-0 flex items-center justify-center gap-1.5 bg-[#e42529] hover:bg-[#c81f23] disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg transition active:scale-95"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? '...' : pendingFile ? 'Selected' : 'Upload'}
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

      {/* Confirmation UI when a file is selected but not yet uploaded */}
      {pendingFile && (
        <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:items-center">
          <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <AlertCircleIcon className="w-3 h-3" /> Nayi image select ki hai — upload karna confirm karo?
          </span>
          <div className="flex gap-1.5 sm:flex-1 justify-end">
            <button
              onClick={cancelUpload}
              className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmUpload}
              disabled={uploading}
              className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-[#e42529] hover:bg-[#c81f23] disabled:opacity-60 transition active:scale-95"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
              {' '}
              {uploading ? 'Uploading…' : 'Confirm Upload'}
            </button>
          </div>
        </div>
      )}

      {err && <p className="text-[11px] text-red-600 font-medium mt-1">{err}</p>}
      {!isCloudConfigured && (
        <p className="text-[10px] text-amber-600 font-medium mt-1">
          Firebase keys nahi mili — upload sirf is browser me dikhega. Sabko dikhane ke liye .env me Firebase config + Storage enable karo.
        </p>
      )}
      {value && (
        <img src={value} alt="preview" className="mt-2 w-20 h-20 object-contain bg-gray-50 border border-gray-200 rounded-lg" />
      )}
    </div>
  );
};
