import { treeAdd, treeRemove, getNodeConnections } from './treeModel'

describe('test tree model', function () {
  const ids = [1, 2, 3, 4, 5, 6, 7, 8]

  it('should add items to tree', function () {
    const rootId = 1
    const root = treeAdd(rootId, ids)

    expect(root.children.length).toBeTruthy()
  })

  it('should remove an item from the tree', function () {
    const rootId = 2
    treeAdd(rootId, ids)

    // remove a branch
    let root = treeRemove(rootId, 2)

    const nodeSeven = root.first(node => node.model.id === 7)
    const nodeSevenPath = nodeSeven.getPath()

    expect(nodeSevenPath[1].model.id).toEqual(6)

    // remove root
    root = treeRemove(rootId, 1)

    expect(root.model.id).toEqual(7)
  })

  it('should get a node connections', function () {
    const rootId = 3
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ,12 , 13, 14, 15]

    treeAdd(rootId, ids)

    const connections = getNodeConnections(rootId, 2)

    expect(connections).toEqual([6, 7, 8, 9, 1])
  })
})
