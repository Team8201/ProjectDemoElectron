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

def decodeDNA(np):
    base_dict = {0:'A', 1:'C', 2:'G', 3:'T'}
    recomendSequence=""
    i = 0
    code=""
    while i < 1600:
        indexNum = 0
        while indexNum < 4:
            if np[0][i][indexNum] == 1 :
                code=code+base_dict[indexNum]
                break
            else:
                indexNum = indexNum + 1
        i=i+1
    recomendSequence="".join(code)
    return recomendSequence



model = load_model('caeDNA11.h5')#모델 불러오기
#predict_img =model.predict(encodeDNA(sys.argv[1]).reshape(-1,1600,4,1))


#print(np.mean(np.abs(encodeDNA(sys.argv[1]) - predict_img.reshape(1600,4))))

index =0
#predict_img[10]
predict_img=[]
predict_img.append(model.predict(encodeDNA(sys.argv[1]).reshape(-1,1600,4,1)))
#print(predict_img[0])
now=False
for count in range(4):
  #predict_img.append(model.predict(predict_img[count].reshape(-1,1600,4,1)))
  #print(predict_img[count])
  for i in range(1600):
      temp0=predict_img[count][0][i][0]
      temp1=predict_img[count][0][i][1]
      temp2=predict_img[count][0][i][2]
      temp3=predict_img[count][0][i][3]
      maximum = max(temp0,temp1,temp2,temp3)
      if(maximum==temp0):
          index=0
      elif(maximum==temp1):
          index=1
      elif(maximum==temp2):
          index=2
      elif(maximum==temp3):
          index=3
      
      for j in range(4):
        if(index==j):
          predict_img[count][0][i][j] =1
        else:
          predict_img[count][0][i][j]=0

    #print(predict_img[count])
  next = count+1
  predict_img.append(model.predict(predict_img[count].reshape(-1,1600,4,1)))
  #print(np.mean(np.abs(predict_img[count].reshape(1600,4) - predict_img[next].reshape(1600,4))))
  if(np.mean(np.abs(predict_img[next].reshape(1600,4) - predict_img[count].reshape(1600,4))) < 0.2):
    #print(np.mean(np.abs(predict_img[next].reshape(1600,4) - predict_img[count].reshape(1600,4))))
    #print(count)
    now=True
    for x in range(1600):
      temp0=predict_img[count][0][x][0]
      temp1=predict_img[count][0][x][1]
      temp2=predict_img[count][0][x][2]
      temp3=predict_img[count][0][x][3]
      maximum = max(temp0,temp1,temp2,temp3)
      if(maximum==temp0):
          index=0
      elif(maximum==temp1):
          index=1
      elif(maximum==temp2):
          index=2
      elif(maximum==temp3):
          index=3
      
      for y in range(4):
        if(index==y):
          predict_img[count][0][x][y] =1
        else:
          predict_img[count][0][x][y]=0
    #print(predict_img[count])
    decode_img = predict_img[count]
    break; 

if(now):
    print(decodeDNA(decode_img))
else :
    print("There is no nucleotide sequence to recommend.")

sys.stdout.flush()