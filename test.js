import test from 'ava'
import promiseWaterfallPipeline from '.'

const promise1 = async id =>
  new Promise(res =>
    setTimeout(() => console.log('promise1', id) || res([id, true]), 1000)
  )
const promise2 = async id =>
  new Promise(res =>
    setTimeout(
      () => console.log('promise2', id) || res([id, `${id}-123`]),
      1000
    )
  )
const promise3 = async (id, subNumber) =>
  new Promise(res =>
    setTimeout(() => console.log('promise3', id, subNumber) || res([id]), 1000)
  )

const transforms = [promise1, promise2, promise3]

const initialArguments = ['1', '2', '3', '4', '5']
const initialArgumentsObjects = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
  { id: '5' },
]
const initialArgumentsArrays = [['1'], ['2'], ['3'], ['4'], ['5']]

test('main', async t => {
  t.is(await promiseWaterfallPipeline(initialArguments, transforms, 3), [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
  ])
})

// test('rejects', async t => {
//   const fixture = [
//     Promise.resolve(3),
//     delay.reject(50, { value: new Error('foo') }),
//   ]

//   await t.throwsAsync(
//     promiseWaterfallPipeline(fixture, (a, b) => a + b, 0),
//     'foo'
//   )
// })

// test('reducer throws', async t => {
//   const fixture = [Promise.resolve(3), Promise.resolve(3)]

//   await t.throwsAsync(
//     promiseWaterfallPipeline(fixture, () => {
//       throw new Error('foo')
//     }),
//     'foo'
//   )
// })

// test('handles empty iterable', async t => {
//   t.deepEqual(await promiseWaterfallPipeline([], () => {}, 0), 0)
// })
