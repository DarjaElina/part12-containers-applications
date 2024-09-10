import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Test todo component'
  }

  const onClickDelete = vi.fn()
  const onClickComplete = vi.fn()

  render(<Todo todo={todo}
    onClickDelete={onClickDelete}
    onClickComplete={onClickComplete}/>)

  const element = screen.getByText('Test todo component')
  expect(element).toBeDefined()
})