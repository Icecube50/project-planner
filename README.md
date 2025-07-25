# project-planner

## Project Setup

Uses [Gantt](https://github.com/Icecube50/gantt_project_planning) to render the chart. The modified version of that library is linked locally so you have to get & build from the linked repo.

1. Clone [Gantt](https://github.com/Icecube50/gantt_project_planning) & build.
2. `cd` gantt_project_planning/dist
3. Run `npm link` to make npm aware of the local package.
4. `cd` project-planner
5. Run `npm link frappe-gantt`

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
