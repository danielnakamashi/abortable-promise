export default class AbortablePromise<T> extends Promise<T> {
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: unknown) => void,
    ) => void,
    options?: { signal?: AbortSignal },
  ) {
    let thisResolve: (value: T | PromiseLike<T>) => void
    let thisReject: (reason?: unknown) => void

    super(
      (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: unknown) => void,
      ) => {
        thisResolve = resolve
        thisReject = reject

        options?.signal?.addEventListener('abort', () => {
          reject(options.signal?.reason)
        })
      },
    )

    executor(
      (value) => {
        thisResolve(value)
      },
      (reason) => {
        thisReject(reason)
      },
    )
  }
}
