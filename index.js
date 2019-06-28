/* eslint-disable import/prefer-default-export */

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

const promiseWaterfallPipeline = async (
  initialArguments,
  transforms,
  concurrency = 3
) => {
  const argsWithFuncs = initialArguments.map(args => ({
    args: isIterable(args) ? [...args] : [args],
    funcs: [...transforms],
  }))
  let promises = argsWithFuncs.splice(0, concurrency)
  let res = []
  const results = []

  while (promises.length) {
    res = await Promise.all(promises.map(p => p.funcs.pop()(...p.args)))
    results.push(...res)
    promises = promises
      .map((p, i) => ({ ...p, args: res[i] }))
      .filter(p => p.funcs.length > 0)
      .concat(argsWithFuncs.splice(0, concurrency))
  }
  console.log(results)
  return results
}

// const transforms = [promise1, promise2, promise3];
// (async () => {
//   await promisePipeline(initialArguments, transforms, 3)
//   await promisePipeline(initialArgumentsArrays, transforms, 3)
// })()

module.exports = promiseWaterfallPipeline
