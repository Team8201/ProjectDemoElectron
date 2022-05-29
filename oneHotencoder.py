import numpy as np
import pandas as pd
from os.path import join
import sys
#import * as tf from "@tensorflowjs/tfjs"
#import tensorflowjs as tfjs
from tensorflow.keras.models import load_model
#model = load_model('caeDNA11.h5')
#model.summary()

def encodeDNA(string):
    #string list 형태로 전달받습니다. 
    # list 형태를  join으로 문자혈로 바꿉니다. 
    dnastring="".join(string)
    my_array = np.array(list(dnastring))
    #encoding file 형태 1600 * 4
    onehot_encode = np.zeros((1600,4), dtype=int)
    base_dict = {'A':0, 'C':1, 'G':2, 'T':3}
    
    # R, Y, S, K 등 ACGT 외 IUPAC nutcloetide code 적용
    # 둘다 1로 하는 이유 : or 관계 이기 때문에 
    for i in range(len(my_array)):
        if my_array[i] == 'R':
            onehot_encode[i, 0]=1
            onehot_encode[i, 2]=1
            continue
        
        if my_array[i] == 'Y':
            onehot_encode[i, 1]=1
            onehot_encode[i, 3]=1
            continue    
        if my_array[i] == 'S':
            onehot_encode[i, 1]=1
            onehot_encode[i, 2]=1
            continue
        if my_array[i] == 'W':
            onehot_encode[i, 0]=1
            onehot_encode[i, 3]=1
            continue
        
        if my_array[i] == 'K':
            onehot_encode[i, 2]=1
            onehot_encode[i, 3]=1
            continue
        
        if my_array[i] == 'M':
            onehot_encode[i, 0]=1
            onehot_encode[i, 1]=1
            continue
        
        if my_array[i] == 'B':
            onehot_encode[i, 1]=1
            onehot_encode[i, 2]=1
            onehot_encode[i, 3]=1
            continue
        
        if my_array[i] == 'D':
            onehot_encode[i, 0]=1
            onehot_encode[i, 2]=1
            onehot_encode[i, 3]=1
            continue
        
        if my_array[i] == 'H':
            onehot_encode[i, 0]=1
            onehot_encode[i, 1]=1
            onehot_encode[i, 3]=1
            continue
        
        if my_array[i] == 'V':
            onehot_encode[i, 0]=1
            onehot_encode[i, 1]=1
            onehot_encode[i, 2]=1
            continue
        
        if my_array[i] == 'N':
            continue
        
        onehot_encode[i, base_dict[my_array[i]]]=1
        
        
    return onehot_encode

#if __name__=='__main__':
#    encodeDNA(sys.argv[1])
model = load_model('caeDNA11.h5')#모델 불러오기
predict_img =model.predict(encodeDNA(sys.argv[1]).reshape(-1,1600,4,1))
#model_predict = model.predict(encodeDNA(sys.argv[1]))
#print(model_predict)
#print(model.summary())
#print(model.predict(encodeDNA(sys.argv[1])))
print(np.mean(np.abs(encodeDNA(sys.argv[1]) - predict_img.reshape(1600,4))))

#print(sys.argv)
#print(encodeDNA(sys.argv[1]))

#encodeDNA(sys.argv[1]) 지워도됨 
sys.stdout.flush()