



let inputText = document.querySelector("#input");
let output = document.querySelector("#output");
let encodeButton = document.querySelector("#encodeButton");
let decodeButton = document.querySelector("#decodeButton");
let key = document.querySelector("#keyInput")
let algorithm = document.querySelector('#Algorithm');


encodeButton.addEventListener('click',(e)=>{

	if(algorithm.value === 'Playfair')
		output.value = playfair(inputText.value,key.value,'encode');

	else if(algorithm.value === 'Vigenere')
	{
		if(!key.value)
			alert('Please specify a key');
		else
			output.value = vigenere(inputText.value,key.value,'encode');
	}
	else if(algorithm.value === 'Caesar Cipher')
		output.value = caesarCipher(input.value,key.value,'encode');
});


decodeButton.addEventListener('click',()=>{

	if(algorithm.value === 'Playfair')
	{
		output.value = playfair(inputText.value, key.value,'decode');
	}
	else if(algorithm.value === 'Vigenere')
	{
		if(!key.value)
			alert("Please specify a key");
		else
		{
			output.value = vigenere(inputText.value, key.value,'decode');
		}
	}
	else if(algorithm.value === 'Caesar Cipher')
		output.value = caesarCipher(inputText.value,key.value,'decode');
});



function sanitize(str){return str.toLowerCase().replace(/[^a-z]/gi,'');}



function getPlayfairTable(key)
{
	let codeBook = new Array(5);
	let keyVal = [...new Set(key.split(''))];
	let s = new Set(key.split(""));
	let alphabet = 97, ctr = 0, i = 0;

	for(let i = 0; i<5; i++)
		codeBook[i] = new Array(5);

	for(let i =0; i<=Math.floor(keyVal.length/5); i++)
		for(let j = 0; j<5 && j<keyVal.length; j++)
			codeBook[i][j] = keyVal[5*i+j];


	ctr = keyVal.length;
	i = Math.floor(ctr/5);

	while(ctr<25)
	{
		while(s.has(String.fromCharCode(alphabet)))
			alphabet++;
		let currentLetter = String.fromCharCode(alphabet);
		s.add(currentLetter);
		codeBook[i][ctr%5] = currentLetter;
		ctr++;
		if(ctr%5 === 0)
			i++;
	}
	return codeBook;
}

function findPair(arr,value)
{
	if(value === 'z')
		return {row:4, col:4};
	
	for(let row = 0; row<arr.length; row++)
	{
		for(let col = 0; col<5; col++)
			if(arr[row][col] == value)
				return {row,col};
	}
}

/*& is the padding*/
//encryption goes right and down for row and column.

// There is a bug with moving left and right in encoding and decoding.
function playfair(input,key, mode) 
{
	key = sanitize(key);
	input = sanitize(input);
	let arr = getPlayfairTable(key);
	let cipher = "", operation = 1;

	if(new Set(key.split('')).size>25)
		return;

	if(mode == 'decode')
		operation = -1;

	if(input.length%2!==0)
		input += 'x';
	for(let i = 1 ;i<input.length; i+=2)
	{
		let p1 = findPair(arr,input[i-1]);
		let p2 = findPair(arr,input[i]);
		let idx1 = 0, idx2 = 0;
		if(p1.row === p2.row && p1.col === p2.col)
			p2 = findPair(arr,'x');

	    if(p1.row - p2.row == 0)
		{	
			idx1 = p1.col+operation<0?4:(p1.col+operation)%5;
			idx2 = p2.col+operation<0?4:(p2.col+operation)%5;
			cipher += arr[p1.row][idx1];
			cipher += arr[p2.row][idx2];
		}
		else if(p1.col - p2.col == 0)
		{
			idx1 = p1.row+operation<0?4:(p1.row+operation)%5;
			idx2 = p2.row+operation<0?4:(p2.row+operation)%5;
			cipher += arr[idx1][p1.col];
			cipher += arr[idx2][p2.col];
		}
		else
		{
			cipher += arr[p1.row][p2.col];
			cipher += arr[p2.row][p1.col];
		}
	}
	return cipher;
}



function vigenereTable()
{
	let table = new Array(26);
	for(let i = 0; i<26; i++)
		table[i] = new Array(26);
	for(let i = 0, shift = 0; i<26; i++,shift++)
		for(let j = 0; j<26; j++)
			table[i][j] = String.fromCharCode(97+(j+shift)%26);
	return table;
}


function vigenere(input,key, mode)
{
	let table = vigenereTable();
	let text = '';
	input = sanitize(input);
	key = sanitize(key);
	if(mode === 'decode')
	{
		for(let i = 0; i<input.length; i++)
		{
			let row = key.charCodeAt(i%key.length)-97,
			col = table[row].indexOf(input[i]);
			text += String.fromCharCode(97+col);
		}
	}
	else
	{
		for(let i = 0; i<input.length; i++)
		{
			let row = key.charCodeAt((i)%key.length)-97,
			col = input.charCodeAt(i)-97;
			 text += table[row][col];
		}
	}
	return text;
}



function caesarCipher(input,key,mode)
{
	let cipher = '';
	key = sanitize(key);
	input = sanitize(input);
	let keyCode = 0;
	if(!key)
		keyCode = 5;
	else
		for(let i = 0; i<key.length; i++)
			keyCode = key.charCodeAt(i);
	keyCode %= 26;
	if(mode == 'encode')
	{
		for(let i = 0; i<input.length; i++)
		{
			let base = (input.charCodeAt(i)-97+keyCode)%26;
			cipher += String.fromCharCode(97+base);
		}
	}
	else
	{
		for(let i = 0; i<input.length; i++)
		{
			let curVal = input.charCodeAt(i)-97-keyCode;
			if(curVal<0)
				curVal = 123+curVal;
			else
				curVal += 97;
			cipher += String.fromCharCode(curVal);
		}
	}
	return cipher;
}