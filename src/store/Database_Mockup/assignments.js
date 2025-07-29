import { daysSince } from "./util/today";

export const assignment_table = [
    {
        task_id: '20250728_1',
        employee_id: 'MF',
        assignment_start_date: daysSince(1),
        assignment_end_date: daysSince(5),
        assignment_hours_per_day: 8,
        version: 1,
    },
    {
        task_id: '20250728_2',
        employee_id: 'MM',
        assignment_start_date: daysSince(5),
        assignment_end_date: daysSince(20),
        assignment_hours_per_day: 8,
        version: 1,
    }   
]