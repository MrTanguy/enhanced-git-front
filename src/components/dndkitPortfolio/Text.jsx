import ReactDOM from 'react-dom';
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

import '../../styles/portfolio/text.css';

const lowlight = createLowlight();

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: null,
  }),
];

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="editorMenu">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''}>Strike</button>
      <br/>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
      <br/>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'active' : ''}>Quote</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'active' : ''}>Code</button>
      <br/>
      <button onClick={() => editor.chain().focus().setColor('#d62f29ff').run()} className={editor.isActive('textStyle', { color: '#d62f29ff' }) ? 'active' : ''}>Red</button>
      <button onClick={() => editor.chain().focus().setColor('#2957d6ff').run()} className={editor.isActive('textStyle', { color: '#2957d6ff' }) ? 'active' : ''}>Blue</button>
      <button onClick={() => editor.chain().focus().setColor('#209e15ff').run()} className={editor.isActive('textStyle', { color: '#209e15ff' }) ? 'active' : ''}>Green</button>
      <br/>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear</button>
    </div>
  );
};

export default function Text({ item, id, isEditable, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `item-${id}` });
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState(item.content || '<p>Double click to edit</p>');

  const editor = useEditor({
    extensions,
    content,
  });

  const className = `draggableText ${isDragging ? 'dragging' : ''}`;
  const style = {
    top: `${item.y}%`,
    left: `${item.x}%`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'translate3d(0, 0, 0)',
  };

  const handleSave = () => {
    const newContent = editor.getHTML();
    setContent(newContent);
    onUpdate(id, {'content': newContent});
    setShowModal(false);
  };

  const handleDelete = () => {
    onDelete(id)
    setShowModal(false)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className={className}
        style={style}
        {...attributes}
        {...listeners}
        onDoubleClick={isEditable ? () => setShowModal(true) : undefined}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showModal && editor && ReactDOM.createPortal(
        <div className="editorModal" onClick={() => setShowModal(false)}>
          <div className="editorContent" onClick={(e) => e.stopPropagation()}>
            <MenuBar editor={editor} />
            <div className="editorBody">
              <EditorContent editor={editor} className="tiptap-editor" />
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="button" style={{ backgroundColor: '#f44336', color: 'white' }} onClick={handleDelete} >
                Delete
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="button" onClick={handleSave}>Save</button>
                <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
