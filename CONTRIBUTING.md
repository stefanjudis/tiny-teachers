# Criteria to add a new tiny teacher

- ❗ **Please only add one (!) new teacher per pull request.** This will speed up the review and merge process.

- ❗ **Please have a look at open PRs and issues.** There might be the chance that someone else opened a PR with your tool already. :)

## What does count as a tiny teacher?

> A collection of online learning tools and courses.

- A tiny teacher is any website or web application that educates developers in a playful way.
- A tiny teacher does not have to be available on GitHub and has not to be open source.
- A tiny teacher can be used right away.
- **It has to be useful, that's all.** 🎉

## What does not(!) count as a tiny helper?

- **JS or CSS libraries / npm modules** (tiny-teachers.dev is about online resources)

## Formatting of tiny teachers

Your generated helper JSON files have to follow these criterias:

- `desc` - includes an "actionable sentence"

  ✅ DO: "Learn about CSS flexbox"

  ❌ DON'T: "ABC is a tool that teaches flexbox"

- `maintainers` - includes a human being (and not companies)

  ✅ DO: ["individualA", "individualB"]

  ❌ DON'T: ["companyA"]

  _It's okay if the helper is closed source and source code is not available on GitHub._

- `tags` - includes tags provided by the `npm run helper:add` cli command

  ✅ DO: ["Accessibility", "Color"]

  ❌ DON'T: ["Some new tag"]

  _Please don't just create some new tags, we want to be careful to not introduce tags that will only include one helper._

  _Please don't set more than three tags, we want to keep the tags tidy._

---

To sum it up – your JSON addition should look as follows:

```json
{
  "name": "A new teacher",
  "desc": "Learn about CSS flexbox.",
  "url": "https://some.url",
  "tags": ["Misc"],
  "maintainers": ["PersonA"],
  "addedAt": "2020-01-17"
}
```
