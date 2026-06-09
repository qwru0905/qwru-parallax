import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('renders brand name', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'qwru0905' })).toBeInTheDocument()
  })

  it('renders three portal cards', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /developer/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /youtube/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /music/i })).toBeInTheDocument()
  })
})
