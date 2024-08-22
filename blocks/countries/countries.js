function createTableHeader(container) {
  const table = document.createElement('table');
  table.classList.add('table-wrapper');
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  const headers = ['ID', 'Countries', 'Continent'];
  headers.forEach((headerText) => {
    const th = document.createElement('th');
    th.textContent = headerText;
    tr.append(th);
  });

  thead.append(tr);
  table.append(thead);
  container.append(table);
  return table;
}

function createTableRow(table, row, i) {
  const tbody = table.querySelector('tbody') || document.createElement('tbody');
  const tr = document.createElement('tr');

  const data = [i, row.Country, row.Continent];
  data.forEach((dataItemText) => {
    const td = document.createElement('td');
    td.textContent = dataItemText;
    tr.append(td);
  });

  tbody.append(tr);
  if (!table.querySelector('tbody')) {
    table.append(tbody);
  }
}

async function fetchData(jsonURL, offset, limit) {
  const url = new URL(jsonURL);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', limit);

  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

function renderTable(container, data, offset) {
  container.innerHTML = '';

  const table = createTableHeader(container);
  data.forEach((row, i) => {
    createTableRow(table, row, offset + i + 1);
  });
}

function createPagination(container, jsonURL, offset, limit, totalRecords) {
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination-controls';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = offset === 0;
  prevButton.addEventListener('click', async () => {
    const newOffset = Math.max(0, offset - limit);
    const newData = await fetchData(jsonURL, newOffset, limit);
    renderTable(container, newData, newOffset);
    createPagination(container, jsonURL, newOffset, limit, totalRecords);
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = offset + limit >= totalRecords;
  nextButton.addEventListener('click', async () => {
    const newOffset = offset + limit;
    const newData = await fetchData(jsonURL, newOffset, limit);
    renderTable(container, newData, newOffset);
    createPagination(container, jsonURL, newOffset, limit, totalRecords);
  });

  paginationDiv.append(prevButton, nextButton);
  container.append(paginationDiv);
}

export default async function decorate(block) {
  const jsonLink = block.querySelector('a[href$=".json"]');
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'data-wrapper';

  if (jsonLink) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'data-content';

    wrapperDiv.append(contentDiv);

    const initialData = await fetchData(jsonLink.href, 0, 10);
    renderTable(contentDiv, initialData, 0);
    createPagination(contentDiv, jsonLink.href, 0, 10, 50);

    jsonLink.replaceWith(wrapperDiv);
  }
}
