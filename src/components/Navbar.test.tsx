import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText('qwru0905')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DEV' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YOUTUBE' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'MUSIC' })).toBeInTheDocument()
  })

  it('logo links to home', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'qwru0905' })).toHaveAttribute('href', '/')
  })
})
