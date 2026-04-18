import mysql.connector

conn = mysql.connector.connect(host='127.0.0.1', user='root', password='', database='agrico')
cursor = conn.cursor()
cursor.execute('SELECT email, mdp FROM utilisateurs WHERE email LIKE "%pierre%"')
result = cursor.fetchone()
print('User:', result)
cursor.close()
conn.close()