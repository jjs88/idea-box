(function() {


  let title = document.querySelector('.inputs__text[name="title"]');
  let body = document.querySelector('.inputs__text[name="body"]');
  const ideaTitle = document.querySelector('.idea__title');
  const ideaBody = document.querySelector('.idea__body');
  const btnSave = document.querySelector('.btn-save');
  // const words = ['genius', 'plausible', 'swill'];
  const bottom = document.querySelector('.bottom');
  const data = {};

  const up = {
    'swill': 'plausible',
    'plausible': 'genius'
  }

  const down = {
    'genius': 'plausible',
    'plausible': 'swill'
  }

  //load initial ideas on page load
  populateIdeas();

  btnSave.addEventListener('click', ()=> {

    const titleVal = title.value;
    const bodyVal = body.value;
    const date = new Date();

    //add to local storage and then the page
    addToLocalStorage(titleVal, bodyVal, date);
  
  });

  bottom.addEventListener('click', (e)=> {
    // target delete click
    if(e.target.classList.contains('idea__delete')) {
      removeIdea(e.target);
    }
    //target upvote 
    if(e.target.classList.contains('idea__upvote')) {
      const parent = e.target.parentNode;
      const word = parent.querySelector('.idea__word').innerHTML;
      parent.querySelector('.idea__word').innerHTML = up[word] ? up[word] : word;
      changeWord(parent, 'up',word);
    }
    //target downvote
    if(e.target.classList.contains('idea__downvote')) {
      const parent = e.target.parentNode;
      const word = parent.querySelector('.idea__word').innerHTML;
      parent.querySelector('.idea__word').innerHTML = down[word] ? down[word] : word;
      changeWord(parent, 'down', word);
    }
  })

  //use capturing option otherwise doesn't detect event
  bottom.addEventListener('blur', (e)=> {

    if(e.target.classList.contains('idea__title')) {
      editContent(e.target, 'title');
      return;
    }

    if(e.target.classList.contains('idea__body')) {
      editContent(e.target, 'body');
      return;
    }

  }, true)

  function editContent(ele, prop) {
    const newContent = ele.innerHTML;
    const parent = ele.parentNode;
    const key = parent.querySelector('.idea__delete').dataset.key

    //now edit the localstorage value
    const item = JSON.parse(localStorage.getItem(key));
    item[prop] = newContent;
    localStorage.setItem(key, JSON.stringify(item));
    // console.log(item, prop, item[prop]);
  }

  function changeWord(parent, vote, word) {
    const key = parent.querySelector('.idea__delete').dataset.key;
    const item = JSON.parse(localStorage.getItem(key));
    if(vote === 'up') {
      item.word = up[word] ? up[word] : word;
    } else {
      item.word = down[word] ? down[word] : word;
    }

    localStorage.setItem(key, JSON.stringify(item));
  }

  function ideaTemplate(title, body, key, word) {
    let idea = document.createElement('div');
    idea.classList.add('idea');

    idea.innerHTML = `
        <h2 class="idea__title" contenteditable="true">${title}</h2>
        <p class="idea__body" contenteditable="true">${body}</p>
        <div class="idea__actions">
          <img class="idea__delete" data-key=${key} src="delete.svg" alt="#">
          <img class="idea__downvote" src="downvote.svg" alt="#">
          <img class="idea__upvote" src="upvote.svg" alt="#">
          <span class="idea__quality">quality:</span>
          <span class="idea__word">${word || 'swill'}</span>
        </div>`;

      return idea;
  }

  function generateRandomWord() {
    const max = words.length;
    const min = 0;
    const pos = Math.floor(Math.random() * (max - min) + min);
    return words[pos];
  }

  function addToLocalStorage(title, body, date) {
    let pos = localStorage.length-1;
    pos++;
    data.title = title;
    data.body = body;
    data.date = date;
    data.key = pos;
    localStorage.setItem(pos, JSON.stringify(data));

     //add to page. Need the pos (key) for the reference so do it here
     bottom.appendChild(ideaTemplate(title, body, pos));
  }

  function populateIdeas() {

    let ideas = [];

    //loop through storage items and get the ideas 
    for(var i = 0; i < localStorage.length; i++) {
      const data = JSON.parse(localStorage.getItem(i));
      const newDate = new Date(data.date).toUTCString();
      data.date = newDate;  
      ideas.push(data);
      
    }
    //sort the ideas
    ideas.sort(sortIdeas)

    //add each idea to the page
    ideas.forEach(idea => {
     bottom.appendChild(ideaTemplate(idea.title, idea.body, idea.key, idea.word));
    });
  }

  function sortIdeas(a,b) {
    if(a.date > b.date) {
      return -1;
    } else {
      return 1;
    }
  }

  function removeIdea(ele) {
    const key = ele.dataset.key;
    const idea = ele.parentNode.parentNode;
    const parent = idea.parentNode;
    parent.removeChild(idea);
    localStorage.removeItem(key);
  }







})();