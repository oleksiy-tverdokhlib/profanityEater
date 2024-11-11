let replacements // Declare replacements in the uppermost scope
let initialBody = document.body.innerHTML

function replaceWords(textContent, replacements) {
	let words = textContent.split(/\s+/) // Split text into words
		words.forEach((word, index) => {
			replacements.forEach((replacement) => {
				if (word === replacement[0]) {
					let isHateSpeech =
						replacement[1] === '__label__offensive_speech' ||
						replacement[1] === '__label__hate_speech'
					words[index] = isHateSpeech ? replacement[2] : word
				}
			})
		})
	return words.join(' ')
}
//---------------------------------------------------------------------------
function processTextNodes(replacements) {
	var walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: function (node) {
				// Only accept text nodes containing non-whitespace characters
				return /\S/.test(node.nodeValue)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP
			},
		},
		false
	)

	while (walker.nextNode()) {
		let currentNode = walker.currentNode
		let textContent = currentNode.nodeValue
		currentNode.nodeValue = replaceWords(textContent, replacements)
	}
}
//---------------------------------------------------------------------------
async function fetchAndProcessReplacements() {
	replacements = await fetchReplacements() // Assign fetched replacements to the uppermost scope variable
	processTextNodes(replacements) // Process text nodes
}
//---------------------------------------------------------------------------
async function fetchReplacements() {
	let response = await fetch('http://127.0.0.1:5000/api/send_data', {
		method: 'POST',
		body: JSON.stringify(document.body.innerText),
	})
	return await response.json()
}
//---------------------------------------------------------------------------
;(async function () {
	await fetchAndProcessReplacements()
})()
//---------------------------------------------------------------------------
// Now you can use the replacements variable outside of the main function


function decode(initialBody){
    document.body.innerHTML = initialBody
}

decode(initialBody)
