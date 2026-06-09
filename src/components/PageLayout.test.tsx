import { render, screen } from '@testing-library/react'
import PageLayout from './PageLayout'

describe('PageLayout', () => {
  it('renders children', () => {
    render(<PageLayout><p>test content</p></PageLayout>)
    expect(screen.getByText('test content')).toBeInTheDocument()
  })
})
