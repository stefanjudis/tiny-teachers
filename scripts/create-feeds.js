const Feed = require('feed').Feed;
const { description } = require('../package.json');
const { getTeachers } = require('../lib/teachers');
const { writeFile } = require('fs').promises;
const { join } = require('path');
const { toSlug } = require('../lib/slug');

(async () => {
  const helpers = await getTeachers();
  try {
    const feed = new Feed({
      title: 'Tiny Teachers',
      description,
      id: 'https://tiny-teachers.dev/',
      link: 'https://tiny-teachers.dev/',
      language: 'en',
      image: 'http://example.com/image.png',
      favicon: 'https://tiny-teachers.dev/favicon.ico',
      copyright: `All rights reserved ${new Date().getUTCFullYear()}, Stefan Judis`,
      generator: 'Feed for tiny-teachers.dev', // optional, default = 'Feed for Node.js'
      feedLinks: {
        atom: 'https://tiny-teachers.dev/feed.atom',
        rss: 'https://tiny-teachers.dev/feed.xml',
      },
      author: {
        name: 'Stefan Judis',
        email: 'stefanjudis@gmail.com',
        link: 'https://www.stefanjudis.com',
      },
    });

    helpers
      .sort((a, b) => (new Date(a.addedAt) < new Date(b.addedAt) ? 1 : -1))
      .forEach(({ addedAt, name, desc, url }) => {
        feed.addItem({
          title: `New teacher added: ${name} – ${desc}.`,
          id: toSlug(name),
          link: url,
          description: desc,
          content: `More teachers! 🎉🎉🎉 "${name}" is available at ${url}`,
          date: new Date(addedAt),
          image: `https://tiny-teachers.dev/screenshots/${toSlug(name)}@1.jpg`,
        });
      });

    console.log('Writing rss feed');
    writeFile(join('.', 'static', 'feed.xml'), feed.rss2());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
