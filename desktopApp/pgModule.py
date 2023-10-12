# MODULE FOR CREATING DATABASE CONNECTIONS AND OPERATIONS
# =======================================================

# LIBRARIES AND MODULES
# ---------------------
import sys
import psycopg2  # Database
import datetime  # For handling date and time values
import decimal  # For handling decimal datatypes with extreme precision
import json  # For converting settings to JSON format

# CLASS DEFINITIONS
# -----------------


class DatabaseOperation():
    """Creates a connection to postgreSQL database and
    executes various SQL commands"""

    # Constructor method: create a new object and set initial properties
    def __init__(self):
        self.errorCode = 0
        self.errorMessage = 'OK'
        self.detailedMessage = 'No errors'
        self.resultSet = []
        self.columnHeaders = []
        self.rows = 0
        self.columns = 0

    # Method for creating connection arguments
    def createConnectionArgumentDict(self, database, role, pwd, host='localhost', port='5432'):
        """Creates a dictionary from connection arguments

        Args:
            database (str): Database name
            role (str): Role ie. username
            pwd (str): Password
            host (str, optional): Server name or IP address. Defaults to 'localhost'.
            port (str, optional): Server's TCP port. Defaults to '5432'.

        Returns:
            dict: Connection arguments as key-value-pairs
        """
        connectionArgumentDict = {}
        connectionArgumentDict['server'] = host
        connectionArgumentDict['port'] = port
        connectionArgumentDict['database'] = database
        connectionArgumentDict['user'] = role
        connectionArgumentDict['password'] = pwd

        return connectionArgumentDict

    # Method for saving connection arguments to a settings file
    def saveDatabaseSettingsToFile(self, file, connectionArgs):
        """Saves connection arguments to JSON based settings file

        Args:
            file (str): Name of the JSON settings file
            connectionArgs (dict): Connection arguments in key-value pairs
        """
        settingsFile = open(file, 'w')
        json.dump(connectionArgs, settingsFile)
        settingsFile.close()

    # Method for reading connection arguments from the settings file
    def readDatabaseSettingsFromFile(self, file):
        """Reads connection arguments from JSON based settings file

        Args:
            file (str): Name of the settings file

        Returns:
            dict: Connection arguments in key-value-pairs
        """
        settingsFile = open(file, 'r')
        connectionArgumentDict = json.load(settingsFile)
        settingsFile.close()
        return connectionArgumentDict

    # Method to get all rows from a given table
    def getAllRowsFromTable(self, connectionArgs, table):
        """Selects all rows from the table, view or SQL function's result set

        Args:
            connectionArgs (dict): Connection arguments in key-value pairs
            table (str): Name of the table to read from
        """
        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                sqlClause = 'SELECT * FROM ' + table + ';'
                cursor.execute(sqlClause)

                # Set object properties
                self.rows = cursor.rowcount
                self.resultSet = cursor.fetchall()
                self.columnHeaders = [cname[0] for cname in cursor.description]
                self.columns = len(self.columnHeaders)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Luettiin taulu onnistuneesti'
                self.detailedMessage = 'Read all data from the table'

        except (Exception, psycopg2.Error )as error:

            # Set error values
            self.errorCode = 1
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to get all rows from a given table with given limit

    def getAllRowsFromTableWithLimit(self, connectionArgs, table, limit):
        """Selects all rows from the table, view or SQL function's result set

        Args:
            connectionArgs (dict): Connection arguments in key-value pairs
            table (str): Name of the table to read from
            limit (str): Limit for the result set
        """
        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                sqlClause = f"SELECT * FROM {table} WHERE {limit};"
                cursor.execute(sqlClause)

                # Set object properties
                self.rows = cursor.rowcount
                self.resultSet = cursor.fetchall()
                self.columnHeaders = [cname[0] for cname in cursor.description]
                self.columns = len(self.columnHeaders)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Luettiin taulu onnistuneesti'
                self.detailedMessage = 'Read all data from the table'

        except (Exception, psycopg2.Error )as error:

            # Set error values
            self.errorCode = 1
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to insert a row to a given table

    def insertRowToTable(self, connectionArgs, sqlClause, returnId=False):
        """Inserts a row to table according to a SQL clause

        Args:
            connectionArgs (dict): Connection arguments in key-value-pairs
            sqlClause (str): Insert clause
        """

        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                cursor.execute(sqlClause)
                if returnId == True:
                    self.resultId = cursor.fetchone()[0]
                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Lisättiin tietue onnistuneesti'
                self.detailedMessage = 'Inserting into table was successful'
                dbconnection.commit()
                
        except (Exception, psycopg2.Error )as error:

            # Set error values 
            self.errorCode = 1 # TODO: Design a set of error codes to use with this module
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to update a table
    def updateTable(self, connectionArgs, table, column, value, limit):
        """Updates a table
        Args:
            connectionArgs (dict): Connection arguments in key-value-pairs
            table (str): Table name
            column (str): Column to be updated
            limit (str): WHERE SQL statement
        """
        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                sqlClause = f'UPDATE {table} SET {column} = {value} WHERE {limit}'
                cursor.execute(sqlClause)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Päivitettiin tietue onnistuneesti'
                self.detailedMessage = 'Update was successful'
                dbconnection.commit()
                
        except (Exception, psycopg2.Error )as error:

            # Set error values 
            self.errorCode = 1 # TODO: Design a set of error codes to use with this module
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to update multiple values in a row
    def updateManyValuesInRow(self, connectionArgs, table, columnValuePairs, limit):
        """Updates a table
        Args:
            connectionArgs (dict): Connection arguments in key-value-pairs
            table (str): Table name
            column (str): Column to be updated
            limit (str): WHERE SQL statement
        """
        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                sqlClause = f'UPDATE {table} SET {columnValuePairs} WHERE {limit}'
                cursor.execute(sqlClause)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Päivitettiin tietue onnistuneesti'
                self.detailedMessage = 'Update was successful'
                dbconnection.commit()
                
        except (Exception, psycopg2.Error )as error:

            # Set error values 
            self.errorCode = 1 # TODO: Design a set of error codes to use with this module
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to delete a row from table
    def deleteFromTable(self, connectionArgs, table, limit):
        """Delete rows from a table using limiting SQL statement
        Args:
            connectionArgs (dict): Connection arguments in key-value pairs
            table (str): Table name
            limit (str): WHERE SQL statement
        """
        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                sqlClause = f'DELETE FROM {table} WHERE {limit}'
                cursor.execute(sqlClause)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Poisto suoritteettiin onnistuneesti'
                self.detailedMessage = 'Delete operation was successful'
                dbconnection.commit()
                
        except (Exception, psycopg2.Error )as error:

            # Set error values 
            self.errorCode = 1 # TODO: Design a set of error codes to use with this module
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    # Method to call a stored procedure and pass parameters
    def callProcedure(self, connectionArgs, procedure, params):
        """Calls a procedure and passes parameters

        Args:
            connectionArgs (dict): Connection arguments in key-value pairs
            procedure (str): Name of the procedure to call
            params (list): List of input parameters for procedure
        """

        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            # Create a cursor to retrieve data from the table
            with dbconnection.cursor() as cursor:
                command = f'CAll {procedure}({params})'
                cursor.execute(command)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Suoritettiin proseduuri onnistuneesti'
                self.detailedMessage = 'Procedure call was succesful'
                dbconnection.commit()

        except (Exception, psycopg2.Error )as error:

            # Set error values
            self.errorCode = 1
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)

        finally:
            if self.errorCode == 0:
                dbconnection.close()

    def callFunction(self, connectionArgs, function, params):
        """Calls a function and passes parameters

        Args:
            connectionArgs (dict): Connection arguments in key-value pairs
            function (str): Name of the function to call
            params (list): List of input parameters for function
        """

        server = connectionArgs['server']
        port = connectionArgs['port']
        database = connectionArgs['database']
        user = connectionArgs['user']
        password = connectionArgs['password']

        try:
            # Connect to the database and set error parameters
            dbconnection = psycopg2.connect(
                database=database, user=user, password=password, host=server, port=port)
            self.errorCode = 0
            self.errorMessage = 'Yhdistettiin tietokantaan'
            self.detailedMessage = 'Connected to database successfully'

            with dbconnection.cursor() as cursor:
                command = f"SELECT * FROM {function}({params});"
                cursor.execute(command)

                 # Set object properties
                self.rows = cursor.rowcount
                self.resultSet = cursor.fetchall()
                self.columnHeaders = [cname[0] for cname in cursor.description]
                self.columns = len(self.columnHeaders)

                # Set error values
                self.errorCode = 0
                self.errorMessage = 'Suoritettiin funktio onnistuneesti'
                self.detailedMessage = 'Function call was succesful'
                dbconnection.commit()



        except (Exception, psycopg2.Error )as error:

            # Set error values
            self.errorCode = 1
            self.errorMessage = 'Tietokannan käsittely ei onnistunut'
            self.detailedMessage = str(error)
        finally:
            if self.errorCode == 0:
                dbconnection.close()


# LOCAL TESTS, REMOVE WHEN FINISHED DESIGNING THE MODULE
if __name__ == "__main__":
    # Lets create a DatabaseOperation object
    testOperation = DatabaseOperation()
    # Create a dictionary for connection settings using defaults
    dictionary = testOperation.createConnectionArgumentDict(
        'uusi_metsastys', 'application', 'Q2werty')
    
    # Save those settings to file
    testOperation.saveDatabaseSettingsToFile('settings.dat', dictionary)

    # Read settings back from the file
    readedSettings = testOperation.readDatabaseSettingsFromFile('settings.dat')

    # print(readedSettings)
    #testOperation.getAllRowsFromTable(readedSettings, 'public.jasen')

    testOperation.callFunction(readedSettings, 'public.get_used_licences', 2022)

    print(testOperation.resultSet, testOperation.columnHeaders)
