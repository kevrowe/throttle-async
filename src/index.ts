import { getComment } from './jsonClient'
import { throttle } from './throttler'

const app = async () => {
  const ids = Array.from([...Array(100)], (e, i) => ++i)
  const comments = await throttle(ids, getComment, 10, 500)
  console.log(comments)
  console.log(`Count: ${comments.length}`)
}

app()