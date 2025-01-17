"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Upload,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Download,
  Eye,
  Star,
  Heart,
  Share2,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

export default function PostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalLikes: 0,
    totalShares: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchPosts();
  }, [session, router, filterCategory, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== "") {
        fetchPosts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        category: filterCategory,
        page: pagination.page,
        limit: pagination.limit,
      });

      const response = await fetch(`/api/admin/posts?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/posts?postId=${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const togglePremium = async (postId) => {
    try {
      const response = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      toast.success("Post updated successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Document Management
          </h1>
          <p className="text-gray-500">Manage and monitor all documents</p>
        </div>
        <button
          onClick={() => router.push("/upload")}
          className="btn btn-primary w-full md:w-auto"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-5 h-5 text-primary" />
            <span className="font-medium">Total Downloads</span>
          </div>
          <p className="text-2xl font-bold">
            {stats.totalDownloads.toLocaleString()}
          </p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-medium">Total Likes</span>
          </div>
          <p className="text-2xl font-bold">
            {stats.totalLikes.toLocaleString()}
          </p>
        </div>
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Total Shares</span>
          </div>
          <p className="text-2xl font-bold">
            {stats.totalShares.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="select select-bordered"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Study Materials">Study Material</option>
            <option value="Question Papers">Question Papers</option>
            <option value="solutions">Solutions</option>
          </select>
          <button className="btn btn-square btn-ghost">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-base-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.subject_name}</p>
                </div>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a
                        onClick={() =>
                          router.push(`/dashboard/posts/${post.id}`)
                        }
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </a>
                    </li>
                    <li>
                      <a onClick={() => togglePremium(post.id)}>
                        <Crown className="w-4 h-4" />
                        Toggle Premium
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-error"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash className="w-4 h-4" />
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="badge badge-outline">{post.category}</div>
                {post.premium && (
                  <div className="badge badge-primary">Premium</div>
                )}
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>Course: {post.course_name}</p>
                <p>Semester: {post.semester_code}</p>
                <p>Uploaded by: {post.user.name || post.user.email}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {post._count.userDownloads}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post._count.userLikes}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  {post.shares}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 p-4 bg-base-200 rounded-lg">
        <div className="text-sm text-gray-500">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} entries
        </div>
        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </button>
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i + 1}
              className={`join-item btn btn-sm ${
                pagination.page === i + 1 ? "btn-active" : ""
              }`}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: i + 1 }))
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            className="join-item btn btn-sm"
            disabled={pagination.page === pagination.pages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
