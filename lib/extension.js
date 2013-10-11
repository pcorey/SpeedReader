(function(u) {
  // this ugly hack is because Opera seems to run userJS on iFrames regardless of @include and @exclude directives.
  // unfortunately, more sites than you'd guess use iframes - which can cause unexpected behavior if Opera goes and
  // runs this script on a page it's not meant to be run
  if (window!=window.top) {
    return false;
  }

  /*
   * NOTE: Opera will run this on EVERY page! It does not have a "run only on matching domains" feature
   * like Firefox, Safari and Chrome all have.  If you want to restrict execution to certain sites, this
   * is the place to add some code to check location.href and return false if not a match.
   *
   */

  var body = document.getElementsByTagName('body')[0];

  var getSelectedText = function() {
      if (window.getSelection) {
          return window.getSelection().toString();
      }
      else if (document.getSelection) {
          return document.getSelection().toString();
      }
      else if (document.selection) {
          return document.selection.createRange().text.toString();
      }
      return null;
  };

  var splitWords = function(text) {
      var wordsAndEmpties = text.split(/\s+/);
      var words = new Array();
      for (var i = 0; i < wordsAndEmpties.length; i++) {
          if (wordsAndEmpties[i]) {
              words.push(wordsAndEmpties[i]);
          }
      }
      return words;
  };

  var buildWrapper = function(allWords) {
      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.right = '10px';
      div.style.bottom = '10px';
      div.style.background = 'red';
      div.style.textalign = 'center';

      var p = document.createElement('p');
      p.style.width = '150px';
      p.innerHTML = allWords[0];
      
      div.appendChild(p);

      var nextWord = function(words) {
          if (words.length == 0) {
              body.removeChild(div);
              return;
          }
          p.innerHTML = words[0];
          setTimeout(nextWord, 250, words.slice(1));
      };
      setTimeout(nextWord, 250, allWords.slice(1));
      return div;
  };

  document.onkeyup = function(event) {
      var words = splitWords(getSelectedText());
      if (words.length > 0) {
          var div = buildWrapper(words);
          body.appendChild(div);
      }
  };

  alert('hellooo');

})();
