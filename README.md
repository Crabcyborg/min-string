# min-string
URL Friendly Lossless Integer Compression in JavaScript. It uses ASCII characters starting from ! (33) to ~ (126) excluding a few characters that influence the way a URL works (/\.?#) as well as the comma (,) to easily distinguish raw data from compressed data.

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
