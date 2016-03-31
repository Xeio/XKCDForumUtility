chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            linksToJumps();
            addQuotingLinks();
            createQuoteOverrideScript();
        }
	}, 10);
});

function linksToJumps()
{
    var links = document.links;
    for (var i = 0; i < links.length; i++)
    {
        var postIdMatchInPostLink = links[i].href.match(/\?p=(\d*)#\d*/i);
        if (postIdMatchInPostLink)
        {
            var postName = "p" + postIdMatchInPostLink[1];
            if(document.getElementsByName(postName).length > 0 ||
                document.getElementById(postName))
            {
                links[i].href = "#" + postName;
            }
        }
    }
}

function addQuotingLinks(){
    var postId = window.location.href.match(/quote&f=\d*&p=(\d*)/i);
	var reply = document.getElementsByName("message")[0];
    if(reply)
    {
        var poster = reply.value.match(/\[quote="(?!\[url=)(.*?)"\]/i);
        if (postId[1] && poster[1])
        {
            var postLink = '[url=http://forums.xkcd.com/viewtopic.php?p=' + postId[1] + '#p' + postId[1] + ']↶[/url]';
            var newString = '[quote="' + poster[1] + '"]' + postLink + '\n';
            reply.value = reply.value.replace(poster[0], newString);
        }
    }
}

function createQuoteOverrideScript(){
	var quoteScript = document.createElement("script");
	quoteScript.textContent = addquote.toString();
	document.body.appendChild(quoteScript);
}

/// **********************************************************************************
/// Below replicated from PHPBB javascript with minor modification to add link
/// **********************************************************************************
function addquote(post_id, username, l_wrote)
{
	var message_name = 'message_' + post_id;
	var theSelection = '';
	var divarea = false;

	if (l_wrote === undefined)
	{
		// Backwards compatibility
		l_wrote = 'wrote';
	}

	if (document.all)
	{
		divarea = document.all[message_name];
	}
	else
	{
		divarea = document.getElementById(message_name);
	}

	// Get text selection - not only the post content :(
	// IE9 must use the document.selection method but has the *.getSelection so we just force no IE
	if (window.getSelection && !is_ie && !window.opera) 
    {
		theSelection = window.getSelection().toString();
	} 
    else if (document.getSelection && !is_ie) 
    {
		theSelection = document.getSelection();
	} 
    else if (document.selection) 
    {
		theSelection = document.selection.createRange().text;
	}

	if (theSelection == '' || typeof theSelection == 'undefined' || theSelection == null)
	{
		if (divarea.innerHTML)
		{
			theSelection = divarea.innerHTML.replace(/<br>/ig, '\n');
			theSelection = theSelection.replace(/<br\/>/ig, '\n');
			theSelection = theSelection.replace(/&lt\;/ig, '<');
			theSelection = theSelection.replace(/&gt\;/ig, '>');
			theSelection = theSelection.replace(/&amp\;/ig, '&');
			theSelection = theSelection.replace(/&nbsp\;/ig, ' ');
		}
		else if (document.all)
		{
			theSelection = divarea.innerText;
		}
		else if (divarea.textContent)
		{
			theSelection = divarea.textContent;
		}
		else if (divarea.firstChild.nodeValue)
		{
			theSelection = divarea.firstChild.nodeValue;
		}
	}

	if (theSelection)
	{
		if (bbcodeEnabled)
		{
            var postLink = '[url=http://forums.xkcd.com/viewtopic.php?p=' + post_id + '#p' + post_id + ']↶[/url]';
			var newText = '[quote="' + username + '"]' + postLink + '\n' + theSelection + '[/quote]';
            
			insert_text(newText);
			
			//insert_text('[quote="' + username + '"]' + theSelection + '[/quote]');
		}
		else
		{
			insert_text(username + ' ' + l_wrote + ':' + '\n');
			var lines = split_lines(theSelection);
			for (i = 0; i < lines.length; i++)
			{
				insert_text('> ' + lines[i] + '\n');
			}
		}
	}

	return;
};