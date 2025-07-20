import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock de useDraggable du package @dnd-kit/core
vi.mock('@dnd-kit/core', () => ({
  useDraggable: vi.fn(),
}));

import { useDraggable } from '@dnd-kit/core';
import Draggable from '../../../src/components/dndkitPortfolio/Draggable';

describe('Draggable component', () => {
  beforeEach(() => {
    // Par défaut, on mock useDraggable pour simuler un drag non actif
    useDraggable.mockReturnValue({
      attributes: { 'data-testid': 'draggable-attributes' },
      listeners: { onMouseDown: () => {} },
      setNodeRef: vi.fn(),
      transform: null,
      isDragging: false,
    });
  });

  it('renders children', () => {
    render(
      <Draggable id="test-id" type="test-type">
        <div data-testid="child">Contenu enfant</div>
      </Draggable>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies transform style when dragging', () => {
    // Mock pour simuler drag actif avec transformation
    useDraggable.mockReturnValueOnce({
      attributes: { 'data-testid': 'draggable-attributes' },
      listeners: { onMouseDown: () => {} },
      setNodeRef: vi.fn(),
      transform: { x: 50, y: 100 },
      isDragging: true,
    });

    render(
      <Draggable id="dragging-id" type="drag-type">
        Dragging content
      </Draggable>
    );

    const draggableDiv = screen.getByText('Dragging content');
    expect(draggableDiv).toHaveStyle({
      transform: 'translate3d(50px, 100px, 0)',
      position: 'fixed',
      zIndex: '1000',
    });
  });

    it('has default styles and position when not dragging', () => {
        render(
            <Draggable id="normal-id" type="normal-type">
            Normal content
            </Draggable>
        );

        const draggableDiv = screen.getByText('Normal content');
        const style = window.getComputedStyle(draggableDiv);

        expect(style.position).toBe('relative');
        expect(style.zIndex).toBe('auto');
        expect(style.transform === 'none' || style.transform === '').toBe(true);
    });
});
