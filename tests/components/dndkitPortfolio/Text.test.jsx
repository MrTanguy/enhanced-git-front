import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Text from '../../../src/components/dndkitPortfolio/Text';

// Mock createPortal pour rendre directement dans le DOM de test
vi.spyOn(ReactDOM, 'createPortal').mockImplementation((element) => element);

// Mock useDraggable pour simplifier
vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

describe('Text component', () => {
  const item = {
    x: 20,
    y: 30,
    content: '<p>Hello World</p>',
  };
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial content', () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('opens modal on double click if editable', () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);

    fireEvent.doubleClick(screen.getByText('Hello World'));
    expect(screen.getByText('Bold')).toBeInTheDocument(); // MenuBar presence check
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('does not open modal on double click if not editable', () => {
    render(<Text item={item} id={1} isEditable={false} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('Hello World'));
    expect(screen.queryByText('Bold')).not.toBeInTheDocument();
  });

  it('calls onDelete and closes modal when Delete clicked', async () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('Hello World'));

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(onDelete).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(screen.queryByText('Bold')).not.toBeInTheDocument();
    });
  });

  it('calls onUpdate and closes modal when Save clicked', async () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('Hello World'));

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    expect(onUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ content: expect.any(String) }));

    await waitFor(() => {
      expect(screen.queryByText('Bold')).not.toBeInTheDocument();
    });
  });

  it('closes modal when clicking Cancel button', async () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('Hello World'));

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText('Bold')).not.toBeInTheDocument();
    });
  });

  it('closes modal when clicking outside modal content', async () => {
    render(<Text item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('Hello World'));

    // simulate click on modal background (editorModal div)
    fireEvent.click(screen.getByText('Bold').parentElement.parentElement.parentElement); // .editorModal div

    await waitFor(() => {
      expect(screen.queryByText('Bold')).not.toBeInTheDocument();
    });
  });
});
