: @echo off

set Looping_number=100
cd %CD%
if not exist "\img\" mkdir img
FOR /L %%A IN (1,1,%Looping_number%) DO call :doit %%A
pause

:doit
REM node english_wiki_search.js 
REM node spanish_wiki_search_url.js
REM node spanish_wiki_search_text.js
REM node git_img_download.js
REM node json_creator.js
REM node final_line.js
REM node rename_img.js
REM node variants_cards.js
REM node update_db.js
REM node strings_english_insert.js
REM node strings_spanish_insert.js
REM node strings_update_db.js
node strings_value_replace.js
pause
timeout /t 10 /nobreak
goto :eof 
