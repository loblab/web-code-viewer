const site = window.location.origin;
const self_url = site + window.location.pathname;
const file_url = window.location.search.slice(1);
const line_num = window.location.hash.slice(1);

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
  })
  .catch((error) => {
    ele_code.textContent = `Could not fetch: ${error}`;
  });

});
