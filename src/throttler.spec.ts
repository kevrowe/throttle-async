import { throttle } from "./throttler";

describe('Throttler', () => {
  it('can return errors and successful results in the same call', async () => {
    const data = Array.from(Array(10), (v, i) => i)
    const callback = jest.fn().mockImplementation(async (input: number) => {
      return `Your value was: ${input}`
    })
    const err = new Error('Something went wrong')

    callback.mockImplementationOnce(() => err)

    const response = await throttle(data, callback, 10, 0)

    expect(response[0]).toEqual(err)
    expect(response[1]).not.toEqual(err)
  })
  it('should delay execution', async () => {
    const data = Array.from(Array(100), (v, i) => i)
    const callback = async (input: number) => {
      return `Your value was: ${input}`
    }
    const start = Date.now()

    const response = await throttle(data, callback, 10, 500)

    expect(start).toBeLessThan(Date.now() - 4000)
  })
  it('return type and input type can differ', async () => {
    const data = Array.from(Array(100), (v, i) => i)
    const callback = async (input: number) => {
      return `Your value was: ${input}`
    }

    const response = await throttle(data, callback, 100, 0)

    expect(typeof data[0]).not.toBe(typeof response[0])
  })
  it('returns the correct amount of values', async () => {
    const data = Array.from(Array(100), (v, i) => i)
    const callback = async (input: number) => {
      return input * 5
    }

    const response = await throttle(data, callback, 100, 0)

    expect(response).toHaveLength(data.length)
  })
})