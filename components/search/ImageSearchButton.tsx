import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageSearchButtonProps {
  onImageSearch: (image: File) => void;
}

const ImageSearchButton: React.FC<ImageSearchButtonProps> = ({ onImageSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onImageSearch(file);
      setIsLoading(false);
      setIsModalOpen(false);
      setPreviewImage(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2.5 bg-white border-2 border-black rounded-full hover:bg-neutral-50 transition-colors"
        title="Buscar por imagen"
      >
        <ImagePlus size={18} />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={() => !isLoading && setIsModalOpen(false)}
            />

            {/* Mobile View */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 md:hidden bg-white border-t-2 border-black rounded-t-2xl z-[70] overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon size={20} />
                  Buscar por imagen
                </h3>
                {!isLoading && (
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      {previewImage && (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-xl border-2 border-black"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 size={32} className="text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-lg font-medium">Buscando anuncios similares...</p>
                    <p className="text-neutral-600 text-sm mt-2">
                      Esto puede tardar unos segundos
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={24} className="text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-medium">Galería</p>
                        <p className="text-sm text-neutral-500">Selecciona una imagen</p>
                      </div>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-black rounded-xl hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Upload size={24} className="text-neutral-600" />
                      </div>
                      <div>
                        <p className="font-medium">Subir archivo</p>
                        <p className="text-sm text-neutral-500">JPG, PNG, GIF (max. 5MB)</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Desktop View */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 35, stiffness: 400 }}
              className="fixed hidden md:block left-1/2 -translate-x-1/2 top-24 w-full max-w-xl bg-white border-2 border-black rounded-2xl z-[70] shadow-retro overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon size={20} />
                  Buscar por imagen
                </h3>
                {!isLoading && (
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div 
                className={`p-6 ${dragActive ? 'bg-neutral-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      {previewImage && (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-xl border-2 border-black"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 size={32} className="text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <p className="text-lg font-medium">Buscando anuncios similares...</p>
                    <p className="text-neutral-600 text-sm mt-2">
                      Esto puede tardar unos segundos
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={24} className="text-neutral-500" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      Arrastra y suelta una imagen aquí
                    </p>
                    <p className="text-neutral-600 text-sm mb-4">
                      o haz clic para seleccionar un archivo
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-primary border-2 border-black rounded-xl font-medium shadow-retro hover:bg-primary-hover transition-colors"
                    >
                      Seleccionar imagen
                    </button>
                    <p className="text-xs text-neutral-500 mt-4">
                      Formatos soportados: JPG, PNG, GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </>
  );
};

export default ImageSearchButton;