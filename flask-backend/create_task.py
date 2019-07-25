
import numpy as np
import pandas as pd

from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures
from sklearn import linear_model

import matplotlib.pyplot as plt
import datetime



def create_task_results(file_name):
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
    print(pizza_type)

    for category in range(len(pizza_vector)):
        tmpDt = datetime.datetime.strptime(str(dates_vector[category]), '%Y-%m-%d %H:%M:%S')
        ms = tmpDt.timestamp()
        sales_data_dict[pizza_vector[category]][0].append(ms)
        sales_data_dict[pizza_vector[category]][1].append(sales_vector[category])




    X1 = sales_data_dict[pizza_vector[0]][0]              
    Y = sales_data_dict[pizza_vector[0]][1]

    X = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]

    X= np.array(X)
    X = X[:, np.newaxis]




    poly_reg = PolynomialFeatures(degree=1)

    X_poly = poly_reg.fit_transform(X)
    pol_reg = linear_model.LinearRegression()

    pol_reg.fit(X_poly, Y)

    def viz_polymonial():
        plt.plot(X, Y, color='red')
        plt.plot(X, pol_reg.predict(poly_reg.fit_transform(X)), color='blue')
        plt.title('Truth or Bluff (Linear Regression)')
        plt.xlabel('Position level')
        plt.ylabel('Salary')
        plt.savefig(file_name  + pizza_type[0] + '.png')
        return
    viz_polymonial()

    print('Variance score: %.2f' % r2_score(Y, pol_reg.predict(poly_reg.fit_transform(X))))

    print("Mean squared error: %.2f"
        % mean_squared_error(Y, pol_reg.predict(poly_reg.fit_transform(X))))