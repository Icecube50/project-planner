import { daysSince, toDateString } from "./util/today";

export const task_table = [
    {
        task_id: '20250728_1',
        project_id: '20250728',
        task_name: 'Onboarding',
        task_description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
        task_type: 'PL',
        task_start_date: daysSince(1),
        task_start_as_text: toDateString(daysSince(1)),
        task_end_date: daysSince(5),
        task_end_as_text: toDateString(daysSince(5)),
        task_hours_estimated: 40,
        task_hours_is: 0,
        version: 1,
    },
    {
        task_id: '20250728_2',
        project_id: '20250728',
        task_name: 'Development',
        task_description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
        task_type: 'KOS',
        task_start_date: daysSince(5),
        task_start_as_text: toDateString(daysSince(5)),
        task_end_date: daysSince(20),
        task_end_as_text: toDateString(daysSince(20)),
        task_hours_estimated: 200,
        task_hours_is: 0,
        version: 1,
    }
]