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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-surface border border-border rounded-[2rem] p-10 sm:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>

        <div className="space-y-10">
          {/* Upload Area */}
          <div className="relative">
            <label
              htmlFor="zip-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border/60 rounded-2xl hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <p className="mb-2 text-lg text-primary-text font-semibold">
                  {fileName ? 'Selected file:' : 'Drag & Drop your ZIP file here'}
                </p>
                <p className="text-sm text-secondary-text mb-6">
                  {fileName ? fileName : 'Supported format: .zip (max 50MB)'}
                </p>
                {!fileName && (
                  <div className="px-6 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold group-hover:border-accent group-hover:text-accent transition-all duration-300">
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center text-accent text-sm font-bold"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Ready to analyze
              </motion.div>
            )}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border/40"></div>
            <span className="flex-shrink mx-6 text-secondary-text/60 text-xs font-bold uppercase tracking-[0.2em]">or analyze via url</span>
            <div className="flex-grow border-t border-border/40"></div>
          </div>

          {/* GitHub Input */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-accent">
                <LinkIcon className="h-5 w-5 text-secondary-text/60 group-focus-within:text-accent" />
              </div>
              <input
                type="text"
                className="block w-full h-14 pl-12 pr-4 bg-background/50 border border-border/60 rounded-xl text-primary-text text-sm placeholder:text-secondary-text/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-300"
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <button className="w-full h-14 rounded-xl bg-accent text-white font-bold hover:bg-blue-600 hover:scale-[1.01] transition-all duration-300 shadow-lg shadow-accent/20 flex items-center justify-center active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background">
              Analyze Repository
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
