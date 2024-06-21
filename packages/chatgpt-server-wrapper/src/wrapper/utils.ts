export function splitStringToChunks(str: string, size: number): string[] {
  const results: string[] = []
  let i = 0
  while (i < str.length) {
    results.push(str.slice(i, i + size))
    i += size
  }

  return results
}
