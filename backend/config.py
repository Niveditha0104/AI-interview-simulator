import pymysql

def get_db():
    connection = pymysql.connect(
        host="mysql-357d3cd4-interview-simulator.e.aivencloud.com",
        port=22559,
        user="avnadmin",
        password="AVNS_9A6D9MTGs1ptj3YjwAi",
        database="defaultdb",
        ssl={"ssl_ca": None},
        ssl_verify_cert=False
    )
    return connection