from dbinit import db,ma
from marshmallow import fields
class EmployeeTasks(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    weight = db.Column(db.Integer)

    def __init__(self, employee_id, task_id, weight):
        self.employee_id = employee_id
        self.task_id = task_id
        self.weight = weight

class EmployeeTasksSchema(ma.Schema):
    id = fields.Integer(dump_only=True)  
    employee_id = fields.Integer(required=True)  
    task_id = fields.Integer(required=True)  
    weight = fields.Integer()

employee_task_schema=EmployeeTasksSchema()
employees_tasks_schema=EmployeeTasksSchema(many=True)