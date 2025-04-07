import  { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlogImages from './BlogImages';

interface Blog {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
}

interface AddEditBlogProps {
  onSave: (blog: Omit<Blog, 'id'> & { id?: string }) => void;
  blogs?: Blog[];
}

const AddEditBlog = ({ onSave, blogs = [] }: AddEditBlogProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);
  
  useEffect(() => {
    if (isEditMode && blogs.length > 0) {
      const blog = blogs.find(blog => blog.id === id);
      if (blog) {
        setTitle(blog.title);
        setImage(blog.image);
        setImagePreview(blog.image);
        setDescription(blog.description);
        setContent(blog.content);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, blogs, isEditMode, navigate]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // For demo, we're just using a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImagePreview(imageUrl);
    }
  };

  const handleImageSelect = (url: string) => {
    setImage(url);
    setImagePreview(url);
    setShowImageSelector(false);
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!image && !imagePreview) {
      setError('Blog image is required');
      return false;
    }
    
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSave({
      id,
      title,
      image: imagePreview || image,
      description,
      content
    });
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="Enter a title for your blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="blogImage">
            Blog Image
          </label>
          <div className="mb-2">
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Blog preview" 
                className="h-40 object-cover border border-gray-300 mb-2"
              />
            )}
            
            <div className="flex space-x-2">
              <button 
                type="button"
                className="btn-secondary text-sm"
                onClick={() => setShowImageSelector(!showImageSelector)}
              >
                {showImageSelector ? 'Hide Image Options' : 'Choose From Sample Images'}
              </button>
              
              <span className="text-gray-600">or</span>
              
              <input
                type="file"
                id="blogImage"
                className="form-input text-sm"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          
          {showImageSelector && (
            <BlogImages onSelect={handleImageSelect} />
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Short Description
          </label>
          <textarea
            id="description"
            className="form-input h-20"
            placeholder="Enter a brief description of your blog"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="content">
            Blog Content
          </label>
          <textarea
            id="content"
            className="form-input h-64"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditMode ? 'Update Blog' : 'Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBlog;
 