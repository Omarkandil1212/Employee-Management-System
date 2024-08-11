from dbinit import db,ma
from marshmallow import fields
from datetime import datetime

class ReportEntries(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'))
    emp_task_id = db.Column(db.Integer, db.ForeignKey('employee_tasks.id'))
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    percent_completion = db.Column(db.Integer)


    def __init__(self, employee_id, task_id,emptaskid, percent_completion,date=None):
        self.employee_id = employee_id
        self.task_id = task_id
        self.emp_task_id=emptaskid
        if date is not None:
            self.date=date
        self.percent_completion=percent_completion

class ReportEntriesSchema(ma.Schema):
    id = fields.Integer(dump_only=True)  
    employee_id = fields.Integer(required=True)  
    task_id = fields.Integer(required=True)  
    emp_task_id=fields.Integer(required=True)
    date = fields.DateTime(required=True)
    percent_completion = fields.Integer()

report_entry_schema=ReportEntriesSchema()
report_entries_schema=ReportEntriesSchema(many=True)