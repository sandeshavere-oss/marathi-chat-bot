
import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  sources: GroundingChunk[];
}

const GroundingSources: React.FC<GroundingSourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        अधिक माहितीसाठी संदर्भ (Sources):
      </h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          if (!source.web) return null;
          return (
            <a
              key={index}
              href={source.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              {source.web.title || source.web.uri}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GroundingSources;
