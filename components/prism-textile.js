(function(Prism) {
	var modifierRegex = '(?:\\([^)]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\})+';
	var modifierTokens = {
		'css': {
			pattern: /\{[^}]+\}/,
			inside: {
				rest: Prism.languages.css
			}
		},
		'class-id': {
			pattern: /(\()[^)]+(?=\))/,
			lookbehind: true,
			alias: 'attr-value'
		},
		'lang': {
			pattern: /(\[)[^\]]+(?=\])/,
			lookbehind: true,
			alias: 'attr-value'
		},
		// Anything else is punctuation (the first pattern is for row/col spans inside tables)
		'punctuation': /[\\\/]\d+|./
	};



	Prism.languages.textile = Prism.languages.extend('markup', {
		'phrase': {
			pattern: /(^|\r|\n)[\S][\s\S]*?(?=$|(?:\r?\n|\r)\s*?(?:\r?\n|\r))/,
			lookbehind: true,
			inside: {

				// h1. Header 1
				'block': {
					pattern: RegExp('^[a-z]\\w*(?:' + modifierRegex + '|[<>=()])*\\.'),
					inside: {
						'modifier': {
							pattern: RegExp('(^[a-z]\\w*)(?:' + modifierRegex + '|[<>=()])*(?=\\.)'),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'tag': /^[a-z]\w*/,
						'punctuation': /\.$/
					}
				},

				// # List item
				// * List item
				'list': {
					pattern: RegExp('(^|\\r|\\n)[*#]+(?:' + modifierRegex + ')?\\s+.+'),
					lookbehind: true,
					inside: {
						'modifier': {
							pattern: RegExp('(^[*#]+)' + modifierRegex),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'punctuation': /^[*#]+/
					}
				},

				// | cell | cell | cell |
				'table': {
					// Modifiers can be applied to the row: {color:red}.|1|2|3|
					// or the cell: |{color:red}.1|2|3|
					pattern: RegExp('(^|\r|\n)(?:(?:' + modifierRegex + '|[<>=()^~])+\\.\\s*)?(?:\\|(?:(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+\\.)?[^|]*)+\\|'),
					lookbehind: true,
					inside: {
						'modifier': {
							// Modifiers for rows after the first one are
							// preceded by a pipe and a line feed
							pattern: RegExp('(^|\\|(?:\\r?\\n|\\r)?)(?:' + modifierRegex + '|[<>=()^~_]|[\\\\/]\\d+)+(?=\\.)'),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'punctuation': /\||^\./
					}
				},

				'inline': {
					pattern: RegExp('(\\*\\*|__|\\?\\?|[*_%@+\\-^~])(?:' + modifierRegex + ')?.+?\\1'),
					inside: {
						// Note: superscripts and subscripts are not handled specifically

						// *bold*, **bold**
						'bold': {
							pattern: RegExp('((^\\*\\*?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
							lookbehind: true
						},

						// _italic_, __italic__
						'italic': {
							pattern: RegExp('((^__?)(?:' + modifierRegex + ')?).+?(?=\\2)'),
							lookbehind: true
						},

						// ??cite??
						'cite': {
							pattern: RegExp('(^\\?\\?(?:' + modifierRegex + ')?).+?(?=\\?\\?)'),
							lookbehind: true,
							alias: 'string'
						},

						// @code@
						'code': {
							pattern: RegExp('(^@(?:' + modifierRegex + ')?).+?(?=@)'),
							lookbehind: true,
							alias: 'keyword'
						},

						// +inserted+
						'inserted': {
							pattern: RegExp('(^\\+(?:' + modifierRegex + ')?).+?(?=\\+)'),
							lookbehind: true
						},

						// -deleted-
						'deleted': {
							pattern: RegExp('(^-(?:' + modifierRegex + ')?).+?(?=-)'),
							lookbehind: true
						},

						// %span%
						'span': {
							pattern: RegExp('(^%(?:' + modifierRegex + ')?).+?(?=%)'),
							lookbehind: true
						},

						'modifier': {
							pattern: RegExp('(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])' + modifierRegex),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'punctuation': /[*_%?@+\-^~]/
					}
				},

				// [alias]http://example.com
				'link-ref': {
					pattern: /^\[[^\]]+\]\S+$/m,
					inside: {
						'string': {
							pattern: /(\[)[^\]]+(?=\])/,
							lookbehind: true
						},
						'url': {
							pattern: /(\])\S+$/,
							lookbehind: true
						},
						'punctuation': /[\[\]]/
					}
				},

				// "text":http://example.com
				// "text":link-ref
				'link': {
					pattern: RegExp('"(?:' + modifierRegex + ')?[^"]+":.+?(?=[^\\w/]?(?:\\s|$))'),
					inside: {
						'text': {
							pattern: RegExp('(^"(?:' + modifierRegex + ')?)[^"]+(?=")'),
							lookbehind: true
						},
						'modifier': {
							pattern: RegExp('(^")' + modifierRegex),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[":]/
					}
				},

				// !image.jpg!
				// !image.jpg(Title)!:http://example.com
				'image': {
					pattern: RegExp('!(?:' + modifierRegex + '|[<>=()])*[^!\\s]+!(?::.+?(?=[^\\w/]?(?:\\s|$)))?'),
					inside: {
						'source': {
							pattern: RegExp('(^!(?:' + modifierRegex + '|[<>=()])*)[^!]+(?=!)'),
							lookbehind: true,
							alias: 'url'
						},
						'modifier': {
							pattern: RegExp('(^!)(?:' + modifierRegex + '|[<>=()])*'),
							lookbehind: true,
							inside: Prism.util.clone(modifierTokens)
						},
						'url': {
							pattern: /(:).+/,
							lookbehind: true
						},
						'punctuation': /[!:]/
					}
				},

				// Footnote[1]
				'footnote': {
					pattern: /\b\[\d+\]/,
					alias: 'comment',
					inside: {
						'punctuation': /\[|\]/
					}
				},

				// CSS(Cascading Style Sheet)
				'acronym': {
					pattern: /\b[A-Z\d]+\([^)]+\)/,
					inside: {
						'comment': {
							pattern: /(\()[^)]+(?=\))/,
							lookbehind: true
						},
						'punctuation': /[()]/
					}
				},

				// Prism(C)
				'mark': {
					pattern: /\b\((TM|R|C)\)/,
					alias: 'comment',
					inside: {
						'punctuation':/[()]/
					}
				}
			}
		}
	});

	var nestedPatterns = {
		'inline': Prism.languages.textile['phrase'].inside['inline'],
		'link': Prism.languages.textile['phrase'].inside['link'],
		'image': Prism.languages.textile['phrase'].inside['image'],
		'footnote': Prism.languages.textile['phrase'].inside['footnote'],
		'acronym': Prism.languages.textile['phrase'].inside['acronym'],
		'mark': Prism.languages.textile['phrase'].inside['mark']
	};

	// Allow some nesting
	Prism.languages.textile['phrase'].inside['inline'].inside['bold'].inside = Prism.util.clone(nestedPatterns);
	Prism.languages.textile['phrase'].inside['inline'].inside['italic'].inside = Prism.util.clone(nestedPatterns);
	Prism.languages.textile['phrase'].inside['inline'].inside['inserted'].inside = Prism.util.clone(nestedPatterns);
	Prism.languages.textile['phrase'].inside['inline'].inside['deleted'].inside = Prism.util.clone(nestedPatterns);
	Prism.languages.textile['phrase'].inside['inline'].inside['span'].inside = Prism.util.clone(nestedPatterns);

	// Allow some styles inside table cells
	Prism.languages.textile['phrase'].inside['table'].inside['inline'] = Prism.util.clone(nestedPatterns['inline']);
	Prism.languages.textile['phrase'].inside['table'].inside['link'] = Prism.util.clone(nestedPatterns['link']);
	Prism.languages.textile['phrase'].inside['table'].inside['image'] = Prism.util.clone(nestedPatterns['image']);
	Prism.languages.textile['phrase'].inside['table'].inside['footnote'] = Prism.util.clone(nestedPatterns['footnote']);
	Prism.languages.textile['phrase'].inside['table'].inside['acronym'] = Prism.util.clone(nestedPatterns['acronym']);
	Prism.languages.textile['phrase'].inside['table'].inside['mark'] = Prism.util.clone(nestedPatterns['mark']);

}(Prism));