import  { useState, useEffect } from 'react';

interface BlogImagesProps {
  onSelect: (url: string) => void;
}

const BlogImages = ({ onSelect }: BlogImagesProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample image URLs from Unsplash
    const sampleImages = [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&fit=fillmax&h=400&w=600',
      'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&fit=fillmax&h=400&w=600',
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&fit=fillmax&h=400&w=600',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&fit=fillmax&h=400&w=600'
    ];
    
    setImages(sampleImages);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading images...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {images.map((url, index) => (
        <div 
          key={index} 
          className="cursor-pointer border hover:border-blue-500 rounded overflow-hidden"
          onClick={() => onSelect(url)}
        >
          <img src={url} alt={`Image ${index + 1}`} className="w-full h-32 object-cover" />
        </div>
      ))}
    </div>
  );
};

export default BlogImages;
 