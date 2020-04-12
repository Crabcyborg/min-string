# min-string

The main goals of min-string are:
1. Create the shortest string possible from a given set of integers
2. Use a small set of characters that will work in a URL

min-string uses ASCII characters starting from ! (33) to ~ (126) excluding a few characters that influence the way a URL works (/\\.?#) as well as the space ( ) and comma (,).

Written with no dependencies in ES6. Can be used via npm with `yarn add min-string` or as a minified script available at https://unpkg.com/min-string@1.0.1/min-string.min.js

The script is 7KB minified.

min-string only works on arrays of integers between 0 and 255. Compression ratios are usually within between 25% to 35% of the original size but results vary. It's intended for small data and has not been tested with large sets of data.

Read about the blog post that inspired it here https://crabcyb.org/post/minimizing-shape-up

The package is free to use for any use. I would love to know if you use it in your project.
This package is not in any way an encryption method or a security feature. There is no salt with this package. It only benefits from its obscurity.

**Benchmark**

*Using the following string as input*

```
27,48,0,0,0,0,31,0,0,0,0,0,127,128,0,0,0,1,255,248,0,0,0,7,255,254,0,0,0,31,255,255,0,0,0,127,255,255,0,0,0,255,255,255,0,0,127,255,255,255,0,0,255,255,255,254,0,1,255,255,255,252,12,3,255,255,255,224,19,127,255,255,252,0,33,255,255,255,254,0,65,255,255,255,254,0,129,255,255,255,254,0,15,255,255,255,254,0,8,127,255,255,255,0,16,127,255,255,255,0,16,62,127,255,255,0,32,29,191,255,254,128,32,9,111,128,204,64,0,1,107,0,102,0,0,2,98,0,35,0,0,4,70,0,33,0,0,0,132,0,16,128,0,1,8,0,0,128,0,0,8,0,0,64
```

| method | length | ratio |
| --- | --- | --- |
| raw | 497 | 100% |
| hashids | 409 | 82.3% |
| base64 | 220 | 44.3% |
| min-string | 146 | 29.4% |

*Using the following string as input*

```
94,89,0,0,0,0,0,0,0,0,31,192,0,0,0,0,0,0,0,0,0,31,252,0,0,0,0,0,0,0,0,0,31,255,128,0,0,0,0,0,0,0,0,31,255,224,0,0,0,0,0,0,0,0,15,255,240,0,0,0,0,0,0,0,0,15,255,248,0,0,0,0,0,0,0,0,7,255,254,0,0,0,0,0,0,0,0,7,255,255,128,0,0,0,0,0,0,0,3,255,255,240,0,0,0,0,0,0,0,1,255,255,254,0,0,0,0,0,0,0,1,255,255,255,128,0,0,0,0,0,0,0,255,255,255,240,0,0,0,0,0,0,0,127,255,255,248,0,0,0,0,0,0,0,63,255,255,252,0,0,0,0,0,0,0,63,255,255,254,0,0,0,0,0,0,0,31,255,255,254,0,0,0,0,0,0,0,15,255,255,252,0,0,0,0,0,0,0,15,255,240,0,0,0,0,0,0,0,0,7,255,248,0,0,0,0,0,0,0,0,7,255,252,0,15,128,0,0,0,0,0,7,255,254,0,3,192,0,0,0,0,0,7,255,255,0,0,248,0,0,0,0,0,7,255,255,128,0,62,0,0,0,0,0,15,255,255,192,0,7,128,0,0,0,0,63,255,255,240,0,1,240,63,254,0,7,255,255,255,248,0,0,124,127,255,255,255,255,255,255,252,0,0,31,255,255,255,255,255,255,255,254,0,0,7,255,255,255,255,255,255,255,254,0,0,3,255,255,255,255,255,255,255,255,0,0,0,255,255,255,255,255,255,255,255,128,0,0,127,255,255,255,255,255,255,255,192,0,0,63,255,255,255,255,255,255,255,224,0,0,31,255,255,255,255,255,255,255,240,0,0,15,255,255,255,255,255,255,255,252,0,0,7,255,255,255,255,255,255,255,254,0,0,7,255,255,255,255,255,255,255,255,0,0,3,255,255,255,255,255,255,255,255,128,0,1,255,255,255,255,255,255,255,255,192,0,1,255,255,255,255,255,255,255,255,224,0,0,255,255,255,255,255,255,255,255,240,0,0,127,255,255,255,255,255,255,255,248,0,0,63,255,255,255,255,255,255,255,252,0,0,31,255,255,255,255,255,255,255,254,0,0,15,255,255,255,255,255,255,255,255,0,0,7,255,255,255,255,255,255,255,255,128,0,3,255,255,240,63,255,255,255,255,224,0,1,255,255,240,0,255,255,255,255,224,0,0,255,255,248,0,15,255,255,255,240,0,0,127,255,252,0,1,255,255,255,248,0,0,63,255,254,0,0,127,255,255,252,0,0,31,255,255,0,0,3,255,255,252,0,0,15,255,255,128,0,0,31,255,254,0,0,7,255,255,128,0,0,3,255,255,0,0,3,255,255,224,0,0,1,255,255,128,0,1,255,255,224,0,0,0,255,255,192,0,0,255,255,240,0,0,0,127,255,192,0,0,127,255,248,0,0,0,127,255,224,0,0,63,255,252,0,0,0,63,255,240,0,0,31,255,254,0,0,0,15,255,248,0,0,31,255,254,0,0,0,7,253,252,0,0,15,255,255,0,0,0,1,254,254,0,0,7,255,255,0,0,0,0,255,127,0,0,7,255,255,0,0,0,0,127,191,128,0,3,255,255,0,0,0,0,31,207,192,0,3,254,255,0,0,0,0,15,231,224,0,1,254,255,0,0,0,0,7,243,240,0,1,254,127,0,0,0,0,3,249,248,0,0,254,127,0,0,0,0,0,252,252,0,1,254,63,0,0,0,0,0,126,62,0,0,254,63,128,0,0,0,0,63,31,0,0,126,31,128,0,0,0,0,31,143,128,0,255,15,192,0,0,0,0,7,199,192,0,127,7,224,0,0,0,0,3,243,240,0,63,1,224,0,0,0,0,1,249,248,0,31,128,240,0,0,0,0,0,252,252,0,15,128,120,0,0,0,0,0,126,126,0,7,192,60,0,0,0,0,0,31,159,0,3,224,30,0,0,0,0,0,15,207,128,1,240,15,0,0,0,0,0,7,231,192,0,248,7,128,0,0,0,0,3,243,224,0,56,3,192,0,0,0,0,1,249,240,0,30,0,224,0,0,0,0,1,252,248,0,14,0,255,0,0,0,0,0,126,60,0,7,0,63,192,0,0,0,0,31,30,0,3,192,15,224,0,0,0,0,15,143,0,1,224,7,248,0,0,0,0,7,199,240,0,240,0,0,0,0,0,0,1,227,254,0,120,0,0,0,0,0,0,0,241,255,0,60,0,0,0,0,0,0,0,124,127,192,31,192,0,0,0,0,0,0,63,227,192,15,240,0,0,0,0,0,0,31,240,0,1,252,0,0,0,0,0,0,15,248,0,0,126,0,0,0,0,0,0,1,252,0
```

| method | length | ratio |
| --- | --- | --- |
| raw | 3035 | 100% |
| hashids | 2554 | 84.2% |
| base64 | 1396 | 46% |
| min-string | 764 | 25.2% |
