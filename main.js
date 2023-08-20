const MaxFileSize = 262114;
const BinaryType = "^(image|video|audio)/";
const SourceType = "Makefile|\.(txt|log|h|hpp|hxx|inl|c|cc|cpp|cxx|mk|py|pl|sh|go|rb|java|groovy|awk|json|rst|md|ya?ml)$";

function updateContent(text) {
  const codeElement = document.getElementById("code");
  codeElement.textContent = text;
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
  row.classList.add("selected");
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
  await waitForElement("td.hljs-ln-numbers");
  return jumpToLine(n);
}

function isSourceType(fileName) {
  const regex = new RegExp(SourceType, "i");
  if (fileName.match(regex))
    return true;
  return false;
}

function isBinaryType(fileType) {
  const regex = new RegExp(BinaryType, "i");
  if (fileType.match(regex))
    return true;
  return false;
}

function downloadShowCode(url, lineNum) {
  updateContent(`fetch ${url}...`);
  fetch(url, {
    mode: "cors",
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
    updateContent(text);
    hljs.highlightAll();
    hljs.initLineNumbersOnLoad();
    waitJumpToLine(lineNum);
  })
  .catch((error) => {
    let msg = `Could not fetch: ${error}`;
    updateContent(msg);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  //console.log("DOM loaded...");
  const site = window.location.origin;
  const selfUrl = site + window.location.pathname;
  const fileUrl = window.location.search.slice(1);
  const lineNum = window.location.hash.slice(1);
  const url = fileUrl ? fileUrl : selfUrl;
  const title = url.replace(site, "");
  let fileName = url.split("/").pop();
  if (!fileName) fileName = "index.html";

  const t0 = document.title;
  document.title = `${fileName} - ${t0}`;

  const titleElement = document.getElementById("title");
  titleElement.textContent = title;
  titleElement.href = url;

  if (isSourceType(fileName)) {
    downloadShowCode(url, lineNum);
    return;
  }

  console.log(`head ${url}`);
  fetch(url, {
    method: "HEAD",
    mode: "cors",
    cache: "no-cache",
    credentials: "omit",
    referrerPolicy: "no-referrer"
  })
  .then(response => {
    const fileSize = response.headers.get("Content-Length");
    const fileType = response.headers.get("Content-Type");
    console.log(`${fileType}: ${fileSize} bytes`);
    if (isBinaryType(fileType)) {
      msg = `Not shown as the content is not text: ${fileType}\nClick the title to download it.`;
      updateContent(msg);
      return;
    }
    if (fileSize > MaxFileSize) {
      msg = `Not shown as the content size (${fileSize}) is too large (> ${MaxFileSize})\nClick the title to download it.`;
      updateContent(msg);
      return;
    }
    downloadShowCode(url, lineNum);
  })
  .catch(error => {
    let msg = `Could not fetch: ${error}`;
    updateContent(msg);
  });

});
