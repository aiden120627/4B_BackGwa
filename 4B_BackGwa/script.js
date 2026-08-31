const documents = [
  { title: "밈", category: "밈", url: "articles/meme.html" },
  { title: "뉴스", category: "뉴스", url: "articles/news.html" },
  { title: "역사", category: "역사", url: "articles/history.html" }
];

const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const results = document.getElementById("searchResults");

function search() {
  const keyword = input.value.trim().toLowerCase();

  if (!keyword) {
    results.style.display = "none";
    results.innerHTML = "";
    return;
  }

  const found = documents.filter(doc =>
    (doc.title + " " + doc.category).toLowerCase().includes(keyword)
  );

  results.innerHTML = found.length
    ? found.map(doc => `<a href="${doc.url}"><strong>${doc.title}</strong> · ${doc.category}</a>`).join("")
    : `<div style="padding:15px;color:#777;">검색 결과가 없습니다.</div>`;

  results.style.display = "block";
}

button.addEventListener("click", search);
input.addEventListener("input", search);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") search();
});
