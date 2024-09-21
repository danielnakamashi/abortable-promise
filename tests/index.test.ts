import assert from 'node:assert'
import { describe, it } from 'node:test'
import AbortablePromise from '../src'

// function waitFor(throwableFn: () => unknown, { timeout = 1_000, interval = 50 }: { timeout?: number, interval?: number }) {
//   const startTime = Date.now();
//   while (true) {
//     try {
//       return throwableFn()
//     } catch {
//
//     }
//   }
// }

describe('AbortController', () => {
  it('should call the resolved callback', async (t) => {
    const mockResolve = t.mock.fn()
    const mockReject = t.mock.fn()
    const promise = new AbortablePromise((resolve, reject) => {
      setTimeout(reject, 2)
      setTimeout(resolve, 1)
    })

    await promise.then(mockResolve, mockReject)

    assert.strictEqual(mockResolve.mock.callCount(), 1)
    assert.strictEqual(mockReject.mock.callCount(), 0)
  })

  it('should call the rejected callback', async (t) => {
    const mockResolve = t.mock.fn()
    const mockReject = t.mock.fn()
    const promise = new AbortablePromise((resolve, reject) => {
      setTimeout(resolve, 2)
      setTimeout(reject, 1)
    })

    await promise.then(mockResolve, mockReject)

    assert.strictEqual(mockReject.mock.callCount(), 1)
    assert.strictEqual(mockResolve.mock.callCount(), 0)
  })

  it('should call the rejected callback due to AbortController', async (t) => {
    const mockResolve = t.mock.fn()
    const mockReject = t.mock.fn()
    const abortController = new AbortController()
    const promise = new AbortablePromise(
      (resolve, reject) => {
        setTimeout(resolve, 2)
        setTimeout(reject, 3)
      },
      { signal: abortController.signal },
    )

    setTimeout(() => {
      abortController.abort('abort reason')
    }, 1)

    await promise.then(mockResolve, mockReject)

    assert.strictEqual(mockReject.mock.callCount(), 1)
    assert.deepStrictEqual(mockReject.mock.calls[0].arguments, ['abort reason'])
    assert.strictEqual(mockResolve.mock.callCount(), 0)
  })
})
