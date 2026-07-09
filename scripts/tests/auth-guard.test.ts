// Guards the invariant the whole admin API depends on: every mutating endpoint
// rejects an unauthenticated request with 401 BEFORE doing any work. Runs in the
// normal build (see package.json "test:security") so this can't silently
// regress. Executed with tsx (`node --import tsx --test`), no bundler needed.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import uploadHandler from '../../api/admin/upload.ts'
import setSlotHandler from '../../api/admin/set-slot.ts'
import deleteHandler from '../../api/admin/delete.ts'

type MockRes = {
  statusCode: number
  body: unknown
  headers: Record<string, string>
  status(code: number): MockRes
  json(payload: unknown): MockRes
  setHeader(key: string, value: string): MockRes
  end(): MockRes
}

function mockRes(): MockRes {
  const res: MockRes = {
    statusCode: 0,
    body: undefined,
    headers: {},
    status(code) {
      res.statusCode = code
      return res
    },
    json(payload) {
      res.body = payload
      return res
    },
    setHeader(key, value) {
      res.headers[key] = value
      return res
    },
    end() {
      return res
    },
  }
  return res
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function req(headers: Record<string, string> = {}): any {
  return { method: 'POST', headers, body: {} }
}

const endpoints = [
  { name: 'upload', handler: uploadHandler },
  { name: 'set-slot', handler: setSlotHandler },
  { name: 'delete', handler: deleteHandler },
] as const

for (const { name, handler } of endpoints) {
  test(`${name}: no session cookie → 401 unauthorized`, async () => {
    const res = mockRes()
    await handler(req(), res)
    assert.equal(res.statusCode, 401, `${name} must 401 when logged out`)
    assert.deepEqual(res.body, { error: 'unauthorized' })
  })

  test(`${name}: forged/garbage session cookie → 401 unauthorized`, async () => {
    const res = mockRes()
    await handler(req({ cookie: 'sandrine_admin=not.a.valid.token' }), res)
    assert.equal(res.statusCode, 401, `${name} must 401 on an invalid token`)
    assert.deepEqual(res.body, { error: 'unauthorized' })
  })
}
