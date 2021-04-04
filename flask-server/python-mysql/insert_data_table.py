from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mysqldb import MySQL
import json, random

SCC = open('SCC.json')
geolocs = json.load(SCC)

 
app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'pras_raja'
app.config['MYSQL_PASSWORD'] = 'mobile6120'
app.config['MYSQL_DB'] = 'flask-Ng'
mysql = MySQL(app)

@app.route("/")
def insert():
	global geolocs
	cur = mysql.connection.cursor()
	cur.execute(''' select * from purchaseOrdersMain''')
	rv = cur.fetchall()   # a tuple ((col1,col2...coln), (col1,col2, ...coln).... (..))
	geolocs = [random.choice(geolocs) for _ in range(len(rv))]								 
	
	#data = [(order_id, f_name, l_name, email, p_id, qty, u_price, *g) for order_id, f_name, l_name, email, p_id, qty, u_price, g in zip(rv
	data = [(*r, *g) for r, g in zip(rv, geolocs)]
	print("\n\nDebug:\n\n")
	print(len(data), len(rv))
	print(data[1:10])
	
	cur.executemany(''' INSERT INTO purchase_orders 
					(Order_ID, First_Name, Last_Name, Email, Product_ID, Quantity, Unit_Price, Country, State, City) values
					(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);''', data)
	mysql.connection.commit()
	return jsonify(data[1:10])



'''
@app.route("/")
def home():
	length = [_ for _ in range(100)]
	values = [_ for _ in range(100,200)]
	geoloc = [random.choice(geolocs) for _ in range(100)]
	
	params = [(l, v, *g) for l,v,g in zip(length, values, geoloc)]
	cur = mysql.connection.cursor()
	cur.executemany("""INSERT INTO countries_test 
	(countries_test, column_2, country, state, city) values (%s, %s, %s, %s, %s);""", params)
	mysql.connection.commit()
	return jsonify(params)


print("All done!")

'''