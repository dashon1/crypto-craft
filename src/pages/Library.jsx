import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Bookmark, FileText, BookOpen, Trash2, Edit2, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function Library() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userBookmarks = await base44.entities.UserBookmark.filter({ 
        created_by: currentUser.email 
      });
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const deleteBookmark = async (id) => {
    try {
      await base44.entities.UserBookmark.delete(id);
      loadData();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const startEditingNote = (bookmark) => {
    setEditingNote(bookmark.id);
    setNoteText(bookmark.notes || "");
  };

  const saveNote = async (bookmarkId) => {
    try {
      await base44.entities.UserBookmark.update(bookmarkId, {
        notes: noteText
      });
      setEditingNote(null);
      loadData();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const categoryIcons = {
    lesson: BookOpen,
    glossary_term: FileText,
    article: FileText
  };

  const categoryColors = {
    lesson: "bg-blue-100 text-blue-800 border-blue-200",
    glossary_term: "bg-purple-100 text-purple-800 border-purple-200",
    article: "bg-green-100 text-green-800 border-green-200"
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="text-center py-20">
            <Bookmark className="w-20 h-20 mx-auto mb-6 text-blue-100" />
            <h1 className="text-3xl font-bold mb-4">Your Personal Learning Library</h1>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
              Save lessons, glossary terms, and resources for quick access later!
            </p>
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Sign In to Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Library
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your saved resources and notes
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookmarks</p>
                <p className="text-2xl font-bold">{bookmarks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saved Lessons</p>
                <p className="text-2xl font-bold">
                  {bookmarks.filter(b => b.item_type === 'lesson').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">With Notes</p>
                <p className="text-2xl font-bold">
                  {bookmarks.filter(b => b.notes).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookmarks */}
      <div className="space-y-4">
        {bookmarks.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="text-center py-20">
              <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookmarks yet</h3>
              <p className="text-gray-500 mb-6">
                Start saving lessons and resources you want to revisit
              </p>
              <Link to={createPageUrl("Learn")}>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  Browse Lessons
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          bookmarks.map((bookmark) => {
            const IconComponent = categoryIcons[bookmark.item_type];
            return (
              <Card key={bookmark.id} className="shadow-lg border-0 hover:shadow-xl transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{bookmark.item_title}</h3>
                        <Badge className={`${categoryColors[bookmark.item_type]} border mt-1`}>
                          {bookmark.item_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Notes Section */}
                  {editingNote === bookmark.id ? (
                    <div className="space-y-2 bg-yellow-50 p-4 rounded-lg">
                      <Textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your notes..."
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveNote(bookmark.id)}
                          size="sm"
                          className="bg-green-600 text-white"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingNote(null)}
                          size="sm"
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {bookmark.notes ? (
                        <>
                          <p className="text-gray-700 mb-2">{bookmark.notes}</p>
                          <Button
                            onClick={() => startEditingNote(bookmark)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-600"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit Note
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => startEditingNote(bookmark)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Add Note
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span>Saved {new Date(bookmark.created_date).toLocaleDateString()}</span>
                    {bookmark.item_type === 'lesson' && (
                      <Link to={createPageUrl(`Lesson?id=${bookmark.item_id}`)}>
                        <Button size="sm" variant="outline">
                          Open Lesson
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}