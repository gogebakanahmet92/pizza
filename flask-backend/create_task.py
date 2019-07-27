
import numpy as np
import pandas as pd
import os
import shutil

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn import linear_model
from shutil import copyfile
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score



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
    data = pd.ExcelFile(file_name)
    sheet_name = data.sheet_names
    df = data.parse(sheet_name[0])
    df = df.fillna(0.0)

    dates_vector = df['DATE']
    sales_vector = df['SALES']
    pizza_vector = df['CATEGORY']

    pizza_type = []

    for category in range(len(pizza_vector)):
        if not pizza_vector[category] in pizza_type:
            pizza_type.append(pizza_vector[category])

    pizza_dict = {}

    for i in pizza_type:
        if not i in pizza_dict:
            pizza_check =  pizza_vector == i
            pizza_dict[i] = df[pizza_check]


    first_pizza = pizza_dict['Sicilian Pizza']
    new_sales_vector = first_pizza['SALES']
    new_dates_vector = first_pizza['DATE']

    k = 0
    for i in pizza_type:
        pizza = pizza_dict[i]
        new_sales_vector = pizza['SALES']
        new_dates_vector = pizza['DATE']



        print(new_sales_vector)

        index = [] 
        a = 1
        for j in new_dates_vector:
            index.append(a)
            a += 1


        X_eksen = np.array(index)
        X_eksen = X_eksen[:, np.newaxis] 

        Y_eksen = new_sales_vector



        polynomial_features = PolynomialFeatures(degree=4,
                                                include_bias=False)
        linear_regression = LinearRegression()

        pipeline = Pipeline([("polynomial_features", polynomial_features),
                                ("linear_regression", linear_regression)])


        pipeline.fit(X_eksen, Y_eksen)

        scores = cross_val_score(pipeline, X_eksen, Y_eksen,
                                scoring="neg_mean_squared_error", cv=10)

        a = np.empty(35)
        b = np.arange(1, 35, 1)
        X_test = b
        plt.figure()
        plt.plot(X_test, pipeline.predict(X_test[:, np.newaxis]), label="Model")
        plt.plot(X_eksen, Y_eksen, label="Samples") 

        current_user_file_name = '/images/' + current_user + '.png'

        saving_file_name = current_user + pizza_type[k] + '.png'
        

        current_file = os.path.dirname(os.path.abspath(__file__)) + '/images/' + saving_file_name
        parent_directory = os.path.normpath(os.path.dirname(os.path.abspath(__file__)) + os.sep + os.pardir)

            #print(current_file)
        plt.savefig(current_file)
        #
        # plt.show()
            
        if k == 0:
            copyfile(current_file, 'images/' + current_user + '.png')
        k += 1


        #print('Variance score: %.2f' % r2_score(Y, pol_reg.predict(poly_reg.fit_transform(X))))

        #print("Mean squared error: %.2f"
            #% mean_squared_error(Y, pol_reg.predict(poly_reg.fit_transform(X))))

        #os.rename(saving_file_name,destination)
        #os.rename(current_user_file_name, destination)

    