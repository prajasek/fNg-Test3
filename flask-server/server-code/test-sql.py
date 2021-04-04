from flask import Flask, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'pras_raja'
app.config['MYSQL_PASSWORD'] = 'mobile6120'
app.config['MYSQL_DB'] = 'flask-Ng'

mysql = MySQL(app)

@app.route("/")
def home():
	cur = mysql.connection.cursor()
	cur.execute('''SELECT * from test_table where name="shanna"''')
	rv = cur.fetchall()
	return jsonify([x for x in list(rv)])


@app.route("/insert")
def home1():
	cur = mysql.connection.cursor()
	for _ in range(10):
		cur.execute('''insert into test_table values ("shanna",100);''')
	mysql.connection.commit()
	return "inserted value"
	

print("All done!")