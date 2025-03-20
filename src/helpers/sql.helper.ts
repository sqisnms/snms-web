export const getParenthesisNumStr = (arr: string[]) => {
  const strs = arr.map((a, i) => {
    return `$${i + 1}`
  })
  return `(${strs.join(",")})`
}
