import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { inspectPostAssets } from './post-assets';

const createdFolders: string[] = [];

async function createPostFolder(files: Record<string, string | Buffer> = {}): Promise<string> {
  const folder = await mkdtemp(join(tmpdir(), 'post-assets-'));
  createdFolders.push(folder);

  for (const [name, content] of Object.entries({ 'meta.yml': '', 'index.mdx': '', ...files })) {
    await mkdir(dirname(join(folder, name)), { recursive: true });
    await writeFile(join(folder, name), content);
  }

  return folder;
}

afterEach(async () => {
  const folders = createdFolders.splice(0);

  await Promise.all(folders.map((folder) => rm(folder, { recursive: true, force: true })));
});

describe('inspectPostAssets', () => {
  it('should report nothing for a valid post folder', async () => {
    const folder = await createPostFolder({ 'images/diagram.png': '' });

    const report = await inspectPostAssets(folder, '![Diagram](./images/diagram.png)');

    expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
  });

  describe('cover', () => {
    it('should detect the cover file at the root of the post folder', async () => {
      const folder = await createPostFolder({ 'cover.jpg': '' });

      const report = await inspectPostAssets(folder, '');

      expect(report).toEqual({ errors: [], warnings: [], coverFile: 'cover.jpg' });
    });

    it('should fail when there is more than one cover', async () => {
      const folder = await createPostFolder({ 'cover.jpg': '', 'cover.png': '' });

      const { errors } = await inspectPostAssets(folder, '');

      expect(errors).toEqual([expect.stringContaining('more than one cover found')]);
    });

    it('should fail when the cover name is not lowercase', async () => {
      const folder = await createPostFolder({ 'Cover.PNG': '' });

      const { errors } = await inspectPostAssets(folder, '');

      expect(errors).toEqual([expect.stringContaining('"Cover.PNG": the cover must be named')]);
    });

    it('should warn about unexpected entries in the post folder', async () => {
      const folder = await createPostFolder({ 'notes.txt': '' });

      const { warnings } = await inspectPostAssets(folder, '');

      expect(warnings).toEqual([expect.stringContaining('unexpected entry "notes.txt"')]);
    });
  });

  describe('image files', () => {
    it('should fail when an image name is not lowercase kebab-case', async () => {
      const folder = await createPostFolder({ 'images/My-Image.png': '' });

      const { errors } = await inspectPostAssets(folder, '![x](./images/My-Image.png)');

      expect(errors).toEqual([expect.stringContaining('use lowercase letters, numbers')]);
    });

    it('should warn when an image is larger than 1 MB', async () => {
      const folder = await createPostFolder({ 'images/big.png': Buffer.alloc(1024 * 1024 + 1) });

      const { warnings } = await inspectPostAssets(folder, '![x](./images/big.png)');

      expect(warnings).toEqual([expect.stringContaining('images/big.png: 1.0 MB')]);
    });

    it('should accept images inside nested folders', async () => {
      const folder = await createPostFolder({ 'images/gallery/photo-1.png': '' });

      const report = await inspectPostAssets(folder, '![x](./images/gallery/photo-1.png)');

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });

    it('should ignore hidden files inside the images folder', async () => {
      const folder = await createPostFolder({ 'images/.DS_Store': '' });

      const report = await inspectPostAssets(folder, '');

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });

    it('should warn about images that are not referenced in the content', async () => {
      const folder = await createPostFolder({ 'images/unused.png': '' });

      const { warnings } = await inspectPostAssets(folder, '');

      expect(warnings).toEqual([
        expect.stringContaining('./images/unused.png: not referenced in index.mdx.'),
      ]);
    });
  });

  describe('image references', () => {
    it('should fail when an image is referenced outside the images folder', async () => {
      const folder = await createPostFolder();

      const { errors } = await inspectPostAssets(folder, '![x](./assets/a.png)');

      expect(errors).toEqual([expect.stringContaining('images must live in "images/"')]);
    });

    it('should fail when the referenced image does not exist', async () => {
      const folder = await createPostFolder({ 'images/other.png': '' });

      const { errors } = await inspectPostAssets(folder, '![x](./images/missing.png)');

      expect(errors).toEqual([expect.stringContaining('./images/missing.png: file not found')]);
    });

    it('should fail when a JSX component receives the image as a string src', async () => {
      const folder = await createPostFolder({ 'images/a.png': '' });

      const { errors } = await inspectPostAssets(folder, '<Image src="./images/a.png" alt="" />');

      expect(errors).toEqual([expect.stringContaining('a string src on a JSX component')]);
    });

    it('should count an HTML img tag as a reference', async () => {
      const folder = await createPostFolder({ 'images/a.png': '' });

      const report = await inspectPostAssets(folder, '<img src="./images/a.png" alt="" />');

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });

    it('should count an image import as a reference', async () => {
      const folder = await createPostFolder({ 'images/a.png': '' });

      const report = await inspectPostAssets(folder, "import cover from './images/a.png';");

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });

    it('should ignore the query string and the hash of a reference', async () => {
      const folder = await createPostFolder({ 'images/a.png': '' });

      const report = await inspectPostAssets(folder, '![x](./images/a.png?raw#top)');

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });

    it.each([
      { label: 'an external URL', content: '![x](https://example.com/a.png)' },
      { label: 'an absolute path', content: '![x](/img/a.png)' },
      { label: 'inline code', content: 'Use `![x](./assets/a.png)` here' },
      { label: 'an MDX comment', content: '{/* ![x](./assets/a.png) */}' },
      { label: 'a fenced code block', content: '```md\n![x](./assets/a.png)\n```' },
      {
        label: 'a fence wrapping another fence',
        content: '````md\n```md\n![x](./assets/a.png)\n```\n````',
      },
    ])('should ignore a reference inside $label', async ({ content }) => {
      const folder = await createPostFolder();

      const report = await inspectPostAssets(folder, content);

      expect(report).toEqual({ errors: [], warnings: [], coverFile: null });
    });
  });
});
