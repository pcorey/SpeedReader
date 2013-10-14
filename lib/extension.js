(function(u) {
  // this ugly hack is because Opera seems to run userJS on iFrames regardless of @include and @exclude directives.
  // unfortunately, more sites than you'd guess use iframes - which can cause unexpected behavior if Opera goes and
  // runs this script on a page it's not meant to be run
  if (window!=window.top) {
    return false;
  }

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


  var buildReader = function() {
      var wrapper = document.createElement('div');
      wrapper.className = '__SpeedReader__wrapper';

      var text = buildText();

      var progress = document.createElement('div');
      progress.className = '__SpeedReader__progress';
      progress.innerHTML = '';

      var settings = document.createElement('img');
      settings.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIRJREFUeNpiYMAN9gPxfyjez0AiMEDSDMMGhDQEALEAECcA8XssBryHyglA1aIYeB6LBkL4PExzARmaYbiACUjoY/HSByBOBGJGKE6EiqEDeWwh/h/qV3SQgKZmPz5JXADDEiYGKgGKvNCPJ86RNWNLG/0URyNVEhJVkjLFmYns7AwQYAAS+n3BcDCF5QAAAABJRU5ErkJggg==';
      settings.className = '__SpeedReader__settings';

      var close = document.createElement('img');
      close.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4UlEQVR4Xo2TYQrCMAyFN397AG8oCKMwESbCYCBMBhsT/SXeUBA8gNSXakghXdyDt7Rd8y10Tea9D4Z62NHYMlTDd57zYgd7sgWBqmjfSABSy4sWBNol9vULPJ6Z1pjnueMJxmWoUuvB9DIQtR154l1FuVQBQQaEIlVJsNYeOSfEL+AHuSKsFcJIFoBAbgKxkwWgtTIAbwoaIKfdIMCT6rCnSgKQfAy37L9aQA4CkGQsKhXwJgE5MkRuonbJPWDchZoqWE6c9hD9nTPCNtN68RcuMXVmMznuxrgjm3ntLM32AV9m7vTAsTYoAAAAAElFTkSuQmCC';
      close.className = '__SpeedReader__close';

      wrapper.appendChild(close);
      wrapper.appendChild(text);
      wrapper.appendChild(settings);
      wrapper.appendChild(progress);

      var reader = {
          wrapper: wrapper,
          text: text,
          progress: progress,
          settings: settings,
          close: close
      };

      return reader;
  };

  var buildText = function() {
      var p = document.createElement('p');
      p.className = '__SpeedReader__text';

      return p;
  };

  var applyCss = function() {
      var css = 
          ['.__SpeedReader__wrapper {',
           '   position:fixed; right: 10px; bottom: 10px;',
           '   background: #FFFAF0; border: 2px solid black; align: left; text-align: left;',
           //'   -moz-border-radius: 5px; -webkit-border-radius: 5px; border-radius: 5px;',
           '}',
           '.__SpeedReader__text {',
           '   clear: right;',
           '   font-size: 50px; font-family: serif; line-height: normal;',
           '   text-align: center; padding: 10px 10px;',
           '   margin-bottom: 20px; margin-top: 20px;',
           '}',
           '.__SpeedReader__progress {',
           '   width: 0px; height: 2px; background: #CC0000;',
           '}',
           '.__SpeedReader__settings {',
           '   margin-top: -16px;',
           '   padding: 2px;',
           '}',
           '.__SpeedReader__close {',
           '   padding: 2px;',
           '   float:right;',
           '}'
          ].join('\n');
      var style = document.createElement('style');
      style.textContent = css;
      var head = document.getElementsByTagName('head')[0];
      if (head) {
          head.appendChild(style);
      }
  };

  var calcMinWidth = function(words, wrapper, min, max) {
      if (!words) {
          return min || 0;
      }

      var ruler = buildText();
      ruler.style.visibility = 'hidden';
      wrapper.appendChild(ruler);

      var width = min || 0;
      for (var i = 0; i < words.length; i++) {
          ruler.innerHTML = words[i];
          if (ruler.offsetWidth > width) {
              width = ruler.offsetWidth;
          }
      }
      wrapper.removeChild(ruler);
      if (max && width > max) {
          return max;
      }
      return width;
  };

  var setProgressTransition = function(progress, speed) {
      var transition = 'width ' + speed + 's linear';
      progress.style.webkitTransition = transition;
      progress.style.mozTransition = transition;
      progress.style.transition = transition;
  };

  var startReader = function(allWords) {
      var speed = 100;
      var numWords = allWords.length;

      var reader = buildReader();
      reader.text.innerHTML = allWords[0];

      reader.wrapper.style.visibility = 'hidden';
      body.appendChild(reader.wrapper);

      var minWidth = calcMinWidth(allWords, reader.wrapper);
      reader.wrapper.style.width = minWidth + 'px';
      reader.wrapper.style.visibility = 'visible';

      setProgressTransition(reader.progress, speed / 1000.0);

      var nextWord = function(words) {
          if (words.length == 0) {
              body.removeChild(reader.wrapper);
              return;
          }
          reader.text.innerHTML = words[0];
          reader.progress.style.width = (((numWords + 1) - words.length) / numWords * minWidth) + 'px';
          setTimeout(nextWord, speed, words.slice(1));
      };
      setTimeout(nextWord, speed, allWords.slice(1));
  };


  document.onkeyup = function(event) {
      var words = splitWords(getSelectedText());
      if (words.length > 0) {
          applyCss();
          startReader(words);
      }
  };

  alert('hellooo');

})();
