import  { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  replies?: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Blog {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  createdAt: string;
  comments: Comment[];
}

interface ViewBlogProps {
  blogs: Blog[];
  onAddComment: (blogId: string, comment: { text: string }) => void;
  onAddReply: (blogId: string, commentId: string, replyText: string) => void;
}

const ViewBlog = ({ blogs, onAddComment, onAddReply }: ViewBlogProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const blog = blogs.find(blog => blog.id === id);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Blog post not found</p>
        <Link to="/dashboard" className="btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    onAddComment(blog.id, { text: newComment });
    setNewComment('');
  };
  
  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    
    if (!replyText.trim() || !replyingTo) return;
    
    onAddReply(blog.id, commentId, replyText);
    setReplyText('');
    setReplyingTo(null);
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-blue-500 hover:underline"
        >
          Back to all blogs
        </button>
      </div>
      
      <div className="card mb-8">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-64 object-cover mb-4"
        />
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600 text-sm">
            {formatDate(blog.createdAt)}
          </div>
          
          <Link 
            to={`/dashboard/edit/${blog.id}`}
            className="btn-secondary"
          >
            Edit
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">{blog.title}</h1>
        
        <p className="text-gray-600 italic mb-6">{blog.description}</p>
        
        <div>
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Comments ({blog.comments.length})
        </h2>
        
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="form-input h-20 mb-2"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
        
        <div className="space-y-6">
          {blog.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          ) : (
            blog.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{comment.author}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{comment.text}</p>
                
                <button
                  onClick={() => setReplyingTo(comment.id === replyingTo ? null : comment.id)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {comment.id === replyingTo ? 'Cancel Reply' : 'Reply'}
                </button>
                
                {comment.id === replyingTo && (
                  <form 
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className="mt-3 pl-6 border-l-2 border-gray-200"
                  >
                    <textarea
                      className="form-input h-16 text-sm mb-2"
                      placeholder={`Reply to ${comment.author}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary text-xs px-3 py-1"
                        disabled={!replyText.trim()}
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-6 border-l-2 border-gray-200 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded p-3">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium text-sm">{reply.author}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
 
