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
	offset = 50*int(request.args['page_index'])
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
	row_count = cur.fetchall()[0][0] # return ((xxx,),)
	return jsonify({"users": user_details, "no_of_users": row_count, "countries": countries})



@app.route("/geoloc", methods=['GET'])
def get_geolocs():
	cur = mysql.connection.cursor()
	search_country = request.args['search_country'];
	search_state = request.args['search_state'];
	search_city = request.args['search_city'];
	print(search_state, search_country, "\n\nsearch state and country\n\n\n\n" )
	offset = 50*int(request.args['page_index'])
	
	print("Search Country: ", search_country)
	print("Search State: ", search_state)
	print("Search City: ", search_city)
	print("Page Index: ", offset)
	
	row_count = 0;
	states = []
	cities = []
	table_values = []
	
	
	def create_list_users(data):
		return  [{'Order_ID':x[0], 'First_Name': x[1],
				  'Last_Name': x[2], 'Email' : x[3], 	 
				  'Product_ID' : x[4], 'Quantity' : x[5],
				  'Unit_Price' : x[6], 'Country': x[7],
				  'State': x[8], 'City': x[9] 
				 } for x in data
			    ]
	
	
	if search_country and search_state and search_city:
		cur.execute('''SELECT * from purchase_orders where Country=%(cntry)s AND State=%(st)s AND City=%(city)s
					   limit 50 offset %(off)s''',{'cntry':search_country, 'st': search_state, 'city': search_city ,"off":offset})

		table_values = create_list_users(cur.fetchall())
		
		cur.execute('''SELECT COUNT(*) FROM purchase_orders where Country=%(cntry)s AND State=%(st)s AND City=%(city)s''',{'cntry':search_country, 'st': search_state, 'city': search_city})
		
		row_count = cur.fetchall()[0][0]
		

		
		
	elif search_country and search_state:
		cur.execute('SELECT DISTINCT City from purchase_orders where State=%(state)s', {"state":search_state}) 
		cities = [cty[0] for cty in cur.fetchall()]
		
		cur.execute('''SELECT * from purchase_orders where Country=%(cntry)s AND State=%(st)s limit 50 offset
										%(off)s''',  {'cntry':search_country, 'st': search_state, "off":offset})
		
		table_values = create_list_users(cur.fetchall())
		
		cur.execute('''SELECT COUNT(*) FROM purchase_orders where Country=%(cntry)s AND State=%(st)s ''',																{'cntry':search_country, 'st': search_state})
		row_count = cur.fetchall()[0][0]
		
		
		
		
		
	elif search_country:
		cur.execute('SELECT DISTINCT State from purchase_orders where Country=%(cntry)s', {"cntry":search_country}) 
		states = [s[0] for s in cur.fetchall()]
		
		cur.execute('SELECT * from purchase_orders where Country=%(cntry)s limit 50 offset %(off)s', 																		{'cntry':search_country, "off":offset})
		table_values = create_list_users(cur.fetchall())
		
		cur.execute('''SELECT COUNT(*) FROM purchase_orders where Country=%(cntry)s''',																{'cntry':search_country})
		row_count = cur.fetchall()[0][0]

		
	return jsonify({'row_count':row_count, 'cities': cities, 'states': states, 'table_data' : table_values})

	
