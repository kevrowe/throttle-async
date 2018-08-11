const TIMEOUT_VALUE = 'TIMEOUTRESOLVED'
const wait = (ms: number): Promise<undefined> => new Promise((resolve, reject) => setTimeout(resolve.bind(this, TIMEOUT_VALUE), ms))

export const throttle = async <T, U>(input: U[], fn: (data: U) => Promise<T>, qty: number, interval: number): Promise<T[]> => {
  const remaining = input.slice(0)
  let responses = []
  let i = 0

  while (remaining.length > 0) {
    let activePromises = []
    const batch = remaining.splice(0, qty)

    for (let data of batch) {
      activePromises.push(new Promise(async (resolve, reject) => {
        try {
          resolve((await fn(data)))
        } catch (e) {
          reject(e)
        }
      }))
    }

    activePromises = remaining.length > 0 ? [...activePromises, wait(interval)] : activePromises
    responses = responses.concat(await Promise.all(activePromises)).filter(e => e !== TIMEOUT_VALUE)
  }

  return await responses
}