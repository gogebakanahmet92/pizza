import numpy as np
import pandas as pd

from sklearn.svm import SVR
from sklearn.metrics import r2_score

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

clf = SVR(gamma='scale', C=1, epsilon=0.1)


Xaa = sales_data_dict[pizza_vector[0]][0]                # dates
Y = sales_data_dict[pizza_vector[0]][1]                # sales


X = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
X_train = X[:-5]
X_test = X[-5:]
Y_train = Y[:-5]
Y_test = Y[-5:]

X1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]

my_array2 = np.array(X1)
my_array2 = my_array2[:, np.newaxis]

my_array = np.array(X)
my_array = my_array[:, np.newaxis]

clf.fit(my_array, Y)

prediction_arr = clf.predict(my_array)

print(prediction_arr)
print(len(Y))

#print(clf.score(Y,prediction_arr)

#plt.plot(X,prediction_arr)
#plt.plot(X,Y)
#plt.show()

