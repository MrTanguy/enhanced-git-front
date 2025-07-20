import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Project from '../../../src/components/dndkitPortfolio/Project';

// Mock du service apiService
vi.mock('../../../src/services/api/ApiService', () => {
  return {
    default: () => ({
      getUserData: vi.fn().mockResolvedValue({
        connections: [
          { username: 'user1', website: 'github' },
          { username: 'user2', website: 'gitlab' },
        ],
      }),
      getAllPublicProjects: vi.fn().mockResolvedValue([
        { name: 'Project A' },
        { name: 'Project B' },
      ]),
    }),
  };
});

describe('Project component', () => {
  const item = {
    project: { name: 'Test Project', website: 'github', link: 'http://testproject.com' },
    x: 10,
    y: 10,
  };
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project name and icon', () => {
    render(<Project item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    expect(screen.getByTestId('project-div')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByAltText('github')).toBeInTheDocument();
  });

  it('opens modal on double click when editable', async () => {
    render(<Project item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByTestId('project-div'));

    await waitFor(() => {
        expect(screen.getAllByText('Test Project').length).toBeGreaterThan(0);
    });

    expect(screen.getByRole('button', { name: /Change project/i })).toBeInTheDocument();
  });



  it('shows loader and connections after clicking Change project', async () => {
    render(<Project item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByTestId('project-div'));
    fireEvent.click(screen.getByRole('button', { name: /Change project/i }));

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  it('calls onDelete when Delete button clicked', () => {
    render(<Project item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByTestId('project-div'));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(onDelete).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });

  it('calls onUpdate when Save button clicked', () => {
    render(<Project item={item} id={1} isEditable={true} onUpdate={onUpdate} onDelete={onDelete} />);
    fireEvent.doubleClick(screen.getByTestId('project-div'));
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(onUpdate).toHaveBeenCalledWith(1, { project: item.project });
    expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
  });
});
