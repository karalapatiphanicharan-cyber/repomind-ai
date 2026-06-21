'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadCard() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-surface border border-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="space-y-8">
          {/* Upload Area */}
          <div className="relative">
            <label
              htmlFor="zip-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <Upload className="w-10 h-10 text-secondary-text group-hover:text-accent mb-4 transition-colors" />
                <p className="mb-2 text-sm text-primary-text font-medium">
                  {fileName ? 'Selected file:' : 'Drag & Drop your ZIP file here'}
                </p>
                <p className="text-xs text-secondary-text mb-4">
                  {fileName ? fileName : 'Supported format: .zip'}
                </p>
                {!fileName && (
                  <div className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium group-hover:border-accent transition-colors">
                    Choose ZIP File
                  </div>
                )}
              </div>
              <input
                id="zip-upload"
                type="file"
                className="hidden"
                accept=".zip"
                onChange={handleFileChange}
              />
            </label>
            {fileName && (
              <div className="mt-4 flex items-center justify-center text-accent text-sm font-medium">
                <FileCheck className="w-4 h-4 mr-2" />
                Ready to analyze
              </div>
            )}
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-secondary-text text-sm uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* GitHub Input */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-secondary-text" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 bg-background border border-border rounded-lg text-primary-text placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <button className="w-full py-3 px-4 rounded-lg bg-accent text-white font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center">
              Analyze Repository
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
