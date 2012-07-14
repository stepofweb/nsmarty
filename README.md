# nSmarty - Node.js Smarty [Template Engine]
# Prety much the same like PHP Smarty

## Install

    npm install nsmarty

## TEST

	1. Unpack demo.zip 
	2. Run the application: node app.js
	3. Open your browser: http://127.0.0.1:8000/



## JAVASCRIPT USAGE

    var  util    = require('util'),
         http    = require('http'),
         nsmarty = require('nsmarty');

	// IMPORTANT! Templates path	
    nsmarty.tpl_path = __dirname + '';

    var $arr = {
	  // simple {$title}
      title: 'Hi, I am nsmarty template engine!',

	  // loop {foreach} ... {/foreach}
	  books: [
		  {
			 title  : 'JavaScript: The Definitive Guide',          
			 author : 'David Flanagan',                            
			 price  : '31.18'
		  },
		  {
			 title  : 'Murach JavaScript and DOM Scripting',
			 author : 'Ray Harris'
		  },
		  {
			 title  : 'Head First JavaScript',
			 author : 'Michael Morrison',
			 price  : '29.54'
		  }
		]
    }

	http.createServer(function (req, res) {

	  // assign - parse the template.
	  var 	stream = nsmarty.assign('test.tpl', $arr);
			util.pump(stream, res); // take place of _display() from PHP Smarty.

	}).listen(8000);
	console.log("Server started: http://127.0.0.1:8000/");

## TEMPLATE USAGE

	Create a file named "test.tpl"


	{* NSMARTY TEMPLATE TEST *}

	<h1>{$title}</h1>

	{foreach $books as $i => $book}
		<div style="background-color: {cycle values='cyan,yellow'};">
			[{$i+1}] {$book.title|upper} by {$book.author}

			{if $book.price}                                
				Price: <span style="color:red">&euro;{$book.price}</span>
			{/if}
		</div>
	{else}
		No books
	{/foreach}

## Documentation

	See doc/ folder

## General

	=> is a port of the Smarty Template Engine to Javascript, a JavaScript template library that supports the 
	template syntax and all the features (functions, variable modifiers, etc.) of the well-known PHP template engine Smarty. 
	=> allows you to use the same Smarty templates on both server and client side, for both PHP and Javascript. 
	=> supports plugin architecture

	=> no PHP syntax

## Copyright

	Module Author:		Dorin Grigoras
	Code Contributors:	http://code.google.com/p/jsmart/ , mustache (caching system)