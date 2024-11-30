import pymysql.cursors
from os import getenv
import pymysql

class MySQLConnection:
    """
    HOW TO USE:
        with MySQLConnection() as (connection, cursor):
            cursor.execute('SELECT * FROM mytable')
            rows = cursor.fetchall()
            for row in rows:
                print(row)

        OR

        connection, cursor = MySQLConnection().get_cc()
        Avoid using this method as it is not thread safe and garbage collection is not guaranteed.
    """
    def __init__(self):
        self.connection = pymysql.connect(
            host=getenv("DB_SERVER"),
            user=getenv("DB_USER"),
            password=getenv("DB_PASSWORD"),
            db=getenv("DB_DB"),
            cursorclass=pymysql.cursors.DictCursor
        )
        self.cursor = self.connection.cursor()
        print("MySQL Connection Established")

    def __enter__(self):
        print("MySQL Connection Returned `With`")
        return self.connection, self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("MySQL Connection Closed `With`")

    def __del__(self):
        if self.cursor and self.connection.open:
            self.cursor.close()
        if self.connection and self.connection.open:
            self.connection.close()
        print("MySQL Connection Closed `Del`")

    def get_cc(self):
        return self.connection, self.cursor
