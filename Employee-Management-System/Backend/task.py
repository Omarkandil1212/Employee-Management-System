from dbinit import db, ma
from marshmallow import fields
from datetime import datetime,date

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.Date, nullable=False, default=datetime.today)

    def __init__(self, id,name, description, due_date):
        self.id=id
        self.name = name
        self.description = description
        self.due_date = due_date

class TaskSchema(ma.Schema):
    id = fields.Integer(dump_only=True)  
    name = fields.String(required=True)  
    description = fields.String()
    due_date = fields.Date(required=True)

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)