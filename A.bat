: @echo off

set Looping_number=100
cd %CD%
if not exist "\img\" mkdir img
FOR /L %%A IN (1,1,%Looping_number%) DO call :doit %%A
pause

:doit
start B.bat
timeout /t 600 /nobreak
taskkill /IM cmd.exe /FI "WINDOWTITLE eq titulo*"
taskkill /IM cmd.exe /FI "WINDOWTITLE eq C:\Windows\system32\cmd.exe - B.bat*"
goto :eof 
