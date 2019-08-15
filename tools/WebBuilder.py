import os,sys

os.chdir(os.path.abspath("../"))
command_line = "cocos compile -p web -m release"
os.system(command_line)

os.system("pause")