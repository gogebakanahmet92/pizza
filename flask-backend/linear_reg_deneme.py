import numpy as np
import pandas as pd

from sklearn import linear_model
from sklearn.metrics import mean_squared_error, r2_score

import matplotlib.pyplot as plt
import datetime

data = pd.ExcelFile("pizza-sales.xlsx", sheet_name=None)
sheet_name = data.sheet_names
df = data.parse(sheet_name[0])
df = df.fillna(0.0)

dates_vector = df['DATE']
sales_vector = df['SALES']
pizza_vector = df['CATEGORY']

sales_data_dict = {}

for category in range(len(pizza_vector)):
    if not pizza_vector[category] in sales_data_dict:
        sales_data_dict[pizza_vector[category]] = [[],[]]

for category in range(len(pizza_vector)):
    tmpDt = datetime.datetime.strptime(str(dates_vector[category]), '%Y-%m-%d %H:%M:%S')
    ms = tmpDt.timestamp()
    sales_data_dict[pizza_vector[category]][0].append(ms)
    sales_data_dict[pizza_vector[category]][1].append(sales_vector[category])


X = sales_data_dict[pizza_vector[0]][0]                # dates
Y = sales_data_dict[pizza_vector[0]][1]                # sales

X1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]

X= np.array(X)
X = X[:, np.newaxis]


X_train = X[:-2]
X_test = X[-2:]
Y_train = Y[:-2]
Y_test = Y[-2:]


print(X_train)
print(Y_train)



regr = linear_model.LinearRegression()
regr.fit(X_train,Y_train)

y_prediction = regr.predict(X_test)


plt.plot(X_test, Y_test,  color='black')
plt.plot(X_test, y_prediction, color='blue')


plt.show()


# The coefficients
print('Coefficients: \n', regr.coef_)
# The mean squared error
print("Mean squared error: %.2f"
      % mean_squared_error(Y_test, y_prediction))
# Explained variance score: 1 is perfect prediction
print('Variance score: %.2f' % r2_score(Y_test, y_prediction))