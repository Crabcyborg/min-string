# min-string
URL Friendly Lossless Integer Compression in JavaScript. It uses ASCII characters starting from ! (33) to ~ (126) excluding a few characters that influence the way a URL works (/\.?#) as well as the comma (,) to easily distinguish raw data from compressed data.

Written with no dependencies in ES6. Can be used via npm with `yarn add min-string` or as a minified script available at https://unpkg.com/min-string@1.0.1/min-string.min.js

The script is 7KB minified.

min-string only works on arrays of integers between 0 and 255. Compression ratios are usually within between 25% to 35% of the original size but results vary. It's intended for small data and has not been tested with large sets of data.

Read about the blog post that inspired it here https://crabcyb.org/post/minimizing-shape-up

The package is free to use for any use. I would love to know if you use it in your project.
This package is not in any way an encryption method or a security feature. There is no salt with this package. It only benefits from its obscurity.
