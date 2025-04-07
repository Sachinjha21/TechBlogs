import  { useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BlogList from '../components/BlogList';
import AddEditBlog from '../components/AddEditBlog';
import ViewBlog from '../components/ViewBlog';

// Mock data
const initialBlogs = [
  {
    id: 'blog1',
    title: 'Getting Started with React',
    image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBibG9nfGVufDB8fHx8MTc0NDA1MDYzM3ww&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    description: 'Learn the basics of React and how to create your first app',
    content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is widely used in modern web development. This article will guide you through setting up your first React application and understanding the core concepts.',
    createdAt: '2023-06-10T12:00:00Z',
    comments: []
  },
  {
    id: 'blog2',
    title: 'CSS Grid Layout',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBibG9nfGVufDB8fHx8MTc0NDA1MDYzM3ww&ixlib=rb-4.0.3&fit=fillmax&h=400&w=800',
    description: 'Master CSS Grid layout for responsive web design',
    content: 'CSS Grid Layout is a two-dimensional grid-based layout system aimed at web design. It allows developers to create complex responsive web design layouts more easily and consistently across browsers.',
    createdAt: '2023-06-08T09:00:00Z',
    comments: []
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [blogs, setBlogs] = useState(initialBlogs);
  const navigate = useNavigate();

  const handleAddBlog = (blog: any) => {
    const newBlog = {
      ...blog,
      id: 'blog' + (blogs.length + 1),
      createdAt: new Date().toISOString(),
      comments: []
    };
    setBlogs([newBlog, ...blogs]);
    navigate('/dashboard');
  };

  const handleUpdateBlog = (updatedBlog: any) => {
    setBlogs(blogs.map(blog => 
      blog.id === updatedBlog.id ? { ...blog, ...updatedBlog } : blog
    ));
    navigate('/dashboard');
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const handleAddComment = (blogId: string, comment: any) => {
    const newComment = {
      id: 'c' + Date.now(),
      text: comment.text,
      author: user?.email || 'Anonymous',
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setBlogs(blogs.map(blog => 
      blog.id === blogId 
        ? { ...blog, comments: [newComment, ...(blog.comments || [])] } 
        : blog
    ));
  };

  const handleAddReply = (blogId: string, commentId: string, replyText: string) => {
    const newReply = {
      id: 'r' + Date.now(),
      text: replyText,
      author: user?.email || 'Anonymous',
      createdAt: new Date().toISOString()
    };
    
    setBlogs(blogs.map(blog => {
      if (blog.id !== blogId) return blog;
      
      const updatedComments = blog.comments.map((comment: any) => {
        if (comment.id !== commentId) return comment;
        
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      });
      
      return { ...blog, comments: updatedComments };
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 bg-white p-4 shadow rounded">
        <h1 className="text-2xl font-bold">Blog Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img 
              src={user?.profileImage || 'https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcGxhY2Vob2xkZXJ8ZW58MHx8fHwxNzQ0MDUxMTY2fDA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'} 
              alt="Profile" 
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
            />
            <span className="ml-2">{user?.email}</span>
          </div>
          <button
            onClick={() => logout()}
            className="btn-secondary"
          >
            Logout
          </button>
          <Link
            to="/dashboard/add"
            className="btn-primary"
          >
            Add Blog
          </Link>
        </div>
      </div>
      
      <div className="mt-4">
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} onDelete={handleDeleteBlog} />} />
          <Route path="/add" element={<AddEditBlog onSave={handleAddBlog} />} />
          <Route path="/edit/:id" element={<AddEditBlog onSave={handleUpdateBlog} blogs={blogs} />} />
          <Route path="/view/:id" element={<ViewBlog blogs={blogs} onAddComment={handleAddComment} onAddReply={handleAddReply} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
 