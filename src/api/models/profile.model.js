export default function profile (data) {
  return Object.assign({}, data, {
    id: data._id,
    avatar: `http://api.adorable.io/avatars/32/${data._id}.png`
  })
}
