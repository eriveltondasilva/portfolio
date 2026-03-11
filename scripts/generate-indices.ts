import { join } from 'node:path'
import { cwd } from 'node:process'

const CONTENT_DIR = join(cwd(), 'content')
const POSTS_DIR = join(CONTENT_DIR, 'posts')
const SERIES_DIR = join(CONTENT_DIR, 'series')
const OUTPUT_POSTS = join(CONTENT_DIR, 'posts-index.json')
const OUTPUT_SERIES = join(CONTENT_DIR, 'series-index.json')

console.log(POSTS_DIR)
