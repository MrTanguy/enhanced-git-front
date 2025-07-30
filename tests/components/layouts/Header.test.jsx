// tests/components/layouts/Header.test.jsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Header from '../../../src/components/layouts/Header'

describe('Header', () => {
  test('affiche le logo avec un lien vers la page d’accueil', () => {
    render(<Header />)

    const logoLink = screen.getByRole('link', { name: /Home page/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  test('affiche un lien vers le tableau de bord', () => {
    render(<Header />)

    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i })
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })
})
