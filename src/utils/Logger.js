export const logRaw = (label, data) => {
  console.log(label, JSON.parse(JSON.stringify(data)))
}
