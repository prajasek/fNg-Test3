from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL
 
app = Flask(__name__)
CORS(app)
COUNT = 0
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'pras_raja'
app.config['MYSQL_PASSWORD'] = 'mobile6120'
app.config['MYSQL_DB'] = 'flask-Ng'

mysql = MySQL(app)

@app.route("/", methods=['GET','POST'])
def home():
	global COUNT
	COUNT = COUNT + 1
	cur = mysql.connection.cursor()
	offset = COUNT*100
	
	if request.method == "POST":
		print(request)
		name = request.json['name']
		id = request.json['id']
		print(name, id)
		cur.execute(f"SELECT * from purchaseOrders_2 limit 100")
		rv = cur.fetchall()
		print(rv)
		return jsonify(rv)
		
	cur.execute('SELECT * from purchaseOrders limit 100 offset %(off)s', {"off":offset})
	rv = cur.fetchall()
	user_details = [{'Order_ID':x[0],
					 'First_Name': x[1],
					 'Last_Name': x[2],
					 'Email' : x[3],
					 'PID' : x[4],
					 'Q' : x[5],
					 'Price' : x[6],
					 'Country': x[7],
					 'State': x[8],
					 'City': x[9]
					 } 
				     for x in rv 
				    ]
	#print(user_details)
	return jsonify(user_details)


@app.route("/insert")
def home1():
	cur = mysql.connection.cursor()
	for _ in range(10):
		cur.execute('''insert into test_table values ("shanna",100);''')
	mysql.connection.commit()
	return "inserted value"
	

print("All done!")