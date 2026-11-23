const base = import.meta.env.BASE_URL

/** 站内链接统一走这里：项目页部署时自动带上 /JtProductsIndex 前缀。 */
export function withBase(path: string): string {
  const root = base.replace(/\/$/, '')
  const clean = path.replace(/^\//, '')
  return clean ? `${root}/${clean}` : `${root}/`
}
