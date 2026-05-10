'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link as LinkIcon, Unlink } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';

interface Props {
  initialContent: string;
  onChange: (content: string) => void;
  isSaving?: boolean;
}

import { Editor } from '@tiptap/react';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    // cancelled
    if (url === null) return;
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-b bg-muted/20 p-2 flex flex-wrap gap-1 sticky top-0 z-10 rounded-t-xl">
      <Toggle 
        size="sm" 
        pressed={editor.isActive('bold')} 
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle 
        size="sm" 
        pressed={editor.isActive('italic')} 
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-border mx-1 self-center" />
      
      <Toggle 
        size="sm" 
        pressed={editor.isActive('heading', { level: 1 })} 
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle 
        size="sm" 
        pressed={editor.isActive('heading', { level: 2 })} 
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Toggle 
        size="sm" 
        pressed={editor.isActive('bulletList')} 
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle 
        size="sm" 
        pressed={editor.isActive('orderedList')} 
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Toggle size="sm" pressed={editor.isActive('link')} onPressedChange={setLink}>
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className="px-2"
      >
        <Unlink className="h-4 w-4" />
      </Button>
    </div>
  );
};

export function RichTextEditor({ initialContent, onChange, isSaving }: Props) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'typing'>('saved');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Write your note here...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setSaveStatus('typing');
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  // Sync external changes (e.g., selecting a different note)
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
      setSaveStatus('saved');
    }
  }, [initialContent, editor]);

  useEffect(() => {
    if (isSaving) {
      setSaveStatus('saving');
    } else if (saveStatus === 'saving') {
      setSaveStatus('saved');
    }
  }, [isSaving, saveStatus]);

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col h-full relative">
      <MenuBar editor={editor} />
      
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="absolute bottom-4 right-4 text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/80 backdrop-blur-sm rounded-md shadow-sm">
        {saveStatus === 'saved' ? 'All changes saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes'}
      </div>
    </div>
  );
}
