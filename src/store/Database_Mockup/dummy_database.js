import { project_table } from "./projects";
import { task_table } from "./tasks";
import { assignment_table } from "./assignments";
import { employee_table } from "./employees";
import { TicksPerDay, toDateString } from "./util/today";

export default class DummyDb {

    GetChartDataFor(project_id) {
        let chart_data = []

        let prj = project_table.find(it => it.project_id === project_id)
        if (prj === undefined) {
            console.log(`no project for ${project_id}`)
            return chart_data
        }

        let project_progress = 0
        if (prj.project_hours_is > 0)
            project_progress = prj.project_hours_estimated / prj.project_hours_is

        chart_data.push({
            id: prj.project_id,
            name: prj.project_name,
            description: prj.project_description,
            start: prj.project_start_date,
            end: prj.project_end_date,
            progress: project_progress,
            hours_estimated: prj.project_hours_estimated,
            hours_is: prj.project_hours_is,
            type: 1,
            link_by_arrow: false,
        })

        for (let task of task_table.filter(it => it.project_id === prj.project_id)) {

            let task_progress = 0
            if (task.task_hours_is > 0)
                task_progress = task.task_hours_estimated / task.task_hours_is

            chart_data.push({
                id: task.task_id,
                name: task.task_name,
                description: task.task_description,
                start: task.task_start_date,
                end: task.task_end_date,
                progress: task_progress,
                hours_estimated: task.task_hours_estimated,
                hours_is: task.task_hours_is,
                category: task.task_type,
                dependencies: task.project_id,
                type: 2,
                link_by_arrow: false,
            })

            for (let assignment of assignment_table.filter(it => it.task_id === task.task_id)) {

                let employee = employee_table.find(it => it.employee_id === assignment.employee_id)

                chart_data.push({
                    id: employee.employee_id,
                    name: employee.employee_name,
                    role: employee.employee_role,
                    start: assignment.assignment_start_date,
                    end: assignment.assignment_end_date,
                    progress: 0,
                    hours_per_day: assignment.assignment_hours_per_day,
                    dependencies: assignment.task_id,
                    type: 3,
                    link_by_arrow: false,

                })
            }
        }

        return chart_data
    }

    GetChartData() {
        let chart_data = []

        for (let prj of project_table) {
            let project_data = this.GetChartDataFor(prj.project_id)
            chart_data.push(...project_data)
        }

        return chart_data
    }

    CalculateAssignedWorkload(id){
        let prj = project_table.find(it => it.project_id === id)
        if (prj !== undefined) {
            return projectAssignedWorkload(prj)
        }

        let task = task_table.find(it => it.task_id == id)
        if(task !== undefined){
            return taskAssignedWorkload(task)
        }
    }

    CreateEmployee(employee){
        if(employee_table.find(it => it.employee_id === employee.employee_id) !== undefined)
            return false

        employee_table.push(employee)
        return true
    }

    GetDefinedRoles(){
        return [...new Set(employee_table.map(it => it.employee_role))]
    }

    CreateTaskInProject(projectId, taskData){
        let prj = project_table.find(it => it.project_id === projectId)
        if (prj === undefined) return false

        let taskCount = task_table.filter(it => it.project_id === prj.project_id).length + 1

        let entry = {
            task_id: `${prj.project_id}_${taskCount}`,
            project_id: prj.project_id,
            task_name: taskData.task_name,
            task_description: taskData.task_description,
            task_type: taskData.task_type,
            task_start_date: taskData.task_start_date,
            task_start_as_text: toDateString(taskData.task_start_date),
            task_end_date: taskData.task_end_date,
            task_end_as_text: toDateString(taskData.task_end_date),
            task_hours_estimated: taskData.task_hours_estimated,
            task_hours_is: 0,
            version: 1,
        }

        task_table.push(entry)
        return true
    }

    AssignEmployeeToTask(taskId, assignment){
        let task = task_table.find(it => it.task_id === taskId)
        if (task === undefined) return false

        if(assignment_table.find(it => it.task_id === task.task_id && it.employee_id === assignment.assignment_employee_id) !== undefined)
            return false

        let entry =  {
            task_id: task.task_id,
            employee_id: assignment.assignment_employee_id,
            assignment_start_date: assignment.assignment_start_date,
            assignment_end_date: assignment.assignment_end_date,
            assignment_hours_per_day: assignment.assignment_hours_per_day,
            version: 1,
        }   

        assignment_table.push(entry)
        return true
    }

    CreateProject(projectData){
        if (project_table.find(it => it.project_id === projectData.project_id)) return false

        let entry = {
            project_id: projectData.project_id,
            project_name: projectData.project_name,
            project_description: projectData.project_description,
            project_start_date: projectData.project_start_date,
            project_start_as_text: toDateString(projectData.project_start_date),
            project_end_date: projectData.project_end_date,
            project_end_as_text: toDateString(projectData.project_end_date),
            project_hours_estimated: projectData.project_hours_estimated,
            project_hours_is: 0,
            version: 1,
        }

        project_table.push(entry)
        return true
    }

    GetAvailableEmployeeRoles(){
        return [
            'Developer',
            'Project Lead',
            'Tester',
        ]
    }

    GetAvailableTaskTypes(){
        return [
            'Development',
            'QA',
            'Org'
        ]
    }
}


function projectAssignedWorkload(prj){
    let assigned_hours = 0
    for (let task of task_table.filter(it => it.project_id === prj.project_id)) {
        assigned_hours += taskAssignedWorkload(task)
    }
    return assigned_hours
}

function taskAssignedWorkload(task){
    let assigned_hours = 0
    for (let assignment of assignment_table.filter(it => it.task_id === task.task_id)) {
        let assigned_days = (assignment.assignment_end_date - assignment.assignment_start_date) / TicksPerDay
        assigned_hours += assigned_days * assignment.assignment_hours_per_day
    }
    return assigned_hours
}