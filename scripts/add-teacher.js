const inquirer = require('inquirer');
const { getTeachers, writeTeacher, getTags } = require('../lib/teachers');

(async () => {
  try {
    const tags = getTags(await getTeachers());

    console.log('Thank you for contributing to tiny-teachers.dev!\n');
    console.log(
      'Let me give you some guidance and tips on how to add a "good teacher":\n'
    );
    console.log(
      '✅ `desc` – DO: "Learn about CSS flexbox." or "Learn how to design well."'
    );
    console.log(
      '❌ `desc` – DON\'T: "ABC is a tool that can something great"\n'
    );
    console.log('✅ `maintainers` – DO: individualA,individualB');
    console.log("❌ `maintainers` – DON'T: companyA\n");

    const newTeacher = await inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name of the teacher:',
      },
      { name: 'desc', type: 'input', message: 'Enter a description:' },
      { name: 'url', type: 'input', message: 'Enter a URL:' },
      {
        name: 'tags',
        type: 'checkbox',
        message: 'Pick some tags:',
        choices: tags,
      },
      {
        name: 'maintainers',
        type: 'input',
        message:
          'Enter GitHub handles of the tool maintainers (comma separated):',
      },
    ]);

    // if (!newTeacher.tags || !newTeacher.tags.length) {
    //   throw new Error(
    //     'Please define at least one tag for your teacher.\nIf no tag fits your teacher please open issue to add a new tag.\n👉 https://github.com/stefanjudis/tiny-teachers/issues/new'
    //   );
    // }

    newTeacher.addedAt = new Date().toISOString().substring(0, 10);
    newTeacher.maintainers = newTeacher.maintainers.length
      ? newTeacher.maintainers.split(',')
      : [];

    const filePath = await writeTeacher(newTeacher);

    console.log(`Thanks!!! ${filePath} was created!`);
  } catch (error) {
    console.error(error);
  }
})();
