const site = window.location.origin;
const self_url = site + window.location.pathname;
const file_url = window.location.search.slice(1);
const line_num = window.location.hash.slice(1);

function jumpToLine(str_num) {
  if (str_num.length === 0) {
    console.log("no line number specified");
    return false;
  }
  let num = parseInt(str_num);
  console.log(`jump to line ${num}`);
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
  const url = file_url ? file_url : self_url;
  const title = url.replace(site, '');
  const ele_title = document.getElementById("title");
  const ele_code = document.getElementById("code");
  ele_title.textContent = title;
  ele_title.href = url;
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
    ele_code.textContent = text;
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
    waitJumpToLine(line_num);
  })
  .catch((error) => {
    ele_code.textContent = `Could not fetch: ${error}`;
  });

});
