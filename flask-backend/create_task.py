
import numpy as np
import pandas as pd
import os
import shutil
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn import linear_model
from shutil import copyfile



import matplotlib.pyplot as plt
import datetime

def get_pizza_type(file_name):
    data = pd.ExcelFile(file_name)
    sheet_name = data.sheet_names
    df = data.parse(sheet_name[0])
    df = df.fillna(0.0)

    dates_vector = df['DATE']
    sales_vector = df['SALES']
    pizza_vector = df['CATEGORY']

    sales_data_dict = {}
    pizza_type = []
    for category in range(len(pizza_vector)):
        if not pizza_vector[category] in sales_data_dict:
            sales_data_dict[pizza_vector[category]] = [[],[]]
        if not pizza_vector[category] in pizza_type:
            pizza_type.append(pizza_vector[category])

    for i in pizza_type:
        i.encode('utf-8')
    return pizza_type

def create_task_results(file_name,user):

    current_user = user
    print('CURRENT USER')
    print(current_user)
    data = pd.ExcelFile(file_name)
    sheet_name = data.sheet_names
    df = data.parse(sheet_name[0])
    df = df.fillna(0.0)

    dates_vector = df['DATE']
    sales_vector = df['SALES']
    pizza_vector = df['CATEGORY']

    sales_data_dict = {}
    pizza_type = []
    for category in range(len(pizza_vector)):
        if not pizza_vector[category] in sales_data_dict:
            sales_data_dict[pizza_vector[category]] = [[],[]]
        if not pizza_vector[category] in pizza_type:
            pizza_type.append(pizza_vector[category])

    for category in range(len(pizza_vector)):
        tmpDt = datetime.datetime.strptime(str(dates_vector[category]), '%Y-%m-%d %H:%M:%S')
        ms = tmpDt.timestamp()
        sales_data_dict[pizza_vector[category]][0].append(ms)
        sales_data_dict[pizza_vector[category]][1].append(sales_vector[category])

    for i in pizza_type:
        i.encode('utf-8')


    X1 = sales_data_dict[pizza_vector[0]][0] 
    X = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]

    X= np.array(X)
    X = X[:, np.newaxis] 

    for i in range(len(pizza_type)):

        Y = sales_data_dict[pizza_vector[i]][1]

        



        poly_reg = PolynomialFeatures(degree=1)

        X_poly = poly_reg.fit_transform(X)
        pol_reg = linear_model.LinearRegression()

        pol_reg.fit(X_poly, Y)

        
        plt.plot(X, Y, color='red')
        plt.plot(X, pol_reg.predict(poly_reg.fit_transform(X)), color='blue')
        plt.title('Truth or Bluff (Linear Regression)')
        plt.xlabel('Position level')
        plt.ylabel('Salary') 

        current_user_file_name = '/images/' + current_user + '.png'

        saving_file_name = current_user + pizza_type[i] + '.png'


        current_file = os.path.dirname(os.path.abspath(__file__)) + '/images/' + saving_file_name
        parent_directory = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + os.sep + os.pardir)

        #print(current_file)
        #plt.savefig(current_file)
        
        if i == 0:
            copyfile(current_file, 'images/' + current_user + '.png')


        destination = parent_directory + '/react-frontend/src/pages/' + saving_file_name

        #print('Variance score: %.2f' % r2_score(Y, pol_reg.predict(poly_reg.fit_transform(X))))

        #print("Mean squared error: %.2f"
            #% mean_squared_error(Y, pol_reg.predict(poly_reg.fit_transform(X))))

        #os.rename(saving_file_name,destination)
        #os.rename(current_user_file_name, destination)

    