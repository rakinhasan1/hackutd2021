# Import Module
from tkinter import *
from tkinter import ttk
from itertools import *
import matplotlib.pyplot as plt
import json
from PIL import Image

def iterate_lines():
    for line in t.get('1.0', 'end-1c').splitlines():
        # Iterate lines
        if line:
            display = Label(frame2,text = line )

#getPlot()
# Create Tkinter Object
root = Tk()
root.title("Fluid Optimization")
root.resizable(0, 0)


# Set Geometry
root.geometry("900x600")
root.grid_propagate(0)

root.columnconfigure(0, weight=3)
root.columnconfigure(1, weight=1)
root.columnconfigure(2, weight=2)

root.rowconfigure(0, weight=1)


img1 = PhotoImage(file = "img1.png")
img2 = PhotoImage(file = "img2.png")
img3 = PhotoImage(file = "img3.png")
img4 = PhotoImage(file = "img4.png")
img5 = PhotoImage(file = "img5.png")
images = [img1,img2,img3,img4,img5]
#images = iter(images)
images = cycle(images)

file1="result1.txt"
file2="result2.txt"
file3="result3.txt"
file4="result4.txt"
file5="result5.txt"
textFiles = [file1,file2,file3,file4,file5]
textFiles = cycle(textFiles)

data=[]

imgTest = PhotoImage(file = "testGraph1.png")
img = PhotoImage(file = "myimage2.png")
logo = PhotoImage(file="logo.png")

# Frame 1 bottom left
frame1 = Frame(root,bg="white",width=475,height=100)
frame1.grid_propagate(0)
#frame1['borderwidth'] = 3
#frame1['relief'] = 'sunken'
frame1.grid(column=0, row=3, sticky=N, padx=5, pady=5)

wrapper1 = LabelFrame(frame1)
wrapper1.pack(fill="both", expand="yes",padx=5,pady=5)

# Frame 2 top right
frame2 = Frame(root,bg="white",width=275,height=250)
frame2.grid_propagate(0)
frame2.pack_propagate(0)
frame2.grid(column=2, row=0, sticky=NW, padx=5, pady=5)
frame2['borderwidth'] = 3
frame2['relief'] = 'sunken'
frame2.grid_propagate(0)
#ttk.Label(frame2, text="Percent of Flow: ", anchor = "w").grid(column=0, row=0, sticky=W)
#ttk.Label(frame2, text="Flow given: ", anchor = "w").grid(column=0, row=1, sticky=W)
#ttk.Label(frame2, text="Revenue generated: ", anchor = "w").grid(column=0, row=2, sticky=W)
#ttk.Label(frame2, text="datafield 4: ", anchor = "w").grid(column=0, row=3, sticky=W)
t = Text(frame2)

# Frame 3 top left
frame3 = Frame(root,bg="white",width=475,height=500)
frame3.grid_propagate(0)
frame3.pack_propagate(0)
frame3.grid(column=0, row=0, rowspan = 3, sticky=NW, padx=5, pady=5)
frame3['borderwidth'] = 3
frame3['relief'] = 'sunken'

imageDisplay = ttk.Label(frame3)
imageDisplay.pack()

path =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI"
path0 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result0.txt"
path1 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result1.txt"
path2 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result2.txt"
path3 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result3.txt"
path4 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result4.txt"
path5 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result5.txt"
path6 =r"C:/Users/Ameel/IdeaProjects\fluidOptimizationGUI\result6.txt"

file0 = open(path0,"r")
file1 = open(path1,"r")
file2 = open(path2,"r")
file3 = open(path3,"r")
file4 = open(path4,"r")
file5 = open(path5,"r")
file6 = open(path6,"r")


def Next():
    try:
        img = next(images)
    except  StopIteration:
        return
    imageDisplay.img = img
    imageDisplay["image"]=img



    t.insert(END, file0.read()+"\n"+"\n" ,file1.read()+"\n"+"\n" ,file2.read()+"\n"+"\n" ,file3.read()+"\n"+"\n" ,file4.read()+"\n"+"\n" ,file5.read()+"\n"+"\n",file6.read()+"\n"+"\n")
    t.pack()
#def Back():
    #try:
        #img = next(reversed(images))
    #except  StopIteration:
        #return
    #imageDisplay.img = img
    #imageDisplay["image"]=img

#Button(wrapper1, text="Back", command=Back).pack(side=LEFT)

Button(wrapper1, text="Next", command=Next).pack(side=LEFT)

# Frame 4 bottom right
frame4 = Frame(root,bg="white",width=275,height=300)
frame4.grid_propagate(0)
frame4.pack_propagate(0)
frame4.grid(column=2, row=2, rowspan = 2, sticky=NW, padx=5, pady=5)
frame4['borderwidth'] = 3
frame4['relief'] = 'sunken'
displayLabel = ttk.Label(frame4,image=logo)
displayLabel.pack()

# Execute Tkinter
root.mainloop()