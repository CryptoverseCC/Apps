
export const makeCancelable = (promise) => {
  let hasCanceled = false;
  let isResolved = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => {
        isResolved = true;
        if (!hasCanceled) {
          resolve(val);
        }
      },
      (error) => {
        isResolved = true;
        if (!hasCanceled) {
          reject(error);
        }
      },
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true;
    },
    isResolved() {
      return isResolved;
    },
  };
};
