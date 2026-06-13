import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Heart, MessageCircle, Users, Trophy, TrendingUp, Award, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Social() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("tip");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const allPosts = await base44.entities.SocialPost.list('-created_date', 50);
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const createPost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      await base44.entities.SocialPost.create({
        post_type: postType,
        content: newPost,
        user_name: user.full_name || 'Anonymous'
      });
      
      setNewPost("");
      loadData();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const likePost = async (postId, currentLikes) => {
    try {
      await base44.entities.SocialPost.update(postId, {
        likes_count: currentLikes + 1
      });
      loadData();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const postTypeIcons = {
    achievement: Trophy,
    milestone: Award,
    question: MessageCircle,
    tip: TrendingUp
  };

  const postTypeColors = {
    achievement: "bg-yellow-100 text-yellow-800 border-yellow-200",
    milestone: "bg-blue-100 text-blue-800 border-blue-200",
    question: "bg-purple-100 text-purple-800 border-purple-200",
    tip: "bg-green-100 text-green-800 border-green-200"
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardContent className="text-center py-20">
            <Users className="w-20 h-20 mx-auto mb-6 text-purple-100" />
            <h1 className="text-3xl font-bold mb-4">Join the Learning Community</h1>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto text-lg">
              Share your achievements, ask questions, and learn from other crypto enthusiasts!
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Sign In to Join
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Community Feed
        </h1>
        <p className="text-xl text-gray-600">
          Share your journey and connect with fellow learners
        </p>
      </div>

      {/* Create Post */}
      <Card className="mb-8 shadow-xl border-0">
        <CardHeader>
          <CardTitle>Share with the community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {Object.entries(postTypeIcons).map(([type, Icon]) => (
              <button
                key={type}
                onClick={() => setPostType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  postType === type
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type}
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder={`Share a ${postType}...`}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button
            onClick={createPost}
            disabled={!newPost.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Post
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
          const IconComponent = postTypeIcons[post.post_type];
          return (
            <Card key={post.id} className="shadow-lg border-0 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {post.user_name?.charAt(0) || 'A'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">{post.user_name}</p>
                      <Badge className={`${postTypeColors[post.post_type]} border`}>
                        <IconComponent className="w-3 h-3 mr-1" />
                        {post.post_type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(post.created_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likePost(post.id, post.likes_count || 0)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {posts.length === 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No posts yet. Be the first to share!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}