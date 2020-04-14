import migrations from './migrations'

test('version 2', function () {
  const room = { a: 2 }
  const state = {
    rooms: {
      rooms: [room]
    }
  }

  expect(migrations[2](state)).toEqual({
    rooms: {
      rooms: [{...room, isTyping: false}]
    }
  })
})