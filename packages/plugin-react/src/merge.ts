/**
 * A type guard to check if an unknown item is a plain object.
 * Returns true if the item is an object, is not an array, and is not null.
 */
function isPlainObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

const updateObject = <T extends MergeObj>(obj: T, key: string, value: unknown | object | T): T => {
  const result: T = { ...obj }

  if (key === 'plugins') {
    ;(result as MergeObj)[key] = {
      ...(result[key] || {}),
      ...(value as MergeObj)
    }
  } else if (Array.isArray(value)) {
    ;(result as MergeObj)[key] = (result as T)[key]
      ? [...new Set([...(Array.isArray(result[key]) ? result[key] : [result[key]]), ...value])]
      : [...value]
  } else if (isPlainObject(value)) {
    ;(result as MergeObj)[key] = result[key] ? deepMerge(result[key] as MergeObj, value) : deepMerge({}, value)
  } else {
    ;(result as MergeObj)[key] = value
  }

  return result
}

export type MergeObj = Record<string, unknown>

/**
 * Recursively merges two objects, creating a new object without mutating sources.
 * It uses type guards to ensure type safety without relying on `any`.
 */
export const deepMerge = <T extends MergeObj>(...source: T[]): T => {
  let result = {} as T

  for (const obj of source) {
    if (!obj) continue

    for (const [key, value] of Object.entries(obj)) {
      result = updateObject(result, key, value)
    }
  }

  return result
}
