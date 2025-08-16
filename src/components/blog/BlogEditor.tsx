
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogEditorHeader from './BlogEditorHeader';
import BlogEditorForm from './BlogEditorForm';
import BlogEditorSidebar from './BlogEditorSidebar';

import { BlogPost } from '@/types/blog';

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
}

const BlogEditor = ({ post, onSave, onCancel }: BlogEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || 'noticias');
  const [image, setImage] = useState(post?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Por favor completa al menos el título y el contenido');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150).replace(/[#*>`-]/g, '') + '...',
      category,
      image_url: image || undefined,
      tags: [],
      is_published: true
    };

    if (post) {
      onSave({
        ...post,
        ...postData
      });
    } else {
      onSave(postData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <BlogEditorHeader 
            isEditing={!!post}
            onCancel={onCancel}
            onSave={handleSave}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <BlogEditorForm
                title={title}
                excerpt={excerpt}
                content={content}
                onTitleChange={setTitle}
                onExcerptChange={setExcerpt}
                onContentChange={setContent}
              />
            </div>

            {/* Sidebar */}
            <BlogEditorSidebar
              category={category}
              image={image}
              isEditing={!!post}
              onCategoryChange={setCategory}
              onImageChange={setImage}
              onImageFileChange={setImageFile}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogEditor;
