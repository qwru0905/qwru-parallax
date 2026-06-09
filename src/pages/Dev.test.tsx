import { render, screen } from '@testing-library/react'
import Dev from './Dev'

describe('Dev', () => {
  it('renders GitHub profile link', () => {
    render(<Dev />)
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/qwru0905'
    )
  })

  it('renders project from projects data', () => {
    render(<Dev />)
    expect(screen.getByText('qwru-parallax')).toBeInTheDocument()
  })

  it('renders skills section', () => {
    render(<Dev />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
