import pymysql

def get_db():
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="@bunny1099",        
        database="interview_simulator"
    )
    return connection