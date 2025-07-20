import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Sidebar from '../../../src/components/dndkitPortfolio/Sidebar';

describe('Sidebar component', () => {
  it('renders sidebar with draggable elements initially visible', () => {
    render(<Sidebar />);
    
    expect(screen.getByText('Elements')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Connection')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();

    // Le bouton affiche l'icône de flèche gauche (sidebar visible)
    const button = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('toggles sidebar visibility when clicking the button', () => {
    render(<Sidebar />);

    const button = screen.getByRole('button', { name: /toggle sidebar/i });

    // Sidebar visible au départ : "Elements" présent
    expect(screen.getByText('Elements')).toBeInTheDocument();

    // Clique pour cacher la sidebar
    fireEvent.click(button);
    expect(screen.queryByText('Elements')).not.toBeInTheDocument();

    // Clique pour réafficher la sidebar
    fireEvent.click(button);
    expect(screen.getByText('Elements')).toBeInTheDocument();
  });
});
