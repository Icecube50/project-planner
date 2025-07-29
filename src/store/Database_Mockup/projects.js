import { daysSince, toDateString } from "./util/today"

export const project_table = [
    {
        project_id: '20250728',
        project_name: 'Demo Project',
        project_description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        project_start_date: daysSince(1),
        project_start_as_text: toDateString(daysSince(1)),
        project_end_date: daysSince(30),
        project_end_as_text: toDateString(daysSince(30)),
        project_hours_estimated: 400,
        project_hours_is: 0,
        version: 1,
    }
]