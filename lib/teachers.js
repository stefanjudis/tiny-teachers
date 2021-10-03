const { readFile, readdir, writeFile } = require('fs').promises;
const { toSlug } = require('./slug');
const path = require('path');

const teachersDir = path.resolve(__dirname, '..', 'teachers');

async function getTeachers() {
  const teachers = Object.values({
    ...(await getTeachersFromFiles()),
  });
  teachers.sort((a, b) =>
    a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
  );
  return teachers;
}

async function getTeachersFromFiles() {
  const files = (await readdir(teachersDir)).filter((name) =>
    name.endsWith('.json')
  );
  const texts = await Promise.all(
    files.map((name) => readFile(path.join(teachersDir, name)))
  );
  const helpers = texts.map((text) => JSON.parse(text));
  return Object.fromEntries(helpers.map((h) => [h.name, h]));
}

async function writeTeacher(teacher) {
  const filePath = path.join(teachersDir, `${toSlug(teacher.name)}.json`);
  const data = JSON.stringify(teacher, null, 2) + '\n';
  await writeFile(filePath, data);
  return filePath;
}

function getTags(teachers) {
  return [
    ...teachers.reduce((acc, cur) => {
      cur.tags.forEach((tag) => acc.add(tag));
      return acc;
    }, new Set()),
  ].sort((a, b) => (a < b ? -1 : 1));
}

module.exports.getTags = getTags;
module.exports.getTeachers = getTeachers;
module.exports.teachersDir = teachersDir;
module.exports.writeTeacher = writeTeacher;
