
#!/bin/sh
for f in $(ls *.BMP) 
do
  f2=`echo $f | sed -e "s/BMP$/png/"` 
  convert $f $f2 
  rm $f
done

for f in $(ls *.bmp)
do
  f2=`echo $f | sed -e "s/bmp$/png/"`
  convert $f $f2
  rm $f
done
