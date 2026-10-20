export function authorized(req: Request) {
  const key = process.env.ADMIN_KEY
  if (!key) return true
  return req.headers.get('x-admin-key') === key
}
