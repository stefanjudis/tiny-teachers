const { toSlug } = require('../../lib/slug');
const { getTeachers, getTags } = require('../../lib/teachers');

module.exports = async function () {
  const teacherData = (await getTeachers()).map((helper) => ({
    ...helper,
    slug: toSlug(helper.name),
  }));

  const tags = getTags(teacherData)
    .map((tag) => ({
      name: tag,
      title: tag,
      slug: `${toSlug(tag)}`,
      items: teacherData.filter((teacher) => teacher.tags.includes(tag)),
    }))
    .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

  const homeTag = {
    name: 'All',
    title: 'Home',
    slug: 'home',
    items: teacherData,
  };

  return [homeTag, ...tags];
};
