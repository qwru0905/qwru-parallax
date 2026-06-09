import { render, screen } from '@testing-library/react'
import Music from './Music'

describe('Music', () => {
  it('renders coming soon label', () => {
    render(<Music />)
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
  })

  it('renders preparation message', () => {
    render(<Music />)
    expect(screen.getByText(/준비/)).toBeInTheDocument()
  })
})
