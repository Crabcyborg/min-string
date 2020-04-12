let min = {
	base64_symbols: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$',
	counter_symbols: '^*-_~`',
	additional_symbols: '@=\'";:',
	three_character_permutations_symbols: '<>()[]',
	two_character_permutations_symbols: '{}+|',
	patterns: ['3\\$0', 'Y0\\$', 'M0\\*', '!f\\$', '@20', '080', '0Y0', '0f0', '\\$`\\$', '3w0', 'fYf', '0fU', '"23', 'c01', 'Y07', '0fY', '!3\\$', '020', '3M3', 'Y@f', '0fM', '\\$"3', '\\$\\^Y', '640', '030', '1Y0', '1M0', 'Yf=', '@3w', '0c0', '"22', '0M0', '\\$3\\$', '!\\$\\^', '3\\$v', '0g0', 'o\'o', 'M3"', '"1M', 'f\\$\\^', 'M3M', '0s0', '0v0', '@80', '\\$\\*"', '03"'],
	other_patterns: ['$ $ $', '"  "  "', '$M  $', '01  0', '= $  $', '01  \'', 'M f  0', '0 "  0', '0 "  "', '0  "  0', 'M " M', '3 0 "', 'M  0  "', 'm  q  G', '$  $  f', 'Y $ Y', '"  f  "', '1w0', '0  " "', '$^ $', '1 "V', '1" Y', '" " M', '$M   $', '0  "  "', '" fw'],
	pipe: (...ops) => ops.reduce((a, b) => arg => b(a(arg))),
	charAt: index => {
		const { base64_symbols, counter_symbols, additional_symbols } = min;
		if(index < base64_symbols.length) return base64_symbols.charAt(index);
		index -= base64_symbols.length;
		if(index < counter_symbols.length) return counter_symbols.charAt(index);
		index -= counter_symbols.length;
		if(index < additional_symbols.length) return additional_symbols.charAt(index);
	},
	escape: string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
	replaceAt: (target, index, replacement, remove) => target.substr(0, index) + replacement + target.substr(index + (remove === undefined ? replacement.length : remove)),
	sortPatterns: counts => Object.keys(counts).sort((a, b) => counts[b] - counts[a]),
	topPattern: counts => min.sortPatterns(counts)[0],
	toBase64: input => {
		const { toBase64, base64_symbols } = min, symbols = min.base64_symbols, length = input.length;

		let output = [];
		for(let i = 0; i < length; i += 3) {
			let set = input.slice(i, i+3);
			while(set.length < 3) set.push(0);
			let quotient = set[0] + (set[1] << 8) + (set[2] << 16), result = '';

			while(quotient) {
				let remainder = quotient % 64;
				quotient = Math.floor(quotient / 64);
				result = symbols.charAt(remainder) + result;
			}

			output.push(result.padStart(4, '0'));
		}
	
		return output.join('');
	},
	toDecimal: input => {
		const { toDecimal, base64_symbols } = min, length = input.length;

		let output = [];
		for(let i = 0; i <= length; i += 4) {
			const str = input.substr(i, 4), to = str.length;
			let number = 0;
			for(let i = 0; i < to; ++i) number = 64 * number + base64_symbols.indexOf(str.charAt(i));
			const first = number >> 16;
			number -= first << 16;
			const second = number >> 8;
			number -= second << 8;
			output = output.concat([number, second, first]);
		}
	
		while(output[output.length-1] == 0) output.pop();
		return output;
	},
	counter: input => {
		const symbols = min.counter_symbols;
		let previous = false, count = 0, output = '';
	
		const addPreviousCharacterToOutput = () => {
			if(previous === false) return;
			output += previous;
			if(count <= 1) return;
			output += count === 2 ? previous : symbols.charAt(count-3);
		};
	
		const length = symbols.length, last_index = length-1;
		for(let c of input) {
			if(c === previous) {
				++count;
	
				if(count-3 == length) {
					output += previous;
					output += symbols.charAt(last_index);
					count = 1;
				}
			} else {
				addPreviousCharacterToOutput();
				count = 1;
				previous = c;
			}
		}
	
		addPreviousCharacterToOutput();
		return output;
	},
	decounter: input => {
		const symbols = min.counter_symbols;

		let output = '', previous;
		for(let c of input) {
			let index = symbols.indexOf(c);
			
			if(index >= 0) {
				++index;
				for(let i = 0; i <= index; ++i) output += previous;
			} else {
				output += c;
			}
	
			previous = c;
		}
	
		return output;
	},
	twoMostCommonPatterns: input => input.replace(/00/g, '@').replace(/\$\$/g, '='),
	unsubTwoMostCommonPatterns: input => input.replace(/\@/g, '00').replace(/\=/g, '$$$'),
	thirdMostCommonPattern: input => input.replace(/0\^/g, '\''),
	unsubThirdMostCommonPattern: input => input.replace(/'/g, '0^'),
	commonThreeCharacterPatterns: input => {
		const { patterns, base64_symbols } = min, length = patterns.length;
		for(let index = 0; index < length; ++index) input = input.replace(new RegExp(patterns[index], 'g'), '"'+base64_symbols.charAt(index));	
		return input;
	},
	unsubCommonThreeCharacterPatterns: input => {
		const { patterns, base64_symbols } = min;
		for(let index = patterns.length-1; index >= 0; --index) input = input.replace(new RegExp('"'+base64_symbols.charAt(index), 'g'), patterns[index].replace(/\\/g, ''));	
		return input;
	},
	commonSpecialPatterns: input => {
		const { patterns, other_patterns, charAt, replaceAt } = min, input_length = input.length, patterns_length = patterns.length, other_pattern_length = other_patterns.length;

		for(let index = 0; index < other_pattern_length; ++index) {
			const pattern = other_patterns[index], pattern_length = pattern.length, length = input_length-pattern_length+1;

			for(let i = 0; i < length; ++i) {
				let match = true;
				for(let j = 0; j < pattern_length; ++j) {
					if(pattern[j] !== ' ' && input[i+j] !== pattern[j]) {
						match = false;
						break;
					}
				}

				if(!match) continue;
	
				let character_index = patterns_length + index, character = charAt(character_index), subbed = '"' + character;
				for(let char_index = 0; char_index < pattern_length; ++char_index) {
					if(pattern[char_index] === ' ') subbed = subbed.concat(input[i+char_index]);
				}
				
				input = replaceAt(input, i, subbed, pattern_length);
			}
		}
	
		return input;
	},
	unsubCommonSpecialPatterns: input => {
		const { patterns, other_patterns, charAt } = min, input_length = input.length, patterns_length = patterns.length;

		for(let index = other_patterns.length-1; index >= 0; --index) {
			const character_index = patterns_length + index, character = charAt(character_index), search = '"'+character;
	
			if(input.indexOf(search) >= 0) {
				let unsubbed_string = '';
				for(let string_index = 0; string_index < input.length; ++string_index) {
					if(string_index+1 < input_length && input[string_index] === '"' && input[string_index+1] === character) {
						const pattern = other_patterns[index], pattern_length = pattern.length;
						for(let i = 2, j = 0; j < pattern_length; ++j) {
							if(pattern[j] !== ' ') {
								unsubbed_string += pattern[j];
							} else {
								unsubbed_string += input[string_index+i];
								++i;
							}
						}
	
						string_index += pattern_length-2;
					} else {
						unsubbed_string += input[string_index];
					}
				}
	
				input = unsubbed_string;
			}
		}
	
		return input;
	},
	subTopPattern: (input, character) => {
		const { topPattern, escape } = min, to = input.length-1;

		let counts = {};
		for(let i = 0; i < to; ++i) {
			const pattern = input[i] + input[i+1];
			counts[pattern] = (counts[pattern] || 0) + 1;
		}
	
		const top = topPattern(counts);
		if(counts[top] <= 2) return input;
	
		const first_index = input.indexOf(top);
		return input.substr(0, first_index) + character + top + input.substr(first_index+2).replace(new RegExp(escape(top), 'g'), character);
	},
	topTwoPatterns: input => min.subTopPattern(min.subTopPattern(input, ';'), ':'),
	unsubPattern: (input, character) => {
		let first_index = input.indexOf(character);
		if(first_index === -1) return input;	
		const pattern = input[first_index+1] + input[first_index+2];
		return input.replace(character+pattern, pattern).replace(new RegExp(character, 'g'), pattern);
	},
	unsubTopTwoPatterns: input => min.unsubPattern(min.unsubPattern(input, ':'), ';'),
	ruleAdjustment: (pattern, rule_index) => {
		switch(rule_index) {
			case 0: return pattern; // do nothing											<
			case 1: return pattern[1] + pattern[2] + pattern[0]; // shift left 1			>
			case 2: return pattern[2] + pattern[0] + pattern[1]; // shift right 1			(
			case 3: return pattern[1] + pattern[0] + pattern[2]; // swap first 2			)
			case 4: return pattern[0] + pattern[2] + pattern[1]; // swap last 2				[
			case 5: return pattern[2] + pattern[1] + pattern[0]; // flip					]
		}
	},
	patternMatches: (pattern, input) => {
		const { ruleAdjustment } = min, permutations = min.permutations(pattern), to = input.length-2;
		
		let matches = {}, number = 0;
		for(let rule_index = 0; rule_index < 6; ++rule_index) {
			const permutation = permutations[rule_index];
	
			for(let i = 0; i < to; ++i) {	
				if(input[i] === permutation[0] && input[i+1] === permutation[1] && input[i+2] === permutation[2]) {
					matches[rule_index] = rule_index;
					++number;
				}
			}
		}
	
		return { matches: Object.values(matches), number };
	},
	permutations: input => {
		const { ruleAdjustment } = min;
		let permutations = [];
		for(let rule_index = 0; rule_index < 6; ++rule_index) permutations.push(ruleAdjustment(input, rule_index));
		return permutations;
	},
	threeCharacterPermutations: input => {
		const { topPattern, patternMatches, escape, ruleAdjustment } = min, symbols = min.three_character_permutations_symbols, to = input.length-2;

		let counts = {};
		for(let i = 0; i < to; ++i) {
			const pattern = input.substr(i, 3);
			counts[pattern] = patternMatches(pattern, input).number;
		}
	
		const top = topPattern(counts);		
		if(counts[top] <= 2) return input;
	
		const first_index = input.indexOf(top), matches = patternMatches(top, input).matches;
		let result = input.substr(0, first_index) + symbols[0] + top, remaining = input.substr(first_index+3);	
		for(let rule_index of matches) {
			let comparison = escape(ruleAdjustment(top, rule_index));
			remaining = remaining.replace(new RegExp(comparison, 'g'), () => symbols[rule_index]);
		}
	
		result += remaining;
		return result.length < input.length ? result : input;
	},
	unsubThreeCharacterPermutations: input => {
		const { escape, ruleAdjustment } = min, symbols = min.three_character_permutations_symbols, first_index = input.indexOf(symbols[0]);
		if(first_index === -1) return input;
	
		const pattern = input.substr(first_index+1, 3);
		let result = input.substr(0, first_index) + pattern, remaining = input.substr(first_index+4);
		for(let rule_index = 5; rule_index >= 0; --rule_index) {
			const check = symbols[rule_index];
			if(remaining.indexOf(check) >= 0) remaining = remaining.replace(new RegExp(escape(check), 'g'), () => ruleAdjustment(pattern, rule_index));
		}
	
		return result + remaining;
	},
	twoCharacterPermutations: input => {
		const { topPattern, escape } = min, symbols = min.two_character_permutations_symbols, to = input.length-1;

		let counts = {};
		for(let i = 0; i < to; ++i) {
			let pattern = [input[i], input[i+1]].sort().join('');
			counts[pattern] = (counts[pattern] || 0) + 1;
	
			if(i < to-1) {
				pattern = [input[i], input[i+2]].sort().join('');
				counts[pattern] = (counts[pattern] || 0) + 1;
			}
		}
	
		let top = topPattern(counts);
		if(counts[top] <= 2) return input;
	
		const flip = top[1] + top[0];
		let first_index, first_character, first_pattern;
		for(let char_index = 0; char_index < to; ++char_index) {
			let current = input[char_index] + input[char_index+1];
			if(current === top || current === flip) {
				if(current === flip) top = flip;
				first_index = char_index;
				first_character = symbols[0];
				first_pattern = current;
				break;
			}
	
			if(char_index < to-1) {
				current = input[char_index] + input[char_index+2];
				if(current === top || current === flip) {
					if(current === flip) top = flip;	
					first_index = char_index;
					first_character = symbols[2];
					first_pattern = input.substr(char_index, 3);
					break;
				}
			}
		}
	
		let result = input.substr(0, first_index) + first_character + first_pattern, remaining = input.substr(first_index+first_pattern.length);
		for(let c of symbols) {
			let comparison, replace;
			switch(c) {
				case symbols[0]: comparison = escape(top); replace = c; break;
				case symbols[1]: comparison = escape(top[1] + top[0]); replace = c; break;
				case symbols[2]: comparison = '(' + escape(top[0]) + ')([^]{1})(' + escape(top[1]) + ')'; replace = c + "$2"; break;
				case symbols[3]: comparison = '(' + escape(top[1]) + ')([^]{1})(' + escape(top[0]) + ')'; replace = c + "$2"; break;
			}
	
			remaining = remaining.replace(new RegExp(`${comparison}`, 'g'), replace);
		}
	
		return result + remaining;
	},
	unsubTwoCharacterPermutations: input => {
		const { escape } = min, symbols = min.two_character_permutations_symbols, length = symbols.length;

		let first_index = -1, first_character;
		for(let rule_index = 0; rule_index < length; ++rule_index) {
			const index = input.indexOf(symbols[rule_index]);
			if(index !== -1 && (first_index === -1 || index < first_index)) {
				first_index = index;
				first_character = symbols[rule_index];
			}
		}
	
		if(first_index === -1) return input;
	
		let trailing = input.substr(first_index+1, 3), result = input.substr(0, first_index), characters = '', step;
		switch(first_character) {
			case symbols[0]:
				characters += trailing[0] + trailing[1];
				result += trailing.substr(0, 2);
				step = 3;
			break;
	
			case symbols[2]:
				characters += trailing[0] + trailing[2];
				result += trailing;
				step = 4;
			break;
		}
	
		let remaining = input.substr(first_index+step);
		for(let char_index = length-1; char_index >= 0; --char_index) {
			const c = symbols[char_index];
	
			if(remaining.indexOf(c) >= 0) {
				let comparison, replace;
				switch(c) {
					case symbols[0]: comparison = escape(symbols[0]); replace = () => characters; break;
					case symbols[1]: comparison = escape(symbols[1]); replace = () => characters[1] + characters[0]; break;
					case symbols[2]: comparison = '('+escape(symbols[2])+')([^]{1})'; replace = characters[0] + "$2" + characters[1]; break;
					case symbols[3]: comparison = '('+escape(symbols[3])+')([^]{1})'; replace = characters[1] + "$2" + characters[0]; break;
				}
	
				remaining = remaining.replace(new RegExp(comparison, 'g'), replace);
			}
		}
	
		return result + remaining;
	},
	normalize: input => {
		const length = input.length;
		let output = [];
		for(let index = 0; index < length; ++index) {
			const first = input[index] >> 8;
			output.push(first, input[index] - (first << 8));
		}
	
		return output;
	},
	denormalize: input => {
		const to = input.length-1;
		let output = [];
		for(let index = 0; index < to; index += 2) output.push((input[index] << 8) + input[index+1]);
		return output;
	}
};

min.compress = min.pipe(min.toBase64, min.counter, min.twoMostCommonPatterns, min.thirdMostCommonPattern, min.commonThreeCharacterPatterns, min.commonSpecialPatterns, min.topTwoPatterns, min.threeCharacterPermutations, min.twoCharacterPermutations);
min.decompress = min.pipe(min.unsubTwoCharacterPermutations, min.unsubThreeCharacterPermutations, min.unsubTopTwoPatterns, min.unsubCommonSpecialPatterns, min.unsubCommonThreeCharacterPatterns, min.unsubThirdMostCommonPattern, min.unsubTwoMostCommonPatterns, min.decounter, min.toDecimal);

export { min };