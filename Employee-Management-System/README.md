Steps to run the website:

1) Git clone this repository into a folder
2) Make sure you are running Python 3.12.2 (you can check this by running "python --version"). You can download it from the official Python website.
3) Go to the backend folder and run "python -m venv env" to create a virtual environment named "env"
4) Run "env\Scripts\activate" to run the virtual environment
5) Now you can install the requirements by running "pip install -r requirements.txt"
6) You should have mySQL workbench installed and opened
7) Crete a new schema named "ems"
8) In dbinit.py change app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:12345@localhost:3306/ems' to app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://<mysql_username>:<mysql_password>@<mysql_host>:<mysql_port>/<mysql_db_name>'
9) Now run "flask shell" to open a shell
10) Run "db.create_all()" to create the databases
11) run "exit()" to exit the shell
12) run "flask run" to run the backend
13) Now go to the Frontend/ems folder by doing "cd .." then "cd Frontend/ems"
14) Make sure you have npm installed on your computer to run react applications
15) Run "npm install" to install all project dependencies
16) Lastly run "npm start" and the website should open in your default browser!
