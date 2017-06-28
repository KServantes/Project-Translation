: @echo off

set Looping_number=100
cd %CD%
if not exist "\img\" mkdir img
FOR /L %%A IN (1,1,%Looping_number%) DO call :doit %%A
node jason_creator.js
pause

:doit
node english_wiki_search.js 
node spanish_wiki_search_url.js
node spanish_wiki_search_text.js
node git_img_dowmload.js
timeout /t 10 /nobreak
goto :eof 
