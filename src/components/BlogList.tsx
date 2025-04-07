import  { Link } from 'react-router-dom';

interface Blog {
  id: string;
  title: string;
  image: string;
  description: string;
  content: string;
  createdAt: string;
}

interface BlogListProps {
  blogs: Blog[];
  onDelete: (id: string) => void;
}

const BlogList = ({ blogs, onDelete }: BlogListProps) => {
  if (blogs.length === 0) {
    return (
      <div className="card text-center">
        <div className="text-gray-500 mb-4">No blogs found</div>
        <Link to="/dashboard/add" className="btn-primary inline-block">
          Create your first blog
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Your Blog Posts</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Preview</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="font-medium">{blog.title}</td>
                <td>
                  <div className="flex items-center">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="h-10 w-16 object-cover mr-2"
                    />
                    <span className="text-gray-600 text-sm truncate max-w-xs">
                      {blog.description}
                    </span>
                  </div>
                </td>
                <td className="text-sm text-gray-600">
                  {formatDate(blog.createdAt)}
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/dashboard/view/${blog.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/dashboard/edit/${blog.id}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => onDelete(blog.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
 