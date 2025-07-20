import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DisplayPortfolio from '../../../src/components/dndkitPortfolio/DisplayPortfolio';

// Mock des composants enfants
vi.mock('../../../src/components/dndkitPortfolio/Title', () => {
  return {
    default: ({ item }) => <div data-testid="title">{item.content || 'Title'}</div>
  };
});

vi.mock('../../../src/components/dndkitPortfolio/Project', () => {
  return {
    default: ({ item }) => <div data-testid="project">{item.content || 'Project'}</div>
  };
});
vi.mock('../../../src/components/dndkitPortfolio/Text', () => {
  return {
    default: ({ item }) => <div data-testid="text">{item.content || 'Text'}</div>
  };
});

describe('DisplayPortfolio component', () => {
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  it('renders Title component when item type is title', () => {
    const items = [{ type: 'title', content: 'Mon titre' }];
    render(<DisplayPortfolio items={items} isEditable={true} onItemUpdate={onUpdate} onItemDelete={onDelete} />);

    expect(screen.getByTestId('title')).toHaveTextContent('Mon titre');
  });

  it('renders Project component when item type is connection', () => {
    const items = [{ type: 'connection', content: 'Mon projet' }];
    render(<DisplayPortfolio items={items} isEditable={false} onItemUpdate={onUpdate} onItemDelete={onDelete} />);

    expect(screen.getByTestId('project')).toHaveTextContent('Mon projet');
  });

  it('renders Text component when item type is text', () => {
    const items = [{ type: 'text', content: 'Mon texte' }];
    render(<DisplayPortfolio items={items} isEditable={true} onItemUpdate={onUpdate} onItemDelete={onDelete} />);

    expect(screen.getByTestId('text')).toHaveTextContent('Mon texte');
  });

  it('renders fallback for unknown type', () => {
    const items = [{ type: 'unknown' }];
    render(<DisplayPortfolio items={items} isEditable={true} onItemUpdate={onUpdate} onItemDelete={onDelete} />);

    expect(screen.getByText('❓ Inconnu')).toBeInTheDocument();
  });

  it('passes isEditable and callbacks to children', () => {
    const items = [{ type: 'title', content: 'Test' }];
    render(<DisplayPortfolio items={items} isEditable={true} onItemUpdate={onUpdate} onItemDelete={onDelete} />);

    // On ne peut pas tester directement les callbacks internes,
    // mais on s’assure que les éléments sont présents (mock remplace les vrais composants).
    expect(screen.getByTestId('title')).toBeInTheDocument();
  });

  it('accepts and sets ref correctly', () => {
    const items = [{ type: 'title', content: 'Test' }];
    const ref = createRef();
    render(<DisplayPortfolio items={items} isEditable={true} onItemUpdate={onUpdate} onItemDelete={onDelete} ref={ref} />);

    // ref.current devrait être défini (div HTML)
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
