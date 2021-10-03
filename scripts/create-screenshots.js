const pLimit = require('p-limit');
const chrome = require('chrome-aws-lambda');
const { statSync, mkdirSync } = require('fs');
const { join } = require('path');
const copyDir = require('copy-dir');
const Jimp = require('jimp');
const { getTeachers } = require('../lib/teachers');
const { toSlug } = require('../lib/slug');

function exists(path) {
  try {
    statSync(path);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

async function screenshotTeacher(browser, teacher, screenshotDir) {
  try {
    const doubleSize = join(screenshotDir, `${toSlug(teacher.name)}@2.jpg`);
    const singleSize = join(screenshotDir, `${toSlug(teacher.name)}@1.jpg`);
    let sigil = '✅';
    if (!(await exists(doubleSize))) {
      const page = await browser.newPage();
      page.setViewport({
        width: 1000,
        height: 600,
      });
      await page.goto(teacher.url, { waitUntil: 'networkidle0' });

      await page.screenshot({ path: doubleSize });
      await page.close();
      sigil = '📸';
    }
    if (!exists(singleSize)) {
      await (await Jimp.read(doubleSize))
        .quality(75)
        .resize(500, Jimp.AUTO)
        .write(singleSize);
    }
    console.log(`${sigil} ${teacher.name} at ${teacher.url}`);
  } catch (error) {
    console.error(`Failed to screenshot ${teacher.name}`);
    throw error;
  }
}

async function makeScreenshots(helpers, { screenshotCacheDir }) {
  console.log('Taking screenshots...');
  const browser = await chrome.puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });
  const limit = pLimit(8);
  const screenshotPromises = helpers.map((teacher) =>
    limit(() => screenshotTeacher(browser, teacher, screenshotCacheDir))
  );
  await Promise.all(screenshotPromises);
  await browser.close();
}

(async () => {
  try {
    const screenshotCacheDir = join(__dirname, '..', '.cache', 'screenshots');

    if (!exists(screenshotCacheDir)) {
      mkdirSync(screenshotCacheDir, { recursive: true });
    }

    const helpers = await getTeachers();

    await makeScreenshots(helpers, { screenshotCacheDir });

    const publicScreenshotDir = join(__dirname, '..', 'static', 'screenshots');
    copyDir.sync(screenshotCacheDir, publicScreenshotDir);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
