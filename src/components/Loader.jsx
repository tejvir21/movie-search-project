import React from 'react';
import { Clapperboard } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[9999]">
      <div className="relative">
        <Clapperboard className="w-16 h-16 text-blue-400 animate-bounce" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="text-white mt-4 text-lg font-medium">Loading amazing movies...</p>
    </div>
  );
};

export default Loader;