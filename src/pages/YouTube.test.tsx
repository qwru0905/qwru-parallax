import { render, screen } from '@testing-library/react'
import YouTube from './YouTube'

describe('YouTube', () => {
  it('renders subscribe button linking to YouTube', () => {
    render(<YouTube />)
    const link = screen.getByRole('link', { name: /구독하기/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', expect.stringContaining('youtube.com'))
  })

  it('renders video thumbnails', () => {
    render(<YouTube />)
    const thumbnails = screen.getAllByRole('img')
    expect(thumbnails.length).toBeGreaterThan(0)
  })
})
