const TIMEOUT_VALUE = 'TIMEOUTRESOLVED'
const wait = (ms: number): Promise<undefined> => new Promise((resolve, reject) => setTimeout(resolve.bind(this, TIMEOUT_VALUE), ms))

export const throttle = async (input: any[], fn: Function, qty: number, interval: number): Promise<any[]> => {
  const remaining = input.slice(0)
  let responses = []
  let i = 0

  while (remaining.length > 0) {
    let activePromises = []
    const batch = remaining.splice(0, qty)
    console.log(`================================`)
    console.log(`Requesting batch ${i++}`)

    for (let data of batch) {
      activePromises.push(new Promise(async (resolve, reject) => {
        try {
          const response = (await fn(data)).data
          resolve(response)
        } catch (e) {
          reject(e)
        }
      }))
    }

    activePromises = remaining.length > 0 ? [...activePromises, wait(interval)] : activePromises
    console.log('Awaiting results')
    responses = responses.concat(await Promise.all(activePromises)).filter(e => e !== TIMEOUT_VALUE)
    console.log('Merging results')
  }

  return await Promise.resolve(responses)
}