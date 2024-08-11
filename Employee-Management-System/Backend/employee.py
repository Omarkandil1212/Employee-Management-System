from dbinit import db,ma
from marshmallow import fields
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement = False)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.Float, nullable=False)
    strengths = db.Column(db.Text)
    weaknesses = db.Column(db.Text)
    productivity_score = db.Column(db.Integer)
    email = db.Column(db.String(100), unique=True, nullable=False)
    
    def __init__(self, id,name, age, job_title, salary, email,strengths=None, weaknesses=None, productivity_score=None):
        self.id=id
        self.name = name
        self.age = age
        self.job_title = job_title
        self.salary = salary
        self.strengths = strengths
        self.weaknesses = weaknesses
        self.productivity_score = productivity_score
        self.email=email
    
class EmployeeSchema(ma.Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    age = fields.Integer(required=True)
    job_title = fields.String(required=True)
    salary = fields.Float(required=True)
    email = fields.Email(required=True)
    strengths = fields.String()
    weaknesses = fields.String()
    productivity_score = fields.Integer()

employee_schema=EmployeeSchema()
employees_schema=EmployeeSchema(many=True)
