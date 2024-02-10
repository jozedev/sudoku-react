export const arrays = {
  findAllIndexes: (array: any[], val: any) => {
    const indexes = []; let i
    for (i = 0; i < array.length; i++) {
      if (array[i] === val) indexes.push(i)
    }

    return indexes
  },
  findAllDuplicates: (array: any[]) => {
    const duplicates: Array<{
      element: any
      indexes: number[]
    }> = []

    for (let i = 0; i < array.length; i++) {
      const indexes = arrays.findAllIndexes(array, array[i])
      if (indexes.length > 1 && !duplicates.some(d => d.element === array[i])) {
        duplicates.push({
          element: array[i],
          indexes
        })
      }
    }

    return duplicates
  },
  removeElement: (array: any[], element: any) => {
    const index = array.indexOf(element)
    if (index !== -1) {
      return array.splice(index, 1)
    }

    return array
  },
  areEqual: (array1: any[], array2: any[]) => {
    // if the argument is the same array, we can be sure the contents are same as well
    if (array1 === array2) { return true }
    // first compare lengths
    if (array1.length !== array2.length) { return false }

    for (let i = 0, l = array1.length; i < l; i++) {
      // Check if we have nested arrays
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        // recurse into the nested arrays
        if (!arrays.areEqual(array1[i] as any[], array2[i] as any[])) { return false }
      } else if (array1[i] !== array2[i]) {
        return false
      }
    }
    return true
  }
}
