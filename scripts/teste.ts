import { join } from 'node:path'

console.log(Bun.color(import.meta.dir, 'red'))
console.log(join(import.meta.dir, '..'))
console.log(join(import.meta.dir, '..', 'content', 'schemas'))
