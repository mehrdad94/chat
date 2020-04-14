// Tree grid
// who is on the top for each can be different
// who is my children
// How can we replace one with another (we should replace higher node with lower node if they are gone)
// if we give every user whole grid information users know where to send if someone is unavailable
// conclusion: we pass whole tree
// how can we make a tree: required information (degree, max edges)
// how is our data structure: ['himself', ['children']]
//  [
//    [
//      'id',
//      [
//        ['id', []]
//        ['id', []]
//      ]
//    ]
//  ]
//
import splitEvery from 'ramda/src/splitEvery'
import TreeModel from 'tree-model'

const MAX_NODE = 4
const tree = new TreeModel()
const roots = {}

const findNodeWithEmptySpace = rootId => roots[rootId].first({ strategy: 'breadth' }, node => node.model.children.length < MAX_NODE)
const findNodeWithId = (rootId, id) => roots[rootId].first(node => node.model.id === id)

export const childModel = id => ({ id, children: [] })

// method for add
export const treeAdd = (rootId, items) => {
  const splitArray = splitEvery(MAX_NODE, items.map(childModel))

  splitArray.forEach((children) => {
    if (!roots[rootId]) roots[rootId] = tree.parse({id: children[0].id, children: children.slice(1)})
    else {
      children.forEach(child => {
        const emptyNode = findNodeWithEmptySpace(rootId)

        emptyNode.addChild(tree.parse(child))
      })
    }
  })

  return roots[rootId]
}

export const treeRemove = (rootId, id) => {
  const targetNode = findNodeWithId(rootId, id)
  const targetParentNode = targetNode.parent
  const isTargetRoot = targetNode.isRoot()
  const targetNodeIndex = targetNode.getIndex()

  const removedNode = targetNode.drop()

  if (!removedNode.hasChildren()) return roots[rootId]

  // add children to tree
  const firstChild = removedNode.first(node => !node.hasChildren())
  firstChild.drop()

  // replace with removed node
  if (!isTargetRoot) targetParentNode.addChildAtIndex(firstChild, targetNodeIndex)
  else roots[rootId] = firstChild

  if (!removedNode.hasChildren()) return

  removedNode.children.forEach(child => { firstChild.addChild(child) })

  return roots[rootId]
}

// get connections
export const getNodeConnections = (rootId, id) => {
  const node = findNodeWithId(rootId, id)
  if (!node) return []

  let result = node.children.map(child => child.model.id)

  if (node.parent) result.push(node.parent.model.id)

  return result
}