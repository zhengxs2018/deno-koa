import { Path, ParseOptions, pathToRegExp } from 'https://deno.land/x/oak/pathToRegExp.ts'

import { use, RequestHandler } from './server.ts'


/** 使用路由匹配
 *
 * @param path         匹配路径
 * @param callback     回调函数
 */
export function route(path: string, callback: RequestHandler): void

/** 使用路由匹配
 *
 * @param name         路由名称
 * @param path         匹配路径
 * @param callback     回调函数
 */
export function route(
  name: string,
  path: string,
  callback: RequestHandler
): void

/** 使用路由匹配
 *
 * @param method       请求方法
 * @param path         匹配路径
 * @param callback     回调函数
 */
export function route(
  method: string,
  path: string,
  callback: RequestHandler
): void

/** 使用路由匹配
 *
 * @param name         路由名称
 * @param method       请求方法
 * @param path         匹配路径
 * @param callback     回调函数
 */
export function route(
  method: string,
  path: string,
  callback: RequestHandler
): void

export function route() {
  const [method, path, callback] = normalizeArgs(Array.from(arguments))

  const parse = match(path)

  use((req, next) => {
    const result = parse(req.url || '/')

    if (result === false || req.method !== method) {
      return next()
    }

    req.params = result.params
    return callback(req, next)
  })
}

/** 格式参数
 *
 * @private
 *
 * @param name         路由名称
 * @param method       请求方法
 * @param path         匹配路径
 * @param callback     回调函数
 */
function normalizeArgs(
  args: any[]
): [string, string, RequestHandler] {
  if (args.length === 3) {
    const [method, path, callback] = args
    return [method.toUpperCase(), path, callback]
  }

  if (args.length === 2) {
    const [path, callback] = args
    return ['GET', path, callback]
  }

  throw new Error(`Route options 'path' and 'callback' required`)
}

// vscode 插件没装，提示出不来，难受。。。
export function match(str: Path, options?: ParseOptions): any {
  const keys: any[] = [];
  const re = pathToRegExp(str, keys, options)
  return regexpToFunction(re, keys, options);
}

export function regexpToFunction(
  re: RegExp,
  keys: any[],
  options: any = {}
): any {
  const { decode = (x: string) => x } = options;

  return function(pathname: string) {
    const m = re.exec(pathname);
    if (!m) return false;

    const { 0: path, index } = m;
    const params = Object.create(null);

    for (let i = 1; i < m.length; i++) {
      // tslint:disable-next-line
      if (m[i] === undefined) continue;

      const key = keys[i - 1];

      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i].split(key.prefix + key.suffix).map(value => {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i], key);
      }
    }

    return { path, index, params };
  };
}
