# js-Caesar
Шифр цезаря и вижинера.

**Примеры запуска:**

## Запуск шифра Цезаря:

js-Caesar>node src/caesar.js code resources/in.txt resources/out_for_code.txt 1 ru

**code** - вариант для кодирования, можно выбрать **decode** для декодирования\
**resources/in.txt** - файл с исходным текстом\
**resources/out_for_code.txt** - файл для записи результата\
**1** - сдвиг для шифра Цезаря\
**ru** - алфавит ru/en

После выполнения предыдущей команды можно запустить декодирование:\
js-Caesar>node src/caesar.js decode resources/out_for_code.txt resources/out_for_decode.txt ru\
В консоль будет выведено:\
The shift was 1\
В файле **resources/out_for_decode.txt** будет лежать исходный текст

## Запуск шифра Виженера:

js-Caesar>node src/caesar.js code resources/in2.txt resources/out_for_code.txt key en vigenere

**key** - кодовое слово\
**vigenere** - если указан, то используется шифр Виженера


