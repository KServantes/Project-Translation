: @echo off

set Looping_number=1
cd %CD%
if not exist "\img\" mkdir img
FOR /L %%A IN (1,1,%Looping_number%) DO call :doit %%A
pause

:doit
node json_creator.js
node final_line.js
timeout /t 0 /nobreak
goto :eof 
