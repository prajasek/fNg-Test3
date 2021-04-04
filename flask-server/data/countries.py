from collections import defaultdict
import json


countries_file = open('cleaned_up/countries.csv', 'r')
states_file = open('cleaned_up/states.csv', 'r')
cities_file = open('cleaned_up/cities.csv', 'r')

countries = countries_file.readlines()
states = states_file.readlines()
cities = cities_file.readlines()

d = {}
s = {}
print(d)

for c_row in countries:
	country = c_row.split(",")[0].strip()
	country_code = c_row.split(",")[1].strip()
	d[country] = []
	for s_row in states:
		state = s_row.split(",")[0].strip()
		s_country_code = s_row.split(",")[1].strip()
		s_state_code = s_row.split(",")[2].strip()

		#print(country, state)

		if s_country_code.strip()  == country_code.strip() :
			#print("MATCH :", country, state, s_country_code, country_code
			s[state] = []
			for ci_row in cities: 
				city = ci_row.split(",")[0].strip()
				c_state_code = ci_row.split(",")[1].strip()
				c_country_code = ci_row.split(",")[2].strip()
				if (c_state_code.strip() == s_state_code.strip() 
					and 
					(c_country_code.strip() == s_country_code.strip())):
					
					#print(country, state, city, c_state_code, s_state_code)
						s[state].append(city)
			d[country].append({state: s[state]})
			
output_file = open(f"countries.json", 'w')

ccs = json.dumps(d)
output_file.write(ccs)
output_file.close()



