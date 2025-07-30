import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Title from '../../../src/components/dndkitPortfolio/Title';

vi.spyOn(ReactDOM, 'createPortal').mockImplementation((element) => element);

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}));

describe('Title component', () => {
  const item = {
    x: 15,
    y: 25,
    title: 'My Title',
  };
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial title', () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('opens modal on double click if editable', () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));
    expect(screen.getByRole('textbox')).toHaveValue('My Title');
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('does not open modal on double click if not editable', () => {
    render(<Title item={item} id={1} isEditable={false} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('updates title input value on change', () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(input).toHaveValue('New Title');
  });

  it('calls onUpdate and closes modal when Save clicked', async () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Title' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, { title: 'Updated Title' });

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });
  });

  it('calls onDelete and closes modal when Delete clicked', async () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(onDelete).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('closes modal when clicking Cancel button', async () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('closes modal when clicking outside modal content', async () => {
    render(<Title item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByText('My Title'));

    // Click on modal background (the element with class modalBackground)
    fireEvent.click(screen.getByTestId('modal-background'));

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });
});
