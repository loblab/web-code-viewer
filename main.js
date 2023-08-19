function updateDocTitle(url) {
  const parts = url.split("/");
  let fname = parts[parts.length - 1];
  if (!fname) fname = 'index';
  let t0 = document.title;
  let t = `${fname} (${t0})`;
  document.title = t;
}

function jumpToLine(str_num) {
  if (str_num.length === 0) {
    //console.log("no line number specified");
    return true;
  }
  let num = parseInt(str_num);
  //console.log(`jump to line ${num}`);
  const tables = document.getElementsByTagName("table");
  if (tables.length !== 1) {
    console.log(`Count of table: ${tables.length}, not 1`);
    return false;
  }
  const table = tables[0];
  const rows = table.rows;
  if (rows.length < num) {
    console.log(`Cannot jump row ${num} as total is ${rows.length}`);
    return false;
  }
  num -= 1;
  if (num < 0) num = 0;
  let row = rows[num];
  row.classList.add('selected');
  num -= 10;
  if (num < 0) num = 0;
  row = rows[num];
  row.scrollIntoView();
  return true;
}

function waitForElement(selector) {
  return new Promise(function(resolve) {
    const observer = new MutationObserver(function(mutations) {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}

async function waitJumpToLine(n) {
  await waitForElement('td.hljs-ln-numbers');
  return jumpToLine(n);
}

document.addEventListener("DOMContentLoaded", function() {
  const site = window.location.origin;
  const selfUrl = site + window.location.pathname;
  const fileUrl = window.location.search.slice(1);
  const lineNum = window.location.hash.slice(1);
  const url = fileUrl ? fileUrl : selfUrl;
  const title = url.replace(site, '');
  const titleElement = document.getElementById("title");
  const codeElement = document.getElementById("code");
  titleElement.textContent = title;
  titleElement.href = url;
  fetch(url, {
    mode: 'cors',
    cache: "no-cache",
    credentials: "omit",
    referrerPolicy: "no-referrer"
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.text();
  })
  .then((text) => {
    codeElement.textContent = text;
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
    updateDocTitle(url);
    waitJumpToLine(lineNum);
  })
  .catch((error) => {
    codeElement.textContent = `Could not fetch: ${error}`;
  });

});
