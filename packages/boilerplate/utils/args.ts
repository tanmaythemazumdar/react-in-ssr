export type Args = string[]

export function parseArgs(args: string[]): { [key: string]: string | boolean } {
  const result: { [key: string]: string | boolean } = {}

  for (const arg of args) {
    const [key, value] = arg.split('=')

    if (key && value) {
      result[key.replace(/-/g, '')] = value
    }
    else if (key) {
      result[key.replace(/-/g, '')] = true
    }
  }

  return result
}
