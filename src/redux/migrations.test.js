import migrations from './migrations'

test('version 2', function () {
  const currentUserId = '1234'
  const room = '1233'
  const messages = [
    {
      id: '2'
    }
  ]

  const state = {
    messages: {
      [currentUserId]: {
          messages: {
            [room]: messages
          }
      }
    }
  }

  expect(migrations[2](state)).toEqual({
    messages: {
      [currentUserId]: {
        messages: {
          [room]: [
            {
              id: '2',
              sentCount: 0
            }
          ]
        }
      }
    }
  })
})