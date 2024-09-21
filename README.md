# abortable-promise

Promises that can be aborted using AbortController

```typescript
const abortController = new AbortController()
const promise = new AbortablePromise(
  (resolve, reject) => {
    setTimeout(() => {
      resolve('success')
    }, 200)
    setTimeout(() => {
      reject('error')
    }, 300)
  },
  { signal: abortController.signal },
)

setTimeout(() => {
  abortController.abort('aborted by the user')
}, 100)

promise
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.log(error)
  })
```

It should log `aborted by the user`
