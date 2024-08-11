from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request,jsonify
from flask_marshmallow import Marshmallow
from dbinit import db,ma,app,mail
from employee import Employee, employee_schema,employees_schema
from task import Task, task_schema,tasks_schema
from employeetasks import EmployeeTasks,employee_task_schema,employees_tasks_schema
from reportEntries import ReportEntries, report_entries_schema, report_entry_schema
from datetime import datetime, date
from flask_mail import Message



@app.route('/checkEmployeeId',methods=['Get'])
def checkEmployeeId():
    emp_id = request.args.get('emp_id')
    if not emp_id:
        return jsonify({'error': 'emp_id parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'emp_id must be an integer.'}), 400
    employee = Employee.query.get(emp_id)
    if not employee:
        return jsonify({"exists":False})
    return jsonify({"exists":True})
    

@app.route('/addEmployee',methods=['POST'])
def addEmployee():
    required_fields = ['id','name', 'age', 'job', 'salary','email']
    for field in required_fields:
        if field not in request.json:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    id = request.json.get('id')  
    name = request.json['name']
    age = request.json['age']
    job_title = request.json['job']
    salary = request.json['salary']
    email=request.json['email']
    strengths = request.json.get('strengths', '')  
    weaknesses = request.json.get('weaknesses', '')  
    productivity_score = request.json.get('productivity_score')  

    if (type(id)!=int):
        return jsonify({'error': 'ID must be an integer'}), 400
    if type(age)!=int or age < 0:
        return jsonify({'error': 'Age must be a non-negative integer'}), 400
    if (type(salary)!=int and type(salary)!=float) or salary < 0:
        return jsonify({'error': 'Salary must be a non-negative float'}), 400

    existing_employee = Employee.query.get(id)
    if existing_employee:
        return jsonify({'error': 'Employee with this ID already exists.'}), 409
    try:
        emp = Employee(id,name,age,job_title,salary,email,strengths,weaknesses,productivity_score)
        db.session.add(emp)
        db.session.commit()
    except:
        return jsonify({'error': 'Email already exists'}), 400
    return jsonify(employee_schema.dump(emp)),201

@app.route('/addTask',methods=['Post'])
def addTask():
    required_fields = ['id','name','due_date','description']
    for field in required_fields:
        if field not in request.json:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    id=request.json['id']
    name = request.json['name']
    description=request.json['description']
    due_date=request.json['due_date']
    if (type(id)!=int):
        return jsonify({'error': 'ID must be an integer'}), 400
    try:
        due_date = datetime.strptime(due_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid due_date format. It should have the following format: YYYY-MM-DD'}), 400

    existing_task = Task.query.get(id)
    if existing_task:
        return jsonify({'error': 'Task with this ID already exists.'}), 409

    task=Task(id,name,description,due_date)
    db.session.add(task)
    db.session.commit()
    return jsonify(task_schema.dump(task)),201

@app.route('/getEmployees',methods=['Get'])
def getEmp():
    employeesList=Employee.query.all()
    return jsonify(employees_schema.dump(employeesList)),200

@app.route('/getTasks',methods=['Get'])
def getTasks():
    taskList=Task.query.all()
    tasks_with_completion = []
    for task in taskList:
        completion_percentage = getCompletionForTask(task.id)
        task_data = task_schema.dump(task)
        task_data['completion_percentage'] = completion_percentage
        tasks_with_completion.append(task_data)

    return jsonify(tasks_with_completion), 200


def taskWeightSum(taskid):
    weights = [et.weight for et in EmployeeTasks.query.filter_by(task_id=taskid).all()]
    total_weight = sum(weights)
    return total_weight
def empCompletionOnTask(empid,taskid):
    percents = [et.percent_completion for et in ReportEntries.query.filter_by(task_id=taskid,employee_id=empid).all()]
    total_percent = sum(percents)
    return total_percent

@app.route('/assignTask',methods=['Post'])
def assignTask():
    required_fields = ['empid','taskid','weight']
    for field in required_fields:
        if field not in request.json:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    empid=request.json['empid']
    taskid=request.json['taskid']
    weight=request.json['weight'] 
    if type(empid)!=int or type(taskid)!=int or type(weight)!=int:
        return jsonify({'message':'Bad inputs'}),400

    employee = Employee.query.get(empid)
    if not employee:
        return jsonify({'error': f'Employee with ID {empid} does not exist.'}), 400

    task = Task.query.get(taskid)
    if not task:
        return jsonify({'error': f'Task with ID {taskid} does not exist.'}), 400    
    employee_task = EmployeeTasks.query.filter_by(employee_id=empid, task_id=taskid).first()
    if employee_task:
        return jsonify({"message":"Employee already assigned this task"}),400

    avWeight=100-taskWeightSum(taskid)
    if weight<0 or weight>avWeight:
        return jsonify({"Message":"Invalid weight"}),400
    
    aet=EmployeeTasks(empid,taskid,weight)
    db.session.add(aet)
    db.session.commit()
    return jsonify(employee_task_schema.dump(aet)),201

@app.route('/updateCompletion', methods=['PUT'])
def updateCompletion():
    required_fields = ['empid','taskid','completion']
    for field in required_fields:
        if field not in request.json:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    empid = request.json['empid']
    taskid = request.json['taskid']
    new_completion = request.json['completion'] 
    employee_task = EmployeeTasks.query.filter_by(employee_id=empid, task_id=taskid).first()
    if not employee_task:
        return jsonify({'error': 'Employee task assignment not found.'}), 404

    empWeight=employee_task.weight
    remCompletion=empWeight-empCompletionOnTask(empid,taskid)
    if type(empid)!=int or type(taskid)!=int or type(new_completion)!=int:
        return jsonify({'message':'Bad inputs'}),400
    if new_completion<0 or new_completion>remCompletion:
        return jsonify({'message':'Invalid completion insertion'}),400


    newEntry=ReportEntries(empid,taskid,employee_task.id,new_completion)
    db.session.add(newEntry)
    db.session.commit()
    return jsonify(report_entry_schema.dump(newEntry)),201


@app.route('/getAssignableTasks',methods=['Get'])
def getAssignableTasks():
    emp_id = request.args.get('emp_id')
    if not emp_id:
        return jsonify({'error': 'emp_id parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'emp_id must be an integer.'}), 400
        
    employee = Employee.query.filter_by(id=emp_id).first()
    if not employee:
        return jsonify({'error': 'Employee with the provided ID does not exist.'}), 404

    employee_tasks = EmployeeTasks.query.filter_by(employee_id=emp_id).all()
    employee_taskID=[]
    for task in employee_tasks:
        employee_taskID.append(task.task_id)

    taskList=Task.query.all()
    tasks_with_completion = []
    for task in taskList:
        if task.id in employee_taskID:
            continue    
        task_data = task_schema.dump(task)
        task_data['remaining_weight'] = 100-taskWeightSum(task.id)
        tasks_with_completion.append(task_data)

    return jsonify(tasks_with_completion), 200

@app.route('/getTasksForEmployee',methods=['Get'])
def getTasksForEmployee():
    emp_id = request.args.get('emp_id')
    if not emp_id:
        return jsonify({'error': 'emp_id parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'emp_id must be an integer.'}), 400
        
    employee = Employee.query.filter_by(id=emp_id).all()
    if not employee:
        return jsonify({'error': 'Employee with the provided ID does not exist.'}), 404

    employee_tasks = EmployeeTasks.query.filter_by(employee_id=emp_id).all()
    serialized_tasks=[]
    for task in employee_tasks:
        percent_completion=0
        task2=Task.query.filter_by(id=task.task_id).first()
        if task2:
            percent_completion=empCompletionOnTask(emp_id,task2.id)
            serialized_tasks.append({'id': task2.id,'name':task2.name, 'description': task2.description,'weight':task.weight,'percent_completion':percent_completion,'due_date':task2.due_date})
    
    return jsonify(serialized_tasks), 200

@app.route('/getMaxAddablePercentageByTaskByEmployee',methods=['Get'])
def getMaxAddablePercentageByTaskByEmployee():
    emp_id = request.args.get('empid')
    if not emp_id:
        return jsonify({'error': 'empid parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'empid must be an integer.'}), 400
        
    employee = Employee.query.filter_by(id=emp_id).first()
    if not employee:
        return jsonify({'error': 'Employee with the provided ID does not exist.'}), 404

    task_id = request.args.get('taskid')
    if not task_id:
        return jsonify({'error': 'task_id parameter is missing.'}), 400
    try:
        task_id = int(task_id)
    except ValueError:
        return jsonify({'error': 'taskid must be an integer.'}), 400
        
    task = Task.query.filter_by(id=task_id).first()
    if not task:
        return jsonify({'error': 'Task with the provided ID does not exist.'}), 404

    employee_task = EmployeeTasks.query.filter_by(employee_id=employee.id, task_id=task.id).first()
    if not employee_task:
        return jsonify({'error': 'Employee task assignment not found.'}), 404
    
    empWeight=employee_task.weight
    remCompletion=empWeight-empCompletionOnTask(employee.id,task.id)
    return jsonify({"maximum_percentage": remCompletion}),200

@app.route('/getTaskUpdatesForEmployee',methods=['Get'])
def getTaskUpdatesForEmployee():
    emp_id = request.args.get('emp_id')
    if not emp_id:
        return jsonify({'error': 'emp_id parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'emp_id must be an integer.'}), 400
        
    employee = Employee.query.filter_by(id=emp_id).first()
    if not employee:
        return jsonify({'error': 'Employee with the provided ID does not exist.'}), 404
    task_updates = db.session.query(
        ReportEntries.date,
        ReportEntries.percent_completion,
        Task.id,
        Task.name,
        Task.description
    ).join(
        Task, Task.id == ReportEntries.task_id
    ).filter(
        ReportEntries.employee_id == emp_id
    ).order_by(
        ReportEntries.date.asc()
    ).all()

    task_completion_objects = []
    for update in task_updates:
        task_completion_objects.append({
            'datetime': update[0],
            'percentage': update[1],
            'taskid': update[2],
            'name': update[3],
            'description': update[4]
        })

    return jsonify(task_completion_objects), 200

@app.route('/getTaskGraphs', methods=['GET'])
def getTaskGraphs():
    tasks = Task.query.all()
    task_graphs = []
    for task in tasks:
        task_updates = db.session.query(
            ReportEntries.date,
            ReportEntries.percent_completion,
            ReportEntries.employee_id
        ).filter_by(
            task_id=task.id
        ).order_by(
            ReportEntries.date
        ).all()

        task_graph = {
            'task_id': task.id,
            'name': task.name,
            'description': task.description,
            'updates': [
                {
                    'date': update.date,
                    'completion_percentage': update.percent_completion,
                    'emp_id': update.employee_id,
                    'emp_name': Employee.query.filter_by(id=update.employee_id).first().name
                }
                for update in task_updates
            ]
        }

        task_graphs.append(task_graph)

    return jsonify(task_graphs), 200


def getCompletionForTask(task_id):
    repEntries = ReportEntries.query.filter_by(task_id=task_id).all()
    total_completion_percentage = sum(entry.percent_completion for entry in repEntries)

    return total_completion_percentage

@app.route('/getRemainingWeight',methods=['Get'])
def getRemainingWeight():
    task_id = request.args.get('task_id')
    if not task_id:
        return jsonify({'error': 'task_id parameter is missing.'}), 400
    try:
        task_id = int(task_id)
    except ValueError:
        return jsonify({'error': 'task_id must be an integer.'}), 400
        
    task = Task.query.filter_by(id=task_id).first()
    if not task:
        return jsonify({'error': 'Task with the provided ID does not exist.'}), 404

    remWeight=100-taskWeightSum(task_id)
    return jsonify({"remaining_weight":remWeight}),200

@app.route('/requestMeeting', methods=['GET'])
def request_email():
    emp_id = request.args.get('emp_id')
    if not emp_id:
        return jsonify({'error': 'emp_id parameter is missing.'}), 400
    try:
        emp_id = int(emp_id)
    except ValueError:
        return jsonify({'error': 'emp_id must be an integer.'}), 400
        
    employee = Employee.query.filter_by(id=emp_id).first()
    if not employee:
        return jsonify({'error': 'Employee with the provided ID does not exist.'}), 404
    msg = Message("Zoom Meeting Invitation",
                  sender="emsmanager1212@outlook.com",
                  recipients=[employee.email])
    msg.body = "You are invited to join the Zoom meeting: https://us04web.zoom.us/j/7551346134?pwd=cllaSVlLUDZnSGZJRzYxVTZwbWF3Zz09"

    try:
        mail.send(msg)
        return jsonify({'message': 'Email sent.'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to send email.'}), 400
    

if __name__ == '__main__':
    app.run()