
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Eye
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        insertMarkdown('**', '**');
        break;
      case 'italic':
        insertMarkdown('*', '*');
        break;
      case 'underline':
        insertMarkdown('<u>', '</u>');
        break;
      case 'h1':
        insertMarkdown('# ');
        break;
      case 'h2':
        insertMarkdown('## ');
        break;
      case 'quote':
        insertMarkdown('> ');
        break;
      case 'list':
        insertMarkdown('- ');
        break;
      case 'numbered':
        insertMarkdown('1. ');
        break;
    }
  };

  const renderPreview = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br>');
    
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['strong', 'em', 'u', 'h1', 'h2', 'blockquote', 'li', 'br'],
      ALLOWED_ATTR: ['class']
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 pr-2 border-r border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('bold')}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('italic')}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('underline')}
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 pr-2 border-r border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('h1')}
              className="h-8 w-8 p-0"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('h2')}
              className="h-8 w-8 p-0"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('quote')}
              className="h-8 w-8 p-0"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-1 pr-2 border-r border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => formatText('numbered')}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <Button
            type="button"
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="ml-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Editor' : 'Vista Previa'}
          </Button>
        </div>
      </Card>

      {/* Editor/Preview */}
      {showPreview ? (
        <Card className="p-4">
          <CardContent className="prose max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
              className="min-h-[300px] p-4 border border-gray-200 rounded"
            />
          </CardContent>
        </Card>
      ) : (
        <Textarea
          id="content-editor"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>Guía rápida:</strong> **negrita**, *cursiva*, # Título 1, ## Título 2, &gt; cita, - lista, 1. lista numerada
      </div>
    </div>
  );
};

export default RichTextEditor;
