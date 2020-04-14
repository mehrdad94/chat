import React from 'react'
import { render } from '@testing-library/react'
import SidebarItem from './SidebarItem'
import constants from '../../../configs/constants.json'

test('it should render sidebar item with different status', () => {
  const name = 'name'

  const { getByText, rerender } = render(<SidebarItem status={constants.ROOM_STATUS[0]} name={name}/>)

  const offlineElement = getByText('Offline')

  expect(offlineElement).toBeInTheDocument()

  rerender(<SidebarItem status={constants.ROOM_STATUS[1]} name={name}/>)

  const onlineElement = getByText('Online')

  expect(onlineElement).toBeInTheDocument()

  rerender(<SidebarItem status={constants.ROOM_STATUS[2]} name={name}/>)

  const busyElement = getByText('Busy')

  expect(busyElement).toBeInTheDocument()

  rerender(<SidebarItem status={constants.ROOM_STATUS[3]} name={name}/>)

  const typingElement = getByText('Typing...')

  expect(typingElement).toBeInTheDocument()

  rerender(<SidebarItem status={constants.ROOM_STATUS[4]} name={name}/>)

  const deleteElement = getByText('Deleted')

  expect(deleteElement).toBeInTheDocument()
})

test('it should render sidebar item with name and avatar and notification', () => {
  const name = 'name'
  const avatar = 'https://randomuser.me/api/portraits/men/1.jpg'
  const notification = 2

  let { getByText, queryByTestId, getByAltText, rerender } = render(<SidebarItem status={constants.ROOM_STATUS[0]} name={name} avatar={avatar}/>)

  // check defaults
  const nameElement = getByText(name)
  const avatarElement = getByAltText('avatar')

  expect(nameElement).toBeInTheDocument()
  expect(avatarElement.src).toBe(avatar)
  expect(queryByTestId('notification')).not.toBeInTheDocument()

  // add notification
  rerender(<SidebarItem status={constants.ROOM_STATUS[0]} name={name} avatar={avatar} notification={notification}/>)

  const notificationElement = getByText(notification.toString())

  expect(notificationElement).toBeInTheDocument()
})
