export default function profile (data) {
  return Object.assign({}, data, {
    id: data._id,
    avatar: `https://api.adorable.io/avatars/48/${data._id}.png`
  })
}
