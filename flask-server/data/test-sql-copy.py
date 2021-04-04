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
	cur = mysql.connection.cursor()
	cur.execute('SELECT DISTINCT City from purchase_orders')
	rv = cur.fetchall()
	print(rv)
	return jsonify(rv)


@app.route("/users", methods=['GET','POST'])
def users():
	offset = 50*int(request.args['page'])
	cur = mysql.connection.cursor()
	print("Got request")
	#get countries
	cur.execute('SELECT DISTINCT Country from purchase_orders')
	countries = [c[0] for c in cur.fetchall()]
	
	#get User data
	cur.execute('SELECT * from purchase_orders limit 50 offset %(off)s', {"off":offset})
	rv = cur.fetchall()
	
	user_details = [{'Order_ID':x[0],
					 'First_Name': x[1],
					 'Last_Name': x[2],
					 'Email' : x[3], 
					 'Product_ID' : x[4],
					 'Quantity' : x[5],
					 'Unit_Price' : x[6],
					 'Country': x[7],
					 'State': x[8],
					 'City': x[9]
					 } 
				     for x in rv 
				    ]
	
	cur.execute('SELECT COUNT(*) FROM purchase_orders')
	no_of_rows = cur.fetchall()[0][0] # return ((xxx,),)
	return jsonify({"users": user_details, "no_of_users": no_of_rows, "countries": countries})


@app.route("/geoloc", methods=['GET'])
def get_geolocs():
	cur = mysql.connection.cursor()
	search_country = request.args['search_country'];
	search_state = request.args['search_state'];
	search_city = request.args['search_city'];
	
	print("Search Country: ", search_country)
	print("Search State: ", search_state)
	print("Search City: ", search_city)
	
	states = []
	cities = []

	
	if search_country and search_state and search_city:
		cur.execute('SELECT * from purchase_orders where Country=%(cntry)s AND State=%(st)s AND City=%(city)s',	{'cntry':search_country, 'st': search_state, 'city': search_city})

		country_states_cities = [{'Order_ID':x[0],
										 'First_Name': x[1],
										 'Last_Name': x[2],
										 'Email' : x[3], 
										 'Product_ID' : x[4],
										 'Quantity' : x[5],
										 'Unit_Price' : x[6],
										 'Country': x[7],
										 'State': x[8],
										 'City': x[9]
										 } 
										 for x in cur.fetchall()
										]
		return jsonify({'table_values' : country_states_cities})

		
		
	elif search_country and search_state:
		cur.execute('SELECT DISTINCT City from purchase_orders where State=%(state)s', {"state":search_state}) 
		cities = [cty[0] for cty in cur.fetchall()]
		
		cur.execute('SELECT * from purchase_orders where Country=%(cntry)s AND State=%(st)s', {'cntry':search_country, 'st': search_state})
		country_states_table = [{'Order_ID':x[0],
							 'First_Name': x[1],
							 'Last_Name': x[2],
							 'Email' : x[3], 
							 'Product_ID' : x[4],
							 'Quantity' : x[5],
							 'Unit_Price' : x[6],
							 'Country': x[7],
							 'State': x[8],
							 'City': x[9]
							 } 
							 for x in cur.fetchall()
							]
		return jsonify({'cities': cities, 'table_values' : country_states_table})

	
	
	elif search_country:
		cur.execute('SELECT DISTINCT State from purchase_orders where Country=%(cntry)s', {"cntry":search_country}) 
		states = [s[0] for s in cur.fetchall()]
		
		cur.execute('SELECT * from purchase_orders where Country=%(cntry)s', {'cntry':search_country})
		country_table = [{'Order_ID':x[0],
						 'First_Name': x[1],
						 'Last_Name': x[2],
						 'Email' : x[3], 
						 'Product_ID' : x[4],
						 'Quantity' : x[5],
						 'Unit_Price' : x[6],
						 'Country': x[7],
						 'State': x[8],
						 'City': x[9]
						 } 
						 for x in cur.fetchall()
						]
		return jsonify({'states': states, 'table_values' : country_table})

	

print("All done!")